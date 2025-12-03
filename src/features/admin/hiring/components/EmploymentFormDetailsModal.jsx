import {
  CheckCircle,
  Loader2,
  ThumbsUp,
  ThumbsDown,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { format } from "date-fns";

/**
 * EmploymentFormDetailsModal - Modal showing employment form details
 * Separated component for better maintainability
 */
const StatusBadge = ({ status }) => {
  const config = {
    pending_review: {
      icon: CheckCircle,
      bg: "bg-yellow-100",
      text: "text-yellow-700",
      label: "Pending Review",
    },
    approved: {
      icon: CheckCircle,
      bg: "bg-green-100",
      text: "text-green-700",
      label: "Approved",
    },
    rejected: {
      icon: CheckCircle,
      bg: "bg-red-100",
      text: "text-red-700",
      label: "Rejected",
    },
  };

  const { icon: Icon, bg, text, label } = config[status] || config.pending_review;

  return (
    <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${bg} ${text}`}>
      <Icon className="w-3 h-3" />
      {label}
    </span>
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
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Employment Form Details</DialogTitle>
        </DialogHeader>

        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-gray-900" />
          </div>
        ) : selectedForm ? (
          <div className="space-y-6">
            {/* Status & Actions */}
            <div className="flex justify-between items-center pb-4 border-b">
              <StatusBadge status={selectedForm.status} />
              {selectedForm.status === "pending_review" && (
                <div className="flex gap-2">
                  <Button
                    onClick={onApprove}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    <ThumbsUp className="w-4 h-4 mr-2" />
                    Approve
                  </Button>
                  <Button onClick={onReject} variant="destructive">
                    <ThumbsDown className="w-4 h-4 mr-2" />
                    Reject
                  </Button>
                </div>
              )}
            </div>

            {/* Personal Information */}
            <div className="space-y-4">
              <h3 className="font-semibold text-gray-900 text-lg">
                Personal Information
              </h3>
              <div className="grid md:grid-cols-2 gap-4">
                {selectedForm.personalInfo?.photo && (
                  <div className="col-span-2">
                    <img
                      src={selectedForm.personalInfo.photo}
                      alt="Candidate"
                      className="w-24 h-24 rounded-full object-cover"
                    />
                  </div>
                )}
                <div>
                  <p className="text-sm text-gray-600">Legal Name</p>
                  <p className="font-medium">{selectedForm.personalInfo?.legalName}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Date of Birth</p>
                  <p className="font-medium">
                    {selectedForm.personalInfo?.dateOfBirth &&
                      format(new Date(selectedForm.personalInfo.dateOfBirth), "MMM dd, yyyy")}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Gender</p>
                  <p className="font-medium capitalize">{selectedForm.personalInfo?.gender}</p>
                </div>
              </div>
            </div>

            {/* CNIC Information */}
            <div className="space-y-4 border-t pt-4">
              <h3 className="font-semibold text-gray-900 text-lg">CNIC Information</h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="col-span-2">
                  <p className="text-sm text-gray-600">CNIC Number</p>
                  <p className="font-medium">{selectedForm.cnicInfo?.cnicNumber}</p>
                </div>
                {selectedForm.cnicInfo?.cnicFrontImage && (
                  <div>
                    <p className="text-sm text-gray-600 mb-2">CNIC Front</p>
                    <img
                      src={selectedForm.cnicInfo.cnicFrontImage}
                      alt="CNIC Front"
                      className="w-full h-40 object-cover rounded-lg border"
                    />
                  </div>
                )}
                {selectedForm.cnicInfo?.cnicBackImage && (
                  <div>
                    <p className="text-sm text-gray-600 mb-2">CNIC Back</p>
                    <img
                      src={selectedForm.cnicInfo.cnicBackImage}
                      alt="CNIC Back"
                      className="w-full h-40 object-cover rounded-lg border"
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Contact Information */}
            <div className="space-y-4 border-t pt-4">
              <h3 className="font-semibold text-gray-900 text-lg">Contact Information</h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600">Email</p>
                  <p className="font-medium">{selectedForm.contactInfo?.email}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Phone</p>
                  <p className="font-medium">{selectedForm.contactInfo?.phone}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Emergency Contact</p>
                  <p className="font-medium">{selectedForm.contactInfo?.emergencyContactName}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Emergency Phone</p>
                  <p className="font-medium">{selectedForm.contactInfo?.emergencyContactPhone}</p>
                </div>
              </div>
            </div>

            {/* Addresses */}
            <div className="space-y-4 border-t pt-4">
              <h3 className="font-semibold text-gray-900 text-lg">Addresses</h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600 mb-2">Primary Address</p>
                  <p className="text-sm">
                    {selectedForm.addresses?.primary?.street}
                    <br />
                    {selectedForm.addresses?.primary?.city}, {selectedForm.addresses?.primary?.state}{" "}
                    {selectedForm.addresses?.primary?.zipCode}
                  </p>
                </div>
                {selectedForm.addresses?.secondary?.city && (
                  <div>
                    <p className="text-sm text-gray-600 mb-2">Secondary Address</p>
                    <p className="text-sm">
                      {selectedForm.addresses.secondary.street}
                      <br />
                      {selectedForm.addresses.secondary.city}, {selectedForm.addresses.secondary.state}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Accepted Policies */}
            {selectedForm.acceptedPolicies?.length > 0 && (
              <div className="border-t pt-4">
                <h3 className="font-semibold text-gray-900 text-lg mb-3">Accepted Policies</h3>
                <div className="space-y-2">
                  {selectedForm.acceptedPolicies.map((policy, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-600" />
                      <span className="text-sm">{policy.policyTitle}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Review Feedback */}
            {selectedForm.reviewedBy && (
              <div className="border-t pt-4">
                <h3 className="font-semibold text-gray-900 text-lg mb-3">Review Feedback</h3>
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-sm text-gray-600">
                    {selectedForm.reviewFeedback || "No feedback provided"}
                  </p>
                  <p className="text-xs text-gray-500 mt-2">
                    Reviewed on {format(new Date(selectedForm.reviewedAt), "MMM dd, yyyy HH:mm")}
                  </p>
                </div>
              </div>
            )}
          </div>
        ) : null}
      </DialogContent>
    </Dialog>
  );
};

export default EmploymentFormDetailsModal;
