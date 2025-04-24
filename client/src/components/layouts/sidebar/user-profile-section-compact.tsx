"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeftOnRectangleIcon,
  UserCircleIcon,
  Cog6ToothIcon,
} from "@heroicons/react/24/outline";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface UserProfileSectionCompactProps {
  user: any;
  getUserInitials: () => string;
  handleLogout: () => void;
  onViewProfile?: () => void;
  onSettings?: () => void;
}

export function UserProfileSectionCompact({
  user,
  getUserInitials,
  handleLogout,
  onViewProfile,
  onSettings,
}: UserProfileSectionCompactProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <div className="relative flex flex-shrink-0 justify-center border-t border-[var(--sidebar-border)] p-4">
      <TooltipProvider delayDuration={300}>
        <Tooltip>
          <TooltipTrigger asChild>
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="group relative flex h-10 w-10 items-center justify-center rounded-full transition-all duration-200 hover:bg-[var(--sidebar-accent)] focus:outline-none focus:ring-2 focus:ring-[var(--sidebar-ring)] focus:ring-offset-1"
              aria-expanded={isMenuOpen}
              aria-haspopup="true"
            >
              <Avatar className="h-9 w-9 border-2 border-transparent transition-all duration-300 group-hover:border-[var(--sidebar-accent-foreground)] group-hover:shadow-md">
                <AvatarImage
                  src={user?.avatarUrl || "/placeholder.svg"}
                  alt={user?.fullName || user?.username || "User"}
                />
                <AvatarFallback className="bg-[var(--sidebar-accent)] text-[var(--sidebar-accent-foreground)]">
                  {getUserInitials()}
                </AvatarFallback>
              </Avatar>
              <span className="absolute -bottom-0.5 -right-0.5 flex h-3 w-3 items-center justify-center rounded-full border-2 border-[var(--sidebar-background)] bg-green-500">
                <span className="sr-only">Online</span>
              </span>
            </button>
          </TooltipTrigger>
          <TooltipContent side="right">
            <p>{user?.fullName || user?.username || "Client"}</p>
          </TooltipContent>
        </Tooltip>

        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.15 }}
              className="absolute bottom-full left-0 mb-2 w-48 overflow-hidden rounded-lg border border-[var(--sidebar-border)] bg-[var(--sidebar-background)] shadow-lg"
            >
              <div className="p-2">
                <div className="mb-2 px-3 py-1.5">
                  <p className="truncate text-sm font-medium text-[var(--sidebar-foreground)]">
                    {user?.fullName || user?.username || "Client"}
                  </p>
                  <p className="truncate text-xs text-[var(--muted-foreground)]">
                    {user?.email || "client@example.com"}
                  </p>
                </div>

                <div className="h-px bg-[var(--sidebar-border)]" />

                <div className="p-1">
                  <button
                    onClick={onViewProfile}
                    className="flex w-full items-center rounded-md px-2 py-1.5 text-sm text-[var(--sidebar-foreground)] hover:bg-[var(--sidebar-accent)] hover:text-[var(--sidebar-accent-foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--sidebar-ring)] focus:ring-offset-1"
                  >
                    <UserCircleIcon className="mr-2 h-4 w-4" />
                    View Profile
                  </button>

                  <button
                    onClick={onSettings}
                    className="flex w-full items-center rounded-md px-2 py-1.5 text-sm text-[var(--sidebar-foreground)] hover:bg-[var(--sidebar-accent)] hover:text-[var(--sidebar-accent-foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--sidebar-ring)] focus:ring-offset-1"
                  >
                    <Cog6ToothIcon className="mr-2 h-4 w-4" />
                    Settings
                  </button>

                  <div className="my-1 h-px bg-[var(--sidebar-border)]" />

                  <button
                    onClick={handleLogout}
                    className="flex w-full items-center rounded-md px-2 py-1.5 text-sm text-red-500 hover:bg-red-50 hover:text-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-1 dark:hover:bg-red-950/30"
                  >
                    <ArrowLeftOnRectangleIcon className="mr-2 h-4 w-4" />
                    Logout
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </TooltipProvider>
    </div>
  );
}
