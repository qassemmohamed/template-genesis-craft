
import React from "react";
import { Task } from "./types";
import { TaskItem } from "./TaskItem";

interface TaskListProps {
  tasks: Task[];
  status: "todo" | "in-progress" | "completed";
  onToggleStatus: (id: string) => void;
}

export const TaskList: React.FC<TaskListProps> = ({ tasks, status, onToggleStatus }) => {
  if (tasks.length === 0) {
    const message = status === "completed" ? "No completed tasks" : 
                   status === "in-progress" ? "No tasks in progress" : 
                   "No pending tasks";
                   
    return (
      <div className="py-8 text-center text-[var(--paragraph)]">
        {message}
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {tasks.map((task) => (
        <TaskItem
          key={task.id}
          task={task}
          isCompleted={status === "completed"}
          onToggleStatus={onToggleStatus}
        />
      ))}
    </div>
  );
};
