import { useEffect, useMemo, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { useGetEmploymentFormDetailQuery } from "@/features/employe/employment/api/employmentApiSlice";
import {
  Loader2,
  User,
  MapPin,
  Calendar,
  Phone,
  Mail,
  FileText,
  AlertCircle,
  CheckCircle2,
  XCircle,
  ExternalLink,
} from "lucide-react";

// --- Constants ---
const FIELD_OPTIONS = [
  { id: "cnicFrontImage", label: "CNIC (Front Image)" },
  { id: "cnicBackImage", label: "CNIC (Back Image)" },
  { id: "photo", label: "Profile Photograph" },
  { id: "primaryAddress", label: "Primary Address" },
  { id: "secondaryAddress", label: "Secondary Address" },
  { id: "phone", label: "Phone Number" },
  { id: "legalName", label: "Legal Name Spelling" },
];

// --- Helper Components ---
const InfoRow = ({ icon: Icon, label, value, className = "" }) => (
  <div className={`flex flex-col gap-1 ${className}`}>
    <span className="text-xs font-semibold uppercase tracking-wider text-gray-500 flex items-center gap-1.5">
      {Icon && <Icon className="h-3 w-3" />}
      {label}
    </span>
    <span className="font-medium text-gray-900 text-sm truncate">
      {value || <span className="text-gray-300 italic">Not provided</span>}
    </span>
  </div>
);

const ImageCard = ({ src, alt, label }) => {
  if (!src) return null;
  return (
    <div className="group relative overflow-hidden rounded-lg border border-gray-200 bg-gray-50">
      <div className="aspect-[3/2] w-full">
        <img
          src={src}
          alt={alt}
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
      </div>
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
      <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between opacity-0 transition-opacity group-hover:opacity-100">
        <span className="text-xs font-medium text-white">{label}</span>
        <Button
          size="icon"
          variant="ghost"
          className="h-6 w-6 text-white hover:bg-white/20"
          onClick={() => window.open(src, "_blank")}
        >
          <ExternalLink className="h-3 w-3" />
        </Button>
      </div>
    </div>
  );
};

const StatusBadge = ({ status }) => {
  const styles = {
    approved: "bg-green-100 text-green-700 border-green-200",
    rejected: "bg-red-100 text-red-700 border-red-200",
    needs_revision: "bg-amber-100 text-amber-700 border-amber-200",
    pending_review: "bg-blue-50 text-blue-700 border-blue-200",
  };

  const icons = {
    approved: CheckCircle2,
    rejected: XCircle,
    needs_revision: AlertCircle,
    pending_review: Loader2,
  };

  const Icon = icons[status] || AlertCircle;

  return (
    <div
      className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-semibold capitalize ${
        styles[status] || "bg-gray-100 text-gray-700"
      }`}
    >
      <Icon className="h-3.5 w-3.5" />
      {status?.replace(/_/g, " ")}
    </div>
  );
};

// --- Main Component ---
const EmploymentFormReviewModal = ({
  open,
  onOpenChange,
  formId,
  onApprove,
  onReject,
  onRequestRevision,
  requestingId,
}) => {
  const { data, isFetching } = useGetEmploymentFormDetailQuery(formId, {
    skip: !open || !formId,
  });

  const form = data?.data;
  const [selectedFields, setSelectedFields] = useState([]);
  const [notes, setNotes] = useState("");

  useEffect(() => {
    if (open) {
      setSelectedFields([]);
      setNotes("");
    }
  }, [open, formId]);

  const toggleField = (fieldId) => {
    setSelectedFields((prev) =>
      prev.includes(fieldId)
        ? prev.filter((f) => f !== fieldId)
        : [...prev, fieldId],
    );
  };

  const handleRequest = () => {
    if (!onRequestRevision || !formId) return;
    const labelById = FIELD_OPTIONS.reduce((acc, option) => {
      acc[option.id] = option.label;
      return acc;
    }, {});
    const selectedLabels = selectedFields.map((id) => labelById[id] || id);
    onRequestRevision(formId, selectedLabels, notes);
  };

  const formatDate = (dateString) => {
    if (!dateString) return null;
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const isPending = form?.status === "pending_review";
  const isRequesting = requestingId === formId;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      {/* Changed: max-w-4xl -> max-w-[90vw] lg:max-w-7xl 
         This makes the modal occupy 90% of screen width, giving plenty of room.
      */}
      <DialogContent className="flex h-[90vh] w-full max-w-[95vw] lg:max-w-7xl flex-col overflow-hidden p-0">
        {/* Header */}
        <DialogHeader className="flex-none border-b bg-white px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 text-blue-600">
                <User className="h-5 w-5" />
              </div>
              <div>
                <DialogTitle className="text-lg font-bold">
                  {form?.personalInfo?.legalName || "Employment Form Review"}
                </DialogTitle>
                <div className="mt-1 flex items-center gap-2 text-xs text-gray-500">
                  <FileText className="h-3 w-3" />
                  <span>ID: {formId?.slice(-8).toUpperCase()}</span>
                  <span>•</span>
                  <span>Submitted {formatDate(form?.submittedAt)}</span>
                </div>
              </div>
            </div>
            {form && <StatusBadge status={form.status} />}
          </div>
        </DialogHeader>

        {isFetching ? (
          <div className="flex flex-1 items-center justify-center">
            <div className="flex flex-col items-center gap-3 text-gray-500">
              <Loader2 className="h-8 w-8 animate-spin" />
              <p className="text-sm">Loading details...</p>
            </div>
          </div>
        ) : !form ? (
          <div className="flex flex-1 items-center justify-center text-gray-500">
            Unable to load form data.
          </div>
        ) : (
          <div className="flex flex-1 overflow-hidden">
            {/* Left Column: Form Details (Scrollable) */}
            <ScrollArea className="flex-1 bg-gray-50/50">
              <div className="space-y-6 p-8">
                {/* Personal & Contact Card */}
                <div className="rounded-xl border bg-white p-6 shadow-sm">
                  <h3 className="mb-6 flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-gray-900 border-b pb-3">
                    <User className="h-4 w-4" /> Personal & Contact
                  </h3>

                  {/* Improved Grid: Increased gap to prevent overlapping text */}
                  <div className="grid gap-x-8 gap-y-6 sm:grid-cols-2 lg:grid-cols-3">
                    <InfoRow
                      label="Legal Name"
                      value={form.personalInfo?.legalName}
                    />
                    <InfoRow
                      label="Date of Birth"
                      icon={Calendar}
                      value={formatDate(form.personalInfo?.dateOfBirth)}
                    />
                    <InfoRow label="Gender" value={form.personalInfo?.gender} />
                    <InfoRow
                      label="Guardian Name"
                      value={form.personalInfo?.guardianName}
                    />
                    <InfoRow
                      label="Phone"
                      icon={Phone}
                      value={form.contactInfo?.phone}
                    />
                    <InfoRow
                      label="Email"
                      icon={Mail}
                      value={form.contactInfo?.email}
                    />
                  </div>
                  <Separator className="my-6" />
                  <div className="grid gap-6 sm:grid-cols-2">
                    <InfoRow
                      label="Primary Address"
                      icon={MapPin}
                      value={`${form.addresses?.primaryAddress?.street || ""}, ${form.addresses?.primaryAddress?.city || ""}`}
                      className="col-span-2 sm:col-span-1"
                    />
                    <InfoRow
                      label="Emergency Contact"
                      icon={AlertCircle}
                      value={
                        form.contactInfo?.emergencyContact?.name ? (
                          <span>
                            {form.contactInfo.emergencyContact.name}
                            <span className="block text-xs font-normal text-gray-400 mt-0.5">
                              {form.contactInfo.emergencyContact.phone}
                            </span>
                          </span>
                        ) : null
                      }
                    />
                  </div>
                </div>

                {/* Identity & Documents Card */}
                <div className="rounded-xl border bg-white p-6 shadow-sm">
                  <h3 className="mb-6 flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-gray-900 border-b pb-3">
                    <FileText className="h-4 w-4" /> Identity Verification
                  </h3>
                  <div className="mb-8 grid gap-x-8 gap-y-6 sm:grid-cols-3">
                    <InfoRow
                      label="CNIC Number"
                      value={form.cnicInfo?.cnicNumber}
                    />
                    <InfoRow
                      label="Issue Date"
                      value={formatDate(form.cnicInfo?.cnicIssueDate)}
                    />
                    <InfoRow
                      label="Expiry Date"
                      value={formatDate(form.cnicInfo?.cnicExpiryDate)}
                    />
                  </div>
                  <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3">
                    <ImageCard
                      src={form.cnicInfo?.cnicFrontImage}
                      alt="Front"
                      label="CNIC Front"
                    />
                    <ImageCard
                      src={form.cnicInfo?.cnicBackImage}
                      alt="Back"
                      label="CNIC Back"
                    />
                    {/* Placeholder for Profile Photo if available in schema */}
                  </div>
                </div>
              </div>
            </ScrollArea>

            {/* Right Column: Actions & Review (Fixed width, slightly larger) */}
            <div className="flex w-[400px] flex-none flex-col border-l bg-white">
              <div className="flex-1 overflow-y-auto p-6">
                <h3 className="mb-4 text-sm font-bold text-gray-900 flex items-center gap-2">
                  Review Actions
                </h3>

                {/* Revision History */}
                {form.revisionRequests?.length > 0 && (
                  <div className="mb-6 rounded-lg border border-amber-100 bg-amber-50 p-4">
                    <h4 className="mb-2 text-xs font-semibold uppercase text-amber-800">
                      Previous Requests
                    </h4>
                    <div className="space-y-3">
                      {form.revisionRequests.map((req, idx) => (
                        <div key={idx} className="text-xs text-amber-900">
                          <div className="font-medium">
                            {formatDate(req.requestedAt)}
                          </div>
                          <div className="text-amber-700/80">
                            Required: {req.requestedFields?.join(", ")}
                          </div>
                          {req.notes && (
                            <div className="mt-1 border-l-2 border-amber-200 pl-2 italic">
                              "{req.notes}"
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Amendment Form */}
                <div className="space-y-5">
                  <div className="space-y-2">
                    <Label className="text-xs font-semibold uppercase text-gray-500">
                      Select Fields to Revise
                    </Label>
                    <div className="space-y-1 rounded-lg border border-gray-100 bg-gray-50/50 p-2">
                      {FIELD_OPTIONS.map((option) => (
                        <div
                          key={option.id}
                          className="flex items-center space-x-3 rounded p-2 hover:bg-white transition-colors"
                        >
                          <Checkbox
                            id={option.id}
                            checked={selectedFields.includes(option.id)}
                            onCheckedChange={() => toggleField(option.id)}
                            disabled={!isPending}
                          />
                          <label
                            htmlFor={option.id}
                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer w-full"
                          >
                            {option.label}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label
                      htmlFor="notes"
                      className="text-xs font-semibold uppercase text-gray-500"
                    >
                      Review Notes / Instructions
                    </Label>
                    <Textarea
                      id="notes"
                      placeholder="e.g. Please upload a clearer photo of the CNIC front..."
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      className="min-h-[120px] resize-none text-sm bg-gray-50"
                      disabled={!isPending}
                    />
                  </div>

                  <Button
                    onClick={handleRequest}
                    disabled={
                      !isPending || !selectedFields.length || isRequesting
                    }
                    className="w-full"
                    variant="default"
                  >
                    {isRequesting ? (
                      <>
                        <Loader2 className="mr-2 h-3 w-3 animate-spin" />{" "}
                        Requesting...
                      </>
                    ) : (
                      "Send Revision Request"
                    )}
                  </Button>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="border-t bg-gray-50 p-6">
                <div className="grid grid-cols-2 gap-4">
                  <Button
                    variant="outline"
                    className="border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700"
                    onClick={() => onReject && onReject(formId, "rejected", notes)}
                    disabled={!isPending}
                  >
                    Reject Application
                  </Button>
                  <Button
                    className="bg-green-600 hover:bg-green-700"
                    onClick={() => onApprove && onApprove(formId, "approved", notes)}
                    disabled={!isPending}
                  >
                    Approve Application
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default EmploymentFormReviewModal;
