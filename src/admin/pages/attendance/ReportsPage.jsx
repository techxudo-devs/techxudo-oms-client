import { useState } from "react";
import {
  useGetWeeklyReportQuery,
  useGetMonthlyReportQuery,
} from "../../apiSlices/manageAttendanceApiSlice";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Download, TrendingUp, Calendar as CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";

const COLORS = ["#10b981", "#ef4444", "#f59e0b", "#3b82f6"];

const ReportsPage = () => {
  const [reportType, setReportType] = useState("monthly");
  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const [year, setYear] = useState(new Date().getFullYear());

  const { data: monthlyData, isLoading: isMonthlyLoading } =
    useGetMonthlyReportQuery({
      month,
      year,
    });

  const { data: weeklyData, isLoading: isWeeklyLoading } =
    useGetWeeklyReportQuery({});

  const isLoading =
    reportType === "monthly" ? isMonthlyLoading : isWeeklyLoading;
  const reportData = reportType === "monthly" ? monthlyData : weeklyData;

  // Prepare chart data
  const prepareWeeklyChartData = () => {
    if (!weeklyData?.dailyBreakdown) return [];
    return weeklyData.dailyBreakdown.map((day) => ({
      date: format(new Date(day.date), "EEE"),
      present: day.present,
      late: day.late,
      hours: day.totalHours.toFixed(1),
    }));
  };

  const prepareStatusPieData = () => {
    if (!reportData?.summary) return [];
    return [
      { name: "Present", value: reportData.summary.presentDays || 0 },
      { name: "Absent", value: reportData.summary.absentDays || 0 },
      { name: "Late", value: reportData.summary.lateDays || 0 },
    ];
  };

  const handleExport = () => {
    if (!reportData?.attendances) return;

    const csv = [
      ["Employee", "Date", "Check In", "Check Out", "Hours", "Status", "Late"],
      ...reportData.attendances.map((att) => [
        att.userId?.fullName || "-",
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
    a.download = `attendance-report-${reportType}-${Date.now()}.csv`;
    a.click();
  };

  return (
    <div className="container mx-auto p-6 max-w-7xl">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Attendance Reports
          </h1>
          <p className="text-gray-600 mt-1">Analytics and insights</p>
        </div>
        <Button
          onClick={handleExport}
          disabled={!reportData?.attendances?.length}
        >
          <Download className="mr-2 h-4 w-4" />
          Export Report
        </Button>
      </div>

      {/* Filters */}
      <Card className="mb-6">
        <CardContent className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="text-sm font-medium mb-2 block">
                Report Type
              </label>
              <Select value={reportType} onValueChange={setReportType}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="weekly">Weekly</SelectItem>
                  <SelectItem value="monthly">Monthly</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {reportType === "monthly" && (
              <>
                <div>
                  <label className="text-sm font-medium mb-2 block">
                    Month
                  </label>
                  <Select
                    value={month.toString()}
                    onValueChange={(v) => setMonth(parseInt(v))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Array.from({ length: 12 }, (_, i) => (
                        <SelectItem key={i + 1} value={(i + 1).toString()}>
                          {format(new Date(2024, i, 1), "MMMM")}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">Year</label>
                  <Input
                    type="number"
                    value={year}
                    onChange={(e) => setYear(parseInt(e.target.value))}
                  />
                </div>
              </>
            )}
          </div>
        </CardContent>
      </Card>

      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      ) : (
        <>
          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <Card>
              <CardContent className="p-4">
                <div className="text-sm text-gray-600">Total Days</div>
                <div className="text-2xl font-bold">
                  {reportData?.summary?.totalDays || 0}
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="text-sm text-gray-600">Present</div>
                <div className="text-2xl font-bold text-green-600">
                  {reportData?.summary?.presentDays || 0}
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="text-sm text-gray-600">Late Arrivals</div>
                <div className="text-2xl font-bold text-yellow-600">
                  {reportData?.summary?.lateDays || 0}
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="text-sm text-gray-600">Avg Hours</div>
                <div className="text-2xl font-bold text-blue-600">
                  {reportData?.summary?.averageHours?.toFixed(1) || 0}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            {/* Trend Chart */}
            {reportType === "weekly" && weeklyData?.dailyBreakdown && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5" />
                    Weekly Attendance Trend
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={250}>
                    <LineChart data={prepareWeeklyChartData()}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis />
                      <Tooltip />
                      <Line
                        type="monotone"
                        dataKey="present"
                        stroke="#10b981"
                        strokeWidth={2}
                      />
                      <Line
                        type="monotone"
                        dataKey="late"
                        stroke="#f59e0b"
                        strokeWidth={2}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            )}

            {/* Hours Chart */}
            {reportType === "weekly" && weeklyData?.dailyBreakdown && (
              <Card>
                <CardHeader>
                  <CardTitle>Daily Hours Worked</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={250}>
                    <BarChart data={prepareWeeklyChartData()}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="hours" fill="#3b82f6" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            )}

            {/* Status Distribution */}
            <Card>
              <CardHeader>
                <CardTitle>Attendance Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={250}>
                  <PieChart>
                    <Pie
                      data={prepareStatusPieData()}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, value }) => `${name}: ${value}`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {prepareStatusPieData().map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={COLORS[index % COLORS.length]}
                        />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Stats Card */}
            <Card>
              <CardHeader>
                <CardTitle>Summary Statistics</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Total Hours</span>
                  <span className="font-bold text-lg">
                    {reportData?.summary?.totalHours?.toFixed(1) || 0} hrs
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Average Hours/Day</span>
                  <span className="font-bold text-lg">
                    {reportData?.summary?.averageHours?.toFixed(1) || 0} hrs
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Attendance Rate</span>
                  <span className="font-bold text-lg text-green-600">
                    {reportData?.summary?.presentDays &&
                    reportData?.summary?.totalDays
                      ? Math.round(
                          (reportData.summary.presentDays /
                            reportData.summary.totalDays) *
                            100
                        )
                      : 0}
                    %
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Late Rate</span>
                  <span className="font-bold text-lg text-yellow-600">
                    {reportData?.summary?.lateDays &&
                    reportData?.summary?.totalDays
                      ? Math.round(
                          (reportData.summary.lateDays /
                            reportData.summary.totalDays) *
                            100
                        )
                      : 0}
                    %
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>
        </>
      )}
    </div>
  );
};

export default ReportsPage;
