import { useState } from "react";
import {
  useGetAllAttendanceQuery,
  useDeleteAttendanceMutation,
} from "../../apiSlices/manageAttendanceApiSlice";
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
  Edit,
  Trash2,
  UserCheck,
  Search,
  MapPin,
} from "lucide-react";
import { format } from "date-fns";
import { toast } from "sonner";
import { Link } from "react-router-dom";

const AllAttendancePage = () => {
  const [filters, setFilters] = useState({
    startDate: new Date(new Date().getFullYear(), new Date().getMonth(), 1)
      .toISOString()
      .split("T")[0],
    endDate: new Date().toISOString().split("T")[0],
    status: "all",
    department: "",
    userId: "",
    page: 1,
    limit: 50,
  });

  const [searchQuery, setSearchQuery] = useState("");

  // Prepare query params - exclude status if "all"
  const queryParams = {
    ...filters,
    status: filters.status === "all" ? undefined : filters.status,
  };

  const { data, isLoading, isFetching } = useGetAllAttendanceQuery(queryParams);
  const [deleteAttendance] = useDeleteAttendanceMutation();
  console.log(data);

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value, page: 1 }));
  };

  const handleDelete = async (id) => {
    if (
      !window.confirm("Are you sure you want to delete this attendance record?")
    )
      return;

    try {
      await deleteAttendance(id).unwrap();
      toast.success("Attendance deleted successfully");
    } catch (error) {
      toast.error(error?.data?.message || "Failed to delete attendance");
    }
  };

  const handleExportCSV = () => {
    if (!data?.attendances) return;

    const csv = [
      [
        "Date",
        "Employee",
        "Department",
        "Check In",
        "Check Out",
        "Hours",
        "Status",
        "Late (min)",
        "Method",
        "IP Address",
        "Location Latitude",
        "Location Longitude",
      ],
      ...data.attendances.map((att) => [
        format(new Date(att.date), "MMM dd, yyyy"),
        att.userId?.fullName || "-",
        att.userId?.department || "-",
        att.checkIn?.time ? format(new Date(att.checkIn.time), "hh:mm a") : "-",
        att.checkOut?.time
          ? format(new Date(att.checkOut.time), "hh:mm a")
          : "-",
        att.hoursWorked || 0,
        att.status,
        att.lateArrival?.isLate ? att.lateArrival.minutesLate : 0,
        att.checkIn?.method || "-",
        att.checkIn?.ipAddress || "-",
        att.checkIn?.location?.latitude || "-",
        att.checkIn?.location?.longitude || "-",
      ]),
    ]
      .map((row) => row.join(","))
      .join("\n");

    const blob = new Blob([csv], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `all-attendance-${filters.startDate}-to-${filters.endDate}.csv`;
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

  // Filter by search query (client-side)
  const filteredAttendances = data?.attendances?.filter((att) =>
    searchQuery
      ? att.userId?.fullName
          ?.toLowerCase()
          .includes(searchQuery.toLowerCase()) ||
        att.userId?.email?.toLowerCase().includes(searchQuery.toLowerCase())
      : true
  );

  return (
    <div className="container mx-auto p-6 ">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            All Attendance Records
          </h1>
          <p className="text-gray-600 mt-1">
            View and manage employee attendance
          </p>
        </div>
        <div className="flex gap-2">
          <Link to="/admin/attendance/manual-entry">
            <Button variant="outline">
              <Edit className="mr-2 h-4 w-4" />
              Manual Entry
            </Button>
          </Link>
          <Button
            onClick={handleExportCSV}
            disabled={!data?.attendances?.length}
          >
            <Download className="mr-2 h-4 w-4" />
            Export CSV
          </Button>
        </div>
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
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-4">
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
                value={filters.status}
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
                Department
              </label>
              <Input
                placeholder="e.g., Engineering"
                value={filters.department}
                onChange={(e) =>
                  handleFilterChange("department", e.target.value)
                }
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">Per Page</label>
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
                  <SelectItem value="25">25</SelectItem>
                  <SelectItem value="50">50</SelectItem>
                  <SelectItem value="100">100</SelectItem>
                  <SelectItem value="200">200</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Search Box */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search by employee name or email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Stats Summary */}
      {data?.attendances && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardContent className="p-4">
              <div className="text-sm text-gray-600">Total Records</div>
              <div className="text-2xl font-bold">
                {data.pagination?.total || 0}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-sm text-gray-600">Present</div>
              <div className="text-2xl font-bold text-green-600">
                {
                  data.attendances.filter(
                    (a) => a.status === "present" || a.status === "late"
                  ).length
                }
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-sm text-gray-600">Late Arrivals</div>
              <div className="text-2xl font-bold text-yellow-600">
                {data.attendances.filter((a) => a.lateArrival?.isLate).length}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-sm text-gray-600">Avg Hours</div>
              <div className="text-2xl font-bold text-blue-600">
                {(
                  data.attendances.reduce(
                    (sum, a) => sum + (a.hoursWorked || 0),
                    0
                  ) / (data.attendances.length || 1)
                ).toFixed(1)}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Table */}
      <Card>
        <CardContent className="p-0">
          {isLoading || isFetching ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
          ) : filteredAttendances?.length === 0 ? (
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
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Employee
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Date
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Check In
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Check Out
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Hours
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Status
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Late
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        IP Address
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Location
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredAttendances?.map((attendance) => (
                      <tr key={attendance._id} className="hover:bg-gray-50">
                        <td className="px-4 py-4">
                          <div>
                            <div className="text-sm font-medium text-gray-900">
                              {attendance.userId?.fullName}
                            </div>
                            <div className="text-xs text-gray-500">
                              {attendance.userId?.designation} -{" "}
                              {attendance.userId?.department}
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm">
                          {format(new Date(attendance.date), "MMM dd, yyyy")}
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm">
                          {attendance.checkIn?.time
                            ? format(
                                new Date(attendance.checkIn.time),
                                "hh:mm a"
                              )
                            : "-"}
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm">
                          {attendance.checkOut?.time
                            ? format(
                                new Date(attendance.checkOut.time),
                                "hh:mm a"
                              )
                            : "-"}
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm font-medium">
                          {attendance.hoursWorked?.toFixed(2) || 0} hrs
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap">
                          {getStatusBadge(attendance.status)}
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm">
                          {attendance.lateArrival?.isLate ? (
                            <span className="text-red-600">
                              +{attendance.lateArrival.minutesLate} min
                            </span>
                          ) : (
                            <span className="text-green-600">No</span>
                          )}
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm">
                          {attendance.checkIn?.ipAddress || "-"}
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm">
                          {attendance.checkIn?.location ? (
                            <button
                              className="text-blue-600 hover:text-blue-800 flex items-center gap-1"
                              onClick={() => {
                                const lat =
                                  attendance.checkIn.location.latitude;
                                const lng =
                                  attendance.checkIn.location.longitude;
                                window.open(
                                  `https://www.google.com/maps?q=${lat},${lng}`,
                                  "_blank"
                                );
                              }}
                              title={`Location: ${attendance.checkIn.location.latitude}, ${attendance.checkIn.location.longitude}`}
                            >
                              <MapPin className="h-4 w-4" />
                              View
                            </button>
                          ) : (
                            "-"
                          )}
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm">
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => handleDelete(attendance._id)}
                            >
                              <Trash2 className="h-4 w-4 text-red-500" />
                            </Button>
                          </div>
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
                    Page {data.pagination.page} of {data.pagination.totalPages}{" "}
                    ({data.pagination.total} total records)
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

export default AllAttendancePage;
