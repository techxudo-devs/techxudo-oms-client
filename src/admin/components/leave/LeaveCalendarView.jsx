import React from "react";
import {
  Calendar as BigCalendar,
  momentLocalizer,
} from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import "./calendar-custom.css";

const localizer = momentLocalizer(moment);

const LeaveCalendarView = ({ events }) => {
  // Transform events to match react-big-calendar format
  const calendarEvents = events.map((event) => ({
    ...event,
    start: new Date(event.start),
    end: new Date(event.end),
    title: `${event.employee?.fullName || event.employeeId} - ${event.type}`,
  }));

  const eventStyleGetter = (event) => {
    let backgroundColor = "";
    let borderColor = "";

    switch (event.status.toLowerCase()) {
      case "approved":
        backgroundColor = "#10b981";
        borderColor = "#059669";
        break;
      case "rejected":
        backgroundColor = "#ef4444";
        borderColor = "#dc2626";
        break;
      case "pending":
        backgroundColor = "#f59e0b";
        borderColor = "#d97706";
        break;
      default:
        backgroundColor = "#6b7280";
        borderColor = "#4b5563";
    }

    const style = {
      backgroundColor: backgroundColor,
      borderLeft: `4px solid ${borderColor}`,
      borderRadius: "6px",
      color: "white",
      border: "0px",
      display: "block",
      padding: "4px 8px",
      fontSize: "13px",
      fontWeight: "500",
      boxShadow: "0 1px 3px 0 rgb(0 0 0 / 0.1)",
      transition: "all 0.2s ease",
    };

    return { style };
  };

  const customDayPropGetter = (date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const currentDate = new Date(date);
    currentDate.setHours(0, 0, 0, 0);

    if (currentDate.getTime() === today.getTime()) {
      return {
        className: "today-highlight",
        style: {
          backgroundColor: "#eff6ff",
        },
      };
    }
    return {};
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 overflow-hidden">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">
          Leave Calendar Overview
        </h3>
        <div className="flex items-center gap-4 text-xs">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-sm bg-green-500"></div>
            <span className="text-gray-600 font-medium">Approved</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-sm bg-orange-500"></div>
            <span className="text-gray-600 font-medium">Pending</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-sm bg-red-500"></div>
            <span className="text-gray-600 font-medium">Rejected</span>
          </div>
        </div>
      </div>

      <div className="modern-calendar">
        <BigCalendar
          localizer={localizer}
          events={calendarEvents}
          startAccessor="start"
          endAccessor="end"
          style={{ height: 650 }}
          eventPropGetter={eventStyleGetter}
          dayPropGetter={customDayPropGetter}
          views={["month", "week", "day", "agenda"]}
          messages={{
            date: "Date",
            time: "Time",
            event: "Event",
            allDay: "All Day",
            week: "Week",
            work_week: "Work Week",
            day: "Day",
            month: "Month",
            previous: "Back",
            next: "Next",
            today: "Today",
            agenda: "Agenda",
            showMore: (total) => `+${total} more`,
          }}
          popup
        />
      </div>
    </div>
  );
};

export default LeaveCalendarView;
