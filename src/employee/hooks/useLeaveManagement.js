import { useState, useEffect } from 'react';
import {
  useGetMyLeaveBalanceQuery,
  useGetMyLeaveRequestsQuery,
  useSubmitLeaveRequestMutation,
  useCancelMyLeaveRequestMutation
} from '../apiSlices/leaveApiSlice';
import { toast } from 'sonner';

export const useLeaveManagement = () => {
  // Queries
  const { data: leaveBalance, isLoading: isBalanceLoading, isError: isBalanceError } = useGetMyLeaveBalanceQuery();
  const { data: leaveRequests, isLoading: isRequestsLoading, isError: isRequestsError, refetch } = useGetMyLeaveRequestsQuery({});

  // Mutations
  const [submitLeaveRequest, { isLoading: isSubmitting, isSuccess: isSubmitSuccess, isError: isSubmitError, error: submitError }] = useSubmitLeaveRequestMutation();
  const [cancelLeaveRequest, { isLoading: isCancelling, isSuccess: isCancelSuccess, isError: isCancelError, error: cancelError }] = useCancelMyLeaveRequestMutation();

  // State for form
  const [showLeaveForm, setShowLeaveForm] = useState(false);
  const [formData, setFormData] = useState({
    type: 'casual',
    startDate: '',
    endDate: '',
    reason: '',
    attachments: []
  });
  const [daysCount, setDaysCount] = useState(0);

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Calculate days if date range changes
    if ((name === 'startDate' || name === 'endDate') && formData.startDate && formData.endDate) {
      calculateDays(formData.startDate, formData.endDate);
    }
  };

  // Calculate days between dates
  const calculateDays = (start, end) => {
    if (start && end) {
      const startDate = new Date(start);
      const endDate = new Date(end);
      const timeDiff = endDate.getTime() - startDate.getTime();
      const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24)) + 1; // +1 to include both start and end days
      setDaysCount(Math.max(0, daysDiff));
    } else {
      setDaysCount(0);
    }
  };

  // Handle attachment change
  const handleAttachmentChange = (files) => {
    const fileArray = Array.from(files);
    setFormData(prev => ({
      ...prev,
      attachments: fileArray
    }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate form
    if (!formData.type || !formData.startDate || !formData.endDate || !formData.reason) {
      toast.error('Please fill in all required fields');
      return;
    }

    if (new Date(formData.startDate) > new Date(formData.endDate)) {
      toast.error('Start date must be before end date');
      return;
    }

    // Check if enough leave balance
    if (leaveBalance) {
      const availableBalance = leaveBalance[formData.type]?.remaining || 0;
      if (daysCount > availableBalance && formData.type !== 'emergency') {
        toast.error(`Insufficient ${formData.type} leave balance. Available: ${availableBalance} days`);
        return;
      }
    }

    try {
      const submitData = {
        type: formData.type,
        startDate: formData.startDate,
        endDate: formData.endDate,
        reason: formData.reason,
        attachments: [] // This would be handled by the backend after file upload
      };

      await submitLeaveRequest(submitData).unwrap();
      toast.success('Leave request submitted successfully');
      
      // Reset form
      setFormData({
        type: 'casual',
        startDate: '',
        endDate: '',
        reason: '',
        attachments: []
      });
      setDaysCount(0);
      setShowLeaveForm(false);
      refetch(); // Refresh the data
    } catch (error) {
      toast.error(submitError?.data?.message || 'Failed to submit leave request');
    }
  };

  // Handle cancel request
  const handleCancelRequest = async (requestId) => {
    if (!window.confirm('Are you sure you want to cancel this leave request?')) {
      return;
    }

    try {
      await cancelLeaveRequest(requestId).unwrap();
      toast.success('Leave request cancelled successfully');
      refetch(); // Refresh the data
    } catch (error) {
      toast.error(cancelError?.data?.message || 'Failed to cancel leave request');
    }
  };

  // Toggle form visibility
  const toggleLeaveForm = () => {
    setShowLeaveForm(!showLeaveForm);
  };

  // Reset form
  const resetForm = () => {
    setFormData({
      type: 'casual',
      startDate: '',
      endDate: '',
      reason: '',
      attachments: []
    });
    setDaysCount(0);
    setShowLeaveForm(false);
  };

  // Calculate progress percentages for balance cards
  const getBalanceProgress = () => {
    if (!leaveBalance) return { casual: 0, sick: 0, annual: 0 };
    
    return {
      casual: ((leaveBalance.casual.total - leaveBalance.casual.remaining) / leaveBalance.casual.total) * 100,
      sick: ((leaveBalance.sick.total - leaveBalance.sick.remaining) / leaveBalance.sick.total) * 100,
      annual: ((leaveBalance.annual.total - leaveBalance.annual.remaining) / leaveBalance.annual.total) * 100
    };
  };

  return {
    // Data
    leaveBalance,
    leaveRequests,
    
    // Loading states
    isBalanceLoading,
    isRequestsLoading,
    isSubmitting,
    isCancelling,
    
    // Errors
    isBalanceError,
    isRequestsError,
    isSubmitError,
    isCancelError,
    
    // Form state
    showLeaveForm,
    formData,
    daysCount,
    
    // Functions
    toggleLeaveForm,
    handleInputChange,
    handleAttachmentChange,
    handleSubmit,
    handleCancelRequest,
    resetForm,
    getBalanceProgress,
    
    // Other
    calculateDays
  };
};