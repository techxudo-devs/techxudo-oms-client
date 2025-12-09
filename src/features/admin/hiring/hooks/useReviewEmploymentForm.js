import { useState } from "react";
import {
  useListEmploymentFormsQuery,
  useGetEmploymentFormByIdQuery,
  useReviewEmploymentFormMutation,
} from "../api/hiringApiSlice";

/**
 * Hook for reviewing employment forms
 * Business logic for approving/rejecting forms
 */
const useReviewEmploymentForm = () => {
  const [filters, setFilters] = useState({
    status: "all",
    page: 1,
    limit: 10,
  });
  const [selectedFormId, setSelectedFormId] = useState(null);
  const [reviewModalOpen, setReviewModalOpen] = useState(false);
  const [detailsModalOpen, setDetailsModalOpen] = useState(false);
  const [reviewAction, setReviewAction] = useState(null); // "approve" or "reject"

  // Fetch employment forms list
  const {
    data: formsData,
    isLoading,
    isFetching,
    refetch,
  } = useListEmploymentFormsQuery(
    {
      status: filters.status === "all" ? undefined : filters.status,
      page: filters.page,
      limit: filters.limit,
    },
    {
      refetchOnMountOrArgChange: true,
    }
  );

  // Fetch single form details
  const {
    data: selectedForm,
    isLoading: isLoadingDetails,
    isFetching: isFetchingDetails,
  } = useGetEmploymentFormByIdQuery(selectedFormId, {
    skip: !selectedFormId,
  });

  console.log("SelectedForm", selectedForm);

  // Review mutation
  const [reviewForm, { isLoading: isSubmitting }] =
    useReviewEmploymentFormMutation();

  // Extract data with fallbacks
  const forms = formsData?.data?.forms || [];

  const pagination = formsData?.data?.pagination || {
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
    { label: "Pending Review", value: "pending_review" },
    { label: "Approved", value: "approved" },
    { label: "Rejected", value: "rejected" },
  ];

  // View form details
  const viewForm = (formId) => {
    setSelectedFormId(formId);
    setDetailsModalOpen(true);
  };

  // Close details view
  const closeDetails = () => {
    setSelectedFormId(null);
    setReviewModalOpen(false);
    setDetailsModalOpen(false);
    setReviewAction(null);
  };

  // Extract selected form data correctly
  const selectedFormData = selectedForm?.data || null;

  // Open review modal
  const openReviewModal = (action) => {
    setReviewAction(action);
    setReviewModalOpen(true);
  };

  // Close review modal
  const closeReviewModal = () => {
    setReviewModalOpen(false);
    setReviewAction(null);
  };

  // Submit review
  const submitReview = async (feedback = "") => {
    if (!selectedFormId || !reviewAction) return { success: false };

    try {
      const status = reviewAction === "approve" ? "approved" : "rejected";
      await reviewForm({
        id: selectedFormId,
        status,
        feedback,
      }).unwrap();

      closeReviewModal();
      closeDetails();
      refetch();

      return { success: true };
    } catch (err) {
      return {
        success: false,
        error: err.data?.message || "Failed to submit review",
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
    forms,
    pagination,
    selectedForm,
    selectedFormData,

    // Loading states
    isLoading,
    isFetching,
    isLoadingDetails,
    isFetchingDetails,
    isSubmitting,

    // Filters
    filters,
    statusOptions,
    updateFilter,

    // Actions
    viewForm,
    closeDetails,
    refetch,

    // Details modal
    detailsModalOpen,
    setDetailsModalOpen,

    // Review modal
    reviewModalOpen,
    reviewAction,
    openReviewModal,
    closeReviewModal,
    submitReview,

    // Pagination
    goToPage,
    nextPage,
    prevPage,
  };
};

export default useReviewEmploymentForm;
