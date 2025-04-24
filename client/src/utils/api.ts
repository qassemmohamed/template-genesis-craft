
import axios, { AxiosInstance } from "axios";
import { toast } from "sonner";

const api: AxiosInstance = axios.create({
  baseURL: "/api",
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
  (response) => response.data,
  (error) => {
    const message = error.response?.data?.message || "An error occurred";
    toast.error(message);
    
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      window.location.href = "/login";
    }
    
    return Promise.reject(error);
  }
);

// Document Extractor endpoints
export const documentApi = {
  extract: (formData: FormData) => api.post("/documents/extract", formData),
  getAll: () => api.get("/documents"),
  getById: (id: string) => api.get(`/documents/${id}`),
  delete: (id: string) => api.delete(`/documents/${id}`),
};

// Service Tracker endpoints
export const serviceTrackerApi = {
  getAll: () => api.get("/services/tracking"),
  getById: (id: string) => api.get(`/services/tracking/${id}`),
  create: (data: any) => api.post("/services/tracking", data),
  update: (id: string, data: any) => api.put(`/services/tracking/${id}`, data),
  delete: (id: string) => api.delete(`/services/tracking/${id}`),
};

// Calendar endpoints
export const calendarApi = {
  getEvents: () => api.get("/calendar/events"),
  createEvent: (data: any) => api.post("/calendar/events", data),
  updateEvent: (id: string, data: any) => api.put(`/calendar/events/${id}`, data),
  deleteEvent: (id: string) => api.delete(`/calendar/events/${id}`),
  getAppointments: () => api.get("/calendar/appointments"),
  createAppointment: (data: any) => api.post("/calendar/appointments", data),
  updateAppointment: (id: string, data: any) => 
    api.put(`/calendar/appointments/${id}`, data),
  deleteAppointment: (id: string) => api.delete(`/calendar/appointments/${id}`),
  getReminders: () => api.get("/calendar/reminders"),
  createReminder: (data: any) => api.post("/calendar/reminders", data),
  updateReminder: (id: string, data: any) => 
    api.put(`/calendar/reminders/${id}`, data),
  deleteReminder: (id: string) => api.delete(`/calendar/reminders/${id}`),
};

// Template endpoints
export const templateApi = {
  getAll: () => api.get("/templates"),
  getById: (id: string) => api.get(`/templates/${id}`),
  create: (data: any) => api.post("/templates", data),
  update: (id: string, data: any) => api.put(`/templates/${id}`, data),
  delete: (id: string) => api.delete(`/templates/${id}`),
  generate: (templateId: string, data: any) => 
    api.post(`/templates/${templateId}/generate`, data),
};

// Task endpoints
export const taskApi = {
  getAll: () => api.get("/tasks"),
  getByService: (service: string) => api.get(`/tasks/service/${service}`),
  create: (data: any) => api.post("/tasks", data),
  update: (id: string, data: any) => api.put(`/tasks/${id}`, data),
  delete: (id: string) => api.delete(`/tasks/${id}`),
  updateStatus: (id: string, status: string) => 
    api.patch(`/tasks/${id}/status`, { status }),
};

// Report endpoints
export const reportApi = {
  getAll: () => api.get("/reports"),
  getById: (id: string) => api.get(`/reports/${id}`),
  generate: (type: string, params: any) => 
    api.post(`/reports/generate/${type}`, params),
  download: (id: string, format: string) => 
    api.get(`/reports/${id}/download?format=${format}`, {
      responseType: 'blob'
    }),
};

// Translation endpoints
export const translationApi = {
  translate: (data: any) => api.post("/translation/translate", data),
  getMemory: (params: any) => api.get("/translation/memory", { params }),
  addMemory: (data: any) => api.post("/translation/memory", data),
  updateMemory: (id: string, data: any) => api.put(`/translation/memory/${id}`, data),
  deleteMemory: (id: string) => api.delete(`/translation/memory/${id}`),
  getHistory: () => api.get("/translation/history"),
  upload: (formData: FormData) => api.post("/translation/upload", formData),
};

// Communication endpoints
export const communicationApi = {
  getMessages: () => api.get("/communication/messages"),
  sendMessage: (data: any) => api.post("/communication/messages", data),
  getMessage: (id: string) => api.get(`/communication/messages/${id}`),
  replyToMessage: (id: string, data: any) => 
    api.post(`/communication/messages/${id}/reply`, data),
  deleteMessage: (id: string) => api.delete(`/communication/messages/${id}`),
  markAsRead: (id: string) => api.patch(`/communication/messages/${id}/read`),
  getUnreadCount: () => api.get("/communication/messages/unread/count"),
};

// Content management endpoints
export const contentApi = {
  getAll: () => api.get("/content"),
  getById: (id: string) => api.get(`/content/${id}`),
  create: (data: any) => api.post("/content", data),
  update: (id: string, data: any) => api.put(`/content/${id}`, data),
  delete: (id: string) => api.delete(`/content/${id}`),
  publish: (id: string) => api.patch(`/content/${id}/publish`),
  unpublish: (id: string) => api.patch(`/content/${id}/unpublish`),
};

export { api };
