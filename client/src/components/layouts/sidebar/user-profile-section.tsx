"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeftOnRectangleIcon,
  UserCircleIcon,
  Cog6ToothIcon,
  ChevronUpIcon,
} from "@heroicons/react/24/outline";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface UserProfileSectionProps {
  user: any;
  getUserInitials: () => string;
  handleLogout: () => void;
  onViewProfile?: () => void;
  onSettings?: () => void;
}

export function UserProfileSection({
  user,
  getUserInitials,
  handleLogout,
  onViewProfile,
  onSettings,
}: UserProfileSectionProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <div className="relative flex flex-shrink-0 border-t border-[var(--sidebar-border)] p-4">
      <TooltipProvider delayDuration={300}>
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="group flex w-full items-center rounded-lg p-2 transition-all duration-200 hover:bg-[var(--sidebar-accent)] focus:outline-none focus:ring-2 focus:ring-[var(--sidebar-ring)] focus:ring-offset-1"
          aria-expanded={isMenuOpen}
          aria-haspopup="true"
        >
          <div className="relative">
            <Avatar className="h-10 w-10 border-2 border-transparent transition-all duration-300 group-hover:border-[var(--sidebar-accent-foreground)] group-hover:shadow-md">
              <AvatarImage
                src={user?.avatarUrl || "/placeholder.svg"}
                alt={user?.fullName || user?.username || "User"}
              />
              <AvatarFallback className="bg-[var(--sidebar-accent)] text-[var(--sidebar-accent-foreground)]">
                {getUserInitials()}
              </AvatarFallback>
            </Avatar>
            <span className="absolute -bottom-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full border-2 border-[var(--sidebar-background)] bg-green-500">
              <span className="sr-only">Online</span>
            </span>
          </div>

          <div className="ml-3 flex-1 overflow-hidden">
            <p className="truncate text-sm font-medium text-[var(--sidebar-foreground)] transition-colors group-hover:text-[var(--sidebar-accent-foreground)]">
              {user?.fullName || user?.username || "Client"}
            </p>
            <p className="truncate text-xs text-[var(--muted-foreground)] transition-colors group-hover:text-[var(--sidebar-accent-foreground)]">
              {user?.email || "client@example.com"}
            </p>
          </div>

          <ChevronUpIcon
            className={`h-5 w-5 flex-shrink-0 text-[var(--muted-foreground)] transition-all duration-200 group-hover:text-[var(--sidebar-accent-foreground)] ${isMenuOpen ? "rotate-180" : "rotate-0"}`}
          />
        </button>

        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.15 }}
              className="absolute bottom-full left-4 right-4 mb-2 overflow-hidden rounded-lg border border-[var(--sidebar-border)] bg-[var(--sidebar-background)] shadow-lg"
            >
              <div className="p-1">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button
                      onClick={onViewProfile}
                      className="flex w-full items-center rounded-md px-3 py-2 text-sm text-[var(--sidebar-foreground)] hover:bg-[var(--sidebar-accent)] hover:text-[var(--sidebar-accent-foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--sidebar-ring)] focus:ring-offset-1"
                    >
                      <UserCircleIcon className="mr-2 h-4 w-4" />
                      View Profile
                    </button>
                  </TooltipTrigger>
                  <TooltipContent side="right">
                    <p>View and edit your profile</p>
                  </TooltipContent>
                </Tooltip>

                <Tooltip>
                  <TooltipTrigger asChild>
                    <button
                      onClick={onSettings}
                      className="flex w-full items-center rounded-md px-3 py-2 text-sm text-[var(--sidebar-foreground)] hover:bg-[var(--sidebar-accent)] hover:text-[var(--sidebar-accent-foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--sidebar-ring)] focus:ring-offset-1"
                    >
                      <Cog6ToothIcon className="mr-2 h-4 w-4" />
                      Settings
                    </button>
                  </TooltipTrigger>
                  <TooltipContent side="right">
                    <p>Manage your account settings</p>
                  </TooltipContent>
                </Tooltip>

                <div className="my-1 h-px bg-[var(--sidebar-border)]" />

                <Tooltip>
                  <TooltipTrigger asChild>
                    <button
                      onClick={handleLogout}
                      className="flex w-full items-center rounded-md px-3 py-2 text-sm text-red-500 hover:bg-red-50 hover:text-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-1 dark:hover:bg-red-950/30"
                    >
                      <ArrowLeftOnRectangleIcon className="mr-2 h-4 w-4" />
                      Logout
                    </button>
                  </TooltipTrigger>
                  <TooltipContent side="right">
                    <p>Sign out of your account</p>
                  </TooltipContent>
                </Tooltip>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </TooltipProvider>
    </div>
  );
}
