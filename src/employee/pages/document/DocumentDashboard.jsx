import React, { useState } from "react";
import { FileText, Clock, CheckCircle, XCircle } from "lucide-react";
import PageLayout from "@/shared/components/layout/PagesLayout";
import DocumentList from "../../components/document/DocumentList";
import { useEmployeeDocumentManager } from "../../hooks/useEmployeeDocumentManager";

const DocumentDashboard = () => {
  const {
    documents,
    isDocumentsLoading,
  } = useEmployeeDocumentManager();
  console.log(documents);
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
      title="My Documents"
      subtitle="Manage and review your documents"
      icon={FileText}
    >
      <div className="space-y-6">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat) => (
            <div
              key={stat.name}
              className="relative overflow-hidden rounded-l g bg-white px-4 py-5  border border-gray-200 sm:px-6 sm:pt-6"
            >
              <dt>
                <div className={`absolute rounded-md  p-3`}>
                  <stat.icon
                    className="h-6 w-6 text-brand-primary"
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

        {/* Document List */}
        <DocumentList
          documents={filteredDocuments}
          isLoading={isDocumentsLoading}
          statusFilter={statusFilter}
          setStatusFilter={setStatusFilter}
        />
      </div>
    </PageLayout>
  );
};

export default DocumentDashboard;
