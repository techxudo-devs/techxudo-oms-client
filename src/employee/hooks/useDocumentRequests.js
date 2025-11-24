import { useState, useEffect } from 'react';
import {
  useGetMyDocumentRequestsQuery,
  useSubmitDocumentRequestMutation,
  useCancelMyDocumentRequestMutation,
} from '../apiSlices/documentRequestApiSlice';
import { toast } from 'sonner';

export const useDocumentRequests = () => {
  // Queries
  const {
    data: documentRequests,
    isLoading: isRequestsLoading,
    isError: isRequestsError,
    refetch
  } = useGetMyDocumentRequestsQuery({});

  // Mutations
  const [
    submitDocumentRequest,
    {
      isLoading: isSubmitting,
      isSuccess: isSubmitSuccess,
      isError: isSubmitError,
      error: submitError
    }
  ] = useSubmitDocumentRequestMutation();

  const [
    cancelDocumentRequest,
    {
      isLoading: isCancelling,
      isSuccess: isCancelSuccess,
      isError: isCancelError,
      error: cancelError
    }
  ] = useCancelMyDocumentRequestMutation();

  // State for form
  const [showRequestForm, setShowRequestForm] = useState(false);
  const [formData, setFormData] = useState({
    type: 'recommendation',
    customType: '',
    reason: ''
  });

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate form
    if (!formData.type || !formData.reason) {
      toast.error('Please fill in all required fields');
      return;
    }

    // Validate custom type for certificate
    if (formData.type === 'certificate' && !formData.customType) {
      toast.error('Please specify the certificate type');
      return;
    }

    try {
      const requestData = {
        type: formData.type,
        reason: formData.reason,
      };

      // Only add customType if it's a certificate
      if (formData.type === 'certificate') {
        requestData.customType = formData.customType;
      }

      await submitDocumentRequest(requestData).unwrap();
      toast.success('Document request submitted successfully');
      setShowRequestForm(false);
      resetForm();
      refetch();
    } catch (error) {
      toast.error(error?.data?.message || 'Failed to submit document request');
    }
  };

  // Handle cancel request
  const handleCancelRequest = async (requestId) => {
    if (!window.confirm('Are you sure you want to cancel this request?')) {
      return;
    }

    try {
      await cancelDocumentRequest(requestId).unwrap();
      toast.success('Document request cancelled successfully');
      refetch();
    } catch (error) {
      toast.error(error?.data?.message || 'Failed to cancel request');
    }
  };

  // Reset form
  const resetForm = () => {
    setFormData({
      type: 'recommendation',
      customType: '',
      reason: ''
    });
  };

  // Handle download
  const handleDownload = (documentUrl) => {
    if (documentUrl) {
      window.open(documentUrl, '_blank');
    } else {
      toast.error('Document is not yet available');
    }
  };

  // Get requests by status
  const getPendingRequests = () => {
    return documentRequests?.filter(req => req.status === 'pending') || [];
  };

  const getGeneratedRequests = () => {
    return documentRequests?.filter(req =>
      req.status === 'generated' || req.status === 'downloaded'
    ) || [];
  };

  const getRejectedRequests = () => {
    return documentRequests?.filter(req => req.status === 'rejected') || [];
  };

  // Get request counts
  const getPendingCount = () => getPendingRequests().length;
  const getGeneratedCount = () => getGeneratedRequests().length;

  // Handle success/error effects
  useEffect(() => {
    if (isSubmitSuccess) {
      refetch();
    }
  }, [isSubmitSuccess, refetch]);

  useEffect(() => {
    if (isCancelSuccess) {
      refetch();
    }
  }, [isCancelSuccess, refetch]);

  return {
    // Data
    documentRequests: documentRequests || [],

    // Loading states
    isLoading: {
      requests: isRequestsLoading,
      submitting: isSubmitting,
      cancelling: isCancelling,
    },

    // Error states
    isError: {
      requests: isRequestsError,
      submit: isSubmitError,
      cancel: isCancelError,
    },

    // Form state
    showRequestForm,
    setShowRequestForm,
    formData,
    setFormData,

    // Handlers
    handleInputChange,
    handleSubmit,
    handleCancelRequest,
    handleDownload,
    resetForm,

    // Utilities
    getPendingRequests,
    getGeneratedRequests,
    getRejectedRequests,
    getPendingCount,
    getGeneratedCount,
    refetch,
  };
};
