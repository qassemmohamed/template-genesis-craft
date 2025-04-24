import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus } from "lucide-react";
import AppointmentItem from "./AppointmentItem";
import AppointmentForm from "./AppointmentForm";
import { Appointment } from "@/types/index";
import { Card } from "@/components/ui/card";

interface AppointmentsListProps {
  appointments: Appointment[];
  selectedDate: string;
  onAddAppointment: (appointment: Appointment) => void;
  onUpdateAppointment: (appointment: Appointment) => void;
  onDeleteAppointment: (id: string) => void;
}

const AppointmentsList = ({
  appointments,
  selectedDate,
  onAddAppointment,
  onUpdateAppointment,
  onDeleteAppointment,
}: AppointmentsListProps) => {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingAppointment, setEditingAppointment] =
    useState<Appointment | null>(null);

  const filteredAppointments = appointments
    .filter((appointment) => appointment.date === selectedDate)
    .sort((a, b) => {
      if (!a.time) return 1;
      if (!b.time) return -1;
      return a.time.localeCompare(b.time);
    });

  const handleAddClick = () => {
    setEditingAppointment(null);
    setIsFormOpen(true);
  };

  const handleEditClick = (appointment: Appointment) => {
    setEditingAppointment(appointment);
    setIsFormOpen(true);
  };

  const handleFormClose = () => {
    setIsFormOpen(false);
    setEditingAppointment(null);
  };

  const handleFormSubmit = (appointment: Appointment) => {
    if (editingAppointment) {
      onUpdateAppointment(appointment);
    } else {
      onAddAppointment(appointment);
    }
    setIsFormOpen(false);
    setEditingAppointment(null);
  };

  return (
    <Card className="h-full rounded-lg p-4 shadow-md">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-[var(--headline)]">
          Appointments
        </h2>
        <button
          onClick={handleAddClick}
          className="rounded-full border border-[var(--chart-2)] bg-[var(--input)] p-2 text-[var(--chart-2)] transition-colors"
        >
          <Plus className="h-5 w-5" />
        </button>
      </div>

      <AnimatePresence>
        {isFormOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="mb-4 overflow-hidden"
          >
            <AppointmentForm
              initialAppointment={editingAppointment}
              selectedDate={selectedDate}
              onSubmit={handleFormSubmit}
              onCancel={handleFormClose}
            />
          </motion.div>
        )}
      </AnimatePresence>

      <div className="max-h-[calc(100%-3rem)] overflow-y-auto">
        {filteredAppointments.length > 0 ? (
          <AnimatePresence>
            {filteredAppointments.map((appointment) => (
              <AppointmentItem
                key={appointment.id}
                appointment={appointment}
                onEdit={handleEditClick}
                onDelete={onDeleteAppointment}
              />
            ))}
          </AnimatePresence>
        ) : (
          <div className="py-6 text-center text-[var(--paragraph)]">
            <p>No appointments for this date</p>
          </div>
        )}
      </div>
    </Card>
  );
};

export default AppointmentsList;
