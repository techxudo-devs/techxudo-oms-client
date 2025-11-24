import { useState } from "react";
import {
  useGetDashboardStatsQuery,
  useGetDailyReportQuery,
} from "../../apiSlices/manageAttendanceApiSlice";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Users,
  UserCheck,
  UserX,
  Clock,
  Calendar,
  AlertCircle,
} from "lucide-react";
import { Link } from "react-router-dom";

const AdminAttendanceDashboard = () => {
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split("T")[0]
  );

  const { data: dashboardStats, isLoading: isStatsLoading } =
    useGetDashboardStatsQuery();

  const { data: dailyReport, isLoading: isReportLoading } =
    useGetDailyReportQuery({
      date: selectedDate,
    });

  if (isStatsLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  const stats = dashboardStats?.today || {};
  const summary = dailyReport?.summary || {};
  const absentees = dailyReport?.absentees || [];
  const lateArrivals = dailyReport?.lateArrivals || [];

  return (
    <div className="container mx-auto p-6 ">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Attendance Dashboard
          </h1>
          <p className="text-gray-600 mt-1">Real-time attendance monitoring</p>
        </div>
        <div className="flex gap-2">
          <Link to="/admin/attendance/qr">
            <Button>Generate QR Code</Button>
          </Link>
          <Link to="/admin/attendance/manual-entry">
            <Button variant="outline">Manual Entry</Button>
          </Link>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Employees</p>
                <p className="text-3xl font-bold text-gray-900">
                  {stats.totalEmployees || 0}
                </p>
              </div>
              <Users className="h-12 w-12 text-gray-400" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Present Today</p>
                <p className="text-3xl font-bold text-green-600">
                  {stats.present || 0}
                </p>
              </div>
              <UserCheck className="h-12 w-12 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Absent Today</p>
                <p className="text-3xl font-bold text-red-600">
                  {stats.absent || 0}
                </p>
              </div>
              <UserX className="h-12 w-12 text-red-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Late Arrivals</p>
                <p className="text-3xl font-bold text-yellow-600">
                  {stats.late || 0}
                </p>
              </div>
              <Clock className="h-12 w-12 text-yellow-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Alerts Section */}
      {(absentees.length > 0 || lateArrivals.length > 0) && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Absentees */}
          {absentees.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-red-600">
                  <AlertCircle className="h-5 w-5" />
                  Absentees Today ({absentees.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {absentees.slice(0, 10).map((employee) => (
                    <div
                      key={employee._id}
                      className="flex items-center justify-between p-2 bg-red-50 rounded-md"
                    >
                      <div>
                        <p className="font-medium">{employee.fullName}</p>
                        <p className="text-sm text-gray-600">
                          {employee.designation} - {employee.department}
                        </p>
                      </div>
                    </div>
                  ))}
                  {absentees.length > 10 && (
                    <p className="text-sm text-gray-500 text-center mt-2">
                      And {absentees.length - 10} more...
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Late Arrivals */}
          {lateArrivals.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-yellow-600">
                  <Clock className="h-5 w-5" />
                  Late Arrivals Today ({lateArrivals.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {lateArrivals.slice(0, 10).map((attendance) => (
                    <div
                      key={attendance._id}
                      className="flex items-center justify-between p-2 bg-yellow-50 rounded-md"
                    >
                      <div>
                        <p className="font-medium">
                          {attendance.userId?.fullName}
                        </p>
                        <p className="text-sm text-gray-600">
                          {attendance.userId?.designation}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium text-yellow-700">
                          {attendance.lateArrival?.minutesLate} min late
                        </p>
                        <p className="text-xs text-gray-500">
                          {new Date(
                            attendance.checkIn?.time
                          ).toLocaleTimeString("en-US", {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </p>
                      </div>
                    </div>
                  ))}
                  {lateArrivals.length > 10 && (
                    <p className="text-sm text-gray-500 text-center mt-2">
                      And {lateArrivals.length - 10} more...
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      )}

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Link to="/admin/attendance/all" className="block">
              <Button variant="outline" className="w-full">
                <Calendar className="mr-2 h-4 w-4" />
                View All Attendance
              </Button>
            </Link>
            <Link to="/admin/attendance/reports" className="block">
              <Button variant="outline" className="w-full">
                <Users className="mr-2 h-4 w-4" />
                Reports
              </Button>
            </Link>
            <Link to="/admin/attendance/settings" className="block">
              <Button variant="outline" className="w-full">
                <Clock className="mr-2 h-4 w-4" />
                Settings
              </Button>
            </Link>
            <Link to="/admin/attendance/qr" className="block">
              <Button variant="outline" className="w-full">
                <Calendar className="mr-2 h-4 w-4" />
                QR Code
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminAttendanceDashboard;
