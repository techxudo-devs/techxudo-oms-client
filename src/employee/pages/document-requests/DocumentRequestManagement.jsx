import React from "react";
import { FileText, Plus, Filter, RefreshCw } from "lucide-react";
import { useDocumentRequests } from "../../hooks/useDocumentRequests";
import DocumentRequestForm from "../../components/document-requests/DocumentRequestForm";
import DocumentRequestHistory from "../../components/document-requests/DocumentRequestHistory";
import PageLayout from "@/shared/components/layout/PagesLayout";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

const DocumentRequestManagement = () => {
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
  } = useDocumentRequests();

  const handleFormCancel = () => {
    setShowRequestForm(false);
  };

  // Stats Cards
  const stats = [
    {
      label: "Pending Requests",
      value: getPendingCount(),
      color: "blue",
      bgColor: "bg-blue-50",
      textColor: "text-blue-600",
      borderColor: "border-blue-200",
    },
    {
      label: "Ready to Download",
      value: getGeneratedCount(),
      color: "slate",
      bgColor: "bg-slate-50",
      textColor: "text-slate-700",
      borderColor: "border-slate-200",
    },
    {
      label: "Total Requests",
      value: documentRequests.length,
      color: "blue",
      bgColor: "bg-blue-50",
      textColor: "text-blue-600",
      borderColor: "border-blue-200",
    },
  ];

  return (
    <PageLayout
      title="Document Requests"
      subtitle="Request and manage your official documents"
      icon={FileText}
      actions={
        <div className="flex gap-3">
          <Button
            variant="outline"
            onClick={refetch}
            className="inline-flex items-center gap-2 rounded-lg"
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
        {stats.map((stat, index) => (
          <div
            key={index}
            className={`${stat.bgColor} border ${stat.borderColor} rounded-xl p-5 transition-all hover:shadow-md`}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">
                  {stat.label}
                </p>
                <p className={`text-3xl font-bold ${stat.textColor}`}>
                  {stat.value}
                </p>
              </div>
              <div
                className={`w-12 h-12 ${stat.bgColor} rounded-lg flex items-center justify-center ring-2 ring-white shadow-sm`}
              >
                <FileText className={`w-6 h-6 ${stat.textColor}`} />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Request Form */}
      {showRequestForm && (
        <div className="animate-in fade-in slide-in-from-top-4 duration-300">
          <DocumentRequestForm
            formData={formData}
            onInputChange={handleInputChange}
            onSubmit={handleSubmit}
            onCancel={handleFormCancel}
            isLoading={isLoading.submitting}
          />
        </div>
      )}

      {/* Request History Section */}
      <div className="mt-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">
            Request History
          </h2>
        </div>

        {isLoading.requests ? (
          <div className="space-y-4">
            {[...Array(3)].map((_, index) => (
              <div
                key={index}
                className="bg-white rounded-xl shadow-sm border border-gray-100 p-6"
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
                  <div className="space-y-2">
                    <Skeleton className="h-10 w-28 rounded-lg" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <DocumentRequestHistory
            requests={documentRequests}
            onDownload={handleDownload}
            onCancel={handleCancelRequest}
            isLoading={isLoading.cancelling}
          />
        )}
      </div>
    </PageLayout>
  );
};

export default DocumentRequestManagement;
