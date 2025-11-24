import React, { useState } from "react";
import {
  FileText,
  Plus,
  RefreshCw,
  Clock,
  CheckCircle,
  Download,
  Trash2,
  Award,
  Briefcase,
  TrendingUp,
  Calendar,
  List,
} from "lucide-react";
import { useDocumentRequests } from "../../hooks/useDocumentRequests";
import DocumentRequestForm from "../../components/document-requests/DocumentRequestForm";
import PageLayout from "@/shared/components/layout/PagesLayout";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

const MyDocuments = () => {
  const {
    documentRequests,
    isLoading,
    showRequestForm,
    setShowRequestForm,
    formData,
    handleInputChange,
    handleSubmit,
    handleCancelRequest,
    handleDownload,
    refetch,
    getPendingCount,
    getGeneratedCount,
    getPendingRequests,
    getGeneratedRequests,
  } = useDocumentRequests();

  const [activeTab, setActiveTab] = useState("all");

  const handleFormCancel = () => {
    setShowRequestForm(false);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getStatusConfig = (status) => {
    switch (status) {
      case "pending":
        return {
          bg: "bg-blue-50",
          text: "text-blue-700",
          border: "border-blue-200",
          icon: Clock,
          iconColor: "text-blue-500",
          label: "Pending Review",
        };
      case "generated":
      case "downloaded":
        return {
          bg: "bg-slate-50",
          text: "text-slate-700",
          border: "border-slate-200",
          icon: CheckCircle,
          iconColor: "text-slate-500",
          label: status === "downloaded" ? "Downloaded" : "Ready",
        };
      case "rejected":
        return {
          bg: "bg-slate-100",
          text: "text-slate-700",
          border: "border-slate-300",
          icon: Clock,
          iconColor: "text-slate-500",
          label: "Rejected",
        };
      default:
        return {
          bg: "bg-slate-50",
          text: "text-slate-700",
          border: "border-slate-200",
          icon: Clock,
          iconColor: "text-slate-500",
          label: status,
        };
    }
  };

  const getTypeConfig = (type) => {
    switch (type) {
      case "recommendation":
        return { icon: Award, label: "Recommendation Letter" };
      case "experience":
        return { icon: Briefcase, label: "Experience Letter" };
      case "certificate":
        return { icon: TrendingUp, label: "Certificate" };
      default:
        return { icon: FileText, label: type };
    }
  };

  const tabs = [
    {
      id: "all",
      label: "All Documents",
      icon: List,
      count: documentRequests.length,
    },
    {
      id: "pending",
      label: "Pending",
      icon: Clock,
      count: getPendingCount(),
    },
    {
      id: "ready",
      label: "Ready to Download",
      icon: CheckCircle,
      count: getGeneratedCount(),
    },
  ];

  const EmptyState = ({ icon: Icon, title, description }) => (
    <div className="bg-gradient-to-br from-slate-50 to-white rounded-2xl border-2 border-dashed border-slate-200 p-16 text-center">
      <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-slate-100 mb-4">
        <Icon className="w-8 h-8 text-slate-400" />
      </div>
      <h3 className="text-xl font-semibold text-slate-900 mb-2">{title}</h3>
      <p className="text-slate-500 max-w-md mx-auto">{description}</p>
    </div>
  );

  const DocumentCard = ({ request }) => {
    const statusConfig = getStatusConfig(request.status);
    const typeConfig = getTypeConfig(request.type);
    const StatusIcon = statusConfig.icon;
    const TypeIcon = typeConfig.icon;
    const canCancel = request.status === "pending";
    const canDownload =
      request.status === "generated" || request.status === "downloaded";

    return (
      <div className="group bg-white rounded-xl shadow-sm border border-slate-200 p-6 hover:shadow-md hover:border-blue-200 transition-all duration-300">
        <div className="flex items-start justify-between gap-6">
          <div className="flex-1 space-y-4">
            {/* Header */}
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-blue-50 border border-blue-100">
                  <TypeIcon className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h4 className="text-base font-semibold text-slate-900">
                    {typeConfig.label}
                    {request.customType && (
                      <span className="text-sm font-normal text-slate-500 ml-2">
                        ({request.customType})
                      </span>
                    )}
                  </h4>
                  <div className="flex items-center gap-2 mt-1 text-xs text-slate-500">
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
            <div className="bg-slate-50 border border-slate-200 rounded-lg p-3">
              <p className="text-sm font-medium text-slate-700 mb-1">Reason:</p>
              <p className="text-sm text-slate-600 leading-relaxed">
                {request.reason}
              </p>
            </div>

            {/* Admin Comments */}
            {request.status === "rejected" && request.adminComments && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                <p className="text-sm font-medium text-blue-700 mb-1">
                  Admin Response:
                </p>
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

          {/* Actions */}
          <div className="flex flex-col gap-2">
            {canDownload && (
              <Button
                onClick={() => handleDownload(request.generatedDocumentUrl)}
                disabled={isLoading.cancelling}
                className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 hover:shadow-md transition-all font-medium"
              >
                <Download className="w-4 h-4" />
                Download
              </Button>
            )}

            {canCancel && (
              <Button
                onClick={() => handleCancelRequest(request._id)}
                disabled={isLoading.cancelling}
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
  };

  const renderTabContent = () => {
    if (isLoading.requests) {
      return (
        <div className="space-y-4">
          {[...Array(3)].map((_, index) => (
            <div
              key={index}
              className="bg-white rounded-xl shadow-sm border border-slate-100 p-6"
            >
              <div className="flex items-start gap-6">
                <Skeleton className="h-12 w-12 rounded-lg" />
                <div className="flex-1 space-y-3">
                  <div className="flex items-center justify-between">
                    <Skeleton className="h-5 w-48" />
                    <Skeleton className="h-6 w-24 rounded-full" />
                  </div>
                  <Skeleton className="h-20 w-full rounded-lg" />
                  <Skeleton className="h-4 w-32" />
                </div>
              </div>
            </div>
          ))}
        </div>
      );
    }

    let filteredRequests = [];
    let emptyState = {};

    switch (activeTab) {
      case "all":
        filteredRequests = documentRequests;
        emptyState = {
          icon: FileText,
          title: "No Documents Yet",
          description:
            "You haven't requested any documents yet. Click 'Request Document' to get started.",
        };
        break;
      case "pending":
        filteredRequests = getPendingRequests();
        emptyState = {
          icon: Clock,
          title: "No Pending Requests",
          description: "You don't have any pending document requests.",
        };
        break;
      case "ready":
        filteredRequests = getGeneratedRequests();
        emptyState = {
          icon: CheckCircle,
          title: "No Documents Ready",
          description: "You don't have any documents ready for download.",
        };
        break;
      default:
        filteredRequests = documentRequests;
    }

    if (filteredRequests.length === 0) {
      return <EmptyState {...emptyState} />;
    }

    return (
      <div className="space-y-4">
        {filteredRequests.map((request) => (
          <DocumentCard key={request._id} request={request} />
        ))}
      </div>
    );
  };

  return (
    <PageLayout
      title="My Documents"
      subtitle="Request and manage your official documents"
      icon={FileText}
      actions={
        <div className="flex gap-3">
          <Button
            variant="outline"
            onClick={refetch}
            className="inline-flex items-center gap-2 rounded-lg border-slate-300 text-slate-700 hover:bg-slate-50"
            disabled={isLoading.requests}
          >
            <RefreshCw
              className={`w-4 h-4 ${isLoading.requests ? "animate-spin" : ""}`}
            />
            Refresh
          </Button>
          <Button
            onClick={() => setShowRequestForm(true)}
            className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow-md hover:shadow-lg transition-all"
            disabled={showRequestForm}
          >
            <Plus className="w-4 h-4" />
            Request Document
          </Button>
        </div>
      }
    >
      {/* Stats Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-5 transition-all hover:shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600 mb-1">
                Pending Requests
              </p>
              <p className="text-3xl font-bold text-blue-600">
                {getPendingCount()}
              </p>
            </div>
            <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center shadow-sm">
              <Clock className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 transition-all hover:shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600 mb-1">
                Ready to Download
              </p>
              <p className="text-3xl font-bold text-slate-700">
                {getGeneratedCount()}
              </p>
            </div>
            <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center shadow-sm">
              <CheckCircle className="w-6 h-6 text-slate-600" />
            </div>
          </div>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-xl p-5 transition-all hover:shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600 mb-1">
                Total Documents
              </p>
              <p className="text-3xl font-bold text-blue-600">
                {documentRequests.length}
              </p>
            </div>
            <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center shadow-sm">
              <FileText className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Request Form */}
      {showRequestForm && (
        <div className="animate-in fade-in slide-in-from-top-4 duration-300 mb-6">
          <DocumentRequestForm
            formData={formData}
            onInputChange={handleInputChange}
            onSubmit={handleSubmit}
            onCancel={handleFormCancel}
            isLoading={isLoading.submitting}
          />
        </div>
      )}

      {/* Tabs */}
      <div className="mb-8">
        <div className="border-b border-slate-200">
          <nav className="-mb-px flex gap-2" aria-label="Tabs">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`group relative px-6 py-3 border-b-2 font-medium text-sm flex items-center gap-2 rounded-t-lg transition-all duration-200 ${
                    isActive
                      ? "border-blue-500 text-blue-600 bg-blue-50"
                      : "border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{tab.label}</span>
                  <span
                    className={`inline-flex items-center justify-center min-w-6 h-6 px-2 rounded-full text-xs font-semibold transition-all ${
                      isActive
                        ? "bg-blue-100 text-blue-800 ring-1 ring-blue-500/20"
                        : "bg-slate-100 text-slate-700"
                    }`}
                  >
                    {tab.count}
                  </span>
                </button>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Tab Content */}
      <div className="transition-all duration-300">{renderTabContent()}</div>
    </PageLayout>
  );
};

export default MyDocuments;
