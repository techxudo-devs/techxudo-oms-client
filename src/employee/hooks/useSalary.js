import { useState, useCallback } from "react";
import {
  useGetMySalaryHistoryQuery,
  useGetMyCurrentSalaryQuery,
  useGetMySalarySummaryQuery,
  useAcknowledgeSalaryMutation,
  useLazyExportMySalaryQuery,
} from "../apiSlices/salaryApiSlice";
import { toast } from "sonner";

/**
 * Manages all state and logic for employee salary feature.
 */
export const useSalary = () => {
  const currentDate = new Date();

  // State for filters
  const [selectedYear, setSelectedYear] = useState(currentDate.getFullYear());
  const [selectedMonth, setSelectedMonth] = useState(null); // null = all months
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(12);

  // Prepare query params for history
  const historyParams = {
    year: selectedYear,
    month: selectedMonth || undefined,
    page,
    limit,
  };

  // RTK Query Hooks
  const {
    data: salaryHistory,
    isLoading: isLoadingHistory,
    isFetching: isRefetchingHistory,
    refetch: refetchHistory,
  } = useGetMySalaryHistoryQuery(historyParams);

  const {
    data: currentSalary,
    isLoading: isLoadingCurrent,
  } = useGetMyCurrentSalaryQuery();

  const {
    data: summary,
    isLoading: isLoadingSummary,
  } = useGetMySalarySummaryQuery({
    startDate: new Date(selectedYear, 0, 1).toISOString().split("T")[0],
    endDate: new Date(selectedYear, 11, 31).toISOString().split("T")[0],
  });

  const [exportSalary] = useLazyExportMySalaryQuery();
  const [acknowledgeSalary, { isLoading: isAcknowledging }] = useAcknowledgeSalaryMutation();

  // Export handlers
  const handleExportCSV = useCallback(async () => {
    try {
      const result = await exportSalary({
        ...historyParams,
        format: "csv",
      }).unwrap();

      // Create blob and download
      const blob = new Blob([result], { type: "text/csv" });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `my-salary-${selectedYear}${
        selectedMonth ? `-${selectedMonth}` : ""
      }.csv`;
      a.click();
      window.URL.revokeObjectURL(url);

      toast.success("CSV exported successfully");
      return true;
    } catch (error) {
      toast.error(error?.data?.message || "Failed to export CSV");
      return false;
    }
  }, [exportSalary, historyParams, selectedYear, selectedMonth]);

  const handleExportPDF = useCallback(async () => {
    try {
      const result = await exportSalary({
        ...historyParams,
        format: "pdf",
      }).unwrap();

      // Create blob and download
      const blob = new Blob([result], { type: "application/pdf" });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `my-salary-${selectedYear}${
        selectedMonth ? `-${selectedMonth}` : ""
      }.pdf`;
      a.click();
      window.URL.revokeObjectURL(url);

      toast.success("PDF exported successfully");
      return true;
    } catch (error) {
      toast.error(error?.data?.message || "Failed to export PDF");
      return false;
    }
  }, [exportSalary, historyParams, selectedYear, selectedMonth]);

  // Helper functions
  const getTotalEarnings = useCallback(() => {
    return summary?.totalEarnings || 0;
  }, [summary]);

  const getAverageSalary = useCallback(() => {
    return summary?.averageSalary || 0;
  }, [summary]);

  const getTotalAllowances = useCallback(() => {
    return summary?.totalAllowances || 0;
  }, [summary]);

  const getTotalBonuses = useCallback(() => {
    return summary?.totalBonuses || 0;
  }, [summary]);

  const getTotalDeductions = useCallback(() => {
    return summary?.totalDeductions || 0;
  }, [summary]);

  const getMonthlyBreakdown = useCallback(() => {
    return summary?.monthlyBreakdown || [];
  }, [summary]);

  const formatCurrency = useCallback((amount) => {
    return `₨${amount?.toLocaleString() || 0}`;
  }, []);

  const formatMonth = useCallback((month, year) => {
    return new Date(year, month - 1).toLocaleDateString("en-US", {
      month: "long",
      year: "numeric",
    });
  }, []);

  const handleAcknowledgeSalary = useCallback(async (salaryId) => {
    try {
      await acknowledgeSalary(salaryId).unwrap();
      toast.success("Salary acknowledged successfully");
      refetchHistory(); // Refresh the salary history
      return true;
    } catch (error) {
      toast.error(error?.data?.message || "Failed to acknowledge salary");
      return false;
    }
  }, [acknowledgeSalary, refetchHistory]);

  const getStatusBadge = useCallback((salary) => {
    if (salary.acknowledged) {
      return "Acknowledged";
    } else if (salary.paymentStatus === "paid") {
      return "Paid - Awaiting Acknowledgment";
    } else {
      return salary.paymentStatus || "Pending";
    }
  }, []);

  const handleRefresh = useCallback(() => {
    refetchHistory();
  }, [refetchHistory]);

  // Calculate breakdown percentages
  const getBreakdownPercentages = useCallback(
    (salary) => {
      if (!salary?.grossSalary) return null;

      const totalAllowances =
        salary.allowances?.reduce((sum, a) => sum + a.amount, 0) || 0;
      const totalBonuses =
        salary.bonuses?.reduce((sum, b) => sum + b.amount, 0) || 0;
      const totalDeductions =
        salary.deductions?.reduce((sum, d) => sum + d.amount, 0) || 0;

      return {
        base:
          ((salary.baseSalary || 0) / (salary.grossSalary || 1)) * 100,
        allowances: (totalAllowances / (salary.grossSalary || 1)) * 100,
        bonuses: (totalBonuses / (salary.grossSalary || 1)) * 100,
        deductions: (totalDeductions / (salary.grossSalary || 1)) * 100,
      };
    },
    []
  );

  return {
    // Data
    salaryHistory: salaryHistory?.salaries || [],
    pagination: salaryHistory?.pagination || {},
    currentSalary: currentSalary?.salary || null,
    summary: summary || {},
    monthlyBreakdown: getMonthlyBreakdown(),

    // Loading States
    isLoading: {
      history: isLoadingHistory,
      refetching: isRefetchingHistory,
      current: isLoadingCurrent,
      summary: isLoadingSummary,
    },

    // Filter state and setters
    selectedYear,
    setSelectedYear,
    selectedMonth,
    setSelectedMonth,
    page,
    setPage,
    limit,
    setLimit,

    // Action functions
    handleExportCSV,
    handleExportPDF,
    handleRefresh,

    // Helper functions
    getTotalEarnings,
    getAverageSalary,
    getTotalAllowances,
    getTotalBonuses,
    getTotalDeductions,
    formatCurrency,
    formatMonth,
    getStatusBadge,
    getBreakdownPercentages,

    // Acknowledgment
    handleAcknowledgeSalary,
    isAcknowledging,
  };
};
