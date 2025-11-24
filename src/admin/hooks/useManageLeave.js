import { useState, useCallback } from "react";
import {
  useGetLeaveRequestsQuery,
  useUpdateLeaveStatusMutation,
} from "../apiSlices/manageLeaveApiSlice";
import { toast } from "sonner";
import { useDebounce } from "use-debounce";

/**
 * Manages all state and logic for the admin leave management feature.
 */
export const useManageLeave = () => {
  // State for filters
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState(""); // Default to pending
  const [employeeId, setEmployeeId] = useState("");
  const [page, setPage] = useState(1);
  const [debouncedSearchTerm] = useDebounce(searchTerm, 500);

  // RTK Query Hooks
  const {
    data: leaveRequestsData,
    isLoading: isFetchingLeaveRequests,
    isError: isLeaveRequestsError,
    refetch: getLeaveRequests,
  } = useGetLeaveRequestsQuery({
    page,
    limit: 10,
    status: statusFilter,
    employeeId,
    search: debouncedSearchTerm,
  });

  const [updateLeaveStatus, { isLoading: isUpdatingLeaveStatus }] =
    useUpdateLeaveStatusMutation();

  // Action Handlers
  const approveLeave = useCallback(
    async (id, comments = "") => {
      try {
        await updateLeaveStatus({ id, status: "approved", comments }).unwrap();
        toast.success("Leave request approved successfully");
      } catch (error) {
        toast.error("Error approving leave request", {
          description: error?.data?.error || "An unexpected error occurred.",
        });
      }
    },
    [updateLeaveStatus]
  );

  const rejectLeave = useCallback(
    async (id, comments = "") => {
      try {
        await updateLeaveStatus({ id, status: "rejected", comments }).unwrap();
        toast.success("Leave request rejected successfully");
      } catch (error) {
        toast.error("Error rejecting leave request", {
          description: error?.data?.error || "An unexpected error occurred.",
        });
      }
    },
    [updateLeaveStatus]
  );

  const handleRefresh = useCallback(() => {
    getLeaveRequests();
  }, [getLeaveRequests]);

  // Helper function to get count of pending requests
  const getPendingCount = useCallback(() => {
    const allRequests = leaveRequestsData || [];
    return allRequests.filter((request) => request.status === "pending").length;
  }, [leaveRequestsData]);

  // Helper function to get approved requests
  const getApprovedRequests = useCallback(() => {
    const allRequests = leaveRequestsData || [];
    return allRequests.filter((request) => request.status === "approved");
  }, [leaveRequestsData]);

  // Helper function to get rejected requests
  const getRejectedRequests = useCallback(() => {
    const allRequests = leaveRequestsData || [];
    return allRequests.filter((request) => request.status === "rejected");
  }, [leaveRequestsData]);

  // Helper function to format leave requests for calendar view
  const getCalendarEvents = useCallback(() => {
    console.log(leaveRequestsData);
    const allRequests = leaveRequestsData || [];
    return allRequests.map((request) => ({
      id: request._id,
      title: `${request.userId?.fullName || request.userId?._id} - ${
        request.type
      }`,
      start: new Date(request.startDate),
      end: new Date(request.endDate),
      status: request.status,
      employee: request.userId,
      type: request.type,
      reason: request.reason,
    }));
  }, [leaveRequestsData]);

  return {
    // Data
    leaveRequests: leaveRequestsData || [],
    pagination: {}, // Update this if pagination data is available in the actual response

    // Loading States
    isLoading: {
      leaveRequests: isFetchingLeaveRequests,
      updateStatus: isUpdatingLeaveStatus,
    },
    isLeaveRequestsError,

    // Filter state and setters
    searchTerm,
    setSearchTerm,
    statusFilter,
    setStatusFilter,
    employeeId,
    setEmployeeId,
    page,
    setPage,

    // Action functions
    approveLeave,
    rejectLeave,
    handleRefresh,

    // Helper functions
    getPendingCount,
    getApprovedRequests,
    getRejectedRequests,
    getCalendarEvents,
  };
};
