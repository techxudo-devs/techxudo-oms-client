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
  const [offerDialog, setOfferDialog] = useState({
    open: false,
    app: null,
    salary: "",
    phone: "",
    joiningDate: "",
  });
  const { data: orgData } = useGetCurrentOrganizationQuery();
  const departments = orgData?.data?.departments || [];
  const [localAdds, setLocalAdds] = useState([]);

  const appsByStage = useMemo(() => {
    const src = Array.isArray(data?.data)
      ? data.data
      : Array.isArray(data)
        ? data
        : [];
    // Merge server items with local overrides by id, preferring local
    const byId = new Map();
    for (const it of src) {
      const key = it.id || it._id;
      if (!key) continue;
      byId.set(key, it);
    }
    for (const it of localAdds) {
      const key = it.id || it._id;
      if (!key) continue;
      const base = byId.get(key) || {};
      byId.set(key, { ...base, ...it });
    }
    const merged = Array.from(byId.values());
    const map = Object.fromEntries(STAGES.map((s) => [s, []]));
    for (const a of merged) {
      const s = (a.stage || "applied").toLowerCase();
      if (!map[s]) map[s] = [];
      map[s].push(a);
    }
    return map;
  }, [data, localAdds]);

  const openDrawer = (app) => {
    // Do not open email drawer for 'applied' stage
    if ((app.stage || "").toLowerCase() === "applied") return;
    setSelected(app);
    setDrawerOpen(true);
  };

  const onMove = async (app, toStage) => {
    const key = app.id || app._id;
    // Optimistic local update (frontend demo)
    setLocalAdds((prev) => {
      let updated = false;
      const next = prev.map((x) => {
        const k = x.id || x._id;
        if (k === key) {
          updated = true;
          return { ...x, stage: toStage };
        }
        return x;
      });
      if (!updated) next.push({ ...app, stage: toStage });
      return next;
    });

    try {
      if (toStage === "offer") {
        setOfferDialog({
          open: true,
          app: { ...app, stage: toStage },
          salary: "",
          phone: app.candidate?.phone || "",
          joiningDate: "",
        });
        return;
      }
      await moveStage({
        id: app.id || app._id,
        stage: toStage,
        to: app.candidate?.email,
        candidateName: app.candidate?.name,
        jobTitle: app.jobTitle,
      }).unwrap();
      toast.success(
        toStage === "screen"
          ? "Moved to screening and email sent"
          : `Moved to ${toStage}`,
      );
    } catch (e) {
      // Keep local movement for demo
      toast.info("Moved locally (demo mode)");
    }
  };

  const submitOffer = async () => {
    try {
      const { app, salary, phone, joiningDate } = offerDialog;
      const salaryNum = parseFloat(
        String(salary || "").replace(/[^0-9.]/g, ""),
      );
      const phoneStr = String(phone || "").trim();
      if (!salaryNum || Number.isNaN(salaryNum) || salaryNum <= 0) {
        toast.error("Please enter a valid salary");
        return;
      }
      if (!phoneStr) {
        toast.error("Phone number is required");
        return;
      }
      await moveStage({
        id: app.id || app._id,
        stage: "offer",
        salary: salaryNum,
        phone: phoneStr,
        joiningDate: joiningDate || undefined,
        jobTitle: app.jobTitle,
      }).unwrap();
      const key = app.id || app._id;
      setLocalAdds((prev) => {
        let updated = false;
        const next = prev.map((x) => {
          const k = x.id || x._id;
          if (k === key) {
            updated = true;
            return { ...x, stage: "offer" };
          }
          return x;
        });
        if (!updated) {
          next.push({ ...app, stage: "offer" });
        }
        return next;
      });
      toast.success("Offer initiated and email sent");
      setOfferDialog({
        open: false,
        app: null,
        salary: "",
        phone: "",
        joiningDate: "",
      });
    } catch (e) {
      // Demo fallback: move locally even if API fails
      const { app } = offerDialog;
      const key = app.id || app._id;
      setLocalAdds((prev) => {
        let updated = false;
        const next = prev.map((x) => {
          const k = x.id || x._id;
          if (k === key) {
            updated = true;
            return { ...x, stage: "offer" };
          }
          return x;
        });
        if (!updated) next.push({ ...app, stage: "offer" });
        return next;
      });
      setOfferDialog({
        open: false,
        app: null,
        salary: "",
        phone: "",
        joiningDate: "",
      });
      toast.info("Offer initiated locally (demo mode)");
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
      else
        setLocalAdds((prev) => [
          {
            _id: Date.now().toString(),
            stage: "applied",
            jobTitle: newCandidate.jobTitle,
            department: newCandidate.department,
            candidate: { name: newCandidate.name, email: newCandidate.email },
          },
          ...prev,
        ]);
      toast.success("Candidate added (demo)");
      setNewCandidate({ name: "", email: "", jobTitle: "", department: "" });
    } catch (e) {
      // Fallback: add locally in demo mode
      setLocalAdds((prev) => [
        {
          _id: Date.now().toString(),
          stage: "applied",
          jobTitle: newCandidate.jobTitle,
          department: newCandidate.department,
          candidate: { name: newCandidate.name, email: newCandidate.email },
        },
        ...prev,
      ]);
      setNewCandidate({ name: "", email: "", jobTitle: "", department: "" });
      toast.info("Candidate added locally (demo)");
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

      {/* Offer Details Dialog */}
      {offerDialog.open && (
        <div className="fixed inset-0 z-50">
          <div
            className="absolute inset-0 bg-black/30"
            onClick={() =>
              setOfferDialog({
                open: false,
                app: null,
                salary: "",
                phone: "",
                joiningDate: "",
              })
            }
          />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md bg-white rounded-xl shadow-xl border p-4">
            <div className="text-sm font-semibold mb-2">Initiate Offer</div>
            <div className="space-y-3">
              <div className="text-xs text-zinc-500">
                Provide details to send offer letter
              </div>
              <div className="grid grid-cols-1 gap-3">
                <Input
                  placeholder="Salary (numeric)"
                  value={offerDialog.salary}
                  onChange={(e) =>
                    setOfferDialog((s) => ({ ...s, salary: e.target.value }))
                  }
                />
                <Input
                  placeholder="Phone"
                  value={offerDialog.phone}
                  onChange={(e) =>
                    setOfferDialog((s) => ({ ...s, phone: e.target.value }))
                  }
                />
                <Input
                  type="date"
                  placeholder="Joining Date (optional)"
                  value={offerDialog.joiningDate}
                  onChange={(e) =>
                    setOfferDialog((s) => ({
                      ...s,
                      joiningDate: e.target.value,
                    }))
                  }
                />
              </div>
              <div className="flex items-center justify-end gap-2 pt-1">
                <Button
                  variant="outline"
                  onClick={() =>
                    setOfferDialog({
                      open: false,
                      app: null,
                      salary: "",
                      phone: "",
                      joiningDate: "",
                    })
                  }
                >
                  Cancel
                </Button>
                <Button onClick={submitOffer}>Send Offer</Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
