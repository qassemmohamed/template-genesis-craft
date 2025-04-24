import { PriorityStyle, ServiceStyle, Task } from "./types";

export const getPriorityBadge = (priority: string): PriorityStyle => {
  const priorities: Record<string, PriorityStyle> = {
    high: { bg: "bg-red-100", text: "text-red-800" },
    medium: { bg: "bg-yellow-100", text: "text-yellow-800" },
    low: { bg: "bg-green-100", text: "text-green-800" },
  };

  return priorities[priority] || priorities.medium;
};

export const getServiceBadge = (service: string): ServiceStyle => {
  const services: Record<string, ServiceStyle> = {
    tax: { bg: "bg-blue-100", text: "text-blue-800" },
    bookkeeping: { bg: "bg-purple-100", text: "text-purple-800" },
    translation: { bg: "bg-green-100", text: "text-green-800" },
    immigration: { bg: "bg-orange-100", text: "text-orange-800" },
    notary: { bg: "bg-gray-100", text: "text-[var(--headline)]" },
  };

  return services[service] || services.tax;
};

export const initialTasks: Task[] = [
  {
    id: "1",
    title: "Complete John Smith's tax return",
    description: "Review documents and file Form 1040",
    status: "todo",
    priority: "high",
    dueDate: "2024-04-15",
    service: "tax",
    assignedTo: "Mahmoud",
    client: "John Smith",
  },
  {
    id: "2",
    title: "Translate birth certificate for Maria",
    description: "English to Spanish translation needed",
    status: "in-progress",
    priority: "medium",
    dueDate: "2024-04-10",
    service: "translation",
    assignedTo: "Mahmoud",
    client: "Maria Garcia",
  },
  {
    id: "3",
    title: "Review Ahmed's monthly bookkeeping",
    description: "Reconcile accounts and prepare monthly report",
    status: "completed",
    priority: "medium",
    dueDate: "2024-04-05",
    service: "bookkeeping",
    assignedTo: "Mahmoud",
    client: "Ahmed Khan",
  },
  {
    id: "4",
    title: "Complete I-130 form for Jean",
    description: "Family sponsorship application",
    status: "todo",
    priority: "high",
    dueDate: "2024-04-20",
    service: "immigration",
    assignedTo: "Mahmoud",
    client: "Jean Dupont",
  },
  {
    id: "5",
    title: "Notarize contract for Fatima",
    description: "Business contract notarization",
    status: "todo",
    priority: "low",
    dueDate: "2024-04-12",
    service: "notary",
    assignedTo: "Mahmoud",
    client: "Fatima Rahman",
  },
];
