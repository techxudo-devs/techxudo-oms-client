import { useState, useEffect } from "react";
import {
  useGetSettingsQuery,
  useUpdateSettingsMutation,
} from "../../apiSlices/manageAttendanceApiSlice";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Settings, Save, Clock, MapPin, Calendar } from "lucide-react";
import { toast } from "sonner";

const SettingsPage = () => {
  const { data: settings, isLoading: isLoadingSettings } =
    useGetSettingsQuery();
  const [updateSettings, { isLoading: isUpdating }] =
    useUpdateSettingsMutation();

  const [formData, setFormData] = useState({
    officeStartTime: "09:00",
    officeEndTime: "18:00",
    lateThresholdMinutes: 15,
    earlyLeaveThresholdMinutes: 15,
    minimumHours: 8,
    enableGeolocation: false,
    enableQRCode: true,
    enableManualCheckIn: true,
    autoCheckOutEnabled: false,
    autoCheckOutTime: "19:00",
    weekendDays: [0, 6], // Sunday and Saturday
    qrCodeExpiryMinutes: 5,
  });

  useEffect(() => {
    if (settings) {
      setFormData({
        officeStartTime: settings.officeStartTime || "09:00",
        officeEndTime: settings.officeEndTime || "18:00",
        lateThresholdMinutes: settings.lateThresholdMinutes || 15,
        earlyLeaveThresholdMinutes: settings.earlyLeaveThresholdMinutes || 15,
        minimumHours: settings.minimumHours || 8,
        enableGeolocation: settings.enableGeolocation || false,
        enableQRCode: settings.enableQRCode !== false,
        enableManualCheckIn: settings.enableManualCheckIn !== false,
        autoCheckOutEnabled: settings.autoCheckOutEnabled || false,
        autoCheckOutTime: settings.autoCheckOutTime || "19:00",
        weekendDays: settings.weekendDays || [0, 6],
        qrCodeExpiryMinutes: settings.qrCodeExpiryMinutes || 5,
      });
    }
  }, [settings]);

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await updateSettings(formData).unwrap();
      toast.success("Settings updated successfully");
    } catch (error) {
      console.error("Settings update error:", error);
      toast.error(error?.data?.message || "Failed to update settings");
    }
  };

  const toggleWeekendDay = (day) => {
    setFormData((prev) => ({
      ...prev,
      weekendDays: prev.weekendDays.includes(day)
        ? prev.weekendDays.filter((d) => d !== day)
        : [...prev.weekendDays, day],
    }));
  };

  const weekDays = [
    { label: "Sunday", value: 0 },
    { label: "Monday", value: 1 },
    { label: "Tuesday", value: 2 },
    { label: "Wednesday", value: 3 },
    { label: "Thursday", value: 4 },
    { label: "Friday", value: 5 },
    { label: "Saturday", value: 6 },
  ];

  if (isLoadingSettings) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading settings...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 max-w-5xl">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">
          Attendance Settings
        </h1>
        <p className="text-gray-600 mt-1">
          Configure attendance policies and preferences
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Office Hours */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Office Hours
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="officeStartTime">Office Start Time</Label>
                <Input
                  id="officeStartTime"
                  type="time"
                  value={formData.officeStartTime}
                  onChange={(e) =>
                    handleChange("officeStartTime", e.target.value)
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="officeEndTime">Office End Time</Label>
                <Input
                  id="officeEndTime"
                  type="time"
                  value={formData.officeEndTime}
                  onChange={(e) =>
                    handleChange("officeEndTime", e.target.value)
                  }
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="minimumHours">
                Minimum Hours Required (per day)
              </Label>
              <Input
                id="minimumHours"
                type="number"
                min="0"
                max="24"
                step="0.5"
                value={formData.minimumHours}
                onChange={(e) =>
                  handleChange("minimumHours", parseFloat(e.target.value))
                }
              />
            </div>
          </CardContent>
        </Card>

        {/* Late Arrival & Early Leave */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Late Arrival & Early Leave
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="lateThresholdMinutes">
                  Late Threshold (minutes after start time)
                </Label>
                <Input
                  id="lateThresholdMinutes"
                  type="number"
                  min="0"
                  value={formData.lateThresholdMinutes}
                  onChange={(e) =>
                    handleChange(
                      "lateThresholdMinutes",
                      parseInt(e.target.value)
                    )
                  }
                />
                <p className="text-sm text-gray-500">
                  Grace period before marking as late
                </p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="earlyLeaveThresholdMinutes">
                  Early Leave Threshold (minutes before end time)
                </Label>
                <Input
                  id="earlyLeaveThresholdMinutes"
                  type="number"
                  min="0"
                  value={formData.earlyLeaveThresholdMinutes}
                  onChange={(e) =>
                    handleChange(
                      "earlyLeaveThresholdMinutes",
                      parseInt(e.target.value)
                    )
                  }
                />
                <p className="text-sm text-gray-500">
                  Grace period before marking as early leave
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Check-In Methods */}
        <Card>
          <CardHeader>
            <CardTitle>Check-In Methods</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="enableManualCheckIn">Manual Check-In</Label>
                <p className="text-sm text-gray-500">
                  Allow employees to check-in manually without QR code
                </p>
              </div>
              <Switch
                id="enableManualCheckIn"
                checked={formData.enableManualCheckIn}
                onCheckedChange={(checked) =>
                  handleChange("enableManualCheckIn", checked)
                }
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="enableQRCode">QR Code Check-In</Label>
                <p className="text-sm text-gray-500">
                  Allow employees to check-in using QR code
                </p>
              </div>
              <Switch
                id="enableQRCode"
                checked={formData.enableQRCode}
                onCheckedChange={(checked) =>
                  handleChange("enableQRCode", checked)
                }
              />
            </div>

            {formData.enableQRCode && (
              <div className="space-y-2 pl-4 border-l-2 border-blue-200">
                <Label htmlFor="qrCodeExpiryMinutes">
                  QR Code Expiry (minutes)
                </Label>
                <Input
                  id="qrCodeExpiryMinutes"
                  type="number"
                  min="1"
                  max="60"
                  value={formData.qrCodeExpiryMinutes}
                  onChange={(e) =>
                    handleChange(
                      "qrCodeExpiryMinutes",
                      parseInt(e.target.value)
                    )
                  }
                />
                <p className="text-sm text-gray-500">
                  How often QR codes should refresh for security
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Location & Security */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5" />
              Location & Security
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="enableGeolocation">Enable Geolocation</Label>
                <p className="text-sm text-gray-500">
                  Capture employee location when checking in/out
                </p>
              </div>
              <Switch
                id="enableGeolocation"
                checked={formData.enableGeolocation}
                onCheckedChange={(checked) =>
                  handleChange("enableGeolocation", checked)
                }
              />
            </div>
          </CardContent>
        </Card>

        {/* Auto Check-Out */}
        <Card>
          <CardHeader>
            <CardTitle>Auto Check-Out</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="autoCheckOutEnabled">
                  Enable Auto Check-Out
                </Label>
                <p className="text-sm text-gray-500">
                  Automatically check out employees at a specific time
                </p>
              </div>
              <Switch
                id="autoCheckOutEnabled"
                checked={formData.autoCheckOutEnabled}
                onCheckedChange={(checked) =>
                  handleChange("autoCheckOutEnabled", checked)
                }
              />
            </div>

            {formData.autoCheckOutEnabled && (
              <div className="space-y-2 pl-4 border-l-2 border-blue-200">
                <Label htmlFor="autoCheckOutTime">Auto Check-Out Time</Label>
                <Input
                  id="autoCheckOutTime"
                  type="time"
                  value={formData.autoCheckOutTime}
                  onChange={(e) =>
                    handleChange("autoCheckOutTime", e.target.value)
                  }
                />
                <p className="text-sm text-gray-500">
                  Time to automatically check out employees who forgot
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Weekend Configuration */}
        <Card>
          <CardHeader>
            <CardTitle>Weekend Days</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Label>Select Weekend Days</Label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {weekDays.map((day) => (
                  <div
                    key={day.value}
                    className={`
                      flex items-center justify-center p-3 rounded-lg border-2 cursor-pointer transition-colors
                      ${
                        formData.weekendDays.includes(day.value)
                          ? "border-blue-500 bg-blue-50 text-blue-700"
                          : "border-gray-200 hover:border-gray-300"
                      }
                    `}
                    onClick={() => toggleWeekendDay(day.value)}
                  >
                    <span className="font-medium">{day.label}</span>
                  </div>
                ))}
              </div>
              <p className="text-sm text-gray-500 mt-2">
                Selected days will be marked as weekends in attendance records
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="flex justify-end gap-3">
          <Button type="submit" disabled={isUpdating} size="lg">
            <Save className="mr-2 h-4 w-4" />
            {isUpdating ? "Saving..." : "Save Settings"}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default SettingsPage;
