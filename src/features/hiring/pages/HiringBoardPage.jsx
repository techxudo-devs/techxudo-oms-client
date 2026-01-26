import { useMemo, useState } from "react";
import { Plus, MoveRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import {
  useListApplicationsQuery,
  useMoveStageMutation,
  useCreateCandidateMutation,
} from "../api/hiringApiSlice";
import { useGetCurrentOrganizationQuery } from "@/shared/store/features/organizationApiSlice";
import CandidateCard from "../components/CandidateCard";
import CandidateDrawer from "../components/CandidateDrawer";

const STAGES = ["applied", "screen", "interview", "offer", "hired"];

export default function HiringBoardPage() {
  const [stageFilter, setStageFilter] = useState(null);
  const { data, isFetching } = useListApplicationsQuery({});
  const [moveStage] = useMoveStageMutation();
  const [createCandidate, { isLoading: creating }] =
    useCreateCandidateMutation();

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selected, setSelected] = useState(null);
  const [newCandidate, setNewCandidate] = useState({
    name: "",
    email: "",
    jobTitle: "",
    department: "",
  });
  const { data: orgData } = useGetCurrentOrganizationQuery();
  const departments = orgData?.data?.departments || [];
  const [localAdds, setLocalAdds] = useState([]);

  const appsByStage = useMemo(() => {
    const items = [...(data?.data || data || []), ...localAdds];
    const map = Object.fromEntries(STAGES.map((s) => [s, []]));
    for (const a of items) {
      const s = (a.stage || "applied").toLowerCase();
      if (!map[s]) map[s] = [];
      map[s].push(a);
    }
    return map;
  }, [data, localAdds]);

  const openDrawer = (app) => {
    // Do not open email drawer for 'applied' stage
    if ((app.stage || '').toLowerCase() === 'applied') return;
    setSelected(app);
    setDrawerOpen(true);
  };

  const onMove = async (app, toStage) => {
    try {
      await moveStage({
        id: app.id || app._id,
        stage: toStage,
        to: app.candidate?.email,
        candidateName: app.candidate?.name,
        jobTitle: app.jobTitle,
      }).unwrap();
      setLocalAdds((prev) =>
        prev.map((x) =>
          (x._id === (app._id || app.id) || x.id === (app.id || app._id))
            ? { ...x, stage: toStage }
            : x
        )
      );
      toast.success(toStage === "screen" ? "Moved to screening and email sent" : `Moved to ${toStage}`);
    } catch (e) {
      toast.error(e?.data?.message || "Failed to move");
    }
  };

  const addCandidate = async () => {
    if (!newCandidate.name || !newCandidate.email) {
      toast.error("Name and email are required");
      return;
    }
    try {
      const resp = await createCandidate(newCandidate).unwrap();
      if (resp?.data) setLocalAdds((prev) => [resp.data, ...prev]);
      toast.success("Candidate added and notified");
      setNewCandidate({ name: "", email: "", jobTitle: "", department: "" });
    } catch (e) {
      toast.error(e?.data?.message || "Failed to add candidate");
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold">Hiring</h1>
          <p className="text-sm text-zinc-500">
            Track candidates across your pipeline. Drag and automate.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="hidden sm:flex items-center gap-2">
            {/* Quick add candidate */}
            <Input
              placeholder="Candidate name"
              value={newCandidate.name}
              onChange={(e) =>
                setNewCandidate({ ...newCandidate, name: e.target.value })
              }
            />
            <Input
              placeholder="Email"
              value={newCandidate.email}
              onChange={(e) =>
                setNewCandidate({ ...newCandidate, email: e.target.value })
              }
            />
            <Input
              placeholder="Job Title"
              value={newCandidate.jobTitle}
              onChange={(e) =>
                setNewCandidate({ ...newCandidate, jobTitle: e.target.value })
              }
            />
            <select
              className="h-9 border rounded-md px-2 text-sm"
              value={newCandidate.department}
              onChange={(e) =>
                setNewCandidate({ ...newCandidate, department: e.target.value })
              }
            >
              <option value="">Department</option>
              {departments.map((d) => (
                <option key={d._id || d.name} value={d.name}>
                  {d.name}
                </option>
              ))}
            </select>
          </div>
          <Button onClick={addCandidate} disabled={creating}>
            <Plus className="w-4 h-4 mr-2" />{" "}
            {creating ? "Adding..." : "Add Candidate"}
          </Button>
        </div>
      </div>

      {/* Board */}
      <div className="grid grid-cols-1 md:grid-cols-3 xl:grid-cols-5 gap-4">
        {STAGES.map((stage) => (
          <div
            key={stage}
            className="bg-zinc-50 border border-zinc-200 rounded-2xl p-3"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="text-xs font-semibold uppercase tracking-wider text-zinc-500">
                {stage}
              </div>
              <div className="text-[11px] text-zinc-400">
                {appsByStage[stage]?.length || 0}
              </div>
            </div>
            <div className="space-y-2 min-h-10">
              {(appsByStage[stage] || []).map((app) => (
                <CandidateCard
                  key={app.id || app._id}
                  app={app}
                  onOpen={(a) => openDrawer(a)}
                  onMove={() => {}}
                />
              ))}
              {isFetching && (
                <div className="text-xs text-zinc-400">Loading...</div>
              )}
              {!isFetching && (appsByStage[stage] || []).length === 0 && (
                <div className="text-xs text-zinc-400">No candidates</div>
              )}
            </div>
            {/* Quick move buttons for demo */}
            {stage !== "hired" && (
              <div className="mt-3">
                <Label className="text-[11px] text-zinc-500">
                  Move first to next
                </Label>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full mt-1"
                  disabled={!appsByStage[stage]?.length}
                  onClick={() => {
                    const app = appsByStage[stage][0];
                    const nextIdx = Math.min(
                      STAGES.indexOf(stage) + 1,
                      STAGES.length - 1,
                    );
                    onMove(app, STAGES[nextIdx]);
                  }}
                >
                  <MoveRight className="w-4 h-4 mr-2" /> Move to next
                </Button>
              </div>
            )}
          </div>
        ))}
      </div>

      <CandidateDrawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        app={selected}
      />
    </div>
  );
}
