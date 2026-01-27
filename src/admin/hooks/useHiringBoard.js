import { useMemo, useState, useCallback } from "react";
import { toast } from "sonner";
import {
  useListApplicationsQuery,
  useMoveStageMutation,
  useCreateCandidateMutation,
  useSendEmailMutation,
} from "@/features/hiring/api/hiringApiSlice";
import { useGetCurrentOrganizationQuery } from "@/shared/store/features/organizationApiSlice";

const STAGES = [
  "applied",
  "screening",
  "interview",
  "offer",
  "hired",
  "rejected",
];

export const useHiringBoard = () => {
  const [search, setSearch] = useState("");
  const [stageFilter, setStageFilter] = useState("");
  const { data: orgData } = useGetCurrentOrganizationQuery();
  const org = orgData?.data || {};
  const orgId = org?._id || org?.id;
  const { data, isFetching, refetch } = useListApplicationsQuery({
    search,
    stage: stageFilter,
    ...(orgId ? { organizationId: orgId } : {}),
  });
  const [moveStageMutation] = useMoveStageMutation();
  const [createCandidateMutation, { isLoading: creating }] =
    useCreateCandidateMutation();
  const [sendEmailMutation] = useSendEmailMutation();
  const departments = org?.departments || [];

  // normalize applications
  const applications = useMemo(() => {
    const payload = data?.data || data || {};
    const raw = Array.isArray(payload.all)
      ? payload.all
      : Array.isArray(payload)
        ? payload
        : [];
    // map candidateId => candidate for UI
    return raw.map((app) => ({
      ...app,
      candidate: app.candidateId || app.candidate,
      jobTitle: app.positionTitle || app.jobTitle,
    }));
  }, [data]);

  const grouped = useMemo(() => {
    const result = Object.fromEntries(STAGES.map((s) => [s, []]));
    applications.forEach((a) => {
      const key = (a.stage || "applied").toLowerCase();
      if (!result[key]) result[key] = [];
      result[key].push(a);
    });
    return result;
  }, [applications]);

  const moveStage = useCallback(
    async (app, newStage, notes = "", extra = {}) => {
      try {
        await moveStageMutation({
          id: app._id || app.id,
          stage: newStage,
          notes,
          ...(orgId ? { organizationId: orgId } : {}),
          ...extra,
        }).unwrap();
        toast.success(`Moved to ${newStage}`);
        refetch();
      } catch (e) {
        toast.error(e?.data?.message || "Failed to move application");
      }
    },
    [moveStageMutation, refetch, orgId],
  );

  const createCandidate = useCallback(
    async ({
      name,
      email,
      phone,
      positionTitle,
      department,
      employmentType = "full-time",
      source = "manual",
      resumeUrl,
    }) => {
      try {
        await createCandidateMutation({
          name,
          email,
          phone,
          positionTitle,
          department,
          employmentType,
          source,
          resumeUrl,
          ...(orgId ? { organizationId: orgId } : {}),
        }).unwrap();
        refetch();
        return true;
      } catch (e) {
        toast.error(e?.data?.message || "Failed to add candidate");
        return false;
      }
    },
    [createCandidateMutation, refetch, orgId],
  );

  const sendScreeningEmail = useCallback(
    async (applicationId, subject, message) => {
      try {
        await sendEmailMutation({
          applicationId,
          type: "screening",
          subject,
          message,
        }).unwrap();
        toast.success("Screening email sent");
      } catch (e) {
        toast.error(e?.data?.message || "Failed to send email");
      }
    },
    [sendEmailMutation],
  );

  return {
    STAGES,
    search,
    setSearch,
    stageFilter,
    setStageFilter,
    applications,
    grouped,
    isFetching,
    creating,
    departments,
    moveStage,
    createCandidate,
    sendScreeningEmail,
  };
};

export default useHiringBoard;
