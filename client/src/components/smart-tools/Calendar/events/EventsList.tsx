
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus } from "lucide-react";
import EventItem from "./EventItem";
import EventForm from "./EventForm";
import { Event } from "@/types/index";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { calendarApi } from "@/utils/api";

interface EventsListProps {
  events: Event[];
  selectedDate: string;
  onAddEvent: (event: Event) => void;
  onUpdateEvent: (event: Event) => void;
  onDeleteEvent: (id: string) => void;
}

const EventsList = ({
  events,
  selectedDate,
  onAddEvent,
  onUpdateEvent,
  onDeleteEvent,
}: EventsListProps) => {
  const { toast } = useToast();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

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
    try {
      setIsSubmitting(true);
      
      if (editingEvent) {
        await calendarApi.updateEvent(event.id, event);
        toast({
          title: "Event updated",
          description: "The event has been successfully updated.",
        });
        onUpdateEvent(event);
      } else {
        const response = await calendarApi.createEvent(event);
        toast({
          title: "Event created",
          description: "The new event has been successfully created.",
        });
        onAddEvent({ ...event, id: response.data.id });
      }
      
      setIsFormOpen(false);
      setEditingEvent(null);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save the event. Please try again.",
        variant: "destructive",
      });
      console.error("Error saving event:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteEvent = async (id: string) => {
    try {
      await calendarApi.deleteEvent(id);
      toast({
        title: "Event deleted",
        description: "The event has been successfully deleted.",
      });
      onDeleteEvent(id);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete the event. Please try again.",
        variant: "destructive",
      });
      console.error("Error deleting event:", error);
    }
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
              isSubmitting={isSubmitting}
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
