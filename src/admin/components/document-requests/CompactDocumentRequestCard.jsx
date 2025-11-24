import React from "react";
import {
  Clock,
  CheckCircle,
  XCircle,
  FileText,
  Award,
  Briefcase,
  TrendingUp,
  Calendar,
  Eye,
} from "lucide-react";

const CompactDocumentRequestCard = ({ request, onViewDetails }) => {
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
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
        };
      case "generated":
      case "downloaded":
        return {
          bg: "bg-green-50",
          text: "text-green-700",
          border: "border-green-200",
          icon: CheckCircle,
          iconColor: "text-green-500",
        };
      case "rejected":
        return {
          bg: "bg-red-50",
          text: "text-red-700",
          border: "border-red-200",
          icon: XCircle,
          iconColor: "text-red-500",
        };
      default:
        return {
          bg: "bg-gray-50",
          text: "text-gray-700",
          border: "border-gray-200",
          icon: Clock,
          iconColor: "text-gray-500",
        };
    }
  };

  const getTypeConfig = (type) => {
    switch (type) {
      case "recommendation":
        return {
          icon: Award,
          label: "Recommendation",
          color: "text-blue-600",
          bgColor: "bg-blue-50",
        };
      case "experience":
        return {
          icon: Briefcase,
          label: "Experience",
          color: "text-green-600",
          bgColor: "bg-green-50",
        };
      case "certificate":
        return {
          icon: TrendingUp,
          label: "Certificate",
          color: "text-purple-600",
          bgColor: "bg-purple-50",
        };
      default:
        return {
          icon: FileText,
          label: type,
          color: "text-gray-600",
          bgColor: "bg-gray-50",
        };
    }
  };

  const statusConfig = getStatusConfig(request.status);
  const typeConfig = getTypeConfig(request.type);
  const StatusIcon = statusConfig.icon;
  const TypeIcon = typeConfig.icon;
  const isPending = request.status === "pending";

  return (
    <div className="group bg-white rounded-lg shadow-sm border border-gray-100 p-4 hover:shadow-md hover:border-gray-200 transition-all duration-200">
      <div className="flex items-center justify-between gap-4">
        {/* Left: User & Document Info */}
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <div className="flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 text-white font-semibold text-xs flex-shrink-0">
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
            <div className="flex items-center gap-2 text-xs text-gray-500">
              <TypeIcon className="w-3 h-3" />
              <span className="truncate">
                {typeConfig.label}
                {request.customType && ` (${request.customType})`}
              </span>
            </div>
          </div>
        </div>

        {/* Middle: Date */}
        <div className="flex items-center gap-3 flex-shrink-0">
          <div className="text-center">
            <div className="flex items-center gap-1.5 text-xs text-gray-500 mb-0.5">
              <Calendar className="w-3 h-3" />
              <span>Requested</span>
            </div>
            <p className="text-xs font-semibold text-gray-900">
              {formatDate(request.createdAt)}
            </p>
          </div>
        </div>

        {/* Right: Status & Action */}
        <div className="flex items-center gap-2 flex-shrink-0">
          <div
            className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full border text-xs font-semibold ${statusConfig.bg} ${statusConfig.text} ${statusConfig.border}`}
          >
            <StatusIcon className={`w-3 h-3 ${statusConfig.iconColor}`} />
            <span className="capitalize">{request.status}</span>
          </div>

          {isPending && (
            <button
              onClick={() => onViewDetails(request)}
              className="p-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              title="View Details"
            >
              <Eye className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Reason (truncated) */}
      {request.reason && (
        <div className="mt-3 pt-3 border-t border-gray-100">
          <p className="text-xs text-gray-600 line-clamp-1">{request.reason}</p>
        </div>
      )}
    </div>
  );
};

export default CompactDocumentRequestCard;
