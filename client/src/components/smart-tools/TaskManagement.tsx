import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import {
  CheckIcon,
  PlusIcon,
  Clock8Icon,
  UserIcon,
  CalendarIcon,
  TagIcon,
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { format } from "date-fns";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useTranslation } from "react-i18next";

// Mock data
interface Task {
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

const initialTasks: Task[] = [
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

const TaskManagement: React.FC = () => {
  const { t } = useTranslation();
  const { toast } = useToast();
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [filter, setFilter] = useState<
    "all" | "tax" | "bookkeeping" | "translation" | "immigration" | "notary"
  >("all");

  // Add a new task
  const addTask = () => {
    if (!newTaskTitle.trim()) {
      toast({
        title: "Task title required",
        description: "Please enter a task title",
        variant: "destructive",
      });
      return;
    }

    const newTask: Task = {
      id: Date.now().toString(),
      title: newTaskTitle,
      status: "todo",
      priority: "medium",
      dueDate: format(new Date(), "yyyy-MM-dd"),
      service: "tax",
    };

    setTasks([...tasks, newTask]);
    setNewTaskTitle("");
    toast({
      title: "Task added",
      description: "New task has been added successfully",
    });
  };

  // Toggle task status
  const toggleTaskStatus = (id: string) => {
    setTasks(
      tasks.map((task) => {
        if (task.id === id) {
          const newStatus = task.status === "completed" ? "todo" : "completed";
          return { ...task, status: newStatus };
        }
        return task;
      }),
    );
  };

  // Filter tasks by service type
  const getFilteredTasks = () => {
    return filter === "all"
      ? tasks
      : tasks.filter((task) => task.service === filter);
  };

  // Group tasks by status
  const todoTasks = getFilteredTasks().filter((task) => task.status === "todo");
  const inProgressTasks = getFilteredTasks().filter(
    (task) => task.status === "in-progress",
  );
  const completedTasks = getFilteredTasks().filter(
    (task) => task.status === "completed",
  );

  // Get priority label and styling
  const getPriorityBadge = (priority: string) => {
    const priorities: Record<string, { bg: string; text: string }> = {
      high: { bg: "bg-red-100", text: "text-red-800" },
      medium: { bg: "bg-yellow-100", text: "text-yellow-800" },
      low: { bg: "bg-green-100", text: "text-green-800" },
    };

    const style = priorities[priority] || priorities.medium;
    return (
      <span
        className={`rounded-full px-2 py-1 text-xs ${style.bg} ${style.text}`}
      >
        {priority}
      </span>
    );
  };

  // Get service badge styling
  const getServiceBadge = (service: string) => {
    const services: Record<string, { bg: string; text: string }> = {
      tax: { bg: "bg-blue-100", text: "text-blue-800" },
      bookkeeping: { bg: "bg-purple-100", text: "text-purple-800" },
      translation: { bg: "bg-green-100", text: "text-green-800" },
      immigration: { bg: "bg-orange-100", text: "text-orange-800" },
      notary: { bg: "bg-gray-100", text: "text-[var(--headline)]" },
    };

    const style = services[service] || services.tax;
    return (
      <span
        className={`rounded-full px-2 py-1 text-xs ${style.bg} ${style.text}`}
      >
        {service}
      </span>
    );
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Task Management</CardTitle>
            <CardDescription>
              Track, organize, and prioritize your daily tasks
            </CardDescription>
          </div>
          <div className="flex gap-2">
            <Select
              value={filter}
              onValueChange={(value: any) => setFilter(value)}
            >
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Filter by service" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Services</SelectItem>
                <SelectItem value="tax">Tax Filing</SelectItem>
                <SelectItem value="bookkeeping">Bookkeeping</SelectItem>
                <SelectItem value="translation">Translation</SelectItem>
                <SelectItem value="immigration">Immigration</SelectItem>
                <SelectItem value="notary">Notary</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="mb-6 flex items-center space-x-2">
          <Input
            placeholder="Add a new task..."
            value={newTaskTitle}
            onChange={(e) => setNewTaskTitle(e.target.value)}
            className="flex-1"
            onKeyDown={(e) => e.key === "Enter" && addTask()}
          />
          <Button onClick={addTask}>
            <PlusIcon className="mr-2 h-4 w-4" />
            Add Task
          </Button>
        </div>

        <Tabs defaultValue="todo">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="todo">To Do ({todoTasks.length})</TabsTrigger>
            <TabsTrigger value="in-progress">
              In Progress ({inProgressTasks.length})
            </TabsTrigger>
            <TabsTrigger value="completed">
              Completed ({completedTasks.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="todo" className="mt-4 space-y-3">
            {todoTasks.length === 0 ? (
              <div className="py-8 text-center text-[var(--paragraph)]">
                No pending tasks
              </div>
            ) : (
              todoTasks.map((task) => (
                <div
                  key={task.id}
                  className="flex items-start space-x-3 rounded-md border p-3"
                >
                  <Button
                    variant="outline"
                    className="h-6 w-6 rounded-full"
                    onClick={() => toggleTaskStatus(task.id)}
                  >
                    <CheckIcon className="h-4 w-4" />
                  </Button>
                  <div className="flex-1">
                    <div className="flex justify-between">
                      <h4 className="font-medium">{task.title}</h4>
                      <div className="flex space-x-2">
                        {getPriorityBadge(task.priority)}
                        {getServiceBadge(task.service)}
                      </div>
                    </div>
                    {task.description && (
                      <p className="mt-1 text-sm text-[var(--paragraph)]">
                        {task.description}
                      </p>
                    )}
                    <div className="mt-2 flex items-center space-x-4 text-xs text-[var(--paragraph)]">
                      {task.client && (
                        <span className="flex items-center">
                          <UserIcon className="mr-1 h-3 w-3" />
                          {task.client}
                        </span>
                      )}
                      <span className="flex items-center">
                        <CalendarIcon className="mr-1 h-3 w-3" />
                        Due: {new Date(task.dueDate).toLocaleDateString()}
                      </span>
                      {task.assignedTo && (
                        <span className="flex items-center">
                          <Avatar className="mr-1 h-4 w-4">
                            <AvatarFallback className="text-[8px]">
                              {task.assignedTo.charAt(0)}
                            </AvatarFallback>
                          </Avatar>
                          {task.assignedTo}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </TabsContent>

          <TabsContent value="in-progress" className="mt-4 space-y-3">
            {inProgressTasks.length === 0 ? (
              <div className="py-8 text-center text-[var(--paragraph)]">
                No tasks in progress
              </div>
            ) : (
              inProgressTasks.map((task) => (
                <div
                  key={task.id}
                  className="flex items-start space-x-3 rounded-md border p-3"
                >
                  <div className="flex h-6 w-6 items-center justify-center">
                    <Clock8Icon className="h-5 w-5 text-blue-500" />
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between">
                      <h4 className="font-medium">{task.title}</h4>
                      <div className="flex space-x-2">
                        {getPriorityBadge(task.priority)}
                        {getServiceBadge(task.service)}
                      </div>
                    </div>
                    {task.description && (
                      <p className="mt-1 text-sm text-[var(--paragraph)]">
                        {task.description}
                      </p>
                    )}
                    <div className="mt-2 flex items-center space-x-4 text-xs text-[var(--paragraph)]">
                      {task.client && (
                        <span className="flex items-center">
                          <UserIcon className="mr-1 h-3 w-3" />
                          {task.client}
                        </span>
                      )}
                      <span className="flex items-center">
                        <CalendarIcon className="mr-1 h-3 w-3" />
                        Due: {new Date(task.dueDate).toLocaleDateString()}
                      </span>
                      {task.assignedTo && (
                        <span className="flex items-center">
                          <Avatar className="mr-1 h-4 w-4">
                            <AvatarFallback className="text-[8px]">
                              {task.assignedTo.charAt(0)}
                            </AvatarFallback>
                          </Avatar>
                          {task.assignedTo}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </TabsContent>

          <TabsContent value="completed" className="mt-4 space-y-3">
            {completedTasks.length === 0 ? (
              <div className="py-8 text-center text-[var(--paragraph)]">
                No completed tasks
              </div>
            ) : (
              completedTasks.map((task) => (
                <div
                  key={task.id}
                  className="flex items-start space-x-3 rounded-md border bg-gray-50 p-3"
                >
                  <Button
                    variant="outline"
                    className="h-6 w-6 rounded-full border-green-200 bg-green-100 text-green-800"
                    onClick={() => toggleTaskStatus(task.id)}
                  >
                    <CheckIcon className="h-4 w-4" />
                  </Button>
                  <div className="flex-1">
                    <div className="flex justify-between">
                      <h4 className="font-medium text-[var(--paragraph)] line-through">
                        {task.title}
                      </h4>
                      <div className="flex space-x-2">
                        {getServiceBadge(task.service)}
                      </div>
                    </div>
                    {task.description && (
                      <p className="mt-1 text-sm text-gray-400 line-through">
                        {task.description}
                      </p>
                    )}
                    <div className="mt-2 flex items-center space-x-4 text-xs text-gray-400">
                      {task.client && (
                        <span className="flex items-center">
                          <UserIcon className="mr-1 h-3 w-3" />
                          {task.client}
                        </span>
                      )}
                      <span className="flex items-center">
                        <CalendarIcon className="mr-1 h-3 w-3" />
                        Completed
                      </span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default TaskManagement;
