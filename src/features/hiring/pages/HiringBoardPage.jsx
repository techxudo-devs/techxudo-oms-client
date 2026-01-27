import { useMemo, useRef, useState } from "react";
import { Plus, MoveRight, FileSignature, DollarSign, Phone, CalendarDays } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import useHiringBoard from "@/admin/hooks/useHiringBoard";
import CandidateCard from "../components/CandidateCard";
import CandidateDrawer from "../components/CandidateDrawer";
import { useDeleteApplicationMutation, useDeleteCandidateMutation } from "../api/hiringApiSlice";
import AddCandidateModal from "../components/AddCandidateModal";

const STAGES = ["applied", "screening", "interview", "offer", "hired"];

export default function HiringBoardPage() {
  const {
    grouped,
    isFetching,
    creating,
    departments,
    moveStage,
    createCandidate,
  } = useHiringBoard();

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
  const [showAdd, setShowAdd] = useState(false);
  const draggedRef = useRef(null);
  const [localAdds, setLocalAdds] = useState([]);
  const [deleteApplication] = useDeleteApplicationMutation();
  const [deleteCandidate] = useDeleteCandidateMutation();

  const openDrawer = (app) => {
    // Open drawer only for interview stage as requested
    if ((app.stage || "").toLowerCase() !== "interview") return;
    setSelected(app);
    setDrawerOpen(true);
  };

  const onMove = async (app, toStage) => {
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
      await moveStage(app, toStage);
      toast.success(
        toStage === "screening"
          ? "Moved to screening and email sent"
          : `Moved to ${toStage}`,
      );
    } catch (e) {
      toast.error(e?.data?.message || "Failed to move application");
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
      // Move application to offer and persist details server-side
      await moveStage(app, "offer", "Offer initiated", { salary: salaryNum, joiningDate: joiningDate || undefined, phone: phoneStr });
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
      toast.error(e?.data?.message || "Failed to initiate offer");
    }
  };

  const addCandidate = async () => {
    setShowAdd(true);
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
          <Button onClick={addCandidate} disabled={creating}>
            <Plus className="w-4 h-4 mr-2" /> Add Candidate
          </Button>
        </div>
      </div>

      {/* Board */}
      <div className="grid grid-cols-1 md:grid-cols-3 xl:grid-cols-5 gap-4">
        {STAGES.map((stage) => (
          <div
            key={stage}
            className="bg-zinc-50 border border-zinc-200 rounded-2xl p-3"
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => {
              e.preventDefault();
              if (draggedRef.current) onMove(draggedRef.current, stage);
            }}
          >
            <div className="flex items-center justify-between mb-3">
              <div className="text-xs font-semibold uppercase tracking-wider text-zinc-500">
                {stage}
              </div>
              <div className="text-[11px] text-zinc-400">
                {grouped[stage]?.length || 0}
              </div>
            </div>
            <div className="space-y-2 min-h-10">
              {(grouped[stage] || []).map((app) => (
                <CandidateCard
                  key={app.id || app._id}
                  app={app}
                  onOpen={(a) => openDrawer(a)}
                  onDragStart={(e, a) => {
                    draggedRef.current = a;
                  }}
                  onMove={() => {}}
                  onDeleteApplication={async (a) => {
                    if (!import.meta.env.DEV) return;
                    try {
                      await deleteApplication(a._id || a.id).unwrap();
                      toast.success("Application deleted");
                    } catch (e) {
                      toast.error(e?.data?.message || "Failed to delete application");
                    }
                  }}
                  onDeleteCandidate={async (a) => {
                    if (!import.meta.env.DEV) return;
                    const candId = a?.candidate?._id || a?.candidateId?._id || a?.candidateId;
                    if (!candId) return toast.error("Candidate id missing");
                    try {
                      await deleteCandidate(candId).unwrap();
                      toast.success("Candidate deleted");
                    } catch (e) {
                      toast.error(e?.data?.message || "Failed to delete candidate");
                    }
                  }}
                />
              ))}
              {isFetching && (
                <div className="text-xs text-zinc-400">Loading...</div>
              )}
              {!isFetching && (grouped[stage] || []).length === 0 && (
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
                  disabled={!grouped[stage]?.length}
                  onClick={() => {
                    const app = grouped[stage][0];
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

      <AddCandidateModal
        open={showAdd}
        onClose={() => setShowAdd(false)}
        departments={departments}
        onSubmit={async (values) => {
          const ok = await createCandidate(values);
          if (ok) toast.success("Candidate added");
        }}
      />

      {/* Offer Details Dialog */}
      {offerDialog.open && (
        <div className="fixed inset-0 z-50">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px]" onClick={() => setOfferDialog({ open: false, app: null, salary: "", phone: "", joiningDate: "" })} />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-lg bg-white rounded-2xl shadow-2xl border p-6 ring-1 ring-black/5">
            {/* Header */}
            <div className="flex items-start gap-3 mb-4">
              <div className="h-10 w-10 rounded-xl bg-violet-600/10 text-violet-700 flex items-center justify-center">
                <FileSignature className="w-5 h-5" />
              </div>
              <div>
                <div className="text-base font-semibold">Initiate Offer</div>
                <div className="text-xs text-zinc-500">Provide the details below to send a formal offer letter</div>
              </div>
            </div>

            {/* Form */}
            <div className="space-y-4">
              <div className="grid grid-cols-1 gap-3">
                <div>
                  <label className="text-xs font-medium text-zinc-600 mb-1 block">Salary</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-zinc-400">
                      <DollarSign className="w-4 h-4" />
                    </div>
                    <Input
                      className="pl-9"
                      placeholder="e.g. 150000"
                      value={offerDialog.salary}
                      onChange={(e) => setOfferDialog((s) => ({ ...s, salary: e.target.value }))}
                    />
                  </div>
                  <p className="mt-1 text-[11px] text-zinc-400">Enter gross monthly amount</p>
                </div>

                <div>
                  <label className="text-xs font-medium text-zinc-600 mb-1 block">Phone</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-zinc-400">
                      <Phone className="w-4 h-4" />
                    </div>
                    <Input
                      className="pl-9"
                      placeholder="Candidate phone"
                      value={offerDialog.phone}
                      onChange={(e) => setOfferDialog((s) => ({ ...s, phone: e.target.value }))}
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-medium text-zinc-600 mb-1 block">Joining Date (optional)</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-zinc-400">
                        <CalendarDays className="w-4 h-4" />
                      </div>
                      <Input
                        type="date"
                        className="pl-9"
                        value={offerDialog.joiningDate}
                        onChange={(e) => setOfferDialog((s) => ({ ...s, joiningDate: e.target.value }))}
                      />
                    </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-end gap-2 pt-2">
                <Button
                  variant="outline"
                  onClick={() => setOfferDialog({ open: false, app: null, salary: "", phone: "", joiningDate: "" })}
                >
                  Cancel
                </Button>
                <Button onClick={submitOffer} className="bg-violet-600 hover:bg-violet-700">Send Offer</Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
