import { useState } from "react";
import { motion } from "framer-motion";
import { Event } from "@/types/index";
import { generateId } from "@/utils/dateUtils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

interface EventFormProps {
  initialEvent: Event | null;
  selectedDate: string;
  onSubmit: (event: Event) => void;
  onCancel: () => void;
}

const EventForm = ({
  initialEvent,
  selectedDate,
  onSubmit,
  onCancel,
}: EventFormProps) => {
  const [title, setTitle] = useState(initialEvent?.title || "");
  const [description, setDescription] = useState(
    initialEvent?.description || "",
  );
  const [category, setCategory] = useState<"work" | "personal" | "other">(
    initialEvent?.category || "work",
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const event: Event = {
      id: initialEvent?.id || generateId(),
      title,
      date: selectedDate,
      description,
      category,
      completed: initialEvent?.completed || false,
    };

    onSubmit(event);
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
          htmlFor="description"
          className="mb-1 block text-xs font-medium text-[var(--paragraph)]"
        >
          Description
        </label>
        <Textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={2}
        />
      </div>

      <div className="mb-4">
        <label className="mb-1 block text-xs font-medium text-muted-foreground">
          Category
        </label>
        <div className="flex space-x-4">
          <label className="inline-flex items-center space-x-2">
            <Input
              type="radio"
              name="category"
              value="work"
              checked={category === "work"}
              onChange={() => setCategory("work")}
              className="radio-input"
            />
            <span className="text-sm text-muted-foreground">Work</span>
          </label>
          <label className="inline-flex items-center space-x-2">
            <Input
              type="radio"
              name="category"
              value="personal"
              checked={category === "personal"}
              onChange={() => setCategory("personal")}
              className="radio-input"
            />
            <span className="text-sm text-muted-foreground">Personal</span>
          </label>
          <label className="inline-flex items-center space-x-2">
            <Input
              type="radio"
              name="category"
              value="other"
              checked={category === "other"}
              onChange={() => setCategory("other")}
              className="radio-input"
            />
            <span className="text-sm text-muted-foreground">Other</span>
          </label>
        </div>
      </div>

      <div className="flex justify-end space-x-2">
        <Button type="button" variant={"outline"} onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">{initialEvent ? "Update" : "Add"} Event</Button>
      </div>
    </motion.form>
  );
};

export default EventForm;
