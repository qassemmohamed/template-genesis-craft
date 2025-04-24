
export interface Task {
  id: string;
  title: string;
  description?: string;
  status: "todo" | "in-progress" | "completed";
  priority: "low" | "medium" | "high";
  dueDate: string;
  service: "tax" | "bookkeeping" | "translation" | "immigration" | "notary";
  assignedTo?: string;
  client?: string;
}

export interface PriorityStyle {
  bg: string;
  text: string;
}

export interface ServiceStyle {
  bg: string;
  text: string;
}
