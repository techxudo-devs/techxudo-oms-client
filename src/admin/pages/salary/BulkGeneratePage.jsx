import { useState } from "react";
import { useManageSalary } from "../../hooks/useManageSalary";
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
import { Calendar, Zap, AlertCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";

const BulkGeneratePage = () => {
  const navigate = useNavigate();
  const { handleBulkGenerate, isLoading } = useManageSalary();

  const currentDate = new Date();
  const [formData, setFormData] = useState({
    month: currentDate.getMonth() + 1,
    year: currentDate.getFullYear(),
    department: "",
    considerAttendance: true,
    deductionPerAbsentDay: "",
  });

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Prepare payload
    const payload = {
      month: parseInt(formData.month),
      year: parseInt(formData.year),
      department: formData.department || undefined,
      considerAttendance: formData.considerAttendance,
    };

    if (formData.considerAttendance && formData.deductionPerAbsentDay) {
      payload.deductionPerAbsentDay = parseFloat(formData.deductionPerAbsentDay);
    }

    const success = await handleBulkGenerate(payload);
    if (success) {
      setTimeout(() => {
        navigate("/admin/salary/all");
      }, 1500);
    }
  };

  // Generate month options
  const monthOptions = Array.from({ length: 12 }, (_, i) => ({
    value: i + 1,
    label: new Date(2000, i).toLocaleDateString("en-US", { month: "long" }),
  }));

  // Generate year options
  const yearOptions = Array.from({ length: 3 }, (_, i) => ({
    value: currentDate.getFullYear() - i,
    label: (currentDate.getFullYear() - i).toString(),
  }));

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">
          Bulk Generate Salaries
        </h1>
        <p className="text-gray-600 mt-1">
          Automatically generate salary records for all employees
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Configuration */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Generation Configuration
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Month and Year */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="month">Month *</Label>
                <Select
                  value={formData.month.toString()}
                  onValueChange={(value) =>
                    handleChange("month", parseInt(value))
                  }
                >
                  <SelectTrigger id="month">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {monthOptions.map((m) => (
                      <SelectItem key={m.value} value={m.value.toString()}>
                        {m.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="year">Year *</Label>
                <Select
                  value={formData.year.toString()}
                  onValueChange={(value) => handleChange("year", parseInt(value))}
                >
                  <SelectTrigger id="year">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {yearOptions.map((y) => (
                      <SelectItem key={y.value} value={y.value.toString()}>
                        {y.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Department Filter */}
            <div className="space-y-2">
              <Label htmlFor="department">Department (Optional)</Label>
              <Input
                id="department"
                type="text"
                placeholder="Leave empty to generate for all departments"
                value={formData.department}
                onChange={(e) => handleChange("department", e.target.value)}
              />
              <p className="text-sm text-gray-500">
                Specify a department to generate salaries only for that
                department
              </p>
            </div>

            {/* Consider Attendance */}
            <div className="space-y-2">
              <Label htmlFor="considerAttendance">Consider Attendance</Label>
              <Select
                value={formData.considerAttendance.toString()}
                onValueChange={(value) =>
                  handleChange("considerAttendance", value === "true")
                }
              >
                <SelectTrigger id="considerAttendance">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="true">Yes</SelectItem>
                  <SelectItem value="false">No</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-sm text-gray-500">
                Apply deductions based on employee attendance records
              </p>
            </div>

            {/* Deduction Per Absent Day */}
            {formData.considerAttendance && (
              <div className="space-y-2">
                <Label htmlFor="deductionPerAbsentDay">
                  Deduction Per Absent Day (₨)
                </Label>
                <Input
                  id="deductionPerAbsentDay"
                  type="number"
                  min="0"
                  step="0.01"
                  placeholder="Enter deduction amount per absent day"
                  value={formData.deductionPerAbsentDay}
                  onChange={(e) =>
                    handleChange("deductionPerAbsentDay", e.target.value)
                  }
                />
                <p className="text-sm text-gray-500">
                  Leave empty to use the default calculation (daily salary
                  rate)
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Warning */}
        <Card className="border-yellow-200 bg-yellow-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-yellow-800">
              <AlertCircle className="h-5 w-5" />
              Important Information
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="list-disc list-inside space-y-2 text-yellow-800">
              <li>
                This will generate salary records for all active employees
                {formData.department && ` in the ${formData.department} department`}
              </li>
              <li>
                Salaries will be based on each employee's base salary from
                their profile
              </li>
              <li>
                If attendance consideration is enabled, deductions will be
                applied for absent days
              </li>
              <li>
                Existing salary records for the same month/year will be skipped
              </li>
              <li>You can edit individual salary records after generation</li>
            </ul>
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="flex gap-3 justify-end">
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate("/admin/salary/all")}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={isLoading.bulkGenerating}>
            <Zap className="mr-2 h-4 w-4" />
            {isLoading.bulkGenerating
              ? "Generating..."
              : "Generate Salaries"}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default BulkGeneratePage;
