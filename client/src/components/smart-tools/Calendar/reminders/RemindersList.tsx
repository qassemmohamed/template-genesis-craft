import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus } from "lucide-react";
import ReminderItem from "./ReminderItem";
import ReminderForm from "./ReminderForm";
import { Reminder } from "@/types/index";
import { Card } from "@/components/ui/card";

interface RemindersListProps {
  reminders: Reminder[];
  selectedDate: string;
  onAddReminder: (reminder: Reminder) => void;
  onUpdateReminder: (reminder: Reminder) => void;
  onToggleComplete: (id: string) => void;
  onDeleteReminder: (id: string) => void;
}

const RemindersList = ({
  reminders,
  selectedDate,
  onAddReminder,
  onUpdateReminder,
  onToggleComplete,
  onDeleteReminder,
}: RemindersListProps) => {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingReminder, setEditingReminder] = useState<Reminder | null>(null);

  const filteredReminders = reminders
    .filter((reminder) => reminder.date === selectedDate)
    .sort((a, b) => {
      // Sort by completion status first
      if (a.completed !== b.completed) {
        return a.completed ? 1 : -1;
      }

      // If not completed, sort by priority (high to low)
      if (!a.completed) {
        const priorityOrder = { high: 0, medium: 1, low: 2 };
        return priorityOrder[a.priority] - priorityOrder[b.priority];
      }

      // Finally sort by time
      return a.time.localeCompare(b.time);
    });

  const handleAddClick = () => {
    setEditingReminder(null);
    setIsFormOpen(true);
  };

  const handleEditClick = (reminder: Reminder) => {
    setEditingReminder(reminder);
    setIsFormOpen(true);
  };

  const handleFormClose = () => {
    setIsFormOpen(false);
    setEditingReminder(null);
  };

  const handleFormSubmit = (reminder: Reminder) => {
    if (editingReminder) {
      onUpdateReminder(reminder);
    } else {
      onAddReminder(reminder);
    }
    setIsFormOpen(false);
    setEditingReminder(null);
  };

  return (
    <Card className="h-full rounded-lg p-4 shadow-md">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-[var(--headline)]">
          Reminders
        </h2>
        <button
          onClick={handleAddClick}
          className="rounded-full border border-[var(--chart-5)] bg-[var(--input)] p-2 text-[var(--chart-5)] transition-colors"
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
            <ReminderForm
              initialReminder={editingReminder}
              selectedDate={selectedDate}
              onSubmit={handleFormSubmit}
              onCancel={handleFormClose}
            />
          </motion.div>
        )}
      </AnimatePresence>

      <div className="max-h-[calc(100%-3rem)] overflow-y-auto">
        {filteredReminders.length > 0 ? (
          <AnimatePresence>
            {filteredReminders.map((reminder) => (
              <ReminderItem
                key={reminder.id}
                reminder={reminder}
                onToggleComplete={onToggleComplete}
                onEdit={handleEditClick}
                onDelete={onDeleteReminder}
              />
            ))}
          </AnimatePresence>
        ) : (
          <div className="py-6 text-center text-[var(--paragraph)]">
            <p>No reminders for this date</p>
          </div>
        )}
      </div>
    </Card>
  );
};

export default RemindersList;
