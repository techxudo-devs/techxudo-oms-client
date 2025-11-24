import React from "react";
import {
  Clock,
  CheckCircle,
  XCircle,
  FileText,
  Calendar,
  Award,
  Briefcase,
  TrendingUp,
  User as UserIcon,
  FileCheck,
  Download,
} from "lucide-react";
import { Button } from "@/components/ui/button";

const DocumentRequestCard = ({
  request,
  onGenerate,
  onDownload,
  isLoading,
  readOnly = false,
}) => {
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
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
          label: "Pending Review",
        };
      case "generated":
      case "downloaded":
        return {
          bg: "bg-green-50",
          text: "text-green-700",
          border: "border-green-200",
          icon: CheckCircle,
          iconColor: "text-green-500",
          label: status === "downloaded" ? "Downloaded" : "Generated",
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

  const getTypeConfig = (type) => {
    switch (type) {
      case "recommendation":
        return {
          icon: Award,
          label: "Recommendation Letter",
          color: "text-blue-600",
          bgColor: "bg-blue-50",
        };
      case "experience":
        return {
          icon: Briefcase,
          label: "Experience Letter",
          color: "text-green-600",
          bgColor: "bg-green-50",
        };
      case "certificate":
        return {
          icon: TrendingUp,
          label: "Custom Certificate",
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
  const canGenerate = !readOnly && request.status === "pending";
  const canDownload = request.status === "generated" || request.status === "downloaded";

  return (
    <div className="group bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-lg hover:border-gray-200 transition-all duration-300">
      <div className="flex gap-6">
        {/* Left Section - Main Content */}
        <div className="flex-1 space-y-5">
          {/* Header with Employee & Status */}
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 text-white font-semibold text-sm shadow-md">
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
                  <UserIcon className="w-3.5 h-3.5 text-gray-400" />
                  <span className="text-sm text-gray-600 font-medium">
                    {request.userId?.designation || "Employee"}
                  </span>
                </div>
              </div>
            </div>

            <div
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border ${statusConfig.bg} ${statusConfig.text} ${statusConfig.border}`}
            >
              <StatusIcon className={`w-3.5 h-3.5 ${statusConfig.iconColor}`} />
              <span className="text-xs font-semibold">{statusConfig.label}</span>
            </div>
          </div>

          {/* Document Type & Date Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className={`flex items-center gap-3 px-4 py-3 ${typeConfig.bgColor} border border-${typeConfig.color.replace('text-', '')}-200 rounded-lg`}>
              <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-white shadow-sm">
                <TypeIcon className={`w-5 h-5 ${typeConfig.color}`} />
              </div>
              <div className="flex-1">
                <p className="text-xs font-medium text-gray-500 mb-0.5">Document Type</p>
                <p className="text-sm font-semibold text-gray-900 truncate">
                  {typeConfig.label}
                </p>
                {request.customType && (
                  <p className="text-xs text-gray-500">({request.customType})</p>
                )}
              </div>
            </div>

            <div className="flex items-center gap-3 px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg">
              <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-white shadow-sm">
                <Calendar className="w-5 h-5 text-gray-600" />
              </div>
              <div className="flex-1">
                <p className="text-xs font-medium text-gray-500 mb-0.5">Requested On</p>
                <p className="text-sm font-semibold text-gray-900">
                  {formatDate(request.createdAt)}
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
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
              <p className="text-sm text-gray-700 leading-relaxed">{request.reason}</p>
            </div>
          </div>

          {/* Admin Comments (if any) */}
          {request.adminComments && (
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <FileCheck className="w-4 h-4 text-gray-400" />
                <h4 className="text-sm font-semibold text-gray-700">Admin Comments</h4>
              </div>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-sm text-blue-700 leading-relaxed">
                  {request.adminComments}
                </p>
              </div>
            </div>
          )}

          {/* Generated Document Info */}
          {canDownload && request.completedAt && (
            <div className="flex items-center gap-2 text-xs text-gray-500 pt-2 border-t border-gray-100">
              <CheckCircle className="w-3.5 h-3.5 text-green-500" />
              <span>Document generated on {formatDate(request.completedAt)}</span>
            </div>
          )}

          {/* Submitted Date */}
          <div className="flex items-center gap-2 text-xs text-gray-500 pt-2 border-t border-gray-100">
            <Clock className="w-3.5 h-3.5" />
            <span>Submitted on {formatDate(request.createdAt)}</span>
          </div>
        </div>

        {/* Right Section - Actions */}
        {(canGenerate || canDownload) && (
          <div className="flex flex-col gap-2 pt-1">
            {canGenerate && (
              <Button
                onClick={() => onGenerate(request)}
                disabled={isLoading}
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 hover:shadow-md transition-all disabled:opacity-50 disabled:cursor-not-allowed font-medium"
              >
                <FileCheck className="w-4 h-4" />
                Generate
              </Button>
            )}

            {canDownload && (
              <Button
                onClick={() => onDownload(request.generatedDocumentUrl)}
                disabled={isLoading}
                variant="outline"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg hover:shadow-md transition-all font-medium"
              >
                <Download className="w-4 h-4" />
                Download
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default DocumentRequestCard;
