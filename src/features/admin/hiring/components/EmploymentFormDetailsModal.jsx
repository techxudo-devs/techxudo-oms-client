import {
  CheckCircle,
  Loader2,
  ThumbsUp,
  ThumbsDown,
  User,
  CreditCard,
  MapPin,
  Phone,
  Mail,
  Calendar,
  ShieldCheck,
  FileText,
  X,
  AlertCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge"; // Assuming you have shadcn Badge, or we style it manually
import { Separator } from "@/components/ui/separator"; // Assuming shadcn Separator
import { ScrollArea } from "@/components/ui/scroll-area"; // Assuming shadcn ScrollArea
import { format } from "date-fns";

/**
 * Helper component for consistent data display
 */
const DetailItem = ({ icon: Icon, label, value, className = "" }) => (
  <div className={`flex flex-col space-y-1.5 ${className}`}>
    <span className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-gray-500">
      {Icon && <Icon className="w-3.5 h-3.5" />}
      {label}
    </span>
    <span className="text-sm font-medium text-gray-900 break-words">
      {value || "N/A"}
    </span>
  </div>
);

/**
 * Modern Status Badge
 */
const StatusBadge = ({ status }) => {
  const config = {
    submitted: {
      icon: Loader2,
      className: "bg-blue-50 text-blue-700 border-blue-200",
      label: "Pending Review",
    },
    approved: {
      icon: CheckCircle,
      className: "bg-green-50 text-green-700 border-green-200",
      label: "Approved",
    },
    rejected: {
      icon: X,
      className: "bg-red-50 text-red-700 border-red-200",
      label: "Rejected",
    },
  };

  const { icon: Icon, className, label } = config[status] || config.submitted;

  return (
    <div
      className={`flex items-center gap-1.5 px-3 py-1 rounded-full border ${className}`}
    >
      <Icon className="w-3.5 h-3.5" />
      <span className="text-xs font-semibold">{label}</span>
    </div>
  );
};

const EmploymentFormDetailsModal = ({
  open,
  onClose,
  selectedForm,
  isLoading,
  onApprove,
  onReject,
}) => {
  if (!selectedForm && !isLoading) return null;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl p-0 overflow-hidden gap-0 bg-gray-50">
        {/* Header */}
        <DialogHeader className="p-6 bg-white border-b sticky top-0 z-10">
          <div className="flex items-start justify-between">
            <div>
              <DialogTitle className="text-xl font-bold text-gray-900">
                Application Review
              </DialogTitle>
              <p className="text-sm text-gray-500 mt-1">
                ID: #{selectedForm?._id?.slice(-8).toUpperCase()}
              </p>
            </div>
            {!isLoading && selectedForm && (
              <StatusBadge status={selectedForm.status} />
            )}
          </div>
        </DialogHeader>

        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20 min-h-[400px]">
            <Loader2 className="w-10 h-10 animate-spin text-gray-900 mb-4" />
            <p className="text-gray-500 font-medium">Loading details...</p>
          </div>
        ) : (
          <div className="flex-1 overflow-y-auto max-h-[calc(85vh-140px)]">
            <div className="p-6 space-y-6">
              {/* Profile Hero Section */}
              <div className="bg-white rounded-xl border shadow-sm p-6">
                <div className="flex flex-col md:flex-row gap-6">
                  {/* Photo */}
                  <div className="flex-shrink-0">
                    <div className="w-32 h-32 rounded-xl border-4 border-gray-50 shadow-inner overflow-hidden bg-gray-100">
                      {selectedForm.personalInfo?.photo ? (
                        <img
                          src={selectedForm.personalInfo.photo}
                          alt="Candidate"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-400">
                          <User className="w-12 h-12" />
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Basic Info Grid */}
                  <div className="flex-1 grid grid-cols-2 lg:grid-cols-3 gap-y-6 gap-x-8">
                    <DetailItem
                      icon={User}
                      label="Full Legal Name"
                      value={selectedForm.personalInfo?.legalName}
                      className="col-span-2 lg:col-span-1"
                    />
                    <DetailItem
                      icon={Calendar}
                      label="Date of Birth"
                      value={
                        selectedForm.personalInfo?.dateOfBirth &&
                        format(
                          new Date(selectedForm.personalInfo.dateOfBirth),
                          "MMM dd, yyyy"
                        )
                      }
                    />
                    <DetailItem
                      icon={User}
                      label="Gender"
                      value={selectedForm.personalInfo?.gender}
                      className="capitalize"
                    />
                    <DetailItem
                      icon={Mail}
                      label="Email Address"
                      value={selectedForm.contactInfo?.email}
                      className="col-span-2 lg:col-span-1"
                    />
                    <DetailItem
                      icon={Phone}
                      label="Phone Number"
                      value={selectedForm.contactInfo?.phone}
                    />
                  </div>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                {/* CNIC Section */}
                <div className="bg-white rounded-xl border shadow-sm p-5 space-y-4">
                  <div className="flex items-center gap-2 pb-2 border-b">
                    <CreditCard className="w-5 h-5 text-gray-700" />
                    <h3 className="font-semibold text-gray-900">
                      Identity Documents
                    </h3>
                  </div>

                  <DetailItem
                    label="CNIC Number"
                    value={selectedForm.cnicInfo?.cnicNumber}
                  />

                  <div className="grid grid-cols-2 gap-3 mt-2">
                    {["Front", "Back"].map((side) => {
                      const img =
                        side === "Front"
                          ? selectedForm.cnicInfo?.cnicFrontImage
                          : selectedForm.cnicInfo?.cnicBackImage;
                      return (
                        img && (
                          <div key={side} className="space-y-2">
                            <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                              CNIC {side}
                            </p>
                            <div className="relative aspect-video rounded-lg overflow-hidden border bg-gray-50 hover:shadow-md transition-shadow cursor-pointer group">
                              <img
                                src={img}
                                alt={`CNIC ${side}`}
                                className="w-full h-full object-cover"
                              />
                              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
                            </div>
                          </div>
                        )
                      );
                    })}
                  </div>
                </div>

                {/* Addresses & Emergency */}
                <div className="space-y-6">
                  {/* Address Card */}
                  <div className="bg-white rounded-xl border shadow-sm p-5 space-y-4">
                    <div className="flex items-center gap-2 pb-2 border-b">
                      <MapPin className="w-5 h-5 text-gray-700" />
                      <h3 className="font-semibold text-gray-900">Residence</h3>
                    </div>

                    <div className="space-y-4">
                      <DetailItem
                        label="Primary Address"
                        value={`${
                          selectedForm.addresses?.primaryAddress?.street
                        }, ${selectedForm.addresses?.primaryAddress?.city}, ${
                          selectedForm.addresses?.primaryAddress?.state
                        } ${
                          selectedForm.addresses?.primaryAddress?.zipCode || ""
                        }`}
                      />
                      {selectedForm.addresses?.secondaryAddress?.city && (
                        <DetailItem
                          label="Secondary Address"
                          value={`${selectedForm.addresses.secondaryAddress.street}, ${selectedForm.addresses.secondaryAddress.city}, ${selectedForm.addresses.secondaryAddress.state}`}
                        />
                      )}
                    </div>
                  </div>

                  {/* Emergency Contact */}
                  <div className="bg-white rounded-xl border shadow-sm p-5 space-y-4">
                    <div className="flex items-center gap-2 pb-2 border-b">
                      <AlertCircle className="w-5 h-5 text-gray-700" />
                      <h3 className="font-semibold text-gray-900">
                        Emergency Contact
                      </h3>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <DetailItem
                        label="Name"
                        value={selectedForm.contactInfo?.emergencyContact?.name}
                      />
                      <DetailItem
                        label="Phone"
                        value={
                          selectedForm.contactInfo?.emergencyContact?.phone
                        }
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Policies & Feedback */}
              <div className="bg-white rounded-xl border shadow-sm p-5">
                <div className="flex items-center gap-2 pb-3 border-b mb-4">
                  <ShieldCheck className="w-5 h-5 text-gray-700" />
                  <h3 className="font-semibold text-gray-900">
                    Compliance & Review
                  </h3>
                </div>

                <div className="grid md:grid-cols-2 gap-8">
                  <div>
                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
                      Accepted Policies
                    </p>
                    {selectedForm.acceptedPolicies?.length > 0 ? (
                      <div className="flex flex-wrap gap-2">
                        {selectedForm.acceptedPolicies.map((policy, idx) => (
                          <div
                            key={idx}
                            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-md bg-green-50 text-green-700 text-xs font-medium border border-green-100"
                          >
                            <CheckCircle className="w-3 h-3" />
                            {policy.policyTitle}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-gray-400 italic">
                        No policies recorded
                      </p>
                    )}
                  </div>

                  {selectedForm.reviewFeedback && (
                    <div className="bg-gray-50 rounded-lg p-4 border border-gray-100">
                      <div className="flex items-center gap-2 mb-2">
                        <FileText className="w-4 h-4 text-gray-500" />
                        <span className="text-xs font-semibold text-gray-900 uppercase">
                          Reviewer Feedback
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 leading-relaxed">
                        {selectedForm.reviewFeedback}
                      </p>
                      <p className="text-xs text-gray-400 mt-3 pt-2 border-t">
                        Reviewed:{" "}
                        {format(
                          new Date(selectedForm.reviewedAt),
                          "MMM dd, yyyy HH:mm"
                        )}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Sticky Actions Footer */}
        {selectedForm?.status === "submitted" && (
          <DialogFooter className="p-4 bg-white border-t mt-auto sm:justify-between items-center gap-4">
            <div className="hidden sm:block text-xs text-gray-500">
              Please review all documents before making a decision.
            </div>
            <div className="flex gap-3 w-full sm:w-auto">
              <Button
                onClick={onReject}
                variant="outline"
                className="flex-1 sm:flex-none border-red-200 text-red-700 hover:bg-red-50 hover:text-red-800"
              >
                <ThumbsDown className="w-4 h-4 mr-2" />
                Reject
              </Button>
              <Button
                onClick={onApprove}
                className="flex-1 sm:flex-none bg-gray-900 hover:bg-gray-800 text-white"
              >
                <ThumbsUp className="w-4 h-4 mr-2" />
                Approve Application
              </Button>
            </div>
          </DialogFooter>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default EmploymentFormDetailsModal;
