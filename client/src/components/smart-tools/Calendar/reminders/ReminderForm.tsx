import { useState } from "react";
import { motion } from "framer-motion";
import { Reminder } from "@/types";
import { generateId } from "@/utils/dateUtils";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface ReminderFormProps {
  initialReminder: Reminder | null;
  selectedDate: string;
  onSubmit: (reminder: Reminder) => void;
  onCancel: () => void;
}

const ReminderForm = ({
  initialReminder,
  selectedDate,
  onSubmit,
  onCancel,
}: ReminderFormProps) => {
  const [title, setTitle] = useState(initialReminder?.title || "");
  const [time, setTime] = useState(initialReminder?.time || "09:00");
  const [priority, setPriority] = useState<"low" | "medium" | "high">(
    initialReminder?.priority || "medium",
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const reminder: Reminder = {
      id: initialReminder?.id || generateId(),
      title,
      date: selectedDate,
      time,
      priority,
      completed: initialReminder?.completed || false,
    };

    onSubmit(reminder);
  };

  return (
    <motion.form
      onSubmit={handleSubmit}
      className="mb-4 rounded-md border border-[var(--input)] p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className="mb-3">
        <label
          htmlFor="title"
          className="mb-1 block text-xs font-medium text-[var(--paragraph)]"
        >
          Title
        </label>
        <Input
          type="text"
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
      </div>

      <div className="mb-3">
        <label
          htmlFor="time"
          className="mb-1 block text-xs font-medium text-[var(--paragraph)]"
        >
          Time
        </label>
        <Input
          type="time"
          id="time"
          value={time}
          onChange={(e) => setTime(e.target.value)}
          required
        />
      </div>

      <div className="mb-4">
        <label className="mb-1 block text-xs font-medium text-[var(--paragraph)]">
          Priority
        </label>
        <div className="flex space-x-4">
          {["low", "medium", "high"].map((level) => (
            <label key={level} className="inline-flex items-center space-x-2">
              <Input
                type="radio"
                value={level}
                checked={priority === level}
                onChange={() => setPriority(level as "low" | "medium" | "high")}
                className="radio-input"
              />
              <span className="text-sm capitalize text-muted-foreground">
                {level}
              </span>
            </label>
          ))}
        </div>
      </div>

      <div className="flex justify-end space-x-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">
          {initialReminder ? "Update" : "Add"} Reminder
        </Button>
      </div>
    </motion.form>
  );
};

export default ReminderForm;
