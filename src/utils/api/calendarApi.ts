
import axios from '@/lib/axios';
import { useQuery, useMutation } from '@tanstack/react-query';
import { Event, Appointment, Reminder } from '@/types';

export const calendarApi = {
  // Events
  getEvents: () => axios.get('/api/calendar/events'),
  createEvent: (data: Event) => axios.post('/api/calendar/events', data),
  updateEvent: (id: string, data: Event) => axios.put(`/api/calendar/events/${id}`, data),
  deleteEvent: (id: string) => axios.delete(`/api/calendar/events/${id}`),
  
  // Appointments
  getAppointments: () => axios.get('/api/calendar/appointments'),
  createAppointment: (data: Appointment) => axios.post('/api/calendar/appointments', data),
  updateAppointment: (id: string, data: Appointment) => 
    axios.put(`/api/calendar/appointments/${id}`, data),
  deleteAppointment: (id: string) => axios.delete(`/api/calendar/appointments/${id}`),
  
  // Reminders
  getReminders: () => axios.get('/api/calendar/reminders'),
  createReminder: (data: Reminder) => axios.post('/api/calendar/reminders', data),
  updateReminder: (id: string, data: Reminder) => 
    axios.put(`/api/calendar/reminders/${id}`, data),
  deleteReminder: (id: string) => axios.delete(`/api/calendar/reminders/${id}`),
};

export const useCalendarEvents = () => {
  return useQuery({
    queryKey: ['calendar-events'],
    queryFn: calendarApi.getEvents,
  });
};

export const useCalendarAppointments = () => {
  return useQuery({
    queryKey: ['calendar-appointments'],
    queryFn: calendarApi.getAppointments,
  });
};

export const useCalendarReminders = () => {
  return useQuery({
    queryKey: ['calendar-reminders'],
    queryFn: calendarApi.getReminders,
  });
};
