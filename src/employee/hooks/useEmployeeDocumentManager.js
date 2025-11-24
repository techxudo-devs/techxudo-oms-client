import { useState } from "react";
import {
  useGetEmployeeDocumentsQuery,
  useGetPendingDocumentsQuery,
  useGetEmployeeDocumentByIdQuery,
  useSignDocumentMutation,
  useDeclineDocumentMutation,
} from "../apiSlices/documentApiSlice";

export const useEmployeeDocumentManager = () => {
  const [filters, setFilters] = useState({ status: null });
  const [selectedDocument, setSelectedDocument] = useState(null);
  const [isDocumentDetailOpen, setIsDocumentDetailOpen] = useState(false);

  // Get all employee documents
  const {
    data: documents = [],
    isLoading: isDocumentsLoading,
    refetch: refetchDocuments,
  } = useGetEmployeeDocumentsQuery(filters, {
    skip: false, // Don't skip the query - allow fetching without status filter
  });

  // Get pending documents specifically
  const {
    data: pendingDocuments = [],
    isLoading: isPendingLoading,
    refetch: refetchPending,
  } = useGetPendingDocumentsQuery();

  // Get document by ID
  const {
    data: documentDetail,
    isLoading: isDocumentDetailLoading,
    refetch: refetchDocumentDetail,
  } = useGetEmployeeDocumentByIdQuery(selectedDocument?._id || "", {
    skip: !selectedDocument,
  });

  // Document mutations
  const [signDocument, { isLoading: isSigning }] = useSignDocumentMutation();
  const [declineDocument, { isLoading: isDeclining }] =
    useDeclineDocumentMutation();

  // Handle document selection
  const handleSelectDocument = (document) => {
    setSelectedDocument(document);
    setIsDocumentDetailOpen(true);
  };

  // Handle document signing
  const handleSignDocument = async (signData) => {
    try {
      await signDocument(signData).unwrap();
      refetchDocuments();
      if (documentDetail) {
        refetchDocumentDetail();
      }
      setIsDocumentDetailOpen(false);
      setSelectedDocument(null);
    } catch (error) {
      console.error("Error signing document:", error);
      throw error;
    }
  };

  // Handle document declining
  const handleDeclineDocument = async (declineData) => {
    try {
      await declineDocument(declineData).unwrap();
      refetchDocuments();
      if (documentDetail) {
        refetchDocumentDetail();
      }
      setIsDocumentDetailOpen(false);
      setSelectedDocument(null);
    } catch (error) {
      console.error("Error declining document:", error);
      throw error;
    }
  };

  // Open document detail
  const openDocumentDetail = (document) => {
    setSelectedDocument(document);
    setIsDocumentDetailOpen(true);
  };

  // Close document detail
  const closeDocumentDetail = () => {
    setIsDocumentDetailOpen(false);
    setSelectedDocument(null);
  };

  // Refresh data
  const refreshData = () => {
    refetchDocuments();
    refetchPending();
  };
  console.log(pendingDocuments);

  return {
    // Data
    documents,
    pendingDocuments,
    selectedDocument: documentDetail || selectedDocument,

    // Loading states
    isDocumentsLoading: isDocumentsLoading || isPendingLoading,
    isDocumentDetailLoading,
    isSigning,
    isDeclining,

    // Filters
    filters,
    setFilters,

    // Document detail
    isDocumentDetailOpen,
    openDocumentDetail,
    closeDocumentDetail,

    // Actions
    handleSignDocument,
    handleDeclineDocument,
    refreshData,
  };
};
