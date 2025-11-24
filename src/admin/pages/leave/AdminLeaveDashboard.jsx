import React, { useState } from "react";
import {
  Calendar,
  Clock,
  CheckCircle,
  XCircle,
  Search,
  List,
} from "lucide-react";
import { useManageLeave } from "../../hooks/useManageLeave";
import LeaveRequestCard from "@/admin/components/leave/LeaveRequestCard";
import CompactLeaveCard from "@/admin/components/leave/CompactLeaveCard";
import LeaveRequestSkeleton from "@/admin/components/leave/LeaveRequestSkeleton";
import LeaveCalendarView from "@/admin/components/leave/LeaveCalendarView";
import PageLayout from "@/shared/components/layout/PagesLayout";

const AdminLeaveDashboard = () => {
  const {
    leaveRequests,
    isLoading,
    approveLeave,
    rejectLeave,
    searchTerm,
    setSearchTerm,
    getPendingCount,
    getApprovedRequests,
    getRejectedRequests,
    getCalendarEvents,
  } = useManageLeave();

  const [activeTab, setActiveTab] = useState("all");

  const tabs = [
    {
      id: "all",
      label: "All Requests",
      icon: List,
      count: leaveRequests.length,
      color: "blue-900",
    },
    {
      id: "pending",
      label: "Pending",
      icon: Clock,
      count: getPendingCount(),
      color: "orange",
    },
    {
      id: "approved",
      label: "Approved",
      icon: CheckCircle,
      count: getApprovedRequests().length,
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
      id: "calendar",
      label: "Calendar",
      icon: Calendar,
      count: null,
      color: "blue",
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
    if (isLoading.leaveRequests) {
      return (
        <div className="space-y-4">
          {[...Array(3)].map((_, index) => (
            <LeaveRequestSkeleton key={index} />
          ))}
        </div>
      );
    }

    switch (activeTab) {
      case "all": {
        return leaveRequests.length === 0 ? (
          <EmptyState
            icon={List}
            title="No Leave Requests"
            description="There are no leave requests to display at this time."
          />
        ) : (
          <div className="space-y-3">
            {leaveRequests.map((request) => (
              <CompactLeaveCard
                key={request._id}
                request={request}
                onApprove={approveLeave}
                onReject={rejectLeave}
                isLoading={isLoading.updateStatus}
              />
            ))}
          </div>
        );
      }

      case "pending": {
        const pendingRequests = leaveRequests.filter(
          (request) => request.status === "pending"
        );
        return pendingRequests.length === 0 ? (
          <EmptyState
            icon={Clock}
            title="No Pending Requests"
            description="All caught up! There are no pending leave requests at the moment."
          />
        ) : (
          <div className="space-y-4">
            {pendingRequests.map((request) => (
              <LeaveRequestCard
                key={request._id}
                request={request}
                onApprove={approveLeave}
                onReject={rejectLeave}
                isLoading={isLoading.updateStatus}
              />
            ))}
          </div>
        );
      }

      case "approved": {
        const approvedRequests = getApprovedRequests();
        return approvedRequests.length === 0 ? (
          <EmptyState
            icon={CheckCircle}
            title="No Approved Requests"
            description="There are no approved leave requests to display."
          />
        ) : (
          <div className="space-y-4">
            {approvedRequests.map((request) => (
              <LeaveRequestCard
                key={request._id}
                request={request}
                onApprove={approveLeave}
                onReject={rejectLeave}
                isLoading={isLoading.updateStatus}
                readOnly
              />
            ))}
          </div>
        );
      }

      case "rejected": {
        const rejectedRequests = getRejectedRequests();
        return rejectedRequests.length === 0 ? (
          <EmptyState
            icon={XCircle}
            title="No Rejected Requests"
            description="There are no rejected leave requests to display."
          />
        ) : (
          <div className="space-y-4">
            {rejectedRequests.map((request) => (
              <LeaveRequestCard
                key={request._id}
                request={request}
                onApprove={approveLeave}
                onReject={rejectLeave}
                isLoading={isLoading.updateStatus}
                readOnly
              />
            ))}
          </div>
        );
      }

      case "calendar":
        return <LeaveCalendarView events={getCalendarEvents()} />;

      default:
        return null;
    }
  };

  const getTabColorClasses = (tabId, isActive) => {
    if (!isActive) {
      return "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300";
    }

    const colorMap = {
      all: "border-purple-500 text-purple-600 bg-purple-50",
      pending: "border-orange-500 text-orange-600 bg-orange-50",
      approved: "border-green-500 text-green-600 bg-green-50",
      rejected: "border-red-500 text-red-600 bg-red-50",
      calendar: "border-blue-500 text-blue-600 bg-blue-50",
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
      approved: "bg-green-100 text-green-800 ring-1 ring-green-500/20",
      rejected: "bg-red-100 text-red-800 ring-1 ring-red-500/20",
      calendar: "bg-blue-100 text-blue-800 ring-1 ring-blue-500/20",
    };

    return colorMap[tabId] || "bg-blue-100 text-blue-800";
  };

  return (
    <PageLayout
      title="Leave Management"
      subtitle="Manage and approve employee leave requests efficiently"
      icon={Calendar}
      actions={
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
      }
    >
      {/* Modern Tabs */}
      <div className="mb-8">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex gap-2" aria-label="Tabs">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`group relative px-6 py-3 border-b-2 font-medium text-sm flex items-center gap-2 rounded-t-lg transition-all duration-200 ${getTabColorClasses(
                    tab.id,
                    isActive
                  )}`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{tab.label}</span>
                  {tab.count !== null && (
                    <span
                      className={`inline-flex items-center justify-center min-w-6 h-6 px-2 rounded-full text-xs font-semibold transition-all ${getCountBadgeClasses(
                        tab.id,
                        isActive
                      )}`}
                    >
                      {tab.count}
                    </span>
                  )}
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

export default AdminLeaveDashboard;
