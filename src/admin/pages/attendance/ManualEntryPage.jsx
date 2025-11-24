import { useState } from "react";
import { useManualAttendanceEntryMutation } from "../../apiSlices/manageAttendanceApiSlice";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Calendar, Clock, Save, User } from "lucide-react";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

const ManualEntryPage = () => {
  const navigate = useNavigate();
  const [manualEntry, { isLoading }] = useManualAttendanceEntryMutation();

  const [formData, setFormData] = useState({
    userId: "",
    date: new Date().toISOString().split("T")[0],
    checkInTime: "",
    checkOutTime: "",
    status: "present",
    notes: "",
  });

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
    if (!formData.userId) {
      toast.error("Please enter employee ID or email");
      return;
    }

    if (!formData.date) {
      toast.error("Please select a date");
      return;
    }

    try {
      const payload = {
        userId: formData.userId,
        date: formData.date,
        status: formData.status,
        notes: formData.notes,
      };

      // Add times if provided
      if (formData.checkInTime) {
        payload.checkInTime = `${formData.date}T${formData.checkInTime}:00`;
      }

      if (formData.checkOutTime) {
        payload.checkOutTime = `${formData.date}T${formData.checkOutTime}:00`;
      }

      await manualEntry(payload).unwrap();
      toast.success("Attendance entry created successfully");

      // Reset form
      setFormData({
        userId: "",
        date: new Date().toISOString().split("T")[0],
        checkInTime: "",
        checkOutTime: "",
        status: "present",
        notes: "",
      });

      // Navigate back after 1 second
      setTimeout(() => {
        navigate("/admin/attendance/all");
      }, 1000);
    } catch (error) {
      console.error("Manual entry error:", error);
      toast.error(error?.data?.message || "Failed to create attendance entry");
    }
  };

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">
          Manual Attendance Entry
        </h1>
        <p className="text-gray-600 mt-1">
          Create or update attendance records manually
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Attendance Details
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Employee ID/Email */}
            <div className="space-y-2">
              <Label htmlFor="userId">Employee ID or Email *</Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  id="userId"
                  type="text"
                  placeholder="Enter employee ID or email"
                  value={formData.userId}
                  onChange={(e) => handleChange("userId", e.target.value)}
                  className="pl-10"
                  required
                />
              </div>
              <p className="text-sm text-gray-500">
                Enter the employee's ID or email address
              </p>
            </div>

            {/* Date */}
            <div className="space-y-2">
              <Label htmlFor="date">Date *</Label>
              <Input
                id="date"
                type="date"
                value={formData.date}
                onChange={(e) => handleChange("date", e.target.value)}
                required
              />
            </div>

            {/* Check-In Time */}
            <div className="space-y-2">
              <Label htmlFor="checkInTime">Check-In Time</Label>
              <div className="relative">
                <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  id="checkInTime"
                  type="time"
                  value={formData.checkInTime}
                  onChange={(e) => handleChange("checkInTime", e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            {/* Check-Out Time */}
            <div className="space-y-2">
              <Label htmlFor="checkOutTime">Check-Out Time</Label>
              <div className="relative">
                <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  id="checkOutTime"
                  type="time"
                  value={formData.checkOutTime}
                  onChange={(e) => handleChange("checkOutTime", e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            {/* Status */}
            <div className="space-y-2">
              <Label htmlFor="status">Status *</Label>
              <Select
                value={formData.status}
                onValueChange={(value) => handleChange("status", value)}
              >
                <SelectTrigger id="status">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="present">Present</SelectItem>
                  <SelectItem value="absent">Absent</SelectItem>
                  <SelectItem value="late">Late</SelectItem>
                  <SelectItem value="half-day">Half Day</SelectItem>
                  <SelectItem value="on-leave">On Leave</SelectItem>
                  <SelectItem value="weekend">Weekend</SelectItem>
                  <SelectItem value="holiday">Holiday</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Notes */}
            <div className="space-y-2">
              <Label htmlFor="notes">Notes (Optional)</Label>
              <Textarea
                id="notes"
                placeholder="Add any additional notes or comments..."
                value={formData.notes}
                onChange={(e) => handleChange("notes", e.target.value)}
                rows={4}
              />
            </div>

            {/* Actions */}
            <div className="flex gap-3 justify-end pt-4 border-t">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate("/admin/attendance/all")}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading}>
                <Save className="mr-2 h-4 w-4" />
                {isLoading ? "Saving..." : "Save Entry"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Info Card */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Important Notes</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="list-disc list-inside space-y-2 text-gray-700">
            <li>Fields marked with * are required</li>
            <li>
              If only status is provided, the system will create a record
              without time entries
            </li>
            <li>
              Check-in and check-out times are optional for certain statuses
              (absent, on-leave, etc.)
            </li>
            <li>
              Hours worked will be calculated automatically if both check-in and
              check-out times are provided
            </li>
            <li>
              Late arrival will be calculated based on office start time if
              check-in time is after office hours
            </li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
};

export default ManualEntryPage;
