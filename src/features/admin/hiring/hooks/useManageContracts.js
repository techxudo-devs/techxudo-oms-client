import { useState, useMemo } from "react";
import {
  useListContractsQuery,
  useGetContractByIdQuery,
  useSendContractToEmployeeMutation,
} from "../api/hiringApiSlice";

const useManageContracts = () => {
  const [filters, setFilters] = useState({
    status: "all",
    page: 1,
    limit: 10,
  });
  const [selectedContractId, setSelectedContractId] = useState(null);

  // Fetch contracts list
  const {
    data: contractsData,
    isLoading,
    isFetching,
    refetch,
  } = useListContractsQuery(
    {
      status: filters.status === "all" ? undefined : filters.status,
      page: filters.page,
      limit: filters.limit,
    },
    {
      refetchOnMountOrArgChange: true,
    }
  );

  // Fetch single contract details
  const {
    data: selectedContract,
    isLoading: isLoadingDetails,
    isFetching: isFetchingDetails,
  } = useGetContractByIdQuery(selectedContractId, {
    skip: !selectedContractId,
  });

  // Send contract mutation
  const [sendContract, { isLoading: isSending }] =
    useSendContractToEmployeeMutation();

  // Extract data with fallbacks
  const contracts = contractsData?.data || [];
  const pagination = contractsData?.pagination || {
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
  };

  // Filter handler
  const updateFilter = (key, value) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
      page: key !== "page" ? 1 : value,
    }));
  };

  // Status filter options
  const statusOptions = [
    { label: "All", value: "all" },
    { label: "Draft", value: "draft" },
    { label: "Sent", value: "sent" },
    { label: "Signed", value: "signed" },
    { label: "Expired", value: "expired" },
  ];

  // Computed statistics
  const statistics = useMemo(() => {
    if (!contracts.length) {
      return {
        total: 0,
        draft: 0,
        sent: 0,
        signed: 0,
        expired: 0,
      };
    }

    return {
      total: pagination.totalItems,
      draft: contracts.filter((c) => c.status === "draft").length,
      sent: contracts.filter((c) => c.status === "sent").length,
      signed: contracts.filter((c) => c.status === "signed").length,
      expired: contracts.filter((c) => c.status === "expired").length,
    };
  }, [contracts, pagination.totalItems]);

  // View contract details
  const viewContract = (id) => {
    setSelectedContractId(id);
  };

  // Close details view
  const closeDetails = () => {
    setSelectedContractId(null);
  };

  // Send contract to employee
  const handleSendContract = async (id) => {
    try {
      await sendContract(id).unwrap();
      refetch();
      return { success: true };
    } catch (err) {
      return {
        success: false,
        error: err.data?.message || "Failed to send contract",
      };
    }
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
    contracts,
    pagination,
    statistics,
    selectedContract,

    // Loading states
    isLoading,
    isFetching,
    isLoadingDetails,
    isFetchingDetails,
    isSending,

    // Filters
    filters,
    statusOptions,
    updateFilter,

    // Actions
    viewContract,
    closeDetails,
    handleSendContract,
    refetch,

    // Pagination
    goToPage,
    nextPage,
    prevPage,
  };
};

export default useManageContracts;
