import { useState } from "react";
import { useGetMyAttendanceQuery } from "../../apiSlices/attendanceApiSlice";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Calendar } from "lucide-react";
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay } from "date-fns";

const AttendanceCalendar = () => {
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);

  const { data, isLoading } = useGetMyAttendanceQuery({
    startDate: format(monthStart, "yyyy-MM-dd"),
    endDate: format(monthEnd, "yyyy-MM-dd"),
    limit: 100,
  });

  const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd });

  // Get the starting day of the week for the month
  const startDayOfWeek = monthStart.getDay();

  // Create array for calendar grid (including empty cells for alignment)
  const calendarDays = [
    ...Array(startDayOfWeek).fill(null),
    ...daysInMonth,
  ];

  const getAttendanceForDate = (date) => {
    if (!data?.attendances) return null;
    return data.attendances.find((att) =>
      isSameDay(new Date(att.date), date)
    );
  };

  const getStatusColor = (status) => {
    const colors = {
      present: "bg-green-500 text-white",
      late: "bg-yellow-500 text-white",
      absent: "bg-red-500 text-white",
      "on-leave": "bg-purple-500 text-white",
      "half-day": "bg-blue-500 text-white",
      holiday: "bg-gray-400 text-white",
      weekend: "bg-gray-300 text-gray-700",
    };
    return colors[status] || "bg-gray-100 text-gray-400";
  };

  const previousMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1));
  };

  const nextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1));
  };

  const today = () => {
    setCurrentMonth(new Date());
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Attendance Calendar
          </CardTitle>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={previousMonth}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="sm" onClick={today}>
              Today
            </Button>
            <Button variant="outline" size="sm" onClick={nextMonth}>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
        <div className="text-center text-lg font-semibold mt-2">
          {format(currentMonth, "MMMM yyyy")}
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        ) : (
          <>
            {/* Calendar Grid */}
            <div className="grid grid-cols-7 gap-2">
              {/* Day headers */}
              {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
                <div
                  key={day}
                  className="text-center text-sm font-semibold text-gray-600 py-2"
                >
                  {day}
                </div>
              ))}

              {/* Calendar days */}
              {calendarDays.map((day, index) => {
                if (!day) {
                  return <div key={`empty-${index}`} className="aspect-square" />;
                }

                const attendance = getAttendanceForDate(day);
                const isToday = isSameDay(day, new Date());
                const isCurrentMonth = isSameMonth(day, currentMonth);

                return (
                  <div
                    key={day.toISOString()}
                    className={`
                      aspect-square rounded-lg flex flex-col items-center justify-center p-1 text-sm
                      ${isToday ? "ring-2 ring-blue-500" : ""}
                      ${!isCurrentMonth ? "opacity-30" : ""}
                      ${attendance ? getStatusColor(attendance.status) : "bg-gray-50 text-gray-400"}
                      hover:opacity-90 cursor-pointer transition-all
                    `}
                    title={
                      attendance
                        ? `${format(day, "MMM dd")}: ${attendance.status} - ${
                            attendance.hoursWorked || 0
                          } hrs`
                        : format(day, "MMM dd")
                    }
                  >
                    <div className="font-semibold">{format(day, "d")}</div>
                    {attendance && (
                      <div className="text-xs mt-1">
                        {attendance.hoursWorked?.toFixed(1) || 0}h
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Legend */}
            <div className="mt-6 flex flex-wrap gap-4 justify-center text-sm">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-green-500 rounded"></div>
                <span>Present</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-yellow-500 rounded"></div>
                <span>Late</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-red-500 rounded"></div>
                <span>Absent</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-purple-500 rounded"></div>
                <span>On Leave</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-gray-50 border border-gray-300 rounded"></div>
                <span>No Data</span>
              </div>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default AttendanceCalendar;
