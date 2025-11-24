import { useEffect, useRef, useState } from "react";
import { Html5Qrcode } from "html5-qrcode";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { X, Camera } from "lucide-react";

const QRScanner = ({ onScan, onClose, mode = "in" }) => {
  const html5QrCodeRef = useRef(null);
  const [isScanning, setIsScanning] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const startScanner = async () => {
      try {
        // Create Html5Qrcode instance
        const html5QrCode = new Html5Qrcode("qr-reader");
        html5QrCodeRef.current = html5QrCode;

        // Start scanning
        await html5QrCode.start(
          { facingMode: "environment" },
          {
            fps: 10,
            qrbox: { width: 250, height: 250 },
            aspectRatio: 1.0
          },
          (decodedText) => {
            // Successfully scanned
            console.log("QR Code scanned:", decodedText);

            // Stop scanner before calling onScan
            if (html5QrCodeRef.current) {
              html5QrCodeRef.current
                .stop()
                .then(() => {
                  setIsScanning(false);
                  onScan(decodedText);
                })
                .catch((err) => console.error("Error stopping scanner:", err));
            }
          },
          (errorMessage) => {
            // Scanning error (can be ignored - happens frequently while searching for QR)
            // console.log("Scan error:", errorMessage);
          }
        );

        setIsScanning(true);
        setError(null);
      } catch (err) {
        console.error("Error starting QR scanner:", err);
        const errorMsg = err.message || "Failed to start camera";

        if (errorMsg.includes("Permission")) {
          setError("Camera permission denied. Please allow camera access in your browser settings.");
        } else if (errorMsg.includes("NotFoundError")) {
          setError("No camera found. Please ensure your device has a working camera.");
        } else {
          setError("Failed to start camera. " + errorMsg);
        }
      }
    };

    // Small delay to ensure DOM is ready
    const timeout = setTimeout(() => {
      startScanner();
    }, 100);

    // Cleanup function
    return () => {
      clearTimeout(timeout);

      if (html5QrCodeRef.current) {
        html5QrCodeRef.current
          .stop()
          .then(() => {
            console.log("QR Scanner stopped successfully");
            html5QrCodeRef.current = null;
          })
          .catch((err) => {
            // Ignore errors during cleanup if scanner wasn't running
            console.log("QR Scanner cleanup:", err.message);
          });
      }
    };
  }, [onScan]);

  const handleClose = () => {
    if (html5QrCodeRef.current) {
      html5QrCodeRef.current
        .stop()
        .then(() => {
          onClose();
        })
        .catch((err) => {
          console.error("Error stopping scanner on close:", err);
          onClose(); // Close anyway
        });
    } else {
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md p-6 relative">
        <Button
          variant="ghost"
          size="icon"
          className="absolute top-2 right-2 z-10"
          onClick={handleClose}
        >
          <X className="h-5 w-5" />
        </Button>

        <div className="flex items-center justify-center mb-4">
          <Camera className="h-6 w-6 mr-2 text-blue-600" />
          <h2 className="text-2xl font-bold">
            Scan QR Code to Check-{mode === "in" ? "In" : "Out"}
          </h2>
        </div>

        {error ? (
          <div className="text-center py-8">
            <div className="text-red-500 mb-4">
              <X className="h-12 w-12 mx-auto mb-2" />
              <p className="font-semibold">Camera Error</p>
            </div>
            <p className="text-sm text-gray-600 mb-4">{error}</p>
            <Button onClick={handleClose} variant="outline">
              Close
            </Button>
          </div>
        ) : (
          <>
            <div id="qr-reader" className="w-full mb-4 rounded-lg overflow-hidden"></div>

            {isScanning && (
              <div className="text-center">
                <p className="text-sm text-gray-600 mb-2">
                  Position the QR code within the frame to scan
                </p>
                <div className="flex items-center justify-center gap-2 text-xs text-gray-500">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span>Camera active</span>
                </div>
              </div>
            )}

            {!isScanning && !error && (
              <div className="text-center py-4">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
                <p className="text-sm text-gray-600">Initializing camera...</p>
              </div>
            )}
          </>
        )}
      </Card>
    </div>
  );
};

export default QRScanner;
