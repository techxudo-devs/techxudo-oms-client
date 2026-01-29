import { useState, useCallback } from "react";
import {
  useGetEmployeesQuery,
  useUpdateEmployeeMutation,
  useDeleteEmployeeMutation,
  useBlockEmployeeMutation,
  useUnblockEmployeeMutation,
} from "../apiSlices/employeeApiSlice";
import { toast } from "sonner";
import { useDebounce } from "use-debounce";

export const useManageEmployee = () => {
  // State for filters
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [page, setPage] = useState(1);
  const [debouncedSearchTerm] = useDebounce(searchTerm, 500);

  // RTK Query Hooks
  const {
    data: employeesData,
    isLoading: isFetchingAllEmployees,
    isError,
    refetch: getEmployees,
  } = useGetEmployeesQuery({
    page,
    limit: 10,
    search: debouncedSearchTerm,
    role: roleFilter === "all" ? "" : roleFilter,
  });

  const [deleteEmployee, { isLoading: isDeletingEmployee }] =
    useDeleteEmployeeMutation();
  const [blockEmployee, { isLoading: isBlockingEmployee }] =
    useBlockEmployeeMutation();
  const [unblockEmployee, { isLoading: isUnblockingEmployee }] =
    useUnblockEmployeeMutation();

  // Action Handlers
  const removeEmployee = useCallback(
    async (id) => {
      try {
        await deleteEmployee(id).unwrap();
        toast.success("Employee deleted successfully");
      } catch (error) {
        toast.error("Error deleting employee", {
          description: error?.data?.error || "An unexpected error occurred.",
        });
      }
    },
    [deleteEmployee],
  );

  const blockEmployeeAccess = useCallback(
    async (id) => {
      try {
        await blockEmployee(id).unwrap();
        toast.success("Employee blocked successfully");
      } catch (error) {
        toast.error("Error blocking employee", {
          description: error?.data?.error || "An unexpected error occurred.",
        });
      }
    },
    [blockEmployee],
  );

  const unblockEmployeeAccess = useCallback(
    async (id) => {
      try {
        await unblockEmployee(id).unwrap();
        toast.success("Employee unblocked successfully");
      } catch (error) {
        toast.error("Error unblocking employee", {
          description: error?.data?.error || "An unexpected error occurred.",
        });
      }
    },
    [unblockEmployee],
  );

  const handleRefresh = useCallback(() => {
    getEmployees();
  }, [getEmployees]);

  return {
    // Data
    employees: employeesData?.data?.users || [],
    pagination: employeesData?.data?.pagination || {},

    // Loading States
    isLoading: {
      employees: isFetchingAllEmployees,
      deleting: isDeletingEmployee,
      blocking: isBlockingEmployee,
      unblocking: isUnblockingEmployee,
    },
    isError,

    // Filter state and setters
    searchTerm,
    setSearchTerm,
    roleFilter,
    setRoleFilter,
    page,
    setPage,

    // Action functions
    removeEmployee,
    blockEmployeeAccess,
    unblockEmployeeAccess,
    handleRefresh,
  };
};
