import { useState } from "react";
import { motion } from "framer-motion";
import { Check, Edit, Trash } from "lucide-react";
import { Reminder } from "@/types/index";
import { formatTime } from "@/utils/dateUtils";

interface ReminderItemProps {
  reminder: Reminder;
  onToggleComplete: (id: string) => void;
  onEdit: (reminder: Reminder) => void;
  onDelete: (id: string) => void;
}

const ReminderItem = ({
  reminder,
  onToggleComplete,
  onEdit,
  onDelete,
}: ReminderItemProps) => {
  const [isHovered, setIsHovered] = useState(false);

  const priorityColors = {
    low: "bg-[var(--card-background)]",
    medium: "bg-[var(--card-background)]",
    high: "bg-[var(--card-background)]",
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.2 }}
      className={`mb-2 cursor-pointer rounded-md border p-3 transition-all ${
        reminder.completed
          ? "border-border bg-muted"
          : `${priorityColors[reminder.priority]}`
      }`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="flex items-start justify-between">
        <div className="flex items-start space-x-3">
          <button
            onClick={() => onToggleComplete(reminder.id)}
            className={`mt-1 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full border ${
              reminder.completed
                ? "border-purple-500 bg-purple-500"
                : "bg-[var(--input)] hover:border-purple-400"
            }`}
          >
            {reminder.completed && (
              <Check className="h-3 w-3 text-[var(--headline)]" />
            )}
          </button>

          <div className="flex-1">
            <h4
              className={`text-sm font-medium ${
                reminder.completed
                  ? "text-[var(--paragraph)] line-through"
                  : "text-[var(--headline)]"
              }`}
            >
              {reminder.title}
            </h4>

            <div className="mt-1 flex items-center text-xs text-[var(--paragraph)]">
              <span>{formatTime(reminder.time)}</span>
            </div>

            {!reminder.completed && (
              <div className="mt-2">
                <span
                  className={`rounded-full px-2 py-0.5 text-xs ${
                    reminder.priority === "low"
                      ? "bg-blue-50 text-blue-700"
                      : reminder.priority === "medium"
                        ? "bg-yellow-50 text-yellow-700"
                        : "bg-red-50 text-red-700"
                  }`}
                >
                  {reminder.priority} priority
                </span>
              </div>
            )}
          </div>
        </div>

        {isHovered && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex space-x-1"
          >
            <button
              onClick={() => onEdit(reminder)}
              className="rounded-full p-1 text-[var(--paragraph)] hover:text-[var(--headline)]"
            >
              <Edit className="h-4 w-4" />
            </button>
            <button
              onClick={() => onDelete(reminder.id)}
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

export default ReminderItem;
