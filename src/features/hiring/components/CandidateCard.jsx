import { Mail, MoreHorizontal, Trash2, UserX } from "lucide-react";

export default function CandidateCard({ app, onOpen, onMove, onDragStart, onDeleteApplication, onDeleteCandidate }) {
  return (
    <div
      className="group border border-zinc-200 bg-white rounded-xl p-3 shadow-sm hover:shadow transition-all cursor-pointer"
      onClick={() => onOpen(app)}
      draggable
      onDragStart={(e) => onDragStart && onDragStart(e, app)}
    >
      <div className="flex items-start justify-between">
        <div>
          <div className="text-sm font-semibold text-zinc-900">{app.candidate?.name || "Unnamed"}</div>
          <div className="text-xs text-zinc-500">{app.jobTitle || "Candidate"}{app.department ? ` • ${app.department}` : ""}</div>
        </div>
        <button className="p-1.5 rounded hover:bg-zinc-100" onClick={(e) => { e.stopPropagation(); onMove && onMove(app); }}>
          <MoreHorizontal className="w-4 h-4 text-zinc-500" />
        </button>
      </div>
      {app.candidate?.email && (
        <div className="mt-2 inline-flex items-center gap-1 text-[11px] text-zinc-500">
          <Mail className="w-3.5 h-3.5" />
          {app.candidate.email}
        </div>
      )}
      {import.meta.env.DEV && (
        <div className="mt-2 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            className="text-[11px] inline-flex items-center gap-1 px-2 py-1 rounded border border-red-200 text-red-600 hover:bg-red-50"
            onClick={(e) => { e.stopPropagation(); onDeleteApplication && onDeleteApplication(app); }}
            title="Delete Application"
          >
            <Trash2 className="w-3.5 h-3.5" /> Delete App
          </button>
          <button
            className="text-[11px] inline-flex items-center gap-1 px-2 py-1 rounded border border-amber-200 text-amber-700 hover:bg-amber-50"
            onClick={(e) => { e.stopPropagation(); onDeleteCandidate && onDeleteCandidate(app); }}
            title="Delete Candidate"
          >
            <UserX className="w-3.5 h-3.5" /> Delete Cand
          </button>
        </div>
      )}
    </div>
  );
}
