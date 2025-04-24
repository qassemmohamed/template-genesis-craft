import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus } from "lucide-react";
import EventItem from "./EventItem";
import EventForm from "./EventForm";
import { Event } from "@/types/index";
import { Card } from "@/components/ui/card";
import { useEvents } from "@/hooks/useEvents"; // Ensure you have the hooks to interact with the backend

interface EventsListProps {
  events: Event[];
  selectedDate: string;
  onAddEvent: (event: Event) => void;
  onUpdateEvent: (event: Event) => void;
  onToggleComplete: (id: string) => void;
  onDeleteEvent: (id: string) => void;
}

const EventsList = ({
  events,
  selectedDate,
  onAddEvent,
  onUpdateEvent,
  onDeleteEvent,
}: EventsListProps) => {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);

  const filteredEvents = events.filter((event) => event.date === selectedDate);

  const handleAddClick = () => {
    setEditingEvent(null);
    setIsFormOpen(true);
  };

  const handleEditClick = (event: Event) => {
    setEditingEvent(event);
    setIsFormOpen(true);
  };

  const handleFormClose = () => {
    setIsFormOpen(false);
    setEditingEvent(null);
  };

  const handleFormSubmit = async (event: Event) => {
    if (editingEvent) {
      await onUpdateEvent(event); // API call to update event
    } else {
      await onAddEvent(event); // API call to add event
    }
    setIsFormOpen(false);
    setEditingEvent(null);
  };

  const handleDeleteEvent = async (id: string) => {
    await onDeleteEvent(id); // API call to delete event
  };

  return (
    <Card className="h-full rounded-lg p-4 shadow-md">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-[var(--headline)]">Events</h2>
        <button
          onClick={handleAddClick}
          className="rounded-full border border-[var(--chart-1)] bg-[var(--input)] p-2 text-[var(--chart-1)] transition-colors"
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
            <EventForm
              initialEvent={editingEvent}
              selectedDate={selectedDate}
              onSubmit={handleFormSubmit}
              onCancel={handleFormClose}
            />
          </motion.div>
        )}
      </AnimatePresence>

      <div className="max-h-[calc(100%-3rem)] overflow-y-auto">
        {filteredEvents.length > 0 ? (
          <AnimatePresence>
            {filteredEvents.map((event) => (
              <EventItem
                key={event.id}
                event={event}
                // onToggleComplete={onToggleComplete}
                onEdit={handleEditClick}
                onDelete={handleDeleteEvent}
              />
            ))}
          </AnimatePresence>
        ) : (
          <div className="py-6 text-center text-[var(--paragraph)]">
            <p>No events for this date</p>
          </div>
        )}
      </div>
    </Card>
  );
};

export default EventsList;
