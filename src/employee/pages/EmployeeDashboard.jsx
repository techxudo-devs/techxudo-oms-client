import React from "react";
import {
  Clock,
  Calendar,
  FileText,
  ClipboardList,
  BarChart2Icon,
} from "lucide-react";
import { useAuth } from "../../shared/hooks/useAuth";
import { Link } from "react-router-dom";
import { useGetPendingDocumentsQuery } from "../apiSlices/documentApiSlice";
import RecentAttendanceTable from "@/shared/dashboard/RecentAttendanceTable";
import RecentSalaryTable from "@/shared/dashboard/RecentSalaryTable";
import { useGetMySalaryHistoryQuery } from "../apiSlices/salaryApiSlice";
import { useGetMyAttendanceQuery } from "../apiSlices/attendanceApiSlice";
import PageLayout from "@/shared/components/layout/PagesLayout";

const EmployeeDashboard = () => {
  const { user } = useAuth();

  // Get pending documents for notifications
  const { data: pendingDocuments = [], isLoading: isPendingLoading } =
    useGetPendingDocumentsQuery();

  // Get recent salary history
  const { data: salaryHistory, isLoading: isSalaryLoading } =
    useGetMySalaryHistoryQuery({ page: 1, limit: 10 });

  // Get recent attendance
  const { data: attendanceData, isLoading: isAttendanceLoading } =
    useGetMyAttendanceQuery({ page: 1, limit: 10 });

  const stats = [
    { name: "My Tasks", value: "0", icon: ClipboardList, color: "bg-blue-500" },
    {
      name: "Attendance This Month",
      value: "0",
      icon: Clock,
      color: "bg-green-500",
    },
    {
      name: "Leave Balance",
      value: "0",
      icon: Calendar,
      color: "bg-yellow-500",
    },
    {
      name: "Documents to Sign",
      value: pendingDocuments.count,
      icon: FileText,
      color: "bg-purple-500",
    },
  ];

  return (
    <PageLayout
      title={`Welcome back, ${user?.fullName}!`}
      subtitle={"Here you overview"}
      icon={BarChart2Icon}
    >
      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <div
            key={stat.name}
            className="relative overflow-hidden rounded-lg bg-white px-4 py-5 shadow sm:px-6 sm:pt-6"
          >
            <dt>
              <div className={`absolute rounded-md ${stat.color} p-3`}>
                <stat.icon className="h-6 w-6 text-white" aria-hidden="true" />
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

      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          Quick Actions
        </h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <Link
            to="/employee/attendance"
            className="flex items-center p-4 border border-gray-200 rounded-lg hover:border-brand-primary hover:bg-gray-50 transition-colors cursor-pointer"
          >
            <Clock className="h-8 w-8 text-brand-primary mr-3" />
            <div>
              <p className="font-medium text-gray-900">Mark Attendance</p>
              <p className="text-sm text-gray-500">Clock in/out for today</p>
            </div>
          </Link>
          <Link
            to="/employee/documents"
            className="flex items-center p-4 border border-gray-200 rounded-lg hover:border-brand-primary hover:bg-gray-50 transition-colors cursor-pointer"
          >
            <FileText className="h-8 w-8 text-brand-primary mr-3" />
            <div>
              <p className="font-medium text-gray-900">Review Documents</p>
              <p className="text-sm text-gray-500">
                {pendingDocuments.length > 0
                  ? `${pendingDocuments.length} pending documents`
                  : "View all documents"}
              </p>
            </div>
          </Link>
          <Link
            to="/employee/leave"
            className="flex items-center p-4 border border-gray-200 rounded-lg hover:border-brand-primary hover:bg-gray-50 transition-colors cursor-pointer"
          >
            <Calendar className="h-8 w-8 text-brand-primary mr-3" />
            <div>
              <p className="font-medium text-gray-900">Request Leave</p>
              <p className="text-sm text-gray-500">Submit leave application</p>
            </div>
          </Link>
        </div>
      </div>

      {/* Pending Documents Notification */}
      {pendingDocuments.length > 0 && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center">
            <FileText className="h-5 w-5 text-blue-500 mr-2" />
            <h3 className="text-lg font-medium text-blue-800">
              {pendingDocuments.length} Document
              {pendingDocuments.length > 1 ? "s" : ""} Awaiting Your Signature
            </h3>
          </div>
          <p className="text-blue-700 mt-2">
            You have important documents that require your attention. Please
            review and sign them as soon as possible.
          </p>
          <div className="mt-3">
            <Link
              to="/employee/documents"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-blue-700 bg-blue-100 hover:bg-blue-200"
            >
              View Document{pendingDocuments.length > 1 ? "s" : ""}
            </Link>
          </div>
        </div>
      )}

      {/* Today's Tasks Placeholder */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          Today's Tasks
        </h2>
        <p className="text-gray-500 text-center py-8">No tasks assigned yet</p>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          Recent Activity
        </h2>
        <p className="text-gray-500 text-center py-8">
          No recent activity to display
        </p>
      </div>

      {/* Salary and Attendance Tables */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RecentSalaryTable
          salaries={salaryHistory?.salaries || []}
          isLoading={isSalaryLoading}
        />
        <RecentAttendanceTable
          attendance={attendanceData?.attendance || []}
          isLoading={isAttendanceLoading}
        />
      </div>
    </PageLayout>
  );
};

export default EmployeeDashboard;
