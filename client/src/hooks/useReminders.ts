import { useEffect, useState } from "react";
import { Reminder } from "@/types";
import axios from "@/lib/axios";

export const useReminders = () => {
  const [reminders, setReminders] = useState<Reminder[]>([]);

  useEffect(() => {
    axios.get("/reminders").then((res) => setReminders(res.data));
  }, []);

  const addReminder = (reminder: Reminder) =>
    axios
      .post("/reminders", reminder)
      .then((res) => setReminders((prev) => [...prev, res.data]));

  const updateReminder = (reminder: Reminder) =>
    axios
      .put(`/reminders/${reminder._id}`, reminder)
      .then((res) =>
        setReminders((prev) =>
          prev.map((r) => (r._id === reminder._id ? res.data : r)),
        ),
      );

  const deleteReminder = (id: string) =>
    axios
      .delete(`/reminders/${id}`)
      .then(() => setReminders((prev) => prev.filter((r) => r._id !== id)));

  const toggleReminderComplete = (id: string) => {
    const reminder = reminders.find((r) => r._id === id);
    if (!reminder) return;
    updateReminder({ ...reminder, completed: !reminder.completed });
  };

  return {
    reminders,
    addReminder,
    updateReminder,
    deleteReminder,
    toggleReminderComplete,
  };
};
