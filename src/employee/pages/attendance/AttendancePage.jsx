import { useState, useEffect } from "react";
import { useAttendance } from "../../hooks/useAttendance";
import QRScanner from "../../components/attendance/QRScanner";
import AttendanceCalendar from "../../components/attendance/AttendanceCalendar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Clock,
  LogIn,
  LogOut,
  QrCode,
  Calendar,
  TrendingUp,
  CheckCircle,
  XCircle,
  History,
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { Link } from "react-router-dom";

const AttendancePage = () => {
  const {
    todayAttendance,
    stats,
    isTodayLoading,
    isCheckingIn,
    isCheckingOut,
    handleCheckIn,
    handleCheckOut,
    openQRScannerForCheckIn,
    openQRScannerForCheckOut,
    handleQRScan,
    getAttendanceStatus,
    getHoursWorkedSoFar,
    showQRScanner,
    setShowQRScanner,
    checkInMode,
  } = useAttendance();

  const [currentTime, setCurrentTime] = useState(new Date());
  const [liveHours, setLiveHours] = useState(0);

  // Update current time every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
      if (todayAttendance?.checkIn?.time && !todayAttendance?.checkOut?.time) {
        setLiveHours(getHoursWorkedSoFar());
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [todayAttendance, getHoursWorkedSoFar]);

  const attendanceStatus = getAttendanceStatus();

  // Format time
  const formatTime = (date) => {
    if (!date) return "-";
    return new Date(date).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Format date
  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  if (isTodayLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading attendance...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 ">
      {/* Header */}
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Attendance</h1>
          <p className="text-gray-600 mt-1">{formatDate(currentTime)}</p>
        </div>
        <Link to="/employee/attendance/history">
          <Button variant="outline">
            <History className="mr-2 h-4 w-4" />
            View History
          </Button>
        </Link>
      </div>

      {/* Current Time */}
      <Card className="mb-6 bg-gradient-to-r from-blue-500 to-blue-600 text-white">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100 text-sm">Current Time</p>
              <p className="text-4xl font-bold mt-1">
                {currentTime.toLocaleTimeString("en-US", {
                  hour: "2-digit",
                  minute: "2-digit",
                  second: "2-digit",
                })}
              </p>
            </div>
            <Clock className="h-16 w-16 text-blue-200" />
          </div>
        </CardContent>
      </Card>

      {/* Check-In/Out Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Check-In Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <LogIn className="h-5 w-5" />
              Check-In
            </CardTitle>
          </CardHeader>
          <CardContent>
            {!todayAttendance?.checkIn?.time ? (
              <div className="space-y-4">
                <p className="text-gray-600">You haven't checked in today</p>
                <div className="flex gap-2">
                  <Button
                    onClick={handleCheckIn}
                    disabled={isCheckingIn}
                    className="flex-1"
                    size="lg"
                  >
                    {isCheckingIn ? "Checking In..." : "Check In Manually"}
                  </Button>
                  <Button
                    onClick={openQRScannerForCheckIn}
                    variant="outline"
                    size="lg"
                  >
                    <QrCode className="h-5 w-5" />
                  </Button>
                </div>
              </div>
            ) : (
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-green-600">
                  <CheckCircle className="h-5 w-5" />
                  <span className="font-medium">Checked In</span>
                </div>
                <p className="text-2xl font-bold">
                  {formatTime(todayAttendance.checkIn.time)}
                </p>
                <p className="text-sm text-gray-600">
                  {formatDistanceToNow(new Date(todayAttendance.checkIn.time), {
                    addSuffix: true,
                  })}
                </p>
                {todayAttendance.lateArrival?.isLate && (
                  <div className="bg-yellow-50 border border-yellow-200 rounded-md p-2 mt-2">
                    <p className="text-yellow-800 text-sm">
                      Late by {todayAttendance.lateArrival.minutesLate} minutes
                    </p>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Check-Out Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <LogOut className="h-5 w-5" />
              Check-Out
            </CardTitle>
          </CardHeader>
          <CardContent>
            {!todayAttendance?.checkOut?.time ? (
              <div className="space-y-4">
                {!todayAttendance?.checkIn?.time ? (
                  <p className="text-gray-600">Please check in first</p>
                ) : (
                  <>
                    <p className="text-gray-600">You haven't checked out yet</p>
                    <div className="flex gap-2">
                      <Button
                        onClick={handleCheckOut}
                        disabled={
                          isCheckingOut || !todayAttendance?.checkIn?.time
                        }
                        className="flex-1"
                        size="lg"
                        variant="destructive"
                      >
                        {isCheckingOut
                          ? "Checking Out..."
                          : "Check Out Manually"}
                      </Button>
                      <Button
                        onClick={openQRScannerForCheckOut}
                        disabled={!todayAttendance?.checkIn?.time}
                        variant="outline"
                        size="lg"
                      >
                        <QrCode className="h-5 w-5" />
                      </Button>
                    </div>
                  </>
                )}
              </div>
            ) : (
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-blue-600">
                  <CheckCircle className="h-5 w-5" />
                  <span className="font-medium">Checked Out</span>
                </div>
                <p className="text-2xl font-bold">
                  {formatTime(todayAttendance.checkOut.time)}
                </p>
                <p className="text-sm text-gray-600">
                  {formatDistanceToNow(
                    new Date(todayAttendance.checkOut.time),
                    {
                      addSuffix: true,
                    }
                  )}
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Hours Worked Today */}
      {todayAttendance?.checkIn?.time && (
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Hours Worked Today</p>
                <p className="text-3xl font-bold mt-1">
                  {todayAttendance.checkOut?.time
                    ? `${todayAttendance.hoursWorked || 0} hours`
                    : `${liveHours.toFixed(2)} hours`}
                </p>
                {!todayAttendance.checkOut?.time && (
                  <p className="text-sm text-gray-500 mt-1">Live counter</p>
                )}
              </div>
              <TrendingUp className="h-12 w-12 text-blue-500" />
            </div>
          </CardContent>
        </Card>
      )}

      {/* Monthly Statistics */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Present Days</p>
                  <p className="text-2xl font-bold text-green-600">
                    {stats.presentDays || 0}
                  </p>
                </div>
                <CheckCircle className="h-8 w-8 text-green-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Absent Days</p>
                  <p className="text-2xl font-bold text-red-600">
                    {stats.absentDays || 0}
                  </p>
                </div>
                <XCircle className="h-8 w-8 text-red-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Average Hours</p>
                  <p className="text-2xl font-bold text-blue-600">
                    {stats.averageHours || "0.00"}
                  </p>
                </div>
                <Clock className="h-8 w-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">On-Time %</p>
                  <p className="text-2xl font-bold text-purple-600">
                    {stats.onTimePercentage || "0.00"}%
                  </p>
                </div>
                <Calendar className="h-8 w-8 text-purple-500" />
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Calendar View */}
      <div className="mb-6">
        <AttendanceCalendar />
      </div>

      {/* QR Scanner Modal */}
      {showQRScanner && (
        <QRScanner
          onScan={handleQRScan}
          onClose={() => setShowQRScanner(false)}
          mode={checkInMode}
        />
      )}
    </div>
  );
};

export default AttendancePage;
