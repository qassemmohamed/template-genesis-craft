import { Event, Appointment, Reminder } from "@/types/index";
import { getCurrentDate, formatDate } from "../utils/dateUtils";

const today = getCurrentDate();
const tomorrow = formatDate(
  new Date(new Date().setDate(new Date().getDate() + 1)),
);
const nextWeek = formatDate(
  new Date(new Date().setDate(new Date().getDate() + 7)),
);

export const initialEvents: Event[] = [
  {
    id: "1",
    title: "Team Meeting",
    date: today,
    description: "Weekly team sync to discuss progress",
    category: "work",
    completed: false,
  },
  {
    id: "2",
    title: "Project Deadline",
    date: tomorrow,
    description: "Submit final deliverables for client review",
    category: "work",
    completed: false,
  },
  {
    id: "3",
    title: "Lunch with Sarah",
    date: nextWeek,
    description: "Catch up over lunch at Cafe Bianco",
    category: "personal",
    completed: false,
  },
];

export const initialAppointments: Appointment[] = [
  {
    id: "1",
    title: "Client Meeting",
    date: today,
    time: "10:00",
    duration: 60,
    with: "John Smith",
    notes: "Discuss new project requirements",
  },
  {
    id: "2",
    title: "Dentist Appointment",
    date: tomorrow,
    time: "14:30",
    duration: 45,
    with: "Dr. Martinez",
    notes: "Regular checkup",
  },
  {
    id: "3",
    title: "Interview Candidate",
    date: nextWeek,
    time: "11:00",
    duration: 90,
    with: "Jane Doe",
    notes: "Senior developer position",
  },
];

export const initialReminders: Reminder[] = [
  {
    id: "1",
    title: "Submit expense report",
    date: today,
    time: "17:00",
    priority: "high",
    completed: false,
  },
  {
    id: "2",
    title: "Call IT about new laptop",
    date: tomorrow,
    time: "09:15",
    priority: "medium",
    completed: false,
  },
  {
    id: "3",
    title: "Review quarterly goals",
    date: nextWeek,
    time: "13:00",
    priority: "low",
    completed: false,
  },
];
