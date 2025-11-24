import { useState, useEffect, useRef } from "react";
import { useGenerateQRCodeQuery } from "../../apiSlices/manageAttendanceApiSlice";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RefreshCw, Download } from "lucide-react";
import QRCode from "qrcode";

const QRCodePage = () => {
  const [qrDataUrl, setQrDataUrl] = useState("");
  const [countdown, setCountdown] = useState(0);
  const canvasRef = useRef(null);

  const { data: qrData, isLoading, refetch } = useGenerateQRCodeQuery();

  // Generate QR code canvas when data changes
  useEffect(() => {
    if (qrData?.qrData) {
      generateQRCode(qrData.qrData);

      // Calculate countdown
      if (qrData.expiresAt) {
        const expiryTime = new Date(qrData.expiresAt).getTime();
        const updateCountdown = () => {
          const now = Date.now();
          const remaining = Math.max(0, Math.floor((expiryTime - now) / 1000));
          setCountdown(remaining);

          if (remaining === 0) {
            // Auto-refresh when expired
            refetch();
          }
        };

        updateCountdown();
        const interval = setInterval(updateCountdown, 1000);

        return () => clearInterval(interval);
      }
    }
  }, [qrData, refetch]);

  const generateQRCode = async (data) => {
    try {
      const url = await QRCode.toDataURL(data, {
        width: 300,
        margin: 2,
        color: {
          dark: "#000000",
          light: "#FFFFFF",
        },
      });
      setQrDataUrl(url);
    } catch (error) {
      console.error("Error generating QR code:", error);
    }
  };

  const handleRefresh = () => {
    refetch();
  };

  const handleDownload = () => {
    if (qrDataUrl) {
      const link = document.createElement("a");
      link.href = qrDataUrl;
      link.download = `attendance-qr-${Date.now()}.png`;
      link.click();
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">
          QR Code for Attendance
        </h1>
        <p className="text-gray-600 mt-1">
          Display this QR code for employees to check-in/out
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* QR Code Display */}
        <Card>
          <CardHeader>
            <CardTitle>Scan to Check-In/Out</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-center">
            {isLoading ? (
              <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
              </div>
            ) : qrDataUrl ? (
              <div className="space-y-4">
                <div className="bg-white p-4 rounded-lg border-4 border-blue-500">
                  <img
                    src={qrDataUrl}
                    alt="Attendance QR Code"
                    className="w-full max-w-sm"
                  />
                </div>

                {/* Countdown */}
                <div className="text-center">
                  <p className="text-sm text-gray-600">Time Remaining</p>
                  <p className="text-3xl font-bold text-blue-600">
                    {formatTime(countdown)}
                  </p>
                  {countdown <= 30 && countdown > 0 && (
                    <p className="text-sm text-red-600 mt-1">
                      QR code will expire soon!
                    </p>
                  )}
                  {countdown === 0 && (
                    <p className="text-sm text-red-600 mt-1">QR code expired</p>
                  )}
                </div>

                {/* Actions */}
                <div className="flex gap-2 justify-center">
                  <Button onClick={handleRefresh} variant="outline">
                    <RefreshCw className="mr-2 h-4 w-4" />
                    Refresh QR
                  </Button>
                  <Button onClick={handleDownload}>
                    <Download className="mr-2 h-4 w-4" />
                    Download
                  </Button>
                </div>
              </div>
            ) : (
              <div className="text-center">
                <p className="text-gray-600">Failed to generate QR code</p>
                <Button onClick={handleRefresh} className="mt-4">
                  Retry
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Instructions */}
        <Card>
          <CardHeader>
            <CardTitle>How to Use</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="font-semibold mb-2">For Employees:</h3>
              <ol className="list-decimal list-inside space-y-2 text-gray-700">
                <li>Open the Attendance page on your device</li>
                <li>
                  Click the "Scan QR" button next to Check-In or Check-Out
                </li>
                <li>Point your camera at this QR code</li>
                <li>Wait for automatic check-in/out confirmation</li>
              </ol>
            </div>

            <div className="border-t pt-4">
              <h3 className="font-semibold mb-2">For Admins:</h3>
              <ul className="list-disc list-inside space-y-2 text-gray-700">
                <li>Display this QR code at the office entrance</li>
                <li>
                  QR code refreshes automatically every{" "}
                  {qrData?.expiryMinutes || 5} minutes
                </li>
                <li>Monitor attendance in real-time on the dashboard</li>
                <li>Download the QR code for printing if needed</li>
              </ul>
            </div>

            <div className="border-t pt-4">
              <h3 className="font-semibold mb-2">Security Features:</h3>
              <ul className="list-disc list-inside space-y-2 text-gray-700">
                <li>Time-based expiry prevents unauthorized use</li>
                <li>IP address tracking for audit trail</li>
                <li>Geolocation validation (if enabled)</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default QRCodePage;
