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
import { Calendar, DollarSign } from "lucide-react";

const RecentSalaryTable = ({ salaries, isLoading }) => {
  const getStatusVariant = (status) => {
    switch (status) {
      case "paid":
        return "success";
      case "processing":
        return "default";
      case "cancelled":
        return "destructive";
      case "hold":
        return "warning";
      default:
        return "secondary";
    }
  };

  const formatDate = (year, month) => {
    return new Date(year, month - 1).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
    });
  };

  if (isLoading) {
    return (
      <div className="p-6 bg-white rounded-lg shadow">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">
            Recent Salaries
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

  if (!salaries || salaries.length === 0) {
    return (
      <div className="p-6 bg-white rounded-lg shadow">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">
            Recent Salaries
          </h2>
        </div>
        <div className="text-center py-8 text-gray-500">
          <DollarSign className="h-12 w-12 mx-auto text-gray-300 mb-2" />
          <p>No salary records found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-white rounded-lg shadow">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-900">Recent Salaries</h2>
        <Link to="/employee/salary/history">
          <Button variant="outline" size="sm">
            View All
          </Button>
        </Link>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Month</TableHead>
            <TableHead>Net Salary</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {salaries.slice(0, 5).map((salary) => (
            <TableRow key={salary._id}>
              <TableCell className="font-medium">
                {formatDate(salary.year, salary.month)}
              </TableCell>
              <TableCell>
                ₨{salary.netSalary?.toLocaleString() || "0"}
              </TableCell>
              <TableCell>
                <Badge variant={getStatusVariant(salary.paymentStatus)}>
                  {salary.paymentStatus}
                </Badge>
              </TableCell>
              <TableCell className="text-right">
                <Link to={`/employee/salary/history/${salary._id}`}>
                  <Button variant="outline" size="sm">
                    View
                  </Button>
                </Link>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default RecentSalaryTable;
