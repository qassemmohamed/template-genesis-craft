import { useState } from "react";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import {
  generateCalendarDays,
  months,
  weekdays,
  getCurrentDate,
  getEventsForDate,
  getAppointmentsForDate,
  getRemindersForDate,
} from "@/utils/dateUtils";
import { Event, Appointment, Reminder } from "@/types/index";
import { button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

interface CalendarProps {
  events: Event[];
  appointments: Appointment[];
  reminders: Reminder[];
  onDateSelect: (date: string) => void;
}

const Calendar = ({
  events,
  appointments,
  reminders,
  onDateSelect,
}: CalendarProps) => {
  const currentDate = new Date();
  const [selectedDate, setSelectedDate] = useState(getCurrentDate());
  const [currentMonth, setCurrentMonth] = useState(currentDate.getMonth());
  const [currentYear, setCurrentYear] = useState(currentDate.getFullYear());

  const calendarDays = generateCalendarDays(currentYear, currentMonth);

  const goToPreviousMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(currentYear - 1);
    } else {
      setCurrentMonth(currentMonth - 1);
    }
  };

  const goToNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(currentYear + 1);
    } else {
      setCurrentMonth(currentMonth + 1);
    }
  };

  const handleDateClick = (date: string) => {
    setSelectedDate(date);
    onDateSelect(date);
  };

  return (
    <Card className="rounded-lg p-4 shadow-md">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-[var(--headline)]">
          {months[currentMonth]} {currentYear}
        </h2>
        <div className="flex space-x-2">
          <button
            onClick={goToPreviousMonth}
            className="hoverd rounded-full p-1 text-[var(--paragraph)] hover:bg-[var(--input)] hover:text-[var(--headline)]"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button
            onClick={goToNextMonth}
            className="hoverd rounded-full p-1 text-[var(--paragraph)] hover:bg-[var(--input)] hover:text-[var(--headline)]"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* Day labels */}
      <div className="mb-2 grid grid-cols-7">
        {weekdays.map((day) => (
          <div
            key={day}
            className="text-center text-sm font-medium text-[var(--headline)]"
          >
            {day}
          </div>
        ))}
      </div>

      {/* Calendar grid */}
      <div className="grid grid-cols-7 gap-1">
        {calendarDays.map((day) => {
          const isSelected = day.date === selectedDate;
          const hasEvents = getEventsForDate(events, day.date).length > 0;
          const hasAppointments =
            getAppointmentsForDate(appointments, day.date).length > 0;
          const hasReminders =
            getRemindersForDate(reminders, day.date).length > 0;
          const hasItems = hasEvents || hasAppointments || hasReminders;

          return (
            <motion.div
              key={day.date}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleDateClick(day.date)}
              className={`relative cursor-pointer rounded-md py-2 text-center ${!day.currentMonth ? "text-[var(--paragraph)]" : "text-[var(--headline)]"} ${isSelected ? "bg-[var(--button)] text-[var(--button-text)]" : hasItems ? "hover:bg-[var(--input)]" : "hover:bg-[var(--input)]"} `}
            >
              <span>{day.day}</span>

              {/* Activity indicators */}
              {hasItems && !isSelected && (
                <div className="absolute bottom-1 left-0 right-0 flex justify-center space-x-1">
                  {hasEvents && (
                    <span className="h-1 w-1 rounded-full bg-blue-500"></span>
                  )}
                  {hasAppointments && (
                    <span className="h-1 w-1 rounded-full bg-green-500"></span>
                  )}
                  {hasReminders && (
                    <span className="h-1 w-1 rounded-full bg-red-500"></span>
                  )}
                </div>
              )}
            </motion.div>
          );
        })}
      </div>

      {/* Legend */}
      <div className="mt-4 flex items-center justify-center space-x-4 text-xs text-[var(--paragraph)] flex-wrap text-center">
        <div className="flex items-center">
          <span className="mr-1 h-2 w-2 rounded-full bg-blue-500"></span>
          <span>Events</span>
        </div>
        <div className="flex items-center">
          <span className="mr-1 h-2 w-2 rounded-full bg-green-500"></span>
          <span>Appointments</span>
        </div>
        <div className="flex items-center">
          <span className="mr-1 h-2 w-2 rounded-full bg-red-500"></span>
          <span>Reminders</span>
        </div>
      </div>
    </Card>
  );
};

export default Calendar;
