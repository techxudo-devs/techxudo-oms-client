import { useState, useEffect } from "react";
import {
  X,
  Calendar,
  Plus,
  Clock,
  MapPin,
  Video,
  Phone,
  Mail,
  User,
  MessageSquare,
  CheckCircle2,
  Briefcase,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  useSendEmailMutation,
  useScheduleInterviewMutation,
  useAddNoteMutation,
} from "../api/hiringApiSlice";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

const TABS = [
  { id: "schedule", label: "Schedule", icon: Calendar },
  { id: "email", label: "Email", icon: Mail },
  { id: "notes", label: "Notes", icon: MessageSquare },
];

export default function CandidateDrawer({ open, onClose, app }) {
  const [activeTab, setActiveTab] = useState("schedule");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");

  // Mutations
  const [sendEmail, { isLoading: sendingEmail }] = useSendEmailMutation();
  const [scheduleInterview, { isLoading: scheduling }] =
    useScheduleInterviewMutation();
  const [addNote, { isLoading: addingNote }] = useAddNoteMutation();

  // Interview State
  const [iv, setIv] = useState({
    scheduledAt: "",
    duration: 60,
    type: "video", // Default to modern standard
    meetingLink: "",
    location: "",
  });

  // Note State
  const [note, setNote] = useState("");

  // Reset state when drawer opens/closes or app changes
  useEffect(() => {
    if (open) {
      setActiveTab("schedule");
      setSubject("");
      setMessage("");
      setNote("");
    }
  }, [open, app]);

  if (!open || !app) return null;

  // Guard clause: Hide drawer if stage is 'applied' (as per requirement)
  if ((app.stage || "").toLowerCase() === "applied") return null;

  // --- Handlers ---

  const handleSubmitEmail = async () => {
    if (!subject || !message)
      return toast.error("Subject and message are required");
    try {
      await sendEmail({
        applicationId: app.id || app._id,
        type: "screening",
        subject,
        message,
      }).unwrap();
      toast.success("Email sent successfully");
      setSubject("");
      setMessage("");
    } catch (e) {
      toast.error(e?.data?.message || "Failed to send email");
    }
  };

  const handleSubmitInterview = async () => {
    if (!iv.scheduledAt) return toast.error("Please select a date & time");

    try {
      await scheduleInterview({
        id: app.id || app._id,
        ...iv,
        subject,
        message,
      }).unwrap();
      toast.success("Interview scheduled successfully");
      setIv({
        scheduledAt: "",
        duration: 60,
        type: "video",
        meetingLink: "",
        location: "",
      });
      setSubject("");
      setMessage("");
    } catch (e) {
      toast.error(e?.data?.message || "Failed to schedule interview");
    }
  };

  const handleSubmitNote = async () => {
    if (!note.trim()) return;
    try {
      await addNote({ id: app.id || app._id, content: note }).unwrap();
      toast.success("Note added to timeline");
      setNote("");
    } catch (e) {
      toast.error(e?.data?.message || "Failed to add note");
    }
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-40 bg-black/20 backdrop-blur-[2px] transition-opacity duration-300"
        onClick={onClose}
      />

      {/* Drawer Panel */}
      <div className="fixed inset-y-0 right-0 z-50 w-full max-w-lg bg-white shadow-2xl transform transition-transform duration-300 ease-in-out border-l border-zinc-100 flex flex-col">
        {/* --- Header --- */}
        <div className="flex-none px-6 py-5 border-b border-zinc-100 bg-white z-10">
          <div className="flex items-start justify-between mb-4">
            <div className="flex gap-4">
              <Avatar className="h-14 w-14 border border-zinc-100 shadow-sm">
                <AvatarImage
                  src={`https://ui-avatars.com/api/?name=${app.candidate?.name}&background=random`}
                />
                <AvatarFallback>CN</AvatarFallback>
              </Avatar>
              <div>
                <h2 className="text-lg font-bold text-zinc-900 leading-tight">
                  {app.candidate?.name || "Candidate Name"}
                </h2>
                <div className="flex items-center gap-2 mt-1 text-sm text-zinc-500">
                  <Briefcase className="w-3.5 h-3.5" />
                  <span>{app.jobTitle}</span>
                </div>
                <div className="flex items-center gap-2 mt-2">
                  <Badge
                    variant="secondary"
                    className="bg-zinc-100 text-zinc-600 hover:bg-zinc-100 font-medium px-2 py-0.5 text-xs uppercase tracking-wide"
                  >
                    {app.stage}
                  </Badge>
                  <span className="text-xs text-zinc-400">•</span>
                  <span className="text-xs text-zinc-400">
                    Added via Careers Page
                  </span>
                </div>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-full text-zinc-400 hover:text-zinc-900 hover:bg-zinc-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation Tabs */}
          <div className="flex items-center gap-1 p-1 bg-zinc-50 rounded-lg border border-zinc-200/50 mt-2">
            {TABS.map((tab) => {
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={cn(
                    "flex-1 flex items-center justify-center gap-2 py-2 text-sm font-medium rounded-md transition-all duration-200",
                    isActive
                      ? "bg-white text-zinc-900 shadow-sm ring-1 ring-black/5"
                      : "text-zinc-500 hover:text-zinc-700 hover:bg-zinc-200/50",
                  )}
                >
                  <tab.icon className="w-4 h-4" />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* --- Content Area --- */}
        <div className="flex-1 overflow-y-auto bg-zinc-50/50">
          <div className="p-6">
            {/* 1. Schedule Tab */}
            {activeTab === "schedule" && (
              <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                <div className="bg-white border border-zinc-200 rounded-xl p-5 shadow-sm space-y-5">
                  <div className="flex items-center gap-2 text-sm font-semibold text-zinc-900">
                    <Calendar className="w-4 h-4 text-indigo-600" />
                    Interview Details
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-medium text-zinc-500 uppercase tracking-wider">
                        Date & Time
                      </label>
                      <Input
                        type="datetime-local"
                        className="bg-zinc-50 border-zinc-200 focus:bg-white"
                        value={iv.scheduledAt}
                        onChange={(e) =>
                          setIv((s) => ({ ...s, scheduledAt: e.target.value }))
                        }
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-medium text-zinc-500 uppercase tracking-wider">
                        Duration (min)
                      </label>
                      <div className="relative">
                        <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
                        <Input
                          type="number"
                          step={15}
                          className="pl-9 bg-zinc-50 border-zinc-200 focus:bg-white"
                          value={iv.duration}
                          onChange={(e) =>
                            setIv((s) => ({
                              ...s,
                              duration: Number(e.target.value),
                            }))
                          }
                        />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-zinc-500 uppercase tracking-wider">
                      Format
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      {["video", "phone", "onsite"].map((type) => (
                        <button
                          key={type}
                          onClick={() => setIv((s) => ({ ...s, type }))}
                          className={cn(
                            "flex items-center justify-center gap-2 py-2 rounded-lg border text-sm font-medium transition-all",
                            iv.type === type
                              ? "border-indigo-600 bg-indigo-50 text-indigo-700 ring-1 ring-indigo-600/20"
                              : "border-zinc-200 bg-white text-zinc-600 hover:bg-zinc-50",
                          )}
                        >
                          {type === "video" && (
                            <Video className="w-3.5 h-3.5" />
                          )}
                          {type === "phone" && (
                            <Phone className="w-3.5 h-3.5" />
                          )}
                          {type === "onsite" && (
                            <MapPin className="w-3.5 h-3.5" />
                          )}
                          <span className="capitalize">{type}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {iv.type === "video" && (
                    <div className="space-y-1.5">
                      <label className="text-xs font-medium text-zinc-500 uppercase tracking-wider">
                        Video Link
                      </label>
                      <Input
                        placeholder="e.g. Google Meet or Zoom URL"
                        className="bg-zinc-50 border-zinc-200 focus:bg-white"
                        value={iv.meetingLink}
                        onChange={(e) =>
                          setIv((s) => ({ ...s, meetingLink: e.target.value }))
                        }
                      />
                    </div>
                  )}

                  {iv.type === "onsite" && (
                    <div className="space-y-1.5">
                      <label className="text-xs font-medium text-zinc-500 uppercase tracking-wider">
                        Office Location
                      </label>
                      <Input
                        placeholder="e.g. Room 304, HQ"
                        className="bg-zinc-50 border-zinc-200 focus:bg-white"
                        value={iv.location}
                        onChange={(e) =>
                          setIv((s) => ({ ...s, location: e.target.value }))
                        }
                      />
                    </div>
                  )}
                </div>

                <div className="bg-white border border-zinc-200 rounded-xl p-5 shadow-sm space-y-4">
                  <div className="flex items-center gap-2 text-sm font-semibold text-zinc-900">
                    <Mail className="w-4 h-4 text-indigo-600" />
                    Invitation Email{" "}
                    <span className="text-zinc-400 font-normal text-xs">
                      (Optional)
                    </span>
                  </div>
                  <Input
                    placeholder="Subject line"
                    className="bg-zinc-50 border-zinc-200 focus:bg-white font-medium"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                  />
                  <Textarea
                    placeholder="Add a personal message to the automated invite..."
                    className="min-h-[100px] bg-zinc-50 border-zinc-200 focus:bg-white resize-none"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                  />
                </div>
              </div>
            )}

            {/* 2. Email Tab */}
            {activeTab === "email" && (
              <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                <div className="bg-white border border-zinc-200 rounded-xl p-5 shadow-sm space-y-4 h-full">
                  <div className="flex items-center justify-between">
                    <div className="text-sm font-semibold text-zinc-900">
                      Compose Email
                    </div>
                    <div className="text-xs text-zinc-500">
                      To: {app.candidate?.email || "Candidate"}
                    </div>
                  </div>
                  <div className="space-y-3">
                    <Input
                      placeholder="Subject"
                      className="bg-zinc-50 border-zinc-200 focus:bg-white"
                      value={subject}
                      onChange={(e) => setSubject(e.target.value)}
                    />
                    <Textarea
                      placeholder="Write your message here..."
                      className="min-h-[200px] bg-zinc-50 border-zinc-200 focus:bg-white resize-none"
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                    />
                  </div>
                  <div className="pt-2 flex items-center justify-between">
                    <span className="text-xs text-zinc-400">
                      Sent emails appear in Notes/Timeline
                    </span>
                    <Button
                      onClick={handleSubmitEmail}
                      disabled={sendingEmail || !subject || !message}
                      className="bg-zinc-900 hover:bg-zinc-800 text-white"
                    >
                      {sendingEmail ? "Sending..." : "Send Email"}
                    </Button>
                  </div>
                </div>
              </div>
            )}

            {/* 3. Notes Tab */}
            {activeTab === "notes" && (
              <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                <div className="bg-white border border-zinc-200 rounded-xl p-5 shadow-sm space-y-4">
                  <div className="space-y-3">
                    <Textarea
                      placeholder="Type a note about this candidate..."
                      className="min-h-[100px] bg-zinc-50 border-zinc-200 focus:bg-white resize-none"
                      value={note}
                      onChange={(e) => setNote(e.target.value)}
                    />
                    <div className="flex justify-end">
                      <Button
                        size="sm"
                        onClick={handleSubmitNote}
                        disabled={addingNote || !note.trim()}
                        className="bg-zinc-900 hover:bg-zinc-800 text-white"
                      >
                        {addingNote ? "Saving..." : "Add Note"}
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Timeline Placeholder */}
                <div className="relative pl-4 border-l border-zinc-200 space-y-6">
                  {/* Mock previous entry */}
                  <div className="relative">
                    <div className="absolute -left-[21px] top-1 h-3 w-3 rounded-full bg-zinc-200 ring-4 ring-white" />
                    <div className="text-xs text-zinc-500 mb-0.5">
                      Today, 2:30 PM
                    </div>
                    <div className="text-sm text-zinc-800 bg-white p-3 rounded-lg border border-zinc-100 shadow-sm">
                      Application reviewed. Moved to Screening stage.
                    </div>
                  </div>
                  <div className="relative">
                    <div className="absolute -left-[21px] top-1 h-3 w-3 rounded-full bg-indigo-100 ring-4 ring-white" />
                    <div className="text-xs text-zinc-500 mb-0.5">
                      Yesterday
                    </div>
                    <div className="text-sm text-zinc-800 bg-white p-3 rounded-lg border border-zinc-100 shadow-sm">
                      Applied via LinkedIn.
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* --- Sticky Footer Action (Only for Schedule Tab) --- */}
        {activeTab === "schedule" && (
          <div className="flex-none p-5 bg-white border-t border-zinc-100">
            <Button
              className="w-full h-11 text-base font-medium bg-zinc-900 hover:bg-zinc-800 text-white shadow-lg shadow-zinc-900/10"
              onClick={handleSubmitInterview}
              disabled={scheduling}
            >
              {scheduling ? (
                "Scheduling..."
              ) : (
                <>
                  Confirm Interview
                  <CheckCircle2 className="w-4 h-4 ml-2" />
                </>
              )}
            </Button>
          </div>
        )}
      </div>
    </>
  );
}
  