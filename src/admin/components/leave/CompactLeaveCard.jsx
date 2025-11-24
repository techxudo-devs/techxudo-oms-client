import React from "react";
import {
  Clock,
  CheckCircle,
  XCircle,
  Calendar,
  Briefcase,
  User as UserIcon,
} from "lucide-react";

const CompactLeaveCard = ({ request, onApprove, onReject, isLoading }) => {
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
  };

  const getStatusConfig = (status) => {
    switch (status.toLowerCase()) {
      case "pending":
        return {
          bg: "",
          text: "text-orange-700",
          border: "border-orange-200",
          icon: Clock,
          iconColor: "text-orange-500",
        };
      case "approved":
        return {
          text: "text-green-700",
          border: "border-green-200",
          icon: CheckCircle,
          iconColor: "text-green-500",
        };
      case "rejected":
        return {
          bg: "",
          text: "text-red-700",
          border: "border-red-200",
          icon: XCircle,
          iconColor: "text-red-500",
        };
      default:
        return {
          bg: "",
          text: "text-gray-700",
          border: "border-gray-200",
          icon: Clock,
          iconColor: "text-gray-500",
        };
    }
  };

  const statusConfig = getStatusConfig(request.status);
  const StatusIcon = statusConfig.icon;
  const isPending = request.status === "pending";

  return (
    <div className="group bg-white rounded-lg shadow-sm border border-gray-100 p-4 hover:shadow-md hover:border-gray-200 transition-all duration-200">
      <div className="flex items-center justify-between gap-4">
        {/* Left: User Info */}
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <div className="flex items-center justify-center w-9 h-9 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 text-white font-semibold text-xs flex-shrink-0">
            {(request.userId?.fullName || "U")
              .split(" ")
              .map((n) => n[0])
              .join("")
              .toUpperCase()
              .slice(0, 2)}
          </div>
          <div className="flex-1 min-w-0">
            <h4 className="text-sm font-semibold text-gray-900 truncate">
              {request.userId?.fullName || request.userId?._id}
            </h4>
            <div className="flex items-center gap-1.5 text-xs text-gray-500">
              <Briefcase className="w-3 h-3" />
              <span className="truncate">{request.type} Leave</span>
            </div>
          </div>
        </div>

        {/* Middle: Dates & Duration */}
        <div className="flex items-center gap-3 flex-shrink-0">
          <div className="text-center">
            <div className="flex items-center gap-1.5 text-xs text-gray-500 mb-0.5">
              <Calendar className="w-3 h-3" />
              <span>Duration</span>
            </div>
            <p className="text-xs font-semibold text-gray-900">
              {formatDate(request.startDate)} - {formatDate(request.endDate)}
            </p>
          </div>

          <div className="text-center px-3 py-1.5  border border-purple-200 rounded-lg">
            <p className="text-xs text-blue-900 font-medium">
              {request.daysRequested}{" "}
              {request.daysRequested === 1 ? "day" : "days"}
            </p>
          </div>
        </div>

        {/* Right: Status & Actions */}
        <div className="flex items-center gap-2 flex-shrink-0">
          <div
            className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full border text-xs font-semibold ${statusConfig.bg} ${statusConfig.text} ${statusConfig.border}`}
          >
            <StatusIcon className={`w-3 h-3 ${statusConfig.iconColor}`} />
            <span className="capitalize">{request.status}</span>
          </div>

          {isPending && (
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => onApprove(request._id)}
                disabled={isLoading}
                className="p-1.5 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                title="Approve"
              >
                <CheckCircle className="w-4 h-4" />
              </button>
              <button
                onClick={() => onReject(request._id)}
                disabled={isLoading}
                className="p-1.5 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                title="Reject"
              >
                <XCircle className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Reason (collapsible on hover or click) */}
      {request.reason && (
        <div className="mt-3 pt-3 border-t border-gray-100">
          <p className="text-xs text-gray-600 line-clamp-2">{request.reason}</p>
        </div>
      )}
    </div>
  );
};

export default CompactLeaveCard;
