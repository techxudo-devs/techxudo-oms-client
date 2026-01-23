import { Clock } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

const WorkingHoursStep = ({ formData, updateNestedField, errors }) => {
  const weekDays = [
    { value: "monday", label: "Monday" },
    { value: "tuesday", label: "Tuesday" },
    { value: "wednesday", label: "Wednesday" },
    { value: "thursday", label: "Thursday" },
    { value: "friday", label: "Friday" },
    { value: "saturday", label: "Saturday" },
    { value: "sunday", label: "Sunday" },
  ];

  const timezones = [
    { value: "UTC", label: "UTC (Coordinated Universal Time)" },
    { value: "America/New_York", label: "Eastern Time (ET)" },
    { value: "America/Chicago", label: "Central Time (CT)" },
    { value: "America/Denver", label: "Mountain Time (MT)" },
    { value: "America/Los_Angeles", label: "Pacific Time (PT)" },
    { value: "Europe/London", label: "London (GMT/BST)" },
    { value: "Europe/Paris", label: "Central European Time (CET)" },
    { value: "Asia/Dubai", label: "Dubai (GST)" },
    { value: "Asia/Kolkata", label: "India (IST)" },
    { value: "Asia/Shanghai", label: "China (CST)" },
    { value: "Asia/Tokyo", label: "Japan (JST)" },
    { value: "Australia/Sydney", label: "Sydney (AEDT/AEST)" },
  ];

  // Toggle working day
  const toggleWorkingDay = (day) => {
    const currentDays = formData.workingHours.workingDays;
    const isSelected = currentDays.includes(day);

    let newDays;
    if (isSelected) {
      newDays = currentDays.filter((d) => d !== day);
    } else {
      newDays = [...currentDays, day];
    }

    updateNestedField("workingHours", "workingDays", newDays);
  };

  return (
    <div className="container mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Set your working hours
        </h2>
        <p className="text-gray-600">
          Define your company's standard working schedule. This will be used for
          attendance tracking and leave calculations.
        </p>
      </div>

      <div className="space-y-8">
        {/* Timezone */}
        <div>
          <Label
            htmlFor="timezone"
            className="text-sm font-medium text-gray-900 mb-2 block"
          >
            Timezone <span className="text-red-500">*</span>
          </Label>
          <select
            id="timezone"
            value={formData.workingHours.timezone}
            onChange={(e) =>
              updateNestedField("workingHours", "timezone", e.target.value)
            }
            className={`
              w-full h-11 px-3 rounded-lg border border-gray-300
              focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent
              bg-white text-sm
              ${errors.timezone ? "border-red-500 focus:ring-red-500" : ""}
            `}
          >
            {timezones.map((tz) => (
              <option key={tz.value} value={tz.value}>
                {tz.label}
              </option>
            ))}
          </select>
          {errors.timezone && (
            <p className="text-sm text-red-600 mt-1">{errors.timezone}</p>
          )}
        </div>

        {/* Working Hours */}
        <div>
          <Label className="text-sm font-medium text-gray-900 mb-3 block">
            Working Hours <span className="text-red-500">*</span>
          </Label>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Start Time */}
            <div>
              <Label
                htmlFor="startTime"
                className="text-sm text-gray-600 mb-2 block"
              >
                Start Time
              </Label>
              <Input
                id="startTime"
                type="time"
                value={formData.workingHours.startTime}
                onChange={(e) =>
                  updateNestedField("workingHours", "startTime", e.target.value)
                }
                className={`h-11 ${errors.startTime ? "border-red-500" : ""}`}
              />
              {errors.startTime && (
                <p className="text-sm text-red-600 mt-1">{errors.startTime}</p>
              )}
            </div>

            {/* End Time */}
            <div>
              <Label
                htmlFor="endTime"
                className="text-sm text-gray-600 mb-2 block"
              >
                End Time
              </Label>
              <Input
                id="endTime"
                type="time"
                value={formData.workingHours.endTime}
                onChange={(e) =>
                  updateNestedField("workingHours", "endTime", e.target.value)
                }
                className={`h-11 ${errors.endTime ? "border-red-500" : ""}`}
              />
              {errors.endTime && (
                <p className="text-sm text-red-600 mt-1">{errors.endTime}</p>
              )}
            </div>
          </div>

          {/* Working Hours Preview */}
          <div className="mt-3 p-3 rounded-lg bg-gray-50 border border-gray-200">
            <p className="text-sm text-gray-600">
              <span className="font-medium">Daily working hours:</span>{" "}
              {formData.workingHours.startTime} -{" "}
              {formData.workingHours.endTime}
              {(() => {
                const start = formData.workingHours.startTime.split(":");
                const end = formData.workingHours.endTime.split(":");
                const startMinutes =
                  parseInt(start[0]) * 60 + parseInt(start[1]);
                const endMinutes = parseInt(end[0]) * 60 + parseInt(end[1]);
                const totalHours = ((endMinutes - startMinutes) / 60).toFixed(
                  1,
                );
                return totalHours > 0 ? ` (${totalHours} hours)` : "";
              })()}
            </p>
          </div>
        </div>

        {/* Working Days */}
        <div>
          <Label className="text-sm font-medium text-gray-900 mb-3 block">
            Working Days <span className="text-red-500">*</span>
          </Label>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {weekDays.map((day) => {
              const isSelected = formData.workingHours.workingDays.includes(
                day.value,
              );

              return (
                <button
                  key={day.value}
                  onClick={() => toggleWorkingDay(day.value)}
                  className={`
                    p-4 rounded-lg border-2 transition-all
                    ${
                      isSelected
                        ? "border-gray-900 bg-gray-900 text-white"
                        : "border-gray-200 bg-white text-gray-700 hover:border-gray-300"
                    }
                  `}
                >
                  <span className="text-xs font-semibold uppercase">
                    {day.label.substring(0, 3)}
                  </span>
                  <p className="text-xs mt-1 opacity-75">{day.label}</p>
                </button>
              );
            })}
          </div>

          {errors.workingDays && (
            <p className="text-sm text-red-600 mt-2">{errors.workingDays}</p>
          )}

          {/* Selected Days Preview */}
          {formData.workingHours.workingDays.length > 0 && (
            <div className="mt-3 p-3 rounded-lg bg-gray-50 border border-gray-200">
              <p className="text-sm text-gray-600">
                <span className="font-medium">Selected days:</span>{" "}
                {formData.workingHours.workingDays
                  .map((day) => weekDays.find((d) => d.value === day)?.label)
                  .join(", ")}
              </p>
            </div>
          )}
        </div>

        {/* Helper Info */}
        <div className="p-4 rounded-lg bg-blue-50 border border-blue-200">
          <p className="text-sm text-blue-900">
            <strong>Note:</strong> These are the default working hours for your
            organization. You can set different schedules for specific
            departments or employees later.
          </p>
        </div>
      </div>
    </div>
  );
};

export default WorkingHoursStep;
