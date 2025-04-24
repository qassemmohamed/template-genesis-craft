import { useEffect, useState } from "react";
import { Appointment } from "@/types";
import axios from "@/lib/axios";

export const useAppointments = () => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);

  useEffect(() => {
    axios.get("/appointments").then((res) => setAppointments(res.data));
  }, []);

  const addAppointment = (appointment: Appointment) =>
    axios
      .post("/appointments", appointment)
      .then((res) => setAppointments((prev) => [...prev, res.data]));

  const updateAppointment = (appointment: Appointment) =>
    axios
      .put(`/appointments/${appointment._id}`, appointment)
      .then((res) =>
        setAppointments((prev) =>
          prev.map((a) => (a._id === appointment._id ? res.data : a)),
        ),
      );

  const deleteAppointment = (id: string) =>
    axios
      .delete(`/appointments/${id}`)
      .then(() => setAppointments((prev) => prev.filter((a) => a._id !== id)));

  return { appointments, addAppointment, updateAppointment, deleteAppointment };
};
