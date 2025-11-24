import { useState } from "react";
import {
  useCheckInMutation,
  useCheckOutMutation,
  useGetMyTodayAttendanceQuery,
  useGetMyStatsQuery,
  useRequestCorrectionMutation,
} from "../apiSlices/attendanceApiSlice";
import { toast } from "sonner";

export const useAttendance = () => {
  // Queries
  const {
    data: todayAttendance,
    isLoading: isTodayLoading,
    refetch: refetchToday,
  } = useGetMyTodayAttendanceQuery();

  // Get stats for current month
  const startOfMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1)
    .toISOString()
    .split("T")[0];
  const endOfMonth = new Date().toISOString().split("T")[0];

  const { data: stats, isLoading: isStatsLoading } = useGetMyStatsQuery({
    startDate: startOfMonth,
    endDate: endOfMonth
  });

  // Mutations
  const [checkIn, { isLoading: isCheckingIn }] = useCheckInMutation();
  const [checkOut, { isLoading: isCheckingOut }] = useCheckOutMutation();
  const [requestCorrection, { isLoading: isRequestingCorrection }] =
    useRequestCorrectionMutation();

  // State
  const [showQRScanner, setShowQRScanner] = useState(false);
  const [showCorrectionForm, setShowCorrectionForm] = useState(false);
  const [checkInMode, setCheckInMode] = useState(null); // 'in' or 'out'

  // Get user's current location
  const getCurrentLocation = () => {
    return new Promise((resolve, reject) => {
      if ("geolocation" in navigator) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            resolve({
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
            });
          },
          (error) => {
            console.error("Geolocation error:", error);
            resolve({}); // Return empty object if location fails
          },
          { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 }
        );
      } else {
        resolve({}); // Geolocation not supported
      }
    });
  };

  // Handle check-in (manual)
  const handleCheckIn = async (notes = "") => {
    try {
      // If notes is an event object (from onClick), ignore it
      const actualNotes = typeof notes === "string" ? notes : "";

      const location = await getCurrentLocation();

      const result = await checkIn({
        method: "manual",
        location,
        notes: actualNotes
      }).unwrap();

      if (result.isLate) {
        toast.warning(
          result.message || `You are ${result.minutesLate} minutes late`
        );
      } else {
        toast.success("Checked in successfully!");
      }

      refetchToday();
    } catch (error) {
      console.error("Check-in error:", error);
      toast.error(error?.data?.message || "Check-in failed. Please try again.");
    }
  };

  // Handle check-out (manual)
  const handleCheckOut = async (notes = "") => {
    try {
      // If notes is an event object (from onClick), ignore it
      const actualNotes = typeof notes === "string" ? notes : "";

      const location = await getCurrentLocation();

      const result = await checkOut({
        method: "manual",
        location,
        notes: actualNotes
      }).unwrap();

      toast.success(
        `Checked out successfully! Hours worked: ${
          result.hoursWorked || 0
        } hours`
      );

      refetchToday();
    } catch (error) {
      console.error("Check-out error:", error);
      toast.error(
        error?.data?.message || "Check-out failed. Please try again."
      );
    }
  };

  // Handle QR check-in
  const handleQRCheckIn = async (qrCode) => {
    try {
      const location = await getCurrentLocation();

      const result = await checkIn({
        method: "qr",
        qrCode,
        location,
      }).unwrap();

      if (result.isLate) {
        toast.warning(
          result.message || `You are ${result.minutesLate} minutes late`
        );
      } else {
        toast.success("Checked in successfully with QR code!");
      }

      setShowQRScanner(false);
      refetchToday();
    } catch (error) {
      console.error("QR check-in error:", error);
      toast.error(
        error?.data?.message || "QR check-in failed. Please try again."
      );
    }
  };

  // Handle QR check-out
  const handleQRCheckOut = async (qrCode) => {
    try {
      const location = await getCurrentLocation();

      const result = await checkOut({
        method: "qr",
        qrCode,
        location,
      }).unwrap();

      toast.success(
        `Checked out successfully! Hours worked: ${
          result.hoursWorked || 0
        } hours`
      );

      setShowQRScanner(false);
      refetchToday();
    } catch (error) {
      console.error("QR check-out error:", error);
      toast.error(
        error?.data?.message || "QR check-out failed. Please try again."
      );
    }
  };

  // Open QR scanner for check-in
  const openQRScannerForCheckIn = () => {
    setCheckInMode("in");
    setShowQRScanner(true);
  };

  // Open QR scanner for check-out
  const openQRScannerForCheckOut = () => {
    setCheckInMode("out");
    setShowQRScanner(true);
  };

  // Handle QR scan result
  const handleQRScan = async (qrCode) => {
    if (checkInMode === "in") {
      await handleQRCheckIn(qrCode);
    } else if (checkInMode === "out") {
      await handleQRCheckOut(qrCode);
    }
  };

  // Submit correction request
  const handleCorrectionRequest = async (data) => {
    try {
      await requestCorrection(data).unwrap();
      toast.success("Correction request submitted successfully");
      setShowCorrectionForm(false);
    } catch (error) {
      console.error("Correction request error:", error);
      toast.error(
        error?.data?.message || "Failed to submit correction request"
      );
    }
  };

  // Get attendance status
  const getAttendanceStatus = () => {
    if (!todayAttendance) return "not-checked-in";
    if (todayAttendance.checkIn && !todayAttendance.checkOut)
      return "checked-in";
    if (todayAttendance.checkOut) return "completed";
    return "not-checked-in";
  };

  // Calculate hours worked so far (for live counter)
  const getHoursWorkedSoFar = () => {
    if (!todayAttendance?.checkIn?.time) return 0;
    if (todayAttendance.checkOut?.time) return todayAttendance.hoursWorked || 0;

    const checkInTime = new Date(todayAttendance.checkIn.time);
    const now = new Date();
    const diffMs = now - checkInTime;
    const hours = diffMs / (1000 * 60 * 60);
    return Math.max(0, Math.round(hours * 100) / 100);
  };

  return {
    // Data
    todayAttendance,
    stats,

    // Loading states
    isTodayLoading,
    isStatsLoading,
    isCheckingIn,
    isCheckingOut,
    isRequestingCorrection,

    // Functions
    handleCheckIn,
    handleCheckOut,
    openQRScannerForCheckIn,
    openQRScannerForCheckOut,
    handleQRScan,
    handleCorrectionRequest,
    getAttendanceStatus,
    getHoursWorkedSoFar,

    // State
    showQRScanner,
    setShowQRScanner,
    showCorrectionForm,
    setShowCorrectionForm,
    checkInMode,
  };
};
