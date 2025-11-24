import { useState } from "react";
import { useGetMyAttendanceQuery } from "../../apiSlices/attendanceApiSlice";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import {
  Calendar,
  Download,
  Filter,
  Clock,
  CheckCircle,
  XCircle,
} from "lucide-react";
import { format } from "date-fns";

const AttendanceHistoryPage = () => {
  const [filters, setFilters] = useState({
    startDate: new Date(new Date().getFullYear(), new Date().getMonth(), 1)
      .toISOString()
      .split("T")[0],
    endDate: new Date().toISOString().split("T")[0],
    status: "all",
    page: 1,
    limit: 30,
  });

  // Prepare query params - exclude status if "all"
  const queryParams = {
    ...filters,
    status: filters.status === "all" ? undefined : filters.status,
  };

  const { data, isLoading, isFetching } = useGetMyAttendanceQuery(queryParams);

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value, page: 1 }));
  };

  const handleExport = () => {
    // Export to CSV
    if (!data?.attendances) return;

    const csv = [
      ["Date", "Check In", "Check Out", "Hours", "Status", "Late"],
      ...data.attendances.map((att) => [
        format(new Date(att.date), "MMM dd, yyyy"),
        att.checkIn?.time ? format(new Date(att.checkIn.time), "hh:mm a") : "-",
        att.checkOut?.time
          ? format(new Date(att.checkOut.time), "hh:mm a")
          : "-",
        att.hoursWorked || 0,
        att.status,
        att.lateArrival?.isLate ? `${att.lateArrival.minutesLate} min` : "No",
      ]),
    ]
      .map((row) => row.join(","))
      .join("\n");

    const blob = new Blob([csv], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `attendance-${filters.startDate}-to-${filters.endDate}.csv`;
    a.click();
  };

  const getStatusBadge = (status) => {
    const styles = {
      present: "bg-green-100 text-green-700",
      absent: "bg-red-100 text-red-700",
      late: "bg-yellow-100 text-yellow-700",
      "half-day": "bg-blue-100 text-blue-700",
      "on-leave": "bg-purple-100 text-purple-700",
      holiday: "bg-gray-100 text-gray-700",
      weekend: "bg-gray-100 text-gray-700",
    };

    return (
      <span
        className={`px-2 py-1 rounded-full text-xs font-medium ${
          styles[status] || styles.present
        }`}
      >
        {status}
      </span>
    );
  };

  return (
    <div className="container mx-auto p-6 max-w-7xl">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Attendance History
          </h1>
          <p className="text-gray-600 mt-1">
            View your complete attendance record
          </p>
        </div>
        <Button onClick={handleExport} disabled={!data?.attendances?.length}>
          <Download className="mr-2 h-4 w-4" />
          Export CSV
        </Button>
      </div>

      {/* Filters */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filters
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="text-sm font-medium mb-2 block">
                Start Date
              </label>
              <Input
                type="date"
                value={filters.startDate}
                onChange={(e) =>
                  handleFilterChange("startDate", e.target.value)
                }
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">End Date</label>
              <Input
                type="date"
                value={filters.endDate}
                onChange={(e) => handleFilterChange("endDate", e.target.value)}
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">Status</label>
              <Select
                value={filters.status} // default to "all"
                onValueChange={(value) => handleFilterChange("status", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="All Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="present">Present</SelectItem>
                  <SelectItem value="absent">Absent</SelectItem>
                  <SelectItem value="late">Late</SelectItem>
                  <SelectItem value="on-leave">On Leave</SelectItem>
                  <SelectItem value="half-day">Half Day</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">
                Records Per Page
              </label>
              <Select
                value={filters.limit.toString()}
                onValueChange={(value) =>
                  handleFilterChange("limit", parseInt(value))
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="10">10</SelectItem>
                  <SelectItem value="30">30</SelectItem>
                  <SelectItem value="50">50</SelectItem>
                  <SelectItem value="100">100</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Table */}
      <Card>
        <CardContent className="p-0">
          {isLoading || isFetching ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
          ) : data?.attendances?.length === 0 ? (
            <div className="text-center py-12">
              <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">No attendance records found</p>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Date
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Check In
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Check Out
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Hours
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Late
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Method
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {data?.attendances?.map((attendance) => (
                      <tr key={attendance._id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <Calendar className="h-4 w-4 text-gray-400 mr-2" />
                            <div>
                              <div className="text-sm font-medium text-gray-900">
                                {format(
                                  new Date(attendance.date),
                                  "MMM dd, yyyy"
                                )}
                              </div>
                              <div className="text-xs text-gray-500">
                                {format(new Date(attendance.date), "EEEE")}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {attendance.checkIn?.time ? (
                            <div className="flex items-center text-sm">
                              <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                              {format(
                                new Date(attendance.checkIn.time),
                                "hh:mm a"
                              )}
                            </div>
                          ) : (
                            <span className="text-gray-400 text-sm">-</span>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {attendance.checkOut?.time ? (
                            <div className="flex items-center text-sm">
                              <XCircle className="h-4 w-4 text-blue-500 mr-2" />
                              {format(
                                new Date(attendance.checkOut.time),
                                "hh:mm a"
                              )}
                            </div>
                          ) : (
                            <span className="text-gray-400 text-sm">-</span>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center text-sm font-medium">
                            <Clock className="h-4 w-4 text-gray-400 mr-2" />
                            {attendance.hoursWorked?.toFixed(2) || 0} hrs
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {getStatusBadge(attendance.status)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          {attendance.lateArrival?.isLate ? (
                            <span className="text-red-600 font-medium">
                              +{attendance.lateArrival.minutesLate} min
                            </span>
                          ) : (
                            <span className="text-green-600">On Time</span>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 capitalize">
                          {attendance.checkIn?.method || "-"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              {data?.pagination && data.pagination.totalPages > 1 && (
                <div className="px-6 py-4 border-t flex items-center justify-between">
                  <div className="text-sm text-gray-600">
                    Showing{" "}
                    {(data.pagination.page - 1) * data.pagination.limit + 1} to{" "}
                    {Math.min(
                      data.pagination.page * data.pagination.limit,
                      data.pagination.total
                    )}{" "}
                    of {data.pagination.total} records
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={data.pagination.page === 1}
                      onClick={() =>
                        handleFilterChange("page", data.pagination.page - 1)
                      }
                    >
                      Previous
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={
                        data.pagination.page >= data.pagination.totalPages
                      }
                      onClick={() =>
                        handleFilterChange("page", data.pagination.page + 1)
                      }
                    >
                      Next
                    </Button>
                  </div>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AttendanceHistoryPage;
