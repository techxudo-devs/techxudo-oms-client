import { useManageSalary } from "../../hooks/useManageSalary";
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
  Download,
  Filter,
  Edit,
  Trash2,
  Lock,
  DollarSign,
  Search,
  Eye,
} from "lucide-react";
import { Link } from "react-router-dom";

const AllSalariesPage = () => {
  const {
    filteredSalaries,
    pagination,
    isLoading,
    searchTerm,
    setSearchTerm,
    month,
    setMonth,
    year,
    setYear,
    department,
    setDepartment,
    status,
    setStatus,
    page,
    setPage,
    limit,
    setLimit,
    handleDeleteSalary,
    handleLockSalary,
    handleExportCSV,
    handleExportPDF,
    getTotalPayout,
    getPaidCount,
    getPendingCount,
  } = useManageSalary();

  const getStatusBadge = (isLocked) => {
    return (
      <span
        className={`px-2 py-1 rounded-full text-xs font-medium ${
          isLocked
            ? "bg-green-100 text-green-700"
            : "bg-yellow-100 text-yellow-700"
        }`}
      >
        {isLocked ? "Paid" : "Pending"}
      </span>
    );
  };

  // Generate month options
  const currentDate = new Date();
  const monthOptions = Array.from({ length: 12 }, (_, i) => ({
    value: i + 1,
    label: new Date(2000, i).toLocaleDateString("en-US", { month: "long" }),
  }));

  // Generate year options (current year and 2 years back)
  const yearOptions = Array.from({ length: 3 }, (_, i) => ({
    value: currentDate.getFullYear() - i,
    label: (currentDate.getFullYear() - i).toString(),
  }));

  return (
    <div className="container mx-auto p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">All Salaries</h1>
          <p className="text-gray-600 mt-1">
            View and manage employee salaries
          </p>
        </div>
        <div className="flex gap-2">
          <Link to="/admin/salary/create">
            <Button variant="outline">
              <Edit className="mr-2 h-4 w-4" />
              Create Salary
            </Button>
          </Link>
          <Button
            onClick={handleExportCSV}
            disabled={!filteredSalaries?.length || isLoading.salaries}
          >
            <Download className="mr-2 h-4 w-4" />
            Export CSV
          </Button>
          <Button
            onClick={handleExportPDF}
            disabled={!filteredSalaries?.length || isLoading.salaries}
          >
            <Download className="mr-2 h-4 w-4" />
            Export PDF
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
              <label className="text-sm font-medium mb-2 block">Month</label>
              <Select value={month.toString()} onValueChange={(value) => setMonth(parseInt(value))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {monthOptions.map((m) => (
                    <SelectItem key={m.value} value={m.value.toString()}>
                      {m.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">Year</label>
              <Select value={year.toString()} onValueChange={(value) => setYear(parseInt(value))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {yearOptions.map((y) => (
                    <SelectItem key={y.value} value={y.value.toString()}>
                      {y.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">Status</label>
              <Select value={status} onValueChange={(value) => setStatus(value)}>
                <SelectTrigger>
                  <SelectValue placeholder="All Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="paid">Paid</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">
                Department
              </label>
              <Input
                placeholder="e.g., Engineering"
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">Per Page</label>
              <Select value={limit.toString()} onValueChange={(value) => setLimit(parseInt(value))}>
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
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Stats Summary */}
      {filteredSalaries && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardContent className="p-4">
              <div className="text-sm text-gray-600">Total Records</div>
              <div className="text-2xl font-bold">
                {pagination?.total || 0}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-sm text-gray-600">Total Payout</div>
              <div className="text-2xl font-bold text-green-600">
                ₨{getTotalPayout().toLocaleString()}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-sm text-gray-600">Paid</div>
              <div className="text-2xl font-bold text-green-600">
                {getPaidCount()}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-sm text-gray-600">Pending</div>
              <div className="text-2xl font-bold text-yellow-600">
                {getPendingCount()}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Table */}
      <Card>
        <CardContent className="p-0">
          {isLoading.salaries || isLoading.refetching ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
          ) : filteredSalaries?.length === 0 ? (
            <div className="text-center py-12">
              <DollarSign className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">No salary records found</p>
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
                        Month/Year
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Base Salary
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Allowances
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Bonuses
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Deductions
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Net Salary
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Status
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredSalaries?.map((salary) => (
                      <tr key={salary._id} className="hover:bg-gray-50">
                        <td className="px-4 py-4">
                          <div>
                            <div className="text-sm font-medium text-gray-900">
                              {salary.userId?.fullName}
                            </div>
                            <div className="text-xs text-gray-500">
                              {salary.userId?.designation} -{" "}
                              {salary.userId?.department}
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm">
                          {new Date(
                            salary.year,
                            salary.month - 1
                          ).toLocaleDateString("en-US", {
                            month: "short",
                            year: "numeric",
                          })}
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm font-medium">
                          ₨{salary.baseSalary?.toLocaleString() || 0}
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm text-green-600">
                          +₨
                          {salary.allowances
                            ?.reduce((sum, a) => sum + a.amount, 0)
                            .toLocaleString() || 0}
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm text-green-600">
                          +₨
                          {salary.bonuses
                            ?.reduce((sum, b) => sum + b.amount, 0)
                            .toLocaleString() || 0}
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm text-red-600">
                          -₨
                          {salary.deductions
                            ?.reduce((sum, d) => sum + d.amount, 0)
                            .toLocaleString() || 0}
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm font-bold text-gray-900">
                          ₨{salary.netSalary?.toLocaleString() || 0}
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap">
                          {getStatusBadge(salary.isLocked)}
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm">
                          <div className="flex gap-2">
                            <Link to={`/admin/salary/${salary._id}`}>
                              <Button size="sm" variant="ghost">
                                <Eye className="h-4 w-4 text-blue-500" />
                              </Button>
                            </Link>
                            {!salary.isLocked && (
                              <>
                                <Link to={`/admin/salary/edit/${salary._id}`}>
                                  <Button size="sm" variant="ghost">
                                    <Edit className="h-4 w-4 text-gray-500" />
                                  </Button>
                                </Link>
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  onClick={() => handleLockSalary(salary._id)}
                                >
                                  <Lock className="h-4 w-4 text-green-500" />
                                </Button>
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  onClick={() => handleDeleteSalary(salary._id)}
                                >
                                  <Trash2 className="h-4 w-4 text-red-500" />
                                </Button>
                              </>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              {pagination && pagination.totalPages > 1 && (
                <div className="px-6 py-4 border-t flex items-center justify-between">
                  <div className="text-sm text-gray-600">
                    Page {pagination.page} of {pagination.totalPages} (
                    {pagination.total} total records)
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={pagination.page === 1}
                      onClick={() => setPage(pagination.page - 1)}
                    >
                      Previous
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={pagination.page >= pagination.totalPages}
                      onClick={() => setPage(pagination.page + 1)}
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

export default AllSalariesPage;
