import { useState, useCallback } from "react";
import {
  useGetAdminDocumentRequestsQuery,
  useGenerateDocumentFromAdminRequestMutation,
} from "../apiSlices/manageDocRequestApiSlice";
import { toast } from "sonner";
import { useDebounce } from "use-debounce";

/**
 * Manages all state and logic for the admin document request management feature.
 */
export const useManageDocumentRequests = () => {
  // State for filters
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [employeeId, setEmployeeId] = useState("");
  const [page, setPage] = useState(1);
  const [debouncedSearchTerm] = useDebounce(searchTerm, 500);

  // State for document generation modal
  const [showGenerateModal, setShowGenerateModal] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);

  // RTK Query Hooks
  const {
    data: documentRequests,
    isLoading: isFetchingRequests,
    isError: isRequestsError,
    refetch: getDocumentRequests,
  } = useGetAdminDocumentRequestsQuery({
    page,
    limit: 10,
    status: statusFilter,
    type: typeFilter,
    employeeId,
    search: debouncedSearchTerm,
  });

  const [generateDocument, { isLoading: isGeneratingDocument }] =
    useGenerateDocumentFromAdminRequestMutation();

  // Action Handlers
  const openGenerateModal = useCallback((request) => {
    setSelectedRequest(request);
    setShowGenerateModal(true);
  }, []);

  const closeGenerateModal = useCallback(() => {
    setShowGenerateModal(false);
    setSelectedRequest(null);
  }, []);

  const handleGenerateDocument = useCallback(
    async (id, htmlContent) => {
      try {
        await generateDocument({ id, htmlContent }).unwrap();
        toast.success("Document generated successfully");
        closeGenerateModal();
        getDocumentRequests();
      } catch (error) {
        toast.error("Error generating document", {
          description: error?.data?.message || "An unexpected error occurred.",
        });
      }
    },
    [generateDocument, closeGenerateModal, getDocumentRequests]
  );

  const handleRefresh = useCallback(() => {
    getDocumentRequests();
  }, [getDocumentRequests]);

  // Helper function to get count of pending requests
  const getPendingCount = useCallback(() => {
    const allRequests = documentRequests || [];
    return allRequests.filter((request) => request.status === "pending").length;
  }, [documentRequests]);

  // Helper function to get generated requests
  const getGeneratedRequests = useCallback(() => {
    const allRequests = documentRequests || [];
    return allRequests.filter(
      (request) =>
        request.status === "generated" || request.status === "downloaded"
    );
  }, [documentRequests]);

  // Helper function to get rejected requests
  const getRejectedRequests = useCallback(() => {
    const allRequests = documentRequests || [];
    return allRequests.filter((request) => request.status === "rejected");
  }, [documentRequests]);

  // Helper function to get requests by type
  const getRequestsByType = useCallback(
    (type) => {
      const allRequests = documentRequests || [];
      return allRequests.filter((request) => request.type === type);
    },
    [documentRequests]
  );

  // Helper function to download document
  const handleDownload = useCallback((documentUrl) => {
    if (documentUrl) {
      window.open(documentUrl, "_blank");
    } else {
      toast.error("Document is not yet available");
    }
  }, []);

  return {
    // Data
    documentRequests: documentRequests || [],
    leaveRequests: documentRequests || [],

    // Loading states
    isLoading: {
      requests: isFetchingRequests,
      generating: isGeneratingDocument,
    },

    // Error states
    isError: {
      requests: isRequestsError,
    },

    // Filters
    searchTerm,
    setSearchTerm,
    statusFilter,
    setStatusFilter,
    typeFilter,
    setTypeFilter,
    employeeId,
    setEmployeeId,
    page,
    setPage,

    // Modal state
    showGenerateModal,
    setShowGenerateModal,
    selectedRequest,

    // Action Handlers
    openGenerateModal,
    closeGenerateModal,
    handleGenerateDocument,
    handleDownload,
    handleRefresh,

    // Helper Functions
    getPendingCount,
    getGeneratedRequests,
    getRejectedRequests,
    getRequestsByType,
  };
};
