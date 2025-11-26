import { useManageSalary } from "../../hooks/useManageSalary";
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
  DollarSign,
  TrendingUp,
  Users,
  Calendar,
  PlusCircle,
  FileText,
  AlertCircle,
} from "lucide-react";
import { Link } from "react-router-dom";
import { useGetAllSalariesQuery } from "../../apiSlices/salaryApiSlice";
import DashboardSkeletonLoader from "@/components/SkeletonLoader";

const AdminSalaryDashboard = () => {
  const { statistics, isLoading, month, year } = useManageSalary();
  const { data: recentSalaries, isLoading: isRecentSalariesLoading } =
    useGetAllSalariesQuery({ page: 1, limit: 5 });

  if (isLoading.statistics) return <DashboardSkeletonLoader />;
  5;

  const stats = statistics || {};

  return (
    <div className="container mx-auto p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Salary Management
          </h1>
          <p className="text-gray-600 mt-1">
            {new Date(year, month - 1).toLocaleDateString("en-US", {
              month: "long",
              year: "numeric",
            })}
          </p>
        </div>
        <div className="flex gap-2">
          <Link to="/admin/salary/bulk-generate">
            <Button>
              <Calendar className="mr-2 h-4 w-4" />
              Bulk Generate
            </Button>
          </Link>
          <Link to="/admin/salary/create">
            <Button variant="outline">
              <PlusCircle className="mr-2 h-4 w-4" />
              Create Salary
            </Button>
          </Link>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Payouts</p>
                <p className="text-3xl font-bold text-gray-900">
                  ₨{stats.totalPayouts?.toLocaleString() || 0}
                </p>
              </div>
              <DollarSign className="h-12 w-12 text-gray-400" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Paid Salaries</p>
                <p className="text-3xl font-bold text-green-600">
                  {stats.paidCount || 0}
                </p>
              </div>
              <FileText className="h-12 w-12 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Pending Salaries</p>
                <p className="text-3xl font-bold text-yellow-600">
                  {stats.pendingCount || 0}
                </p>
              </div>
              <AlertCircle className="h-12 w-12 text-yellow-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Employees</p>
                <p className="text-3xl font-bold text-blue-600">
                  {stats.totalEmployees || 0}
                </p>
              </div>
              <Users className="h-12 w-12 text-blue-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Department Breakdown */}
      {stats.byDepartment && stats.byDepartment.length > 0 && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Department Breakdown
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {stats.byDepartment.map((dept) => (
                <Card key={dept._id} className="border">
                  <CardContent className="p-4">
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="font-medium text-gray-900">
                          {dept._id || "Unassigned"}
                        </p>
                        <p className="text-sm text-gray-600">
                          {dept.count} employee{dept.count !== 1 ? "s" : ""}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-bold text-gray-900">
                          ₨{dept.totalPayout.toLocaleString()}
                        </p>
                        <p className="text-xs text-gray-500">
                          Avg: ₨{Math.round(dept.avgSalary).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Recent Salaries */}
      <Card className="mb-6">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-base font-medium">
            Recent Salaries
          </CardTitle>
          <Link to="/admin/salary/all">
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
                  <TableHead>Month/Year</TableHead>
                  <TableHead>Net Salary</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Created Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isRecentSalariesLoading ? (
                  <TableRow>
                    <TableCell colSpan="5" className="text-center py-8">
                      <div className="flex justify-center">
                        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-gray-900"></div>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : recentSalaries && recentSalaries.salaries && recentSalaries.salaries.length > 0 ? (
                  recentSalaries.salaries.map((salary) => (
                    <TableRow key={salary._id}>
                      <TableCell className="font-medium">
                        {salary.userId?.fullName || "N/A"}
                      </TableCell>
                      <TableCell>
                        {new Date(salary.year, salary.month - 1).toLocaleDateString("en-US", {
                          month: "short",
                          year: "numeric"
                        })}
                      </TableCell>
                      <TableCell>
                        ₨{salary.netSalary?.toLocaleString() || "0"}
                      </TableCell>
                      <TableCell>
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          salary.paymentStatus === 'paid'
                            ? 'bg-green-100 text-green-800'
                            : salary.paymentStatus === 'processing'
                            ? 'bg-blue-100 text-blue-800'
                            : salary.paymentStatus === 'pending'
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}>
                          {salary.paymentStatus}
                        </span>
                      </TableCell>
                      <TableCell>
                        {salary.createdAt ? new Date(salary.createdAt).toLocaleDateString() : "N/A"}
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan="5" className="text-center py-8 text-gray-500">
                      No salary records found
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
          <div className="grid gprid-cols-2 md:grid-cols-4 gap-4">
            <Link to="/admin/salary/all" className="block">
              <Button variant="outline" className="w-full">
                <FileText className="mr-2 h-4 w-4" />
                View All Salaries
              </Button>
            </Link>
            <Link to="/admin/salary/create" className="block">
              <Button variant="outline" className="w-full">
                <PlusCircle className="mr-2 h-4 w-4" />
                Create Salary
              </Button>
            </Link>
            <Link to="/admin/salary/bulk-generate" className="block">
              <Button variant="outline" className="w-full">
                <Calendar className="mr-2 h-4 w-4" />
                Bulk Generate
              </Button>
            </Link>
            <Link to="/admin/salary/reports" className="block">
              <Button variant="outline" className="w-full">
                <TrendingUp className="mr-2 h-4 w-4" />
                Reports
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminSalaryDashboard;
