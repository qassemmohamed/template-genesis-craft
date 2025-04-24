"use client";

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { LogOut, ChevronDown, User, Settings } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useAvatar } from "@/hooks/use-avatar";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
// import { Separator } from "@/components/ui/separator"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { SidebarFooter } from "@/components/ui/sidebar";

export function EnhancedSidebarFooter() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { avatarUrl } = useAvatar();
  const [isHovered, setIsHovered] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const handleProfileClick = () => {
    navigate("/dashboard/profile");
  };

  const handleSettingsClick = () => {
    navigate("/dashboard/settings");
  };

  const getUserInitials = () =>
    user?.fullName?.charAt(0).toUpperCase() ||
    user?.username?.charAt(0).toUpperCase() ||
    "U";

  return (
    <SidebarFooter className="border-t border-sidebar-border bg-sidebar-accent/30 px-3 py-3">
      {/* Expanded View */}
      <div className="group-data-[collapsible=icon]:hidden">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="flex h-auto w-full justify-start px-2 py-2 hover:bg-sidebar-accent"
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
            >
              <div className="flex w-full items-center">
                <motion.div
                  animate={{ scale: isHovered ? 1.05 : 1 }}
                  transition={{ duration: 0.2 }}
                  className="relative"
                >
                  <Avatar className="h-9 w-9 border-2 border-sidebar-accent shadow-sm">
                    <AvatarImage
                      src={
                        avatarUrl || user?.avatarUrl || "/default-avatar.png"
                      }
                    />
                    <AvatarFallback className="bg-primary text-primary-foreground">
                      {getUserInitials()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="border-sidebar-background absolute -bottom-1 -right-1 h-3 w-3 rounded-full border-2 bg-green-500" />
                </motion.div>
                <div className="ml-3 flex-1 overflow-hidden">
                  <p className="truncate text-sm font-medium">
                    {user?.fullName || user?.username || "Admin"}
                  </p>
                  <p className="truncate text-xs text-muted-foreground">
                    {user?.email || "admin@example.com"}
                  </p>
                </div>
                <ChevronDown className="ml-auto h-4 w-4 shrink-0 opacity-70" />
              </div>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleProfileClick}>
              <User className="mr-2 h-4 w-4" />
              <span>Profile</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleSettingsClick}>
              <Settings className="mr-2 h-4 w-4" />
              <span>Settings</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={handleLogout}
              className="text-red-500 focus:bg-red-50 focus:text-red-500 dark:focus:bg-red-950"
            >
              <LogOut className="mr-2 h-4 w-4" />
              <span>Log out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Collapsed View */}
      <div className="hidden group-data-[collapsible=icon]:block">
        <TooltipProvider>
          <Tooltip delayDuration={0}>
            <TooltipTrigger asChild>
              <div className="flex flex-col items-center gap-1">
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  transition={{ duration: 0.2 }}
                  className="relative"
                >
                  <Button
                    variant="ghost"
                    className="h-9 w-9 rounded-full p-0"
                    onClick={handleProfileClick}
                  >
                    <Avatar className="h-9 w-9 border-2 border-sidebar-accent shadow-sm">
                      <AvatarImage
                        src={
                          avatarUrl || user?.avatarUrl || "/default-avatar.png"
                        }
                      />
                      <AvatarFallback className="bg-primary text-primary-foreground">
                        {getUserInitials()}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                  <div className="border-sidebar-background absolute -bottom-1 -right-1 h-3 w-3 rounded-full border-2 bg-green-500" />
                </motion.div>

                {/* <Separator className="my-1 w-5" /> */}

                <Button
                  variant="ghost"
                  className="h-7 w-7 rounded-full text-red-500 hover:bg-red-100 hover:text-red-600 dark:hover:bg-red-950"
                  onClick={handleLogout}
                >
                  <LogOut className="h-4 w-4" />
                  <span className="sr-only">Log out</span>
                </Button>
              </div>
            </TooltipTrigger>
            <TooltipContent side="right" className="flex flex-col gap-1 p-0">
              <div className="px-3 py-2">
                <p className="font-medium">
                  {user?.fullName || user?.username || "Admin"}
                </p>
                <p className="text-xs text-muted-foreground">
                  {user?.email || "admin@example.com"}
                </p>
              </div>
              {/* <Separator /> */}
              <div className="px-3 py-2 text-xs">
                Click avatar for profile
                <br />
                Click icon below to log out
              </div>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    </SidebarFooter>
  );
}
