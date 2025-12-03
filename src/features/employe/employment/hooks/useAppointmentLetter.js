import { useState } from "react";
import {
  useGetAppointmentByTokenQuery,
  useRespondToAppointmentMutation,
} from "../api/employmentApiSlice";

/**
 * useAppointmentLetter Hook
 * Business logic for viewing and responding to appointment letters
 * Separates business logic from UI components
 *
 * @param {string} token - Appointment token from URL
 * @returns {object} - State and handlers for appointment letter
 */
const useAppointmentLetter = (token) => {
  const [responseStatus, setResponseStatus] = useState(null); // 'accepted' | 'rejected' | null
  const [error, setError] = useState(null);

  // RTK Query - Fetch appointment data
  const {
    data: appointmentData,
    isLoading,
    error: fetchError,
    refetch,
  } = useGetAppointmentByTokenQuery(token, {
    skip: !token,
  });

  // RTK Query - Respond to appointment mutation
  const [respondToAppointment, { isLoading: isSubmitting }] =
    useRespondToAppointmentMutation();

  /**
   * Handle Accept/Reject Response
   * @param {string} action - 'accept' or 'reject'
   */
  const handleResponse = async (action) => {
    setError(null);

    try {
      const response = await respondToAppointment({
        token,
        action,
      }).unwrap();

      setResponseStatus(action === "accept" ? "accepted" : "rejected");

      return { success: true, data: response };
    } catch (err) {
      const errorMessage =
        err?.data?.message ||
        err?.message ||
        "Failed to submit response. Please try again.";
      setError(errorMessage);

      return { success: false, error: errorMessage };
    }
  };

  /**
   * Check if appointment can be responded to
   */
  const canRespond =
    appointmentData?.data?.status === "sent" ||
    appointmentData?.data?.status === "viewed";

  /**
   * Get formatted appointment details
   */
  const getAppointmentDetails = () => {
    if (!appointmentData?.data) return null;

    const { letterContent, employeeName, status, sentAt } =
      appointmentData.data;

    return {
      employeeName,
      status,
      sentAt,
      subject: letterContent?.subject,
      body: letterContent?.body,
      position: letterContent?.position,
      department: letterContent?.department,
      joiningDate: letterContent?.joiningDate,
      salary: letterContent?.salary,
      benefits: letterContent?.benefits || [],
    };
  };

  return {
    // Data
    appointment: getAppointmentDetails(),
    isLoading,
    isSubmitting,
    responseStatus,
    error: error || fetchError?.data?.message,

    // State checks
    canRespond,
    hasResponded: responseStatus !== null,

    // Actions
    handleAccept: () => handleResponse("accept"),
    handleReject: () => handleResponse("reject"),
    refetch,
  };
};

export default useAppointmentLetter;
