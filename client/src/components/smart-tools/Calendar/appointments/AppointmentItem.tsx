import { useState } from "react";
import { motion } from "framer-motion";
import { Edit, Trash, Clock } from "lucide-react";
import { Appointment } from "@/types/index";
import { formatTime } from "@/utils/dateUtils";

interface AppointmentItemProps {
  appointment: Appointment;
  onEdit: (appointment: Appointment) => void;
  onDelete: (id: string) => void;
}

const AppointmentItem = ({
  appointment,
  onEdit,
  onDelete,
}: AppointmentItemProps) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.2 }}
      className="mb-2 cursor-pointer rounded-md border bg-background p-3 transition-all hover:border-purple-400"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <h4 className="text-sm font-medium text-[var(--headline)]">
            {appointment.title}
          </h4>
          <div className="mt-1 flex items-center text-xs text-[var(--paragraph)]">
            <Clock className="mr-1 h-3 w-3" />
            <span>
              {formatTime(appointment.time)} ({appointment.duration} min)
            </span>
          </div>

          {appointment.with && (
            <p className="mt-1 text-xs text-[var(--paragraph)]">
              With: {appointment.with}
            </p>
          )}

          {appointment.notes && (
            <p className="mt-1 text-xs text-[var(--paragraph)]">
              {appointment.notes}
            </p>
          )}
        </div>

        {isHovered && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex space-x-1"
          >
            <button
              onClick={() => onEdit(appointment)}
              className="rounded-full p-1 text-[var(--paragraph)] hover:text-[var(--headline)]"
            >
              <Edit className="h-4 w-4" />
            </button>
            <button
              onClick={() => onDelete(appointment.id)}
              className="rounded-full p-1 text-[var(--paragraph)] hover:text-[var(--headline)]"
            >
              <Trash className="h-4 w-4" />
            </button>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};

export default AppointmentItem;
