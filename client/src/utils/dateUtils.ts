import { Event, Appointment, Reminder } from "@/types/index";

// Format dates in a consistent way
export const formatDate = (date: Date): string => {
  return date.toISOString().split("T")[0];
};

// Get current date
export const getCurrentDate = (): string => {
  return formatDate(new Date());
};

// Get days in a month
export const getDaysInMonth = (year: number, month: number): number => {
  return new Date(year, month + 1, 0).getDate();
};

// Get day of week (0-6, where 0 is Sunday)
export const getDayOfWeek = (
  year: number,
  month: number,
  day: number,
): number => {
  return new Date(year, month, day).getDay();
};

// Get first day of month
export const getFirstDayOfMonth = (year: number, month: number): number => {
  return new Date(year, month, 1).getDay();
};

// Check if a date is today
export const isToday = (dateString: string): boolean => {
  const today = getCurrentDate();
  return dateString === today;
};

// Check if a date is in the past
export const isPastDate = (dateString: string): boolean => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const date = new Date(dateString);
  return date < today;
};

// Generate an array of dates for calendar view
export const generateCalendarDays = (
  year: number,
  month: number,
): Array<{ date: string; day: number; currentMonth: boolean }> => {
  const daysInMonth = getDaysInMonth(year, month);
  const firstDayOfMonth = getFirstDayOfMonth(year, month);

  const daysFromPrevMonth = firstDayOfMonth;
  const prevMonth = month === 0 ? 11 : month - 1;
  const prevMonthYear = month === 0 ? year - 1 : year;
  const daysInPrevMonth = getDaysInMonth(prevMonthYear, prevMonth);

  const totalDaysToShow = 42;
  const daysFromNextMonth = totalDaysToShow - daysInMonth - daysFromPrevMonth;

  const calendarDays = [];

  for (
    let i = daysInPrevMonth - daysFromPrevMonth + 1;
    i <= daysInPrevMonth;
    i++
  ) {
    calendarDays.push({
      date: formatDate(new Date(prevMonthYear, prevMonth, i)),
      day: i,
      currentMonth: false,
    });
  }

  for (let i = 1; i <= daysInMonth; i++) {
    calendarDays.push({
      date: formatDate(new Date(year, month, i)),
      day: i,
      currentMonth: true,
    });
  }

  const nextMonth = month === 11 ? 0 : month + 1;
  const nextMonthYear = month === 11 ? year + 1 : year;

  for (let i = 1; i <= daysFromNextMonth; i++) {
    calendarDays.push({
      date: formatDate(new Date(nextMonthYear, nextMonth, i)),
      day: i,
      currentMonth: false,
    });
  }

  return calendarDays;
};

// Generate months array
export const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

// Generate weekdays array
export const weekdays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

// Get events for a specific date
export const getEventsForDate = (events: Event[], date: string): Event[] => {
  return events.filter((event) => event.date === date);
};

// Get appointments for a specific date
export const getAppointmentsForDate = (
  appointments: Appointment[],
  date: string,
): Appointment[] => {
  return appointments.filter((appointment) => appointment.date === date);
};

// Get reminders for a specific date
export const getRemindersForDate = (
  reminders: Reminder[],
  date: string,
): Reminder[] => {
  return reminders.filter((reminder) => reminder.date === date);
};

// Format time from 24h to 12h format
export const formatTime = (time?: string): string => {
  if (!time) return "";
  const [hours, minutes] = time.split(":");
  const hour = parseInt(hours, 10);
  const period = hour >= 12 ? "PM" : "AM";
  const formattedHour = hour % 12 === 0 ? 12 : hour % 12;
  return `${formattedHour}:${minutes} ${period}`;
};

// Generate a new ID (simple implementation)
export const generateId = (): string => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2, 5);
};
