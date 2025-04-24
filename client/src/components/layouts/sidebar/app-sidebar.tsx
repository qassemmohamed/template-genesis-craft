"use client";

import type * as React from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChartBarIcon,
  Cog6ToothIcon,
  QuestionMarkCircleIcon,
  LanguageIcon,
  InboxIcon,
  ArrowLeftOnRectangleIcon,
  UserIcon,
} from "@heroicons/react/24/outline";
import {
  FileTextIcon,
  ListChecksIcon,
  CalendarIcon,
  FileIcon,
  ListIcon,
  BarChart2Icon,
  GlobeIcon,
  MessageSquareIcon,
  ChevronLeft,
  Users2Icon,
} from "lucide-react";
import { NavLink } from "react-router-dom";
import { cn } from "@/lib/utils";
import { useAuth } from "@/context/AuthContext";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarRail,
} from "@/components/ui/sidebar";
import { EnhancedSidebarFooter } from "./sidebar-footer";
import { UsersIcon } from "@heroicons/react/24/solid";

interface NavigationItem {
  name: string;
  href: string;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  category?: string;
}

interface AppSidebarProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  isMobile?: boolean;
  onMobileClose?: () => void;
}

export function AppSidebar({
  open,
  onOpenChange,
  isMobile = false,
  onMobileClose,
}: AppSidebarProps) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const navigation: NavigationItem[] = [
    {
      name: "Statistics",
      href: "/dashboard",
      icon: ChartBarIcon,
      category: "Main",
    },
    {
      name: "Services",
      href: "/dashboard/services",
      icon: Cog6ToothIcon,
      category: "Main",
    },
    {
      name: "FAQs",
      href: "/dashboard/faqs",
      icon: QuestionMarkCircleIcon,
      category: "Main",
    },
    {
      name: "Inbox",
      href: "/dashboard/inbox",
      icon: InboxIcon,
      category: "Main",
    },
    {
      name: "Users",
      href: "/dashboard/clients",
      icon: Users2Icon,
      category: "Main",
    },
    {
      name: "Profile",
      href: "/dashboard/profile",
      icon: UserIcon,
      category: "Main",
    },
  ];

  const smartTools: NavigationItem[] = [
    {
      name: "Document Extractor",
      href: "/dashboard/document-extractor",
      icon: FileTextIcon,
    },
    {
      name: "Service Tracker",
      href: "/dashboard/service-tracker",
      icon: ListChecksIcon,
    },
    { name: "Calendar", href: "/dashboard/calendar", icon: CalendarIcon },
    { name: "Templates", href: "/dashboard/templates", icon: FileIcon },
    { name: "Tasks", href: "/dashboard/tasks", icon: ListIcon },
    { name: "Reports", href: "/dashboard/reports", icon: BarChart2Icon },
    { name: "Translation", href: "/dashboard/translation", icon: GlobeIcon },
    {
      name: "Communication",
      href: "/dashboard/communication",
      icon: MessageSquareIcon,
    },
  ];

  const getUserInitials = () =>
    user?.fullName?.charAt(0).toUpperCase() ||
    user?.username?.charAt(0).toUpperCase() ||
    "U";

  if (isMobile) {
    return (
      <AnimatePresence>
        {open && (
          <>
            <div
              className="fixed inset-0 z-40 bg-background/80 backdrop-blur-sm"
              onClick={onMobileClose}
            />
            <motion.div
              className="fixed inset-y-0 left-0 z-50 w-full max-w-xs flex-col bg-[var(--sidebar-background)]"
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
            >
              <div className="flex h-16 items-center justify-between border-b border-[var(--sidebar-border)] px-4">
                <div className="text-xl font-bold text-[var(--headline)]">
                  SamTax Admin
                </div>
                <Button
                  variant="ghost"
                  onClick={onMobileClose}
                  className="h-8 w-8"
                >
                  <ChevronLeft className="h-5 w-5" />
                  <span className="sr-only">Close sidebar</span>
                </Button>
              </div>
              <div className="flex-1 overflow-y-auto p-4">
                <div className="space-y-6">
                  <div>
                    <h3 className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                      Main
                    </h3>
                    <div className="space-y-1">
                      {navigation
                        .filter((item) => item.category === "Main")
                        .map((item) => (
                          <NavLink
                            key={item.name}
                            to={item.href}
                            className={({ isActive }) =>
                              cn(
                                "group flex items-center rounded-md px-3 py-2 text-sm font-medium transition-all",
                                isActive
                                  ? "bg-accent text-accent-foreground"
                                  : "text-foreground hover:bg-accent/50 hover:text-accent-foreground",
                              )
                            }
                            onClick={onMobileClose}
                          >
                            <item.icon className="mr-3 h-5 w-5 flex-shrink-0 transition-transform group-hover:scale-110" />
                            {item.name}
                          </NavLink>
                        ))}
                    </div>
                  </div>
                  <div>
                    <h3 className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                      Smart Tools
                    </h3>
                    <div className="space-y-1">
                      {smartTools.map((item) => (
                        <NavLink
                          key={item.name}
                          to={item.href}
                          className={({ isActive }) =>
                            cn(
                              "group flex items-center rounded-md px-3 py-2 text-sm font-medium transition-all",
                              isActive
                                ? "bg-accent text-accent-foreground"
                                : "text-foreground hover:bg-accent/50 hover:text-accent-foreground",
                            )
                          }
                          onClick={onMobileClose}
                        >
                          <item.icon className="mr-3 h-5 w-5 flex-shrink-0 transition-transform group-hover:scale-110" />
                          {item.name}
                        </NavLink>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
              <div className="border-t border-[var(--sidebar-border)] p-4">
                <button
                  className="group flex w-full items-center"
                  onClick={handleLogout}
                >
                  <Avatar className="mr-3 h-8 w-8 transition-transform group-hover:scale-105">
                    <AvatarImage
                      src={user?.avatarUrl || "/default-avatar.png"}
                    />
                    <AvatarFallback>{getUserInitials()}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-sm font-medium text-foreground">
                      {user?.fullName || user?.username || "Admin"}
                    </p>
                    <p className="flex items-center text-xs text-muted-foreground">
                      <ArrowLeftOnRectangleIcon className="mr-1 h-4 w-4" />
                      Logout
                    </p>
                  </div>
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    );
  }

  return (
    <SidebarProvider open={open} onOpenChange={onOpenChange}>
      <Sidebar collapsible="icon">
        <SidebarHeader className="border-b border-sidebar-border">
          <div className="flex h-16 items-center px-4">
            <div className="text-xl font-bold text-sidebar-foreground">
              SamTax Admin
            </div>
          </div>
        </SidebarHeader>
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel>Main</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {navigation
                  .filter((item) => item.category === "Main")
                  .map((item) => (
                    <SidebarMenuItem key={item.name}>
                      <SidebarMenuButton asChild tooltip={item.name}>
                        <NavLink
                          to={item.href}
                          className={({ isActive }) =>
                            cn(isActive && "data-[active=true]")
                          }
                        >
                          <item.icon className="h-5 w-5" />
                          <span>{item.name}</span>
                        </NavLink>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
          <SidebarGroup>
            <SidebarGroupLabel>Smart Tools</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {smartTools.map((item) => (
                  <SidebarMenuItem key={item.name}>
                    <SidebarMenuButton asChild tooltip={item.name}>
                      <NavLink
                        to={item.href}
                        className={({ isActive }) =>
                          cn(isActive && "data-[active=true]")
                        }
                      >
                        <item.icon className="h-5 w-5" />
                        <span>{item.name}</span>
                      </NavLink>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
        <EnhancedSidebarFooter />
        <SidebarRail />
      </Sidebar>
    </SidebarProvider>
  );
}
