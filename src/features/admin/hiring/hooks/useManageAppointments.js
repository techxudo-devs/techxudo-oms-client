import { useState, useMemo } from "react";
import {
  useListAppointmentsQuery,
  useGetAppointmentByIdQuery,
} from "../api/hiringApiSlice";

/**
 * Hook for managing appointment letters list
 * Handles filtering, pagination, and viewing appointments
 */
const useManageAppointments = () => {
  const [filters, setFilters] = useState({
    status: "all",
    page: 1,
    limit: 10,
  });
  const [selectedAppointmentId, setSelectedAppointmentId] = useState(null);

  // Fetch appointments list
  const {
    data: appointmentsData,
    isLoading,
    isFetching,
    refetch,
  } = useListAppointmentsQuery(
    {
      status: filters.status === "all" ? undefined : filters.status,
      page: filters.page,
      limit: filters.limit,
    },
    {
      refetchOnMountOrArgChange: true,
    }
  );

  // Fetch single appointment details (when selected)
  const {
    data: selectedAppointment,
    isLoading: isLoadingDetails,
    isFetching: isFetchingDetails,
  } = useGetAppointmentByIdQuery(selectedAppointmentId, {
    skip: !selectedAppointmentId,
  });

  // Extract data with fallbacks
  const appointments = appointmentsData?.data || [];
  const pagination = appointmentsData?.pagination || {
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
  };

  // Filter handler
  const updateFilter = (key, value) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
      page: key !== "page" ? 1 : value, // Reset to page 1 when changing filters
    }));
  };

  // Status filter options
  const statusOptions = [
    { label: "All", value: "all" },
    { label: "Pending", value: "pending" },
    { label: "Accepted", value: "accepted" },
    { label: "Rejected", value: "rejected" },
    { label: "Expired", value: "expired" },
  ];

  // Computed statistics
  const statistics = useMemo(() => {
    if (!appointments.length) {
      return {
        total: 0,
        pending: 0,
        accepted: 0,
        rejected: 0,
        expired: 0,
      };
    }

    return {
      total: pagination.totalItems,
      pending: appointments.filter((a) => a.status === "pending").length,
      accepted: appointments.filter((a) => a.status === "accepted").length,
      rejected: appointments.filter((a) => a.status === "rejected").length,
      expired: appointments.filter((a) => a.status === "expired").length,
    };
  }, [appointments, pagination.totalItems]);

  // View appointment details
  const viewAppointment = (id) => {
    setSelectedAppointmentId(id);
  };

  // Close details view
  const closeDetails = () => {
    setSelectedAppointmentId(null);
  };

  // Pagination handlers
  const goToPage = (page) => {
    if (page >= 1 && page <= pagination.totalPages) {
      updateFilter("page", page);
    }
  };

  const nextPage = () => {
    if (filters.page < pagination.totalPages) {
      goToPage(filters.page + 1);
    }
  };

  const prevPage = () => {
    if (filters.page > 1) {
      goToPage(filters.page - 1);
    }
  };

  return {
    // Data
    appointments,
    pagination,
    statistics,
    selectedAppointment,

    // Loading states
    isLoading,
    isFetching,
    isLoadingDetails,
    isFetchingDetails,

    // Filters
    filters,
    statusOptions,
    updateFilter,

    // Actions
    viewAppointment,
    closeDetails,
    refetch,

    // Pagination
    goToPage,
    nextPage,
    prevPage,
  };
};

export default useManageAppointments;
