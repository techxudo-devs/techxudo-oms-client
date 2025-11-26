import { useSalary } from "../../hooks/useSalary";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Download,
  DollarSign,
  TrendingUp,
  Calendar,
  FileText,
  ChevronDown,
  ChevronUp,
  CircleDollarSignIcon,
} from "lucide-react";
import { useState } from "react";
import DashboardSkeletonLoader from "@/components/SkeletonLoader";
import PageLayout from "@/shared/components/layout/PagesLayout";

const SalaryHistoryPage = () => {
  const {
    salaryHistory,
    pagination,
    currentSalary,
    summary,
    isLoading,
    selectedYear,
    setSelectedYear,
    selectedMonth,
    setSelectedMonth,
    page,
    setPage,
    handleExportCSV,
    handleExportPDF,
    formatCurrency,
    formatMonth,
    getStatusBadge,
    getTotalEarnings,
    getAverageSalary,
    handleAcknowledgeSalary,
    isAcknowledging,
  } = useSalary();

  const [expandedRow, setExpandedRow] = useState(null);

  // Generate year options (current year and 2 years back)
  const currentDate = new Date();
  const yearOptions = Array.from({ length: 3 }, (_, i) => ({
    value: currentDate.getFullYear() - i,
    label: (currentDate.getFullYear() - i).toString(),
  }));

  // Generate month options
  const monthOptions = [
    { value: null, label: "All Months" },
    ...Array.from({ length: 12 }, (_, i) => ({
      value: i + 1,
      label: new Date(2000, i).toLocaleDateString("en-US", { month: "long" }),
    })),
  ];

  const toggleRow = (id) => {
    setExpandedRow(expandedRow === id ? null : id);
  };

  if (isLoading.history) return <DashboardSkeletonLoader />;

  return (
    <PageLayout
      title={"Salary History"}
      subtitle={"View you salary details and history"}
      icon={CircleDollarSignIcon}
      actions={
        <div className="flex gap-2">
          <Button
            variant={"outline"}
            onClick={handleExportCSV}
            disabled={!salaryHistory?.length}
          >
            <Download className="mr-2 h-4 w-4" />
            Export CSV
          </Button>
          <Button onClick={handleExportPDF} disabled={!salaryHistory?.length}>
            <Download className="mr-2 h-4 w-4" />
            Export PDF
          </Button>
        </div>
      }
    >
      {/* Current Salary Card */}
      {currentSalary && (
        <Card className="mb-6 bg-gradient-to-r from-blue-500 to-blue-600 text-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100 text-sm">Current Month Salary</p>
                <p className="text-4xl font-bold mt-1">
                  {formatCurrency(currentSalary.netSalary)}
                </p>
                <p className="text-blue-100 text-sm mt-1">
                  {formatMonth(currentSalary.month, currentSalary.year)}
                </p>
              </div>
              <DollarSign className="h-16 w-16 text-blue-200" />
            </div>
          </CardContent>
        </Card>
      )}

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Earnings</p>
                <p className="text-2xl font-bold text-gray-900">
                  {formatCurrency(getTotalEarnings())}
                </p>
              </div>
              <TrendingUp className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Average Salary</p>
                <p className="text-2xl font-bold text-gray-900">
                  {formatCurrency(getAverageSalary())}
                </p>
              </div>
              <Calendar className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Records</p>
                <p className="text-2xl font-bold text-gray-900">
                  {pagination?.total || 0}
                </p>
              </div>
              <FileText className="h-8 w-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Paid Salaries</p>
                <p className="text-2xl font-bold text-green-600">
                  {salaryHistory?.filter((s) => s.isLocked).length || 0}
                </p>
              </div>
              <DollarSign className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Filter by Period</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Year</label>
              <Select
                value={selectedYear.toString()}
                onValueChange={(value) => setSelectedYear(parseInt(value))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {yearOptions.map((year) => (
                    <SelectItem key={year.value} value={year.value.toString()}>
                      {year.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">Month</label>
              <Select
                value={selectedMonth?.toString() || "all"}
                onValueChange={(value) =>
                  setSelectedMonth(value === "all" ? null : parseInt(value))
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {monthOptions.map((month) => (
                    <SelectItem
                      key={month.value || "all"}
                      value={month.value?.toString() || "all"}
                    >
                      {month.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Salary History Table */}
      <Card>
        <CardHeader>
          <CardTitle>Salary Records</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {isLoading.refetching ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
          ) : salaryHistory?.length === 0 ? (
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
                        Period
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Base Salary
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Gross Salary
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
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Details
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {salaryHistory?.map((salary) => (
                      <>
                        <tr key={salary._id} className="hover:bg-gray-50">
                          <td className="px-4 py-4 whitespace-nowrap text-sm font-medium">
                            {formatMonth(salary.month, salary.year)}
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap text-sm">
                            {formatCurrency(salary.baseSalary)}
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap text-sm">
                            {formatCurrency(salary.grossSalary)}
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap text-sm font-bold text-gray-900">
                            {formatCurrency(salary.netSalary)}
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap">
                            <span
                              className={`px-2 py-1 rounded-full text-xs font-medium ${
                                salary.paymentStatus === 'paid' && !salary.acknowledged
                                  ? "bg-blue-100 text-blue-700"
                                  : salary.acknowledged
                                  ? "bg-green-100 text-green-700"
                                  : "bg-yellow-100 text-yellow-700"
                              }`}
                            >
                              {getStatusBadge(salary)}
                            </span>
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap text-sm">
                            {salary.paymentStatus === 'paid' && !salary.acknowledged && (
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleAcknowledgeSalary(salary._id)}
                                disabled={isAcknowledging}
                              >
                                Acknowledge
                              </Button>
                            )}
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap text-sm">
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => toggleRow(salary._id)}
                            >
                              {expandedRow === salary._id ? (
                                <ChevronUp className="h-4 w-4" />
                              ) : (
                                <ChevronDown className="h-4 w-4" />
                              )}
                            </Button>
                          </td>
                        </tr>
                        {expandedRow === salary._id && (
                          <tr>
                            <td colSpan="6" className="px-4 py-4 bg-gray-50">
                              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                {/* Allowances */}
                                {salary.allowances &&
                                  salary.allowances.length > 0 && (
                                    <div>
                                      <h4 className="font-medium text-sm text-gray-900 mb-2">
                                        Allowances
                                      </h4>
                                      <ul className="space-y-1">
                                        {salary.allowances.map(
                                          (allowance, idx) => (
                                            <li
                                              key={idx}
                                              className="text-sm flex justify-between"
                                            >
                                              <span className="text-gray-600">
                                                {allowance.type}
                                              </span>
                                              <span className="text-green-600">
                                                +
                                                {formatCurrency(
                                                  allowance.amount
                                                )}
                                              </span>
                                            </li>
                                          )
                                        )}
                                      </ul>
                                    </div>
                                  )}

                                {/* Bonuses */}
                                {salary.bonuses &&
                                  salary.bonuses.length > 0 && (
                                    <div>
                                      <h4 className="font-medium text-sm text-gray-900 mb-2">
                                        Bonuses
                                      </h4>
                                      <ul className="space-y-1">
                                        {salary.bonuses.map((bonus, idx) => (
                                          <li
                                            key={idx}
                                            className="text-sm flex justify-between"
                                          >
                                            <span className="text-gray-600">
                                              {bonus.type}
                                            </span>
                                            <span className="text-green-600">
                                              +{formatCurrency(bonus.amount)}
                                            </span>
                                          </li>
                                        ))}
                                      </ul>
                                    </div>
                                  )}

                                {/* Deductions */}
                                {salary.deductions &&
                                  salary.deductions.length > 0 && (
                                    <div>
                                      <h4 className="font-medium text-sm text-gray-900 mb-2">
                                        Deductions
                                      </h4>
                                      <ul className="space-y-1">
                                        {salary.deductions.map(
                                          (deduction, idx) => (
                                            <li
                                              key={idx}
                                              className="text-sm flex justify-between"
                                            >
                                              <span className="text-gray-600">
                                                {deduction.type}
                                              </span>
                                              <span className="text-red-600">
                                                -
                                                {formatCurrency(
                                                  deduction.amount
                                                )}
                                              </span>
                                            </li>
                                          )
                                        )}
                                      </ul>
                                    </div>
                                  )}
                              </div>

                              {/* Notes */}
                              {salary.notes && (
                                <div className="mt-4">
                                  <h4 className="font-medium text-sm text-gray-900 mb-1">
                                    Notes
                                  </h4>
                                  <p className="text-sm text-gray-600">
                                    {salary.notes}
                                  </p>
                                </div>
                              )}
                            </td>
                          </tr>
                        )}
                      </>
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
    </PageLayout>
  );
};

export default SalaryHistoryPage;
