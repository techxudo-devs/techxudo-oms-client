import React, { useState } from "react";
import { FileText, Clock, CheckCircle, XCircle, Plus } from "lucide-react";
import PageLayout from "@/shared/components/layout/PagesLayout";
import { useEmployeeDocumentManager } from "../../hooks/useEmployeeDocumentManager";
import { useDocumentRequests } from "../../hooks/useDocumentRequests";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import DocumentList from "../../components/document/DocumentList";
import DocumentRequestForm from "../../components/document-requests/DocumentRequestForm";
import DocumentRequestHistory from "../../components/document-requests/DocumentRequestHistory";

const UnifiedDocumentManagement = () => {
  const {
    documents,
    isDocumentsLoading,
  } = useEmployeeDocumentManager();
  
  const {
    documentRequests,
    isLoading,
    handleSubmit,
    formData,
    handleInputChange,
    showRequestForm,
    setShowRequestForm,
    handleCancelRequest
  } = useDocumentRequests();

  const [statusFilter, setStatusFilter] = useState(null);

  const filteredDocuments = statusFilter
    ? documents.filter((doc) => doc.status === statusFilter)
    : documents;

  const stats = [
    {
      name: "Total Documents",
      value: documents.length,
      icon: FileText,
      color: "bg-blue-500",
    },
    {
      name: "Pending Documents",
      value: documents.filter((doc) => doc.status === "pending").length,
      icon: Clock,
      color: "bg-yellow-500",
    },
    {
      name: "Signed Documents",
      value: documents.filter((doc) => doc.status === "signed").length,
      icon: CheckCircle,
      color: "bg-green-500",
    },
    {
      name: "Declined Documents",
      value: documents.filter((doc) => doc.status === "declined").length,
      icon: XCircle,
      color: "bg-red-500",
    },
  ];

  return (
    <PageLayout
      title="Document Management"
      subtitle="Manage and request your documents"
      icon={FileText}
    >
      <div className="space-y-6">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat) => (
            <div
              key={stat.name}
              className="relative overflow-hidden rounded-lg bg-white px-4 py-5 border border-gray-200 sm:px-6 sm:pt-6"
            >
              <dt>
                <div className={`${stat.color} absolute rounded-md p-3`}>
                  <stat.icon
                    className="h-6 w-6 text-white"
                    aria-hidden="true"
                  />
                </div>
                <p className="ml-16 truncate text-sm font-medium text-gray-500">
                  {stat.name}
                </p>
              </dt>
              <dd className="ml-16 flex items-baseline">
                <p className="text-2xl font-semibold text-gray-900">
                  {stat.value}
                </p>
              </dd>
            </div>
          ))}
        </div>

        {/* Main Content with Tabs */}
        <Tabs defaultValue="documents" className="space-y-4">
          <TabsList className="grid w-full grid-cols-2 lg:w-[400px]">
            <TabsTrigger value="documents">My Documents</TabsTrigger>
            <TabsTrigger value="requests">Request Documents</TabsTrigger>
          </TabsList>

          <TabsContent value="documents" className="space-y-4">
            <DocumentList
              documents={filteredDocuments}
              isLoading={isDocumentsLoading}
              statusFilter={statusFilter}
              setStatusFilter={setStatusFilter}
            />
          </TabsContent>

          <TabsContent value="requests" className="space-y-4">
            <div className="space-y-6">
              {/* Request Form Section */}
              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-lg font-semibold text-gray-900">
                    Request New Document
                  </h2>
                </div>

                {showRequestForm ? (
                  <DocumentRequestForm
                    formData={formData}
                    onInputChange={handleInputChange}
                    onSubmit={handleSubmit}
                    onCancel={() => setShowRequestForm(false)}
                    isLoading={isLoading.requests?.submitting}
                  />
                ) : (
                  <div className="text-center py-8">
                    <FileText className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                    <p className="text-gray-600 mb-4">
                      You don't have any document request form open.
                    </p>
                    <button
                      onClick={() => setShowRequestForm(true)}
                      className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Request Document
                    </button>
                  </div>
                )}
              </div>

              <div className="mt-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold text-gray-900">
                    Request History
                  </h2>
                </div>
                <DocumentRequestHistory
                  requests={documentRequests}
                  onDownload={(url) => {
                    if (url) window.open(url, '_blank');
                  }}
                  onCancel={handleCancelRequest}
                  isLoading={isLoading.cancelling}
                />
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </PageLayout>
  );
};

export default UnifiedDocumentManagement;