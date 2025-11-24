import React from 'react';
import {
  FileText,
  Clock,
  CheckCircle,
  XCircle,
  Download,
  Trash2,
  Award,
  Briefcase,
  TrendingUp,
  Calendar
} from 'lucide-react';
import { Button } from '@/components/ui/button';

const DocumentRequestHistory = ({
  requests,
  onDownload,
  onCancel,
  isLoading
}) => {
  const getStatusConfig = (status) => {
    switch (status) {
      case 'pending':
        return {
          bg: 'bg-blue-50',
          text: 'text-blue-700',
          border: 'border-blue-200',
          icon: Clock,
          iconColor: 'text-blue-500',
          label: 'Pending Review'
        };
      case 'generated':
      case 'downloaded':
        return {
          bg: 'bg-slate-50',
          text: 'text-slate-700',
          border: 'border-slate-200',
          icon: CheckCircle,
          iconColor: 'text-slate-500',
          label: status === 'downloaded' ? 'Downloaded' : 'Ready'
        };
      case 'rejected':
        return {
          bg: 'bg-slate-100',
          text: 'text-slate-700',
          border: 'border-slate-300',
          icon: XCircle,
          iconColor: 'text-slate-500',
          label: 'Rejected'
        };
      default:
        return {
          bg: 'bg-slate-50',
          text: 'text-slate-700',
          border: 'border-slate-200',
          icon: Clock,
          iconColor: 'text-slate-500',
          label: status
        };
    }
  };

  const getTypeConfig = (type) => {
    switch (type) {
      case 'recommendation':
        return {
          icon: Award,
          label: 'Recommendation Letter',
          color: 'text-blue-600',
          bgColor: 'bg-blue-50'
        };
      case 'experience':
        return {
          icon: Briefcase,
          label: 'Experience Letter',
          color: 'text-blue-600',
          bgColor: 'bg-blue-50'
        };
      case 'certificate':
        return {
          icon: TrendingUp,
          label: 'Certificate',
          color: 'text-blue-600',
          bgColor: 'bg-blue-50'
        };
      default:
        return {
          icon: FileText,
          label: type,
          color: 'text-slate-600',
          bgColor: 'bg-slate-50'
        };
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (!requests || requests.length === 0) {
    return (
      <div className="bg-gradient-to-br from-gray-50 to-white rounded-2xl border-2 border-dashed border-gray-200 p-16 text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4">
          <FileText className="w-8 h-8 text-gray-400" />
        </div>
        <h3 className="text-xl font-semibold text-gray-900 mb-2">No Document Requests</h3>
        <p className="text-gray-500 max-w-md mx-auto">
          You haven't requested any documents yet. Click "Request Document" to get started.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {requests.map((request) => {
        const statusConfig = getStatusConfig(request.status);
        const typeConfig = getTypeConfig(request.type);
        const StatusIcon = statusConfig.icon;
        const TypeIcon = typeConfig.icon;
        const canCancel = request.status === 'pending';
        const canDownload = request.status === 'generated' || request.status === 'downloaded';

        return (
          <div
            key={request._id}
            className="group bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md hover:border-gray-200 transition-all duration-300"
          >
            <div className="flex items-start justify-between gap-6">
              {/* Left Section */}
              <div className="flex-1 space-y-4">
                {/* Header */}
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`flex items-center justify-center w-12 h-12 rounded-lg ${typeConfig.bgColor}`}>
                      <TypeIcon className={`w-6 h-6 ${typeConfig.color}`} />
                    </div>
                    <div>
                      <h4 className="text-base font-semibold text-gray-900">
                        {typeConfig.label}
                        {request.customType && (
                          <span className="text-sm font-normal text-gray-500 ml-2">
                            ({request.customType})
                          </span>
                        )}
                      </h4>
                      <div className="flex items-center gap-2 mt-1 text-xs text-gray-500">
                        <Calendar className="w-3 h-3" />
                        <span>Requested on {formatDate(request.createdAt)}</span>
                      </div>
                    </div>
                  </div>

                  <div
                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs font-semibold ${statusConfig.bg} ${statusConfig.text} ${statusConfig.border}`}
                  >
                    <StatusIcon className={`w-3.5 h-3.5 ${statusConfig.iconColor}`} />
                    <span>{statusConfig.label}</span>
                  </div>
                </div>

                {/* Reason */}
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
                  <p className="text-sm font-medium text-gray-700 mb-1">Reason:</p>
                  <p className="text-sm text-gray-600 leading-relaxed">{request.reason}</p>
                </div>

                {/* Admin Comments (if rejected) */}
                {request.status === 'rejected' && request.adminComments && (
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                    <p className="text-sm font-medium text-blue-700 mb-1">Admin Response:</p>
                    <p className="text-sm text-blue-600">{request.adminComments}</p>
                  </div>
                )}

                {/* Completion Info */}
                {request.completedAt && (
                  <div className="flex items-center gap-2 text-xs text-slate-500">
                    <CheckCircle className="w-3.5 h-3.5 text-slate-500" />
                    <span>Generated on {formatDate(request.completedAt)}</span>
                  </div>
                )}
              </div>

              {/* Right Section - Actions */}
              <div className="flex flex-col gap-2">
                {canDownload && (
                  <Button
                    onClick={() => onDownload(request.generatedDocumentUrl)}
                    disabled={isLoading}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 hover:shadow-md transition-all font-medium"
                  >
                    <Download className="w-4 h-4" />
                    Download
                  </Button>
                )}

                {canCancel && (
                  <Button
                    onClick={() => onCancel(request._id)}
                    disabled={isLoading}
                    variant="outline"
                    className="inline-flex items-center gap-2 px-4 py-2 text-slate-600 border-slate-300 hover:bg-slate-50 rounded-lg transition-all font-medium"
                  >
                    <Trash2 className="w-4 h-4" />
                    Cancel
                  </Button>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default DocumentRequestHistory;
