import React, { useState } from "react";
import { Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";

export const Notifications = () => {
  const [notifications, setNotifications] = useState(3);

  const handleClick = () => {
    setNotifications(0);
  };

  return (
    <DropdownMenu>
      <TooltipProvider>
        <Tooltip>
          <DropdownMenuTrigger asChild>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="relative h-9 w-9"
                onClick={handleClick}
              >
                <Bell className="h-4 w-4" />
                {notifications > 0 && (
                  <Badge
                    variant="default"
                    className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full p-0 text-[10px]"
                  >
                    {notifications}
                  </Badge>
                )}
                <span className="sr-only">Notifications</span>
              </Button>
            </TooltipTrigger>
          </DropdownMenuTrigger>
          <TooltipContent side="bottom">
            <p>Notifications</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      <DropdownMenuContent align="end" className="w-64">
        <div className="p-4">
          <h3 className="text-lg font-semibold">Notifications</h3>
          <ul className="mt-2 space-y-2 text-sm text-muted-foreground">
            <DropdownMenuItem>New user signed up</DropdownMenuItem>
            <DropdownMenuItem>System update available</DropdownMenuItem>
            <DropdownMenuItem>New comment on your post</DropdownMenuItem>
          </ul>
        </div>
        <div className="border-t p-2">
          <Button variant="ghost" size="sm" className="w-full">
            View All
          </Button>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
