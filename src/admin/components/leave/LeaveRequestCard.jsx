import React, { useState } from "react";
import {
  Clock,
  CheckCircle,
  XCircle,
  Calendar,
  FileText,
  Download,
  AlertCircle,
  Briefcase,
} from "lucide-react";
import { Button } from "@/components/ui/button";

const LeaveRequestCard = ({
  request,
  onApprove,
  onReject,
  isLoading,
  readOnly = false,
}) => {
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectionReason, setRejectionReason] = useState("");

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const handleApprove = () => {
    onApprove(request._id);
  };

  const handleReject = () => {
    onReject(request._id, rejectionReason);
    setShowRejectModal(false);
    setRejectionReason("");
  };

  const getStatusConfig = (status) => {
    switch (status.toLowerCase()) {
      case "pending":
        return {
          bg: "bg-orange-50",
          text: "text-orange-700",
          border: "border-orange-200",
          icon: Clock,
          iconColor: "text-orange-500",
          label: "Pending Review",
        };
      case "approved":
        return {
          bg: "bg-green-50",
          text: "text-green-700",
          border: "border-green-200",
          icon: CheckCircle,
          iconColor: "text-green-500",
          label: "Approved",
        };
      case "rejected":
        return {
          bg: "bg-red-50",
          text: "text-red-700",
          border: "border-red-200",
          icon: XCircle,
          iconColor: "text-red-500",
          label: "Rejected",
        };
      case "cancelled":
        return {
          bg: "bg-gray-50",
          text: "text-gray-700",
          border: "border-gray-200",
          icon: XCircle,
          iconColor: "text-gray-500",
          label: "Cancelled",
        };
      default:
        return {
          bg: "bg-gray-50",
          text: "text-gray-700",
          border: "border-gray-200",
          icon: Clock,
          iconColor: "text-gray-500",
          label: status,
        };
    }
  };

  const statusConfig = getStatusConfig(request.status);
  const StatusIcon = statusConfig.icon;
  const canTakeAction = !readOnly && request.status === "pending";

  return (
    <>
      <div className="group bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-lg hover:border-gray-200 transition-all duration-300">
        <div className="flex gap-6">
          {/* Left Section - Main Content */}
          <div className="flex-1 space-y-5">
            {/* Header with Avatar and Status */}
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center w-11 h-11 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 text-white font-semibold text-sm shadow-md">
                  {(request.userId?.fullName || "U")
                    .split(" ")
                    .map((n) => n[0])
                    .join("")
                    .toUpperCase()
                    .slice(0, 2)}
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    {request.userId?.fullName || request.userId?._id}
                  </h3>
                  <div className="flex items-center gap-2 mt-1">
                    <Briefcase className="w-3.5 h-3.5 text-gray-400" />
                    
                    <span className="text-sm text-gray-600 font-medium">
                      {request.type} Leave
                    </span>
                  </div>
                </div>
              </div>

              <div
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border ${statusConfig.bg} ${statusConfig.text} ${statusConfig.border}`}
              >
                <StatusIcon className={`w-3.5 h-3.5 ${statusConfig.iconColor}`} />
                <span className="text-xs font-semibold">
                  {statusConfig.label}
                </span>
              </div>
            </div>

            {/* Date Range Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="flex items-center gap-3 px-4 py-3 bg-gradient-to-br from-blue-50 to-blue-50/50 rounded-lg border border-blue-100">
                <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-white shadow-sm">
                  <Calendar className="w-4 h-4 text-blue-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-gray-500 mb-0.5">
                    Duration
                  </p>
                  <p className="text-sm font-semibold text-gray-900 truncate">
                    {formatDate(request.startDate)} - {formatDate(request.endDate)}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 px-4 py-3 bg-gradient-to-br from-purple-50 to-purple-50/50 rounded-lg border border-purple-100">
                <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-white shadow-sm">
                  <Clock className="w-4 h-4 text-purple-600" />
                </div>
                <div className="flex-1">
                  <p className="text-xs font-medium text-gray-500 mb-0.5">
                    Total Days
                  </p>
                  <p className="text-sm font-semibold text-gray-900">
                    {request.daysRequested}{" "}
                    {request.daysRequested === 1 ? "day" : "days"}
                  </p>
                </div>
              </div>
            </div>

            {/* Reason */}
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-gray-400" />
                <h4 className="text-sm font-semibold text-gray-700">Reason</h4>
              </div>
              <div className="bg-gradient-to-br from-gray-50 to-gray-50/50 border border-gray-200 rounded-lg p-4">
                <p className="text-sm text-gray-700 leading-relaxed">
                  {request.reason}
                </p>
              </div>
            </div>

            {/* Attachments */}
            {request.attachments && request.attachments.length > 0 && (
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Download className="w-4 h-4 text-gray-400" />
                  <h4 className="text-sm font-semibold text-gray-700">
                    Attachments
                  </h4>
                </div>
                <div className="flex flex-wrap gap-2">
                  {request.attachments.map((attachment, index) => (
                    <a
                      key={index}
                      href={attachment.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group/attachment inline-flex items-center gap-2 px-3 py-2 bg-blue-50 border border-blue-200 text-blue-700 rounded-lg hover:bg-blue-100 hover:border-blue-300 transition-all"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span className="text-sm font-medium">
                        {attachment.originalName || `Attachment ${index + 1}`}
                      </span>
                    </a>
                  ))}
                </div>
              </div>
            )}

            {/* Submitted Date */}
            <div className="flex items-center gap-2 text-xs text-gray-500 pt-2 border-t border-gray-100">
              <Clock className="w-3.5 h-3.5" />
              <span>Submitted on {formatDate(request.createdAt)}</span>
            </div>
          </div>

          {/* Right Section - Actions */}
          {canTakeAction && (
            <div className="flex flex-col gap-2 pt-1">
              <Button
                onClick={handleApprove}
                disabled={isLoading}
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-green-600 text-white rounded-lg hover:bg-green-700 hover:shadow-md transition-all disabled:opacity-50 disabled:cursor-not-allowed font-medium"
              >
                <CheckCircle className="w-4 h-4" />
                Approve
              </Button>
              <Button
                onClick={() => setShowRejectModal(true)}
                disabled={isLoading}
                variant="destructive"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg hover:shadow-md transition-all disabled:opacity-50 disabled:cursor-not-allowed font-medium"
              >
                <XCircle className="w-4 h-4" />
                Reject
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Rejection Modal */}
      {showRejectModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md animate-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="flex items-start gap-4 p-6 border-b border-gray-100">
              <div className="flex items-center justify-center w-12 h-12 rounded-full bg-red-100">
                <AlertCircle className="w-6 h-6 text-red-600" />
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-semibold text-gray-900">
                  Reject Leave Request
                </h3>
                <p className="text-sm text-gray-500 mt-1">
                  {request.userId?.fullName || request.userId?._id}
                </p>
              </div>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-4">
              <p className="text-gray-700">
                Are you sure you want to reject this leave request? This action
                will notify the employee.
              </p>

              <div className="space-y-2">
                <label
                  htmlFor="rejection-reason"
                  className="block text-sm font-semibold text-gray-700"
                >
                  Rejection Reason{" "}
                  <span className="text-gray-400 font-normal">(Optional)</span>
                </label>
                <textarea
                  id="rejection-reason"
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition-all resize-none"
                  rows="4"
                  placeholder="Provide a reason for rejection (optional)..."
                />
              </div>
            </div>

            {/* Modal Footer */}
            <div className="flex gap-3 p-6 border-t border-gray-100 bg-gray-50 rounded-b-2xl">
              <Button
                type="button"
                onClick={() => setShowRejectModal(false)}
                variant="outline"
                className="flex-1 px-4 py-2.5 font-medium rounded-lg transition-all"
              >
                Cancel
              </Button>
              <Button
                type="button"
                onClick={handleReject}
                disabled={isLoading}
                variant="destructive"
                className="flex-1 px-4 py-2.5 font-medium rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-lg"
              >
                Reject Request
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default LeaveRequestCard;
