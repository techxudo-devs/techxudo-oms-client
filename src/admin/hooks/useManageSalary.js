import { useState, useCallback } from "react";
import {
  useGetAllSalariesQuery,
  useGetSalaryStatisticsQuery,
  useGetSalaryByIdQuery,
  useCreateSalaryMutation,
  useUpdateSalaryMutation,
  useDeleteSalaryMutation,
  useLockSalaryMutation,
  useBulkGenerateSalariesMutation,
  useLazyExportAllSalariesQuery,
} from "../apiSlices/salaryApiSlice";
import { toast } from "sonner";
import { useDebounce } from "use-debounce";

/**
 * Manages all state and logic for the admin salary management feature.
 */
export const useManageSalary = () => {
  const currentDate = new Date();

  // State for filters
  const [searchTerm, setSearchTerm] = useState("");
  const [month, setMonth] = useState(currentDate.getMonth() + 1);
  const [year, setYear] = useState(currentDate.getFullYear());
  const [department, setDepartment] = useState("");
  const [status, setStatus] = useState("all");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(50);
  const [debouncedSearchTerm] = useDebounce(searchTerm, 500);

  // Prepare query params
  const queryParams = {
    month,
    year,
    department: department || undefined,
    status: status === "all" ? undefined : status,
    page,
    limit,
  };

  // RTK Query Hooks
  const {
    data: salariesData,
    isLoading: isFetchingSalaries,
    isFetching: isRefetchingSalaries,
    refetch: refetchSalaries,
  } = useGetAllSalariesQuery(queryParams);

  const {
    data: statistics,
    isLoading: isFetchingStatistics,
  } = useGetSalaryStatisticsQuery({ month, year });

  const [createSalary, { isLoading: isCreatingSalary }] =
    useCreateSalaryMutation();
  const [updateSalary, { isLoading: isUpdatingSalary }] =
    useUpdateSalaryMutation();
  const [deleteSalary, { isLoading: isDeletingSalary }] =
    useDeleteSalaryMutation();
  const [lockSalary, { isLoading: isLockingSalary }] = useLockSalaryMutation();
  const [bulkGenerateSalaries, { isLoading: isBulkGenerating }] =
    useBulkGenerateSalariesMutation();
  const [exportSalaries] = useLazyExportAllSalariesQuery();

  // Action Handlers
  const handleCreateSalary = useCallback(
    async (data) => {
      try {
        await createSalary(data).unwrap();
        toast.success("Salary created successfully");
        return true;
      } catch (error) {
        toast.error(error?.data?.message || "Failed to create salary");
        return false;
      }
    },
    [createSalary]
  );

  const handleUpdateSalary = useCallback(
    async (id, data) => {
      try {
        await updateSalary({ id, ...data }).unwrap();
        toast.success("Salary updated successfully");
        return true;
      } catch (error) {
        toast.error(error?.data?.message || "Failed to update salary");
        return false;
      }
    },
    [updateSalary]
  );

  const handleDeleteSalary = useCallback(
    async (id) => {
      if (
        !window.confirm("Are you sure you want to delete this salary record?")
      )
        return false;

      try {
        await deleteSalary(id).unwrap();
        toast.success("Salary deleted successfully");
        return true;
      } catch (error) {
        toast.error(error?.data?.message || "Failed to delete salary");
        return false;
      }
    },
    [deleteSalary]
  );

  const handleLockSalary = useCallback(
    async (id) => {
      if (
        !window.confirm(
          "Are you sure you want to lock this salary? Locked salaries cannot be edited."
        )
      )
        return false;

      try {
        await lockSalary(id).unwrap();
        toast.success("Salary locked successfully");
        return true;
      } catch (error) {
        toast.error(error?.data?.message || "Failed to lock salary");
        return false;
      }
    },
    [lockSalary]
  );

  const handleBulkGenerate = useCallback(
    async (data) => {
      try {
        const result = await bulkGenerateSalaries(data).unwrap();
        toast.success(
          `Successfully generated ${result.generated} salary records`
        );
        return true;
      } catch (error) {
        toast.error(error?.data?.message || "Failed to generate salaries");
        return false;
      }
    },
    [bulkGenerateSalaries]
  );

  const handleExportCSV = useCallback(async () => {
    try {
      const result = await exportSalaries({
        ...queryParams,
        format: "csv",
      }).unwrap();

      // Create blob and download
      const blob = new Blob([result], { type: "text/csv" });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `salaries-${year}-${month}.csv`;
      a.click();
      window.URL.revokeObjectURL(url);

      toast.success("CSV exported successfully");
      return true;
    } catch (error) {
      toast.error(error?.data?.message || "Failed to export CSV");
      return false;
    }
  }, [exportSalaries, queryParams, year, month]);

  const handleExportPDF = useCallback(async () => {
    try {
      const result = await exportSalaries({
        ...queryParams,
        format: "pdf",
      }).unwrap();

      // Create blob and download
      const blob = new Blob([result], { type: "application/pdf" });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `salaries-${year}-${month}.pdf`;
      a.click();
      window.URL.revokeObjectURL(url);

      toast.success("PDF exported successfully");
      return true;
    } catch (error) {
      toast.error(error?.data?.message || "Failed to export PDF");
      return false;
    }
  }, [exportSalaries, queryParams, year, month]);

  // Filter salaries by search term (client-side)
  const getFilteredSalaries = useCallback(() => {
    const salaries = salariesData?.salaries || [];
    if (!debouncedSearchTerm) return salaries;

    return salaries.filter(
      (salary) =>
        salary.userId?.fullName
          ?.toLowerCase()
          .includes(debouncedSearchTerm.toLowerCase()) ||
        salary.userId?.email
          ?.toLowerCase()
          .includes(debouncedSearchTerm.toLowerCase())
    );
  }, [salariesData, debouncedSearchTerm]);

  // Helper functions
  const getTotalPayout = useCallback(() => {
    const salaries = salariesData?.salaries || [];
    return salaries.reduce((sum, s) => sum + (s.netSalary || 0), 0);
  }, [salariesData]);

  const getPaidCount = useCallback(() => {
    const salaries = salariesData?.salaries || [];
    return salaries.filter((s) => s.isLocked).length;
  }, [salariesData]);

  const getPendingCount = useCallback(() => {
    const salaries = salariesData?.salaries || [];
    return salaries.filter((s) => !s.isLocked).length;
  }, [salariesData]);

  const handleRefresh = useCallback(() => {
    refetchSalaries();
  }, [refetchSalaries]);

  return {
    // Data
    salaries: salariesData?.salaries || [],
    pagination: salariesData?.pagination || {},
    statistics: statistics || {},
    filteredSalaries: getFilteredSalaries(),

    // Loading States
    isLoading: {
      salaries: isFetchingSalaries,
      refetching: isRefetchingSalaries,
      statistics: isFetchingStatistics,
      creating: isCreatingSalary,
      updating: isUpdatingSalary,
      deleting: isDeletingSalary,
      locking: isLockingSalary,
      bulkGenerating: isBulkGenerating,
    },

    // Filter state and setters
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

    // Action functions
    handleCreateSalary,
    handleUpdateSalary,
    handleDeleteSalary,
    handleLockSalary,
    handleBulkGenerate,
    handleExportCSV,
    handleExportPDF,
    handleRefresh,

    // Helper functions
    getTotalPayout,
    getPaidCount,
    getPendingCount,
  };
};
