
import axios, { AxiosInstance } from "axios";
import { toast } from "sonner";

const api: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
  headers: {
    "Content-Type": "application/json",
  },
});

// Add request interceptor for authentication
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      window.location.href = "/login";
      toast.error("Session expired. Please login again.");
    } else if (error.response?.data?.message) {
      toast.error(error.response.data.message);
    } else {
      toast.error("An error occurred. Please try again.");
    }
    return Promise.reject(error);
  }
);

// Document Extractor endpoints
export const documentApi = {
  extract: (formData) => api.post("/documents/extract", formData),
  getAll: () => api.get("/documents"),
  getById: (id) => api.get(`/documents/${id}`),
  delete: (id) => api.delete(`/documents/${id}`),
};

// Service Tracker endpoints
export const serviceTrackerApi = {
  getAll: () => api.get("/services/tracking"),
  getById: (id) => api.get(`/services/tracking/${id}`),
  create: (data) => api.post("/services/tracking", data),
  update: (id, data) => api.put(`/services/tracking/${id}`, data),
  delete: (id) => api.delete(`/services/tracking/${id}`),
};

// Calendar endpoints
export const calendarApi = {
  // Event endpoints
  getEvents: () => api.get("/calendar/events"),
  createEvent: (data) => api.post("/calendar/events", data),
  updateEvent: (id, data) => api.put(`/calendar/events/${id}`, data),
  deleteEvent: (id) => api.delete(`/calendar/events/${id}`),
  
  // Appointment endpoints
  getAppointments: () => api.get("/calendar/appointments"),
  createAppointment: (data) => api.post("/calendar/appointments", data),
  updateAppointment: (id, data) => api.put(`/calendar/appointments/${id}`, data),
  deleteAppointment: (id) => api.delete(`/calendar/appointments/${id}`),
  
  // Reminder endpoints
  getReminders: () => api.get("/calendar/reminders"),
  createReminder: (data) => api.post("/calendar/reminders", data),
  updateReminder: (id, data) => api.put(`/calendar/reminders/${id}`, data),
  deleteReminder: (id) => api.delete(`/calendar/reminders/${id}`),
  toggleReminderComplete: (id) => api.patch(`/calendar/reminders/${id}/toggle`),
};

// Template endpoints
export const templateApi = {
  getAll: () => api.get("/templates"),
  getById: (id) => api.get(`/templates/${id}`),
  create: (data) => api.post("/templates", data),
  update: (id, data) => api.put(`/templates/${id}`, data),
  delete: (id) => api.delete(`/templates/${id}`),
  generate: (templateId, data) => api.post(`/templates/${templateId}/generate`, data),
};

// Task endpoints
export const taskApi = {
  getAll: () => api.get("/tasks"),
  getByService: (service) => api.get(`/tasks/service/${service}`),
  create: (data) => api.post("/tasks", data),
  update: (id, data) => api.put(`/tasks/${id}`, data),
  delete: (id) => api.delete(`/tasks/${id}`),
  updateStatus: (id, status) => api.patch(`/tasks/${id}/status`, { status }),
};

// Report endpoints
export const reportApi = {
  getAll: () => api.get("/reports"),
  getById: (id) => api.get(`/reports/${id}`),
  generate: (type, params) => api.post(`/reports/generate/${type}`, params),
  download: (id, format) => api.get(`/reports/${id}/download?format=${format}`, {
    responseType: 'blob',
  }),
};

// Translation endpoints
export const translationApi = {
  translate: (data) => api.post("/translation/translate", data),
  getMemory: (params) => api.get("/translation/memory", { params }),
  addMemory: (data) => api.post("/translation/memory", data),
  updateMemory: (id, data) => api.put(`/translation/memory/${id}`, data),
  deleteMemory: (id) => api.delete(`/translation/memory/${id}`),
  getHistory: () => api.get("/translation/history"),
  upload: (formData) => api.post("/translation/upload", formData),
};

// Communication endpoints
export const communicationApi = {
  getMessages: () => api.get("/communication/messages"),
  sendMessage: (data) => api.post("/communication/messages", data),
  getMessage: (id) => api.get(`/communication/messages/${id}`),
  replyToMessage: (id, data) => api.post(`/communication/messages/${id}/reply`, data),
  deleteMessage: (id) => api.delete(`/communication/messages/${id}`),
  markAsRead: (id) => api.patch(`/communication/messages/${id}/read`),
  getUnreadCount: () => api.get("/communication/messages/unread/count"),
};

// Content management endpoints
export const contentApi = {
  getAll: () => api.get("/content"),
  getById: (id) => api.get(`/content/${id}`),
  create: (data) => api.post("/content", data),
  update: (id, data) => api.put(`/content/${id}`, data),
  delete: (id) => api.delete(`/content/${id}`),
  publish: (id) => api.patch(`/content/${id}/publish`),
  unpublish: (id) => api.patch(`/content/${id}/unpublish`),
};

export { api };
