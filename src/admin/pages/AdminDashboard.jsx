import React, { useEffect } from "react";
import { Users, ClipboardList, Calendar, FileText } from "lucide-react";
import { useAuth } from "../../shared/hooks/useAuth";
import { Link, useNavigate } from "react-router-dom";

const AdminDashboard = () => {
  const { user, setupCompleted } = useAuth();
  const navigate = useNavigate();

  // Redirect to full-screen setup when not completed
  useEffect(() => {
    if (setupCompleted === false) {
      navigate("/setup", { replace: true });
    }
  }, [setupCompleted, navigate]);

  const stats = [
    { name: "Total Employees", value: "0", icon: Users, color: "bg-blue-500" },
    {
      name: "Pending Requests",
      value: "0",
      icon: ClipboardList,
      color: "bg-yellow-500",
    },
    {
      name: "Leave Applications",
      value: "0",
      icon: Calendar,
      color: "bg-green-500",
    },

    {
      name: "Work Reports",
      value: "0",
      icon: FileText,
      color: "bg-purple-500",
    },
  ];

  return (
    <>
      {/* Setup wizard is full-screen at /setup; no modal here */}

      <div className="space-y-6">
        {/* Header */}

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
            to="/admin/employees"
            className="flex items-center p-4 border border-gray-200 rounded-lg hover:border-brand-primary hover:bg-gray-50 transition-colors cursor-pointer"
          >
            <Users className="h-8 w-8 text-brand-primary mr-3" />
            <div>
              <p className="font-medium text-gray-900">Manage Employees</p>
              <p className="text-sm text-gray-500">View and create employees</p>
            </div>
          </Link>
          <div className="flex items-center p-4 border border-gray-200 rounded-lg hover:border-brand-primary hover:bg-gray-50 transition-colors cursor-pointer">
            <Calendar className="h-8 w-8 text-brand-primary mr-3" />
            <div>
              <p className="font-medium text-gray-900">Review Leave Requests</p>
              <p className="text-sm text-gray-500">Approve or reject leaves</p>
            </div>
          </div>
          <div className="flex items-center p-4 border border-gray-200 rounded-lg hover:border-brand-primary hover:bg-gray-50 transition-colors cursor-pointer">
            <FileText className="h-8 w-8 text-brand-primary mr-3" />
            <div>
              <p className="font-medium text-gray-900">View Work Reports</p>
              <p className="text-sm text-gray-500">
                Check daily work submissions
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity Placeholder */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          Recent Activity
        </h2>
        <p className="text-gray-500 text-center py-8">
          No recent activity to display
        </p>
      </div>
    </div>
    </>
  );
};

export default AdminDashboard;
