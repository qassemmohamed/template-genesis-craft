import axios from "axios";
import { useState } from "react";
import { Event } from "@/types";

const API_URL = "http://localhost:5000/api/events"; // Adjust your API URL

export const useEvents = () => {
  const [events, setEvents] = useState<Event[]>([]);

  const fetchEvents = async () => {
    try {
      const response = await axios.get(API_URL);
      setEvents(response.data);
    } catch (error) {
      console.error("Error fetching events", error);
    }
  };

  const addEvent = async (event: Event) => {
    try {
      const response = await axios.post(API_URL, event);
      setEvents((prevEvents) => [...prevEvents, response.data]);
    } catch (error) {
      console.error("Error adding event", error);
    }
  };

  const updateEvent = async (event: Event) => {
    try {
      const response = await axios.put(`${API_URL}/${event.id}`, event);
      setEvents((prevEvents) =>
        prevEvents.map((e) => (e.id === event.id ? response.data : e)),
      );
    } catch (error) {
      console.error("Error updating event", error);
    }
  };

  const deleteEvent = async (id: string) => {
    try {
      await axios.delete(`${API_URL}/${id}`);
      setEvents((prevEvents) => prevEvents.filter((e) => e.id !== id));
    } catch (error) {
      console.error("Error deleting event", error);
    }
  };

  return {
    events,
    fetchEvents,
    addEvent,
    updateEvent,
    deleteEvent,
  };
};
