export interface Event {
  id: string;
  title: string;
  date: string;
  description: string;
  category: "work" | "personal" | "other";
  completed: boolean;
}

export interface Appointment {
  id: string;
  title: string;
  date: string;
  time: string;
  duration: number; // in minutes
  with: string;
  notes: string;
}

export interface Reminder {
  id: string;
  title: string;
  date: string;
  time: string;
  priority: "low" | "medium" | "high";
  completed: boolean;
}

export type CalendarView = "month" | "week" | "day";

export interface Template {
  id: string;
  name: string;
  content: string;
  category: string;
}

export interface Category {
  id: string;
  name: string;
}

export interface ClientInfo {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  [key: string]: string;
}

export interface CustomField {
  id: string;
  name: string;
  placeholder: string;
  required: boolean;
}
