import React, { useState } from "react";
import {
  FileText,
  Clock,
  CheckCircle,
  XCircle,
  Search,
  List,
  Award,
  Briefcase,
  TrendingUp,
  RefreshCw,
} from "lucide-react";
import { useManageDocumentRequests } from "../../hooks/useManageDocumentRequests";
import DocumentRequestCard from "../../components/document-requests/DocumentRequestCard";
import CompactDocumentRequestCard from "../../components/document-requests/CompactDocumentRequestCard";
import DocumentRequestSkeleton from "../../components/document-requests/DocumentRequestSkeleton";
import DocumentTemplateModal from "../../components/document-requests/DocumentTemplateModal";
import PageLayout from "@/shared/components/layout/PagesLayout";
import { Button } from "@/components/ui/button";

const AdminDocumentRequestDashboard = () => {
  const {
    documentRequests,
    isLoading,
    searchTerm,
    setSearchTerm,
    showGenerateModal,
    selectedRequest,
    openGenerateModal,
    closeGenerateModal,
    handleGenerateDocument,
    handleDownload,
    handleRefresh,
    getPendingCount,
    getGeneratedRequests,
    getRejectedRequests,
    getRequestsByType,
  } = useManageDocumentRequests();

  const [activeTab, setActiveTab] = useState("all");

  const tabs = [
    {
      id: "all",
      label: "All Requests",
      icon: List,
      count: documentRequests.length,
      color: "purple",
    },
    {
      id: "pending",
      label: "Pending",
      icon: Clock,
      count: getPendingCount(),
      color: "orange",
    },
    {
      id: "generated",
      label: "Generated",
      icon: CheckCircle,
      count: getGeneratedRequests().length,
      color: "green",
    },
    {
      id: "rejected",
      label: "Rejected",
      icon: XCircle,
      count: getRejectedRequests().length,
      color: "red",
    },
    {
      id: "recommendation",
      label: "Recommendations",
      icon: Award,
      count: getRequestsByType("recommendation").length,
      color: "blue",
    },
    {
      id: "experience",
      label: "Experience",
      icon: Briefcase,
      count: getRequestsByType("experience").length,
      color: "green",
    },
    {
      id: "certificate",
      label: "Certificates",
      icon: TrendingUp,
      count: getRequestsByType("certificate").length,
      color: "purple",
    },
  ];

  const EmptyState = ({ icon: Icon, title, description }) => (
    <div className="bg-gradient-to-br from-gray-50 to-white rounded-2xl border-2 border-dashed border-gray-200 p-16 text-center">
      <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4">
        <Icon className="w-8 h-8 text-gray-400" />
      </div>
      <h3 className="text-xl font-semibold text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-500 max-w-md mx-auto">{description}</p>
    </div>
  );

  const renderTabContent = () => {
    if (isLoading.requests) {
      return (
        <div className="space-y-4">
          {[...Array(3)].map((_, index) => (
            <DocumentRequestSkeleton key={index} />
          ))}
        </div>
      );
    }

    let filteredRequests = [];

    switch (activeTab) {
      case "all":
        filteredRequests = documentRequests;
        break;
      case "pending":
        filteredRequests = documentRequests.filter(
          (req) => req.status === "pending"
        );
        break;
      case "generated":
        filteredRequests = getGeneratedRequests();
        break;
      case "rejected":
        filteredRequests = getRejectedRequests();
        break;
      case "recommendation":
      case "experience":
      case "certificate":
        filteredRequests = getRequestsByType(activeTab);
        break;
      default:
        filteredRequests = documentRequests;
    }

    if (filteredRequests.length === 0) {
      const emptyStates = {
        all: {
          icon: FileText,
          title: "No Document Requests",
          description: "No document requests have been submitted yet.",
        },
        pending: {
          icon: Clock,
          title: "No Pending Requests",
          description: "All caught up! There are no pending document requests.",
        },
        generated: {
          icon: CheckCircle,
          title: "No Generated Documents",
          description: "There are no generated documents to display.",
        },
        rejected: {
          icon: XCircle,
          title: "No Rejected Requests",
          description: "There are no rejected document requests.",
        },
        recommendation: {
          icon: Award,
          title: "No Recommendation Requests",
          description: "No recommendation letter requests have been made.",
        },
        experience: {
          icon: Briefcase,
          title: "No Experience Requests",
          description: "No experience letter requests have been made.",
        },
        certificate: {
          icon: TrendingUp,
          title: "No Certificate Requests",
          description: "No certificate requests have been made.",
        },
      };

      const state = emptyStates[activeTab] || emptyStates.all;
      return <EmptyState {...state} />;
    }

    // Use compact cards for "all" tab, full cards for others
    if (activeTab === "all") {
      return (
        <div className="space-y-3">
          {filteredRequests.map((request) => (
            <CompactDocumentRequestCard
              key={request._id}
              request={request}
              onViewDetails={openGenerateModal}
            />
          ))}
        </div>
      );
    }

    return (
      <div className="space-y-4">
        {filteredRequests.map((request) => (
          <DocumentRequestCard
            key={request._id}
            request={request}
            onGenerate={openGenerateModal}
            onDownload={handleDownload}
            isLoading={isLoading.generating}
            readOnly={request.status !== "pending"}
          />
        ))}
      </div>
    );
  };

  const getTabColorClasses = (tabId, isActive) => {
    if (!isActive) {
      return "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300";
    }

    const colorMap = {
      all: "border-purple-500 text-purple-600 bg-purple-50",
      pending: "border-orange-500 text-orange-600 bg-orange-50",
      generated: "border-green-500 text-green-600 bg-green-50",
      rejected: "border-red-500 text-red-600 bg-red-50",
      recommendation: "border-blue-500 text-blue-600 bg-blue-50",
      experience: "border-green-500 text-green-600 bg-green-50",
      certificate: "border-purple-500 text-purple-600 bg-purple-50",
    };

    return colorMap[tabId] || "border-blue-500 text-blue-600 bg-blue-50";
  };

  const getCountBadgeClasses = (tabId, isActive) => {
    if (!isActive) {
      return "bg-gray-100 text-gray-700";
    }

    const colorMap = {
      all: "bg-purple-100 text-purple-800 ring-1 ring-purple-500/20",
      pending: "bg-orange-100 text-orange-800 ring-1 ring-orange-500/20",
      generated: "bg-green-100 text-green-800 ring-1 ring-green-500/20",
      rejected: "bg-red-100 text-red-800 ring-1 ring-red-500/20",
      recommendation: "bg-blue-100 text-blue-800 ring-1 ring-blue-500/20",
      experience: "bg-green-100 text-green-800 ring-1 ring-green-500/20",
      certificate: "bg-purple-100 text-purple-800 ring-1 ring-purple-500/20",
    };

    return colorMap[tabId] || "bg-blue-100 text-blue-800";
  };

  return (
    <PageLayout
      title="Document Request Management"
      subtitle="Review and generate employee document requests"
      icon={FileText}
      actions={
        <div className="flex gap-3">
          <div className="relative">
            <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search requests..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none w-64 transition-all hover:border-gray-400"
            />
          </div>
          <Button
            variant="outline"
            onClick={handleRefresh}
            className="inline-flex items-center gap-2 rounded-lg"
            disabled={isLoading.requests}
          >
            <RefreshCw
              className={`w-4 h-4 ${isLoading.requests ? "animate-spin" : ""}`}
            />
            Refresh
          </Button>
        </div>
      }
    >
      {/* Modern Tabs */}
      <div className="mb-8">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex gap-2 overflow-x-auto" aria-label="Tabs">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`group relative px-6 py-3 border-b-2 font-medium text-sm flex items-center gap-2 rounded-t-lg transition-all duration-200 whitespace-nowrap ${getTabColorClasses(
                    tab.id,
                    isActive
                  )}`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{tab.label}</span>
                  <span
                    className={`inline-flex items-center justify-center min-w-6 h-6 px-2 rounded-full text-xs font-semibold transition-all ${getCountBadgeClasses(
                      tab.id,
                      isActive
                    )}`}
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

      {/* Document Generation Modal */}
      {showGenerateModal && selectedRequest && (
        <DocumentTemplateModal
          request={selectedRequest}
          onClose={closeGenerateModal}
          onGenerate={handleGenerateDocument}
          isLoading={isLoading.generating}
        />
      )}
    </PageLayout>
  );
};

export default AdminDocumentRequestDashboard;
