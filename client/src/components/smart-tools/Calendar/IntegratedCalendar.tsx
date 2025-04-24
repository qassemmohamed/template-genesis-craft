import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Event, Appointment, Reminder } from "@/types";
import { getCurrentDate } from "@/utils/dateUtils";
import { useEvents } from "@/hooks/useEvents";
import { useAppointments } from "@/hooks/useAppointments";
import { useReminders } from "@/hooks/useReminders";
import Calendar from "./Calendar";
import EventsList from "./events/EventsList";
import RemindersList from "./reminders/RemindersList";
import AppointmentsList from "./appointments/AppointmentsList";

const IntegratedCalendar = () => {
  const [selectedDate, setSelectedDate] = useState(getCurrentDate());

  const {
    events,
    addEvent: handleAddEvent,
    updateEvent: handleUpdateEvent,
    deleteEvent: handleDeleteEvent,
  } = useEvents();

  const {
    appointments,
    addAppointment: handleAddAppointment,
    updateAppointment: handleUpdateAppointment,
    deleteAppointment: handleDeleteAppointment,
  } = useAppointments();

  const {
    reminders,
    addReminder: handleAddReminder,
    updateReminder: handleUpdateReminder,
    deleteReminder: handleDeleteReminder,
    toggleReminderComplete: handleToggleReminderComplete,
  } = useReminders();

  // Ensure proper key management for lists
  const handleEventAdd = (event: Event) => {
    handleAddEvent(event);
  };

  const handleEventUpdate = (updatedEvent: Event) => {
    handleUpdateEvent(updatedEvent);
  };

  const handleEventDelete = (eventId: string) => {
    handleDeleteEvent(eventId);
  };

  const handleAppointmentAdd = (appointment: Appointment) => {
    handleAddAppointment(appointment);
  };

  const handleAppointmentUpdate = (updatedAppointment: Appointment) => {
    handleUpdateAppointment(updatedAppointment);
  };

  const handleAppointmentDelete = (appointmentId: string) => {
    handleDeleteAppointment(appointmentId);
  };

  const handleReminderAdd = (reminder: Reminder) => {
    handleAddReminder(reminder);
  };

  const handleReminderUpdate = (updatedReminder: Reminder) => {
    handleUpdateReminder(updatedReminder);
  };

  const handleReminderDelete = (reminderId: string) => {
    handleDeleteReminder(reminderId);
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-3xl font-bold tracking-tight">Calendar</h1>
        <p className="text-muted-foreground">
          Manage and organize your appointments efficiently.
        </p>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="grid grid-cols-1 gap-6 lg:grid-cols-4"
      >
        <div className="lg:col-span-1">
          <Calendar
            events={events}
            appointments={appointments}
            reminders={reminders}
            onDateSelect={setSelectedDate}
          />
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-3 lg:col-span-3">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
          >
            <EventsList
              events={events}
              selectedDate={selectedDate}
              onAddEvent={handleEventAdd}
              onUpdateEvent={handleEventUpdate}
              onDeleteEvent={handleEventDelete}
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.2 }}
          >
            <AppointmentsList
              appointments={appointments}
              selectedDate={selectedDate}
              onAddAppointment={handleAppointmentAdd}
              onUpdateAppointment={handleAppointmentUpdate}
              onDeleteAppointment={handleAppointmentDelete}
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.3 }}
          >
            <RemindersList
              reminders={reminders}
              selectedDate={selectedDate}
              onAddReminder={handleReminderAdd}
              onUpdateReminder={handleReminderUpdate}
              onToggleComplete={handleToggleReminderComplete}
              onDeleteReminder={handleReminderDelete}
            />
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};

export default IntegratedCalendar;
