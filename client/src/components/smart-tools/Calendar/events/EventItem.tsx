import { useState } from "react";
import { motion } from "framer-motion";
import { Check, Edit, Trash } from "lucide-react";
import { Event } from "@/types";

interface EventItemProps {
  event: Event;
  // onToggleComplete: (id: string) => void;
  onEdit: (event: Event) => void;
  onDelete: (id: string) => void;
}

const EventItem = ({
  event,
  // onToggleComplete,
  onEdit,
  onDelete,
}: EventItemProps) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.2 }}
      className={`mb-2 cursor-pointer rounded-md border p-3 transition-all`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="flex items-start justify-between">
        <div className="flex items-start space-x-3">
          <button
            // onClick={() => onToggleComplete(event.id)}
            className={`mt-1 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full border ${
              event.completed
                ? "border-purple-500 bg-purple-500"
                : "bg-[var(--input)] hover:border-purple-400"
            }`}
          >
            {event.completed && (
              <Check className="h-3 w-3 text-[var(--headline)]" />
            )}
          </button>

          <div className="flex-1">
            <h4
              className={`text-sm font-medium ${
                event.completed
                  ? "text-[var(--paragraph)] line-through"
                  : "text-[var(--headline)]"
              }`}
            >
              {event.title}
            </h4>

            <p className="mt-1 text-xs text-[var(--paragraph)]">
              {event.description}
            </p>

            <div className="mt-2 flex items-center">
              <span
                className={`rounded-full px-2 py-1 text-xs ${
                  event.category === "work"
                    ? "bg-blue-100 text-blue-700"
                    : event.category === "personal"
                      ? "bg-green-100 text-green-700"
                      : "bg-orange-100 text-orange-700"
                }`}
              >
                {event.category}
              </span>
            </div>
          </div>
        </div>

        {isHovered && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex space-x-1"
          >
            <button
              onClick={() => onEdit(event)}
              className="rounded-full p-1 text-[var(--paragraph)] hover:text-[var(--headline)]"
            >
              <Edit className="h-4 w-4" />
            </button>
            <button
              onClick={() => onDelete(event.id)}
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

export default EventItem;
