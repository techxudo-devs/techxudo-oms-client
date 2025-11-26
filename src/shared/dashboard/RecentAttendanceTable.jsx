import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Calendar, Clock } from "lucide-react";

const RecentAttendanceTable = ({ attendance, isLoading }) => {
  const getStatusVariant = (status) => {
    switch (status) {
      case "present":
        return "success";
      case "late":
        return "warning";
      case "absent":
        return "destructive";
      case "leave":
        return "secondary";
      default:
        return "default";
    }
  };

  const formatTime = (time) => {
    if (!time) return "N/A";
    return new Date(`2000-01-01T${time}`).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  if (isLoading) {
    return (
      <div className="p-6 bg-white rounded-lg shadow">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">
            Recent Attendance
          </h2>
        </div>
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="space-y-2">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-12 bg-gray-100 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!attendance || attendance.length === 0) {
    return (
      <div className="p-6 bg-white rounded-lg shadow">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">
            Recent Attendance
          </h2>
        </div>
        <div className="text-center py-8 text-gray-500">
          <Clock className="h-12 w-12 mx-auto text-gray-300 mb-2" />
          <p>No attendance records found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-white rounded-lg shadow">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-900">
          Recent Attendance
        </h2>
        <Link to="/employee/attendance/history">
          <Button variant="outline" size="sm">
            View All
          </Button>
        </Link>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Date</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Check In</TableHead>
            <TableHead>Check Out</TableHead>
            <TableHead>Overtime</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {attendance.slice(0, 5).map((record) => (
            <TableRow key={record._id}>
              <TableCell className="font-medium">
                {formatDate(record.date)}
              </TableCell>
              <TableCell>
                <Badge variant={getStatusVariant(record.status)}>
                  {record.status}
                </Badge>
              </TableCell>
              <TableCell>
                {record.checkInTime ? formatTime(record.checkInTime) : "N/A"}
              </TableCell>
              <TableCell>
                {record.checkOutTime ? formatTime(record.checkOutTime) : "N/A"}
              </TableCell>
              <TableCell>
                {record.overtimeHours > 0 ? `${record.overtimeHours}h` : "0h"}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default RecentAttendanceTable;
