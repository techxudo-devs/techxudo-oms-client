import { Loader2, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { format } from "date-fns";

const ContractDetailsModal = ({
  open,
  onClose,
  contract,
  isLoading,
  onSend,
  isSending,
}) => {
  const StatusBadge = ({ status }) => {
    const config = {
      draft: { bg: "bg-gray-100", text: "text-gray-700", label: "Draft" },
      sent: { bg: "bg-blue-100", text: "text-blue-700", label: "Sent" },
      signed: { bg: "bg-green-100", text: "text-green-700", label: "Signed" },
      expired: { bg: "bg-red-100", text: "text-red-700", label: "Expired" },
    };

    const { bg, text, label } = config[status] || config.draft;

    return (
      <span
        className={`inline-flex px-3 py-1 rounded-full text-xs font-medium ${bg} 
  ${text}`}
      >
        {label}
      </span>
    );
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Contract Details</DialogTitle>
        </DialogHeader>

        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-gray-900" />
          </div>
        ) : contract ? (
          <div className="space-y-6">
            {/* Status & Actions */}
            <div className="flex justify-between items-center pb-4 border-b">
              <StatusBadge status={contract.status} />
              {contract.status === "draft" && (
                <Button
                  onClick={() => onSend(contract._id)}
                  disabled={isSending}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  {isSending ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin mr-2" />
                      Sending...
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4 mr-2" />
                      Send to Employee
                    </>
                  )}
                </Button>
              )}
            </div>

            {/* Employee Info */}
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600">Employee Name</p>
                <p className="font-medium">{contract.employeeName}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Email</p>
                <p className="font-medium">{contract.employeeEmail}</p>
              </div>
            </div>

            {/* Position Details */}
            <div className="grid md:grid-cols-2 gap-4 border-t pt-4">
              <div>
                <p className="text-sm text-gray-600">Position</p>
                <p className="font-medium">
                  {contract.contractDetails?.position || "N/A"}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Department</p>
                <p className="font-medium">
                  {contract.contractDetails?.department || "N/A"}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Employment Type</p>
                <p className="font-medium capitalize">
                  {contract.contractDetails?.employmentType || "N/A"}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Start Date</p>
                <p className="font-medium">
                  {contract.contractDetails?.startDate
                    ? format(
                        new Date(contract.contractDetails.startDate),
                        "MMM dd, yyyy"
                      )
                    : "N/A"}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Base Salary</p>
                <p className="font-medium">
                  PKR{" "}
                  {contract.contractDetails?.compensation?.baseSalary?.toLocaleString() ||
                    "N/A"}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Probation Period</p>
                <p className="font-medium">
                  {contract.contractDetails?.probationPeriod || 0} months
                </p>
              </div>
            </div>

            {/* Signatures */}
            {contract.employeeSignature && (
              <div className="border-t pt-4">
                <p className="text-sm text-gray-600 mb-2">Employee Signature</p>
                <img
                  src={contract.employeeSignature}
                  alt="Signature"
                  className="border rounded h-24"
                />
                <p className="text-xs text-gray-500 mt-2">
                  Signed on{" "}
                  {format(new Date(contract.employeeSignedAt), "MMM dd,yyyy")}
                </p>
              </div>
            )}
          </div>
        ) : null}
      </DialogContent>
    </Dialog>
  );
};

export default ContractDetailsModal;
