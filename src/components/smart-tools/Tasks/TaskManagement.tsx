
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
import { PlusIcon } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { format } from "date-fns";
import { useTranslation } from "react-i18next";
import { Task } from "./types";
import { initialTasks } from "./utils";
import { TaskList } from "./TaskList";

const TaskManagement: React.FC = () => {
  const { t } = useTranslation();
  const { toast } = useToast();
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [filter, setFilter] = useState<
    "all" | "tax" | "bookkeeping" | "translation" | "immigration" | "notary"
  >("all");

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

  const getFilteredTasks = () => {
    return filter === "all"
      ? tasks
      : tasks.filter((task) => task.service === filter);
  };

  const todoTasks = getFilteredTasks().filter((task) => task.status === "todo");
  const inProgressTasks = getFilteredTasks().filter(
    (task) => task.status === "in-progress",
  );
  const completedTasks = getFilteredTasks().filter(
    (task) => task.status === "completed",
  );

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

          <TabsContent value="todo" className="mt-4">
            <TaskList
              tasks={todoTasks}
              status="todo"
              onToggleStatus={toggleTaskStatus}
            />
          </TabsContent>

          <TabsContent value="in-progress" className="mt-4">
            <TaskList
              tasks={inProgressTasks}
              status="in-progress"
              onToggleStatus={toggleTaskStatus}
            />
          </TabsContent>

          <TabsContent value="completed" className="mt-4">
            <TaskList
              tasks={completedTasks}
              status="completed"
              onToggleStatus={toggleTaskStatus}
            />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default TaskManagement;
