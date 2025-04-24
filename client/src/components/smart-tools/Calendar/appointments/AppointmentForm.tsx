import { useState } from "react";
import { motion } from "framer-motion";
import { Appointment } from "@/types/index";
import { generateId } from "@/utils/dateUtils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface AppointmentFormProps {
  initialAppointment: Appointment | null;
  selectedDate: string;
  onSubmit: (appointment: Appointment) => void;
  onCancel: () => void;
}

const AppointmentForm = ({
  initialAppointment,
  selectedDate,
  onSubmit,
  onCancel,
}: AppointmentFormProps) => {
  const [title, setTitle] = useState(initialAppointment?.title || "");
  const [time, setTime] = useState(initialAppointment?.time || "09:00");
  const [duration, setDuration] = useState(
    initialAppointment?.duration.toString() || "60",
  );
  const [withPerson, setWithPerson] = useState(initialAppointment?.with || "");
  const [notes, setNotes] = useState(initialAppointment?.notes || "");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const appointment: Appointment = {
      id: initialAppointment?.id || generateId(),
      title,
      date: selectedDate,
      time,
      duration: parseInt(duration, 10),
      with: withPerson,
      notes,
    };

    onSubmit(appointment);
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
        <Label htmlFor="title" className="text-xs text-[var(--paragraph)]">
          Title
        </Label>
        <Input
          id="title"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
      </div>

      <div className="mb-3 grid grid-cols-2 gap-3">
        <div>
          <Label htmlFor="time" className="text-xs text-[var(--paragraph)]">
            Time
          </Label>
          <Input
            id="time"
            type="time"
            value={time}
            onChange={(e) => setTime(e.target.value)}
            required
          />
        </div>

        <div>
          <Label htmlFor="duration" className="text-xs text-[var(--paragraph)]">
            Duration (min)
          </Label>
          <Select value={duration} onValueChange={(val) => setDuration(val)}>
            <SelectTrigger>
              <SelectValue placeholder="Select duration" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="15">15 min</SelectItem>
              <SelectItem value="30">30 min</SelectItem>
              <SelectItem value="45">45 min</SelectItem>
              <SelectItem value="60">1 hour</SelectItem>
              <SelectItem value="90">1.5 hours</SelectItem>
              <SelectItem value="120">2 hours</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="mb-3">
        <Label htmlFor="with" className="text-xs text-[var(--paragraph)]">
          With
        </Label>
        <Input
          id="with"
          type="text"
          value={withPerson}
          onChange={(e) => setWithPerson(e.target.value)}
        />
      </div>

      <div className="mb-4">
        <Label htmlFor="notes" className="text-xs text-[var(--paragraph)]">
          Notes
        </Label>
        <Textarea
          id="notes"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          rows={2}
        />
      </div>

      <div className="flex justify-end space-x-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">
          {initialAppointment ? "Update" : "Add"} Appointment
        </Button>
      </div>
    </motion.form>
  );
};

export default AppointmentForm;
