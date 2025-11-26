import { useState } from "react";
import {
  useGetDashboardStatsQuery,
  useGetDailyReportQuery,
  useGetAllAttendanceQuery,
} from "../../apiSlices/manageAttendanceApiSlice";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Users,
  UserCheck,
  UserX,
  Clock,
  Calendar,
  AlertCircle,
  TimerResetIcon,
} from "lucide-react";
import { Link } from "react-router-dom";
import PageLayout from "@/shared/components/layout/PagesLayout";
import DashboardSkeletonLoader from "@/components/SkeletonLoader";

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

  const { data: recentAttendance, isLoading: isRecentAttendanceLoading } =
    useGetAllAttendanceQuery({ page: 1, limit: 5 });

  if (isStatsLoading) return <DashboardSkeletonLoader />;

  const stats = dashboardStats?.today || {};
  const summary = dailyReport?.summary || {};
  const absentees = dailyReport?.absentees || [];
  const lateArrivals = dailyReport?.lateArrivals || [];

  return (
    <PageLayout
      title={"Attendance Dashboard"}
      subtitle={"Real-time attendace"}
      icon={TimerResetIcon}
      actions={
        <div className="flex gap-2">
          <Link to="/admin/attendance/qr">
            <Button>Generate QR Code</Button>
          </Link>
          <Link to="/admin/attendance/manual-entry">
            <Button variant="outline">Manual Entry</Button>
          </Link>
        </div>
      }
    >
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

      {/* Recent Attendance */}
      <Card className="mb-6">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-base font-medium">
            Recent Attendance
          </CardTitle>
          <Link to="/admin/attendance/all">
            <Button variant="outline" size="sm">
              View All
            </Button>
          </Link>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Employee</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Check In</TableHead>
                  <TableHead>Check Out</TableHead>
                  <TableHead>Overtime</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isRecentAttendanceLoading ? (
                  <TableRow>
                    <TableCell colSpan="6" className="text-center py-8">
                      <div className="flex justify-center">
                        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-gray-900"></div>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : recentAttendance && recentAttendance.attendance && recentAttendance.attendance.length > 0 ? (
                  recentAttendance.attendance.map((record) => (
                    <TableRow key={record._id}>
                      <TableCell className="font-medium">
                        {record.userId?.fullName || "N/A"}
                      </TableCell>
                      <TableCell>
                        {new Date(record.date).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          record.status === 'present'
                            ? 'bg-green-100 text-green-800'
                            : record.status === 'late'
                            ? 'bg-yellow-100 text-yellow-800'
                            : record.status === 'absent'
                            ? 'bg-red-100 text-red-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}>
                          {record.status}
                        </span>
                      </TableCell>
                      <TableCell>
                        {record.checkIn?.time
                          ? new Date(`2000-01-01T${record.checkIn.time}`).toLocaleTimeString([], {
                              hour: '2-digit',
                              minute: '2-digit'
                            })
                          : "N/A"}
                      </TableCell>
                      <TableCell>
                        {record.checkOut?.time
                          ? new Date(`2000-01-01T${record.checkOut.time}`).toLocaleTimeString([], {
                              hour: '2-digit',
                              minute: '2-digit'
                            })
                          : "N/A"}
                      </TableCell>
                      <TableCell>
                        {record.overtimeHours > 0 ? `${record.overtimeHours}h` : "0h"}
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan="6" className="text-center py-8 text-gray-500">
                      No attendance records found
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

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
    </PageLayout>
  );
};

export default AdminAttendanceDashboard;
