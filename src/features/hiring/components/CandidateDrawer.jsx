import { useState } from "react";
import { X, Send } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useSendEmailMutation } from "../api/hiringApiSlice";
import { toast } from "sonner";

export default function CandidateDrawer({ open, onClose, app }) {
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [sendEmail, { isLoading }] = useSendEmailMutation();

  if (!open || !app) return null;
  // Hide drawer if stage is 'applied'
  if ((app.stage || '').toLowerCase() === 'applied') return null;

  const submitEmail = async () => {
    try {
      await sendEmail({ applicationId: app.id || app._id, subject, message, to: app.candidate?.email }).unwrap();
      toast.success("Email sent");
      setSubject("");
      setMessage("");
    } catch (e) {
      toast.error(e?.data?.message || "Failed to send email");
    }
  };

  return (
    <div className="fixed inset-0 z-50">
      <div className="absolute inset-0 bg-black/30" onClick={onClose} />
      <div className="absolute top-0 right-0 h-full w-full max-w-md bg-white shadow-xl border-l">
        <div className="flex items-center justify-between px-4 py-3 border-b">
          <div>
            <div className="text-sm font-semibold">{app.candidate?.name || "Candidate"}</div>
            <div className="text-xs text-zinc-500">{app.jobTitle}</div>
          </div>
          <button onClick={onClose} className="p-2 rounded hover:bg-zinc-100">
            <X className="w-4 h-4" />
          </button>
        </div>
        <div className="p-4 space-y-4 overflow-auto h-[calc(100%-56px)]">
          <div>
            <div className="text-xs text-zinc-500 mb-1">Email Candidate</div>
            <div className="space-y-2">
              <Input placeholder="Subject" value={subject} onChange={(e) => setSubject(e.target.value)} />
              <Textarea placeholder="Message" className="min-h-[140px]" value={message} onChange={(e) => setMessage(e.target.value)} />
              <Button className="w-full" disabled={isLoading || !subject || !message} onClick={submitEmail}>
                <Send className="w-4 h-4 mr-2" /> {isLoading ? "Sending..." : "Send Email"}
              </Button>
            </div>
          </div>
          {/* Future: Overview, Activity, Documents tabs */}
        </div>
      </div>
    </div>
  );
}
