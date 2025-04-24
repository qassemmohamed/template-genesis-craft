
import React from "react";
import { Task } from "./types";
import { getPriorityBadge, getServiceBadge } from "./utils";
import { Button } from "@/components/ui/button";
import { CheckIcon, UserIcon, CalendarIcon } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

interface TaskItemProps {
  task: Task;
  isCompleted?: boolean;
  onToggleStatus: (id: string) => void;
}

export const TaskItem: React.FC<TaskItemProps> = ({ 
  task, 
  isCompleted = false,
  onToggleStatus 
}) => {
  const priorityStyle = getPriorityBadge(task.priority);
  const serviceStyle = getServiceBadge(task.service);

  return (
    <div className={`flex items-start space-x-3 rounded-md border p-3 ${isCompleted ? 'bg-gray-50' : ''}`}>
      <Button
        variant="outline"
        className={`h-6 w-6 rounded-full ${
          isCompleted ? 'border-green-200 bg-green-100 text-green-800' : ''
        }`}
        onClick={() => onToggleStatus(task.id)}
      >
        <CheckIcon className="h-4 w-4" />
      </Button>
      <div className="flex-1">
        <div className="flex justify-between">
          <h4 className={`font-medium ${isCompleted ? 'text-[var(--paragraph)] line-through' : ''}`}>
            {task.title}
          </h4>
          <div className="flex space-x-2">
            {!isCompleted && <span className={`rounded-full px-2 py-1 text-xs ${priorityStyle.bg} ${priorityStyle.text}`}>
              {task.priority}
            </span>}
            <span className={`rounded-full px-2 py-1 text-xs ${serviceStyle.bg} ${serviceStyle.text}`}>
              {task.service}
            </span>
          </div>
        </div>
        {task.description && (
          <p className={`mt-1 text-sm ${isCompleted ? 'text-gray-400 line-through' : 'text-[var(--paragraph)]'}`}>
            {task.description}
          </p>
        )}
        <div className={`mt-2 flex items-center space-x-4 text-xs ${isCompleted ? 'text-gray-400' : 'text-[var(--paragraph)]'}`}>
          {task.client && (
            <span className="flex items-center">
              <UserIcon className="mr-1 h-3 w-3" />
              {task.client}
            </span>
          )}
          <span className="flex items-center">
            <CalendarIcon className="mr-1 h-3 w-3" />
            {isCompleted ? 'Completed' : `Due: ${new Date(task.dueDate).toLocaleDateString()}`}
          </span>
          {task.assignedTo && !isCompleted && (
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
  );
};
