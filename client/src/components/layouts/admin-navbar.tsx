"use client";

import * as React from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Bell,
  ChevronDown,
  Menu,
  Search,
  Settings,
  User,
  X,
  LogOut,
  LayoutDashboard,
  Users,
  FileText,
  HelpCircle,
  Globe,
  Moon,
  Sun,
  Laptop,
  MessageSquare,
  BarChart3,
  ShieldAlert,
} from "lucide-react";
import { useTranslation } from "react-i18next";
import i18n from "@/i18n";

import { cn } from "@/lib/utils";
import { useAuth } from "@/context/AuthContext";
import { toast } from "@/hooks/use-toast";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import Logo from "@/components/ui/Logo";

// Import flag images
import enFlag from "@/assets/english.svg";
import arFlag from "@/assets/arabic.svg";
import frFlag from "@/assets/fransh.svg";
import AdminAvatar from "./AdminAvatar";

interface Language {
  code: string;
  name: string;
  flag: string;
}

interface Notification {
  id: string;
  title: string;
  description: string;
  time: string;
  read: boolean;
  type: "info" | "warning" | "success" | "error";
}

const languages: Language[] = [
  { code: "en", name: "English", flag: enFlag },
  { code: "ar", name: "العربية", flag: arFlag },
  { code: "fr", name: "Français", flag: frFlag },
];

// Sample notifications for demo
const sampleNotifications: Notification[] = [
  {
    id: "1",
    title: "New User Registration",
    description: "John Doe has registered as a new user",
    time: "5 minutes ago",
    read: false,
    type: "info",
  },
  {
    id: "2",
    title: "System Update",
    description: "System will undergo maintenance in 2 hours",
    time: "1 hour ago",
    read: false,
    type: "warning",
  },
  {
    id: "3",
    title: "Payment Received",
    description: "Payment of $1,200 received from Client XYZ",
    time: "3 hours ago",
    read: true,
    type: "success",
  },
  {
    id: "4",
    title: "Security Alert",
    description: "Multiple failed login attempts detected",
    time: "Yesterday",
    read: true,
    type: "error",
  },
];

// Admin navigation items
const adminNavItems = [
  {
    title: "Dashboard",
    href: "/admin/dashboard",
    description: "Overview of system performance and metrics",
    icon: LayoutDashboard,
  },
  {
    title: "Users",
    href: "/admin/users",
    description: "Manage user accounts and permissions",
    icon: Users,
  },
  {
    title: "Content",
    href: "/admin/content",
    description: "Manage website content and pages",
    icon: FileText,
  },
  {
    title: "Reports",
    href: "/admin/reports",
    description: "View system reports and analytics",
    icon: BarChart3,
  },
  {
    title: "Settings",
    href: "/admin/settings",
    description: "Configure system settings and preferences",
    icon: Settings,
  },
];

// Quick actions for admin
const quickActions = [
  {
    title: "Add New User",
    href: "/admin/users/new",
    icon: Users,
    shortcut: "⇧+U",
  },
  {
    title: "Create Content",
    href: "/admin/content/new",
    icon: FileText,
    shortcut: "⇧+C",
  },
  {
    title: "System Settings",
    href: "/admin/settings",
    icon: Settings,
    shortcut: "⇧+S",
  },
  {
    title: "View Reports",
    href: "/admin/reports",
    icon: BarChart3,
    shortcut: "⇧+R",
  },
];

export function AdminNavbar() {
  const { t } = useTranslation();
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [theme, setTheme] = React.useState<"light" | "dark" | "system">(
    () =>
      (localStorage.getItem("theme") as "light" | "dark" | "system") ||
      "system",
  );

  const [notifications, setNotifications] =
    React.useState<Notification[]>(sampleNotifications);
  const [isSearchOpen, setIsSearchOpen] = React.useState(false);
  const [searchQuery, setSearchQuery] = React.useState("");

  // Initialize selected language based on current i18n language or localStorage
  const [selectedLang, setSelectedLang] = React.useState<Language>(() => {
    const savedLang =
      localStorage.getItem("selectedLanguage") || i18n.language || "en";
    return languages.find((lang) => lang.code === savedLang) || languages[0];
  });

  // Effect to update document direction and language when component mounts
  React.useEffect(() => {
    const currentLangCode =
      i18n.language || localStorage.getItem("selectedLanguage") || "en";
    const currentLang =
      languages.find((lang) => lang.code === currentLangCode) || languages[0];

    document.documentElement.lang = currentLang.code;
    document.documentElement.dir = currentLang.code === "ar" ? "rtl" : "ltr";
    setSelectedLang(currentLang);

    // Ensure i18n language matches
    if (i18n.language !== currentLang.code) {
      i18n.changeLanguage(currentLang.code);
    }
  }, []);

  // Effect to handle theme changes
  React.useEffect(() => {
    const root = window.document.documentElement;

    root.classList.remove("light", "dark");

    if (theme === "system") {
      const systemTheme = window.matchMedia("(prefers-color-scheme: dark)")
        .matches
        ? "dark"
        : "light";
      root.classList.add(systemTheme);
    } else {
      root.classList.add(theme);
    }

    localStorage.setItem("theme", theme);
  }, [theme]);

  const changeLanguage = (lang: Language) => {
    if (lang.code === selectedLang.code) return;

    i18n.changeLanguage(lang.code);
    localStorage.setItem("selectedLanguage", lang.code);
    document.documentElement.lang = lang.code;
    document.documentElement.dir = lang.code === "ar" ? "rtl" : "ltr";
    setSelectedLang(lang);
    toast({ title: t("navbar.languageToast") });
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const getUserInitials = () => {
    if (user?.fullName) {
      return user.fullName.charAt(0).toUpperCase();
    }
    if (user?.username) {
      return user.username.charAt(0).toUpperCase();
    }
    return "A";
  };

  const markAllNotificationsAsRead = () => {
    setNotifications(
      notifications.map((notification) => ({
        ...notification,
        read: true,
      })),
    );
    toast({ title: "All notifications marked as read" });
  };

  const unreadNotificationsCount = notifications.filter(
    (notification) => !notification.read,
  ).length;

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Implement search functionality
    toast({ title: `Searching for: ${searchQuery}` });
    setSearchQuery("");
    setIsSearchOpen(false);
  };

  const getNotificationIcon = (type: Notification["type"]) => {
    switch (type) {
      case "info":
        return <MessageSquare className="h-4 w-4 text-blue-500" />;
      case "warning":
        return <HelpCircle className="h-4 w-4 text-amber-500" />;
      case "success":
        return <Users className="h-4 w-4 text-green-500" />;
      case "error":
        return <ShieldAlert className="h-4 w-4 text-red-500" />;
      default:
        return <Bell className="h-4 w-4" />;
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-2 md:gap-4">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" className="md:hidden">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="flex flex-col">
              <SheetHeader className="border-b pb-4">
                <SheetTitle className="text-left">Admin Panel</SheetTitle>
              </SheetHeader>
              <div className="flex-1 overflow-auto py-4">
                <nav className="grid gap-2">
                  {adminNavItems.map((item) => (
                    <Link
                      key={item.href}
                      to={item.href}
                      className={cn(
                        "flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium hover:bg-accent",
                        location.pathname === item.href && "bg-accent",
                      )}
                    >
                      <item.icon className="h-4 w-4" />
                      {item.title}
                    </Link>
                  ))}
                </nav>
              </div>
              <div className="border-t pt-4">
                <div className="flex flex-col gap-2">
                  <Button variant="outline" asChild>
                    <Link to="/admin/settings">
                      <Settings className="mr-2 h-4 w-4" />
                      Settings
                    </Link>
                  </Button>
                  <Button variant="outline" onClick={handleLogout}>
                    <LogOut className="mr-2 h-4 w-4" />
                    Logout
                  </Button>
                </div>
              </div>
            </SheetContent>
          </Sheet>

          <Link to="/admin/dashboard" className="flex items-center gap-2">
            <Logo />
            <span className="hidden font-bold md:inline-block">
              Admin Panel
            </span>
          </Link>

          <NavigationMenu className="hidden md:flex">
            <NavigationMenuList>
              <NavigationMenuItem>
                <NavigationMenuTrigger>Dashboard</NavigationMenuTrigger>
                <NavigationMenuContent>
                  <ul className="grid gap-3 p-4 md:w-[400px] lg:w-[500px] lg:grid-cols-2">
                    <li className="row-span-3">
                      <NavigationMenuLink asChild>
                        <Link
                          to="/admin/dashboard"
                          className="flex h-full w-full select-none flex-col justify-end rounded-md bg-gradient-to-b from-muted/50 to-muted p-6 no-underline outline-none focus:shadow-md"
                        >
                          <LayoutDashboard className="h-6 w-6" />
                          <div className="mb-2 mt-4 text-lg font-medium">
                            Admin Dashboard
                          </div>
                          <p className="text-sm leading-tight text-muted-foreground">
                            View system performance, metrics, and manage your
                            application
                          </p>
                        </Link>
                      </NavigationMenuLink>
                    </li>
                    {adminNavItems.slice(1, 5).map((item) => (
                      <li key={item.href}>
                        <NavigationMenuLink asChild>
                          <Link
                            to={item.href}
                            className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                          >
                            <div className="flex items-center gap-2 text-sm font-medium leading-none">
                              <item.icon className="h-4 w-4" />
                              {item.title}
                            </div>
                            <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                              {item.description}
                            </p>
                          </Link>
                        </NavigationMenuLink>
                      </li>
                    ))}
                  </ul>
                </NavigationMenuContent>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavigationMenuTrigger>Users</NavigationMenuTrigger>
                <NavigationMenuContent>
                  <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2">
                    <li>
                      <NavigationMenuLink asChild>
                        <Link
                          to="/admin/users"
                          className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                        >
                          <div className="text-sm font-medium leading-none">
                            All Users
                          </div>
                          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                            View and manage all user accounts
                          </p>
                        </Link>
                      </NavigationMenuLink>
                    </li>
                    <li>
                      <NavigationMenuLink asChild>
                        <Link
                          to="/admin/users/new"
                          className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                        >
                          <div className="text-sm font-medium leading-none">
                            Add User
                          </div>
                          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                            Create a new user account
                          </p>
                        </Link>
                      </NavigationMenuLink>
                    </li>
                    <li>
                      <NavigationMenuLink asChild>
                        <Link
                          to="/admin/roles"
                          className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                        >
                          <div className="text-sm font-medium leading-none">
                            Roles & Permissions
                          </div>
                          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                            Manage user roles and permissions
                          </p>
                        </Link>
                      </NavigationMenuLink>
                    </li>
                    <li>
                      <NavigationMenuLink asChild>
                        <Link
                          to="/admin/activity"
                          className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                        >
                          <div className="text-sm font-medium leading-none">
                            Activity Log
                          </div>
                          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                            View user activity and audit logs
                          </p>
                        </Link>
                      </NavigationMenuLink>
                    </li>
                  </ul>
                </NavigationMenuContent>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <Link
                  to="/admin/settings"
                  className={navigationMenuTriggerStyle()}
                >
                  Settings
                </Link>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
        </div>

        <div className="flex items-center gap-2">
          {/* Search Button */}
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  onClick={() => setIsSearchOpen(!isSearchOpen)}
                  className="hidden sm:flex"
                >
                  <Search className="h-5 w-5" />
                  <span className="sr-only">Search</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Search (Ctrl+K)</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          {/* Search Dialog */}
          {isSearchOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="absolute left-0 right-0 top-16 z-50 mx-auto w-full max-w-2xl rounded-md border bg-background p-4 shadow-lg"
            >
              <form onSubmit={handleSearch} className="flex gap-2">
                <Input
                  type="search"
                  placeholder="Search..."
                  className="flex-1"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  autoFocus
                />
                <Button type="submit">Search</Button>
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => setIsSearchOpen(false)}
                >
                  <X className="h-5 w-5" />
                </Button>
              </form>
              <div className="mt-2">
                <p className="text-xs text-muted-foreground">
                  Press <kbd className="rounded border px-1 text-xs">ESC</kbd>{" "}
                  to close
                </p>
              </div>
            </motion.div>
          )}

          {/* Quick Actions */}
          <DropdownMenu>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="hidden md:flex">
                      <BarChart3 className="h-5 w-5" />
                      <span className="sr-only">Quick actions</span>
                    </Button>
                  </DropdownMenuTrigger>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Quick Actions</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>Quick Actions</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                {quickActions.map((action) => (
                  <DropdownMenuItem key={action.href} asChild>
                    <Link
                      to={action.href}
                      className="flex w-full cursor-pointer"
                    >
                      <action.icon className="mr-2 h-4 w-4" />
                      <span>{action.title}</span>
                      <DropdownMenuShortcut>
                        {action.shortcut}
                      </DropdownMenuShortcut>
                    </Link>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Notifications */}
          <DropdownMenu>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="relative">
                      <Bell className="h-5 w-5" />
                      {unreadNotificationsCount > 0 && (
                        <Badge
                          variant="default"
                          className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full p-0 text-xs"
                        >
                          {unreadNotificationsCount}
                        </Badge>
                      )}
                      <span className="sr-only">Notifications</span>
                    </Button>
                  </DropdownMenuTrigger>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Notifications</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            <DropdownMenuContent align="end" className="w-80">
              <DropdownMenuLabel className="flex items-center justify-between">
                <span>Notifications</span>
                {unreadNotificationsCount > 0 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={markAllNotificationsAsRead}
                    className="h-auto px-2 py-1 text-xs"
                  >
                    Mark all as read
                  </Button>
                )}
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              {notifications.length > 0 ? (
                <>
                  <div className="max-h-80 overflow-auto">
                    {notifications.map((notification) => (
                      <DropdownMenuItem
                        key={notification.id}
                        className="cursor-pointer"
                      >
                        <div className="flex w-full gap-2 py-1">
                          <div className="mt-1 flex-shrink-0">
                            {getNotificationIcon(notification.type)}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center justify-between">
                              <p
                                className={cn(
                                  "text-sm font-medium",
                                  !notification.read && "font-semibold",
                                )}
                              >
                                {notification.title}
                              </p>
                              {!notification.read && (
                                <Badge
                                  variant="secondary"
                                  className="ml-2 h-1.5 w-1.5 rounded-full p-0"
                                />
                              )}
                            </div>
                            <p className="line-clamp-2 text-xs text-muted-foreground">
                              {notification.description}
                            </p>
                            <p className="mt-1 text-xs text-muted-foreground">
                              {notification.time}
                            </p>
                          </div>
                        </div>
                      </DropdownMenuItem>
                    ))}
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link
                      to="/admin/notifications"
                      className="flex w-full cursor-pointer justify-center text-center text-sm font-medium"
                    >
                      View all notifications
                    </Link>
                  </DropdownMenuItem>
                </>
              ) : (
                <div className="py-4 text-center text-sm text-muted-foreground">
                  No notifications
                </div>
              )}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Language Selector */}
          <DropdownMenu>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="hidden md:flex">
                      <Globe className="h-5 w-5" />
                      <span className="sr-only">Language</span>
                    </Button>
                  </DropdownMenuTrigger>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Language: {selectedLang.name}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Language</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuRadioGroup value={selectedLang.code}>
                {languages.map((lang) => (
                  <DropdownMenuRadioItem
                    key={lang.code}
                    value={lang.code}
                    className="cursor-pointer"
                    onClick={() => changeLanguage(lang)}
                  >
                    <div className="flex items-center gap-2">
                      <img
                        src={lang.flag || "/placeholder.svg"}
                        alt={lang.code}
                        className="h-4 w-4 rounded-sm object-cover"
                      />
                      {lang.name}
                    </div>
                  </DropdownMenuRadioItem>
                ))}
              </DropdownMenuRadioGroup>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Theme Selector */}
          <DropdownMenu>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost">
                      {theme === "light" ? (
                        <Sun className="h-5 w-5" />
                      ) : theme === "dark" ? (
                        <Moon className="h-5 w-5" />
                      ) : (
                        <Laptop className="h-5 w-5" />
                      )}
                      <span className="sr-only">Toggle theme</span>
                    </Button>
                  </DropdownMenuTrigger>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Theme: {theme}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Theme</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuRadioGroup
                value={theme}
                onValueChange={(value) =>
                  setTheme(value as "light" | "dark" | "system")
                }
              >
                <DropdownMenuRadioItem value="light" className="cursor-pointer">
                  <Sun className="mr-2 h-4 w-4" />
                  Light
                </DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="dark" className="cursor-pointer">
                  <Moon className="mr-2 h-4 w-4" />
                  Dark
                </DropdownMenuRadioItem>
                <DropdownMenuRadioItem
                  value="system"
                  className="cursor-pointer"
                >
                  <Laptop className="mr-2 h-4 w-4" />
                  System
                </DropdownMenuRadioItem>
              </DropdownMenuRadioGroup>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* User Menu */}
          {isAuthenticated ? (
            <AdminAvatar />
          ) : (
            <Button asChild>
              <Link to="/login">Login</Link>
            </Button>
          )}
        </div>
      </div>
    </header>
  );
}
