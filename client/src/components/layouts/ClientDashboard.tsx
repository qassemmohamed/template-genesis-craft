"use client"

import type React from "react"
import { useState } from "react"
import { Outlet, NavLink, useNavigate } from "react-router-dom"
import {
  ChartBarIcon,
  Cog6ToothIcon,
  InboxIcon,
  ArrowLeftOnRectangleIcon,
  Bars3Icon,
  XMarkIcon,
  UserIcon,
  UserCircleIcon,
} from "@heroicons/react/24/outline"
import { useAuth } from "@/context/AuthContext"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { cn } from "@/lib/utils"
import { motion, AnimatePresence } from "framer-motion"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

interface NavigationItem {
  name: string
  href: string
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>
  category?: string
}

const ClientDashboard = (): JSX.Element => {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(false)
  const [userMenuOpen, setUserMenuOpen] = useState<boolean>(false)

  const handleLogout = (): void => {
    logout()
    navigate("/login")
  }

  const handleViewProfile = (): void => {
    navigate("/client/profile")
    setUserMenuOpen(false)
  }

  const handleSettings = (): void => {
    navigate("/client/settings")
    setUserMenuOpen(false)
  }

  const navigation: NavigationItem[] = [
    { name: "Overview", href: "/client", icon: ChartBarIcon, category: "Main" },
    {
      name: "Messages",
      href: "/client/messages",
      icon: InboxIcon,
      category: "Main",
    },
    {
      name: "My Services",
      href: "/client/services",
      icon: Cog6ToothIcon,
      category: "Main",
    },
    {
      name: "Profile",
      href: "/client/profile",
      icon: UserIcon,
      category: "Main",
    },
  ]

  const getUserInitials = () => {
    if (user?.fullName) {
      return user.fullName.charAt(0).toUpperCase()
    }
    if (user?.username) {
      return user.username.charAt(0).toUpperCase()
    }
    return "U"
  }

  const renderNavItems = (items: NavigationItem[], category?: string) => {
    return (
      <div className="mb-4">
        {category && (
          <h3 className="mb-2 px-3 text-xs font-semibold uppercase tracking-wider text-[var(--muted-foreground)]">
            {category}
          </h3>
        )}
        {items.map((item) => (
          <NavLink
            key={item.name}
            to={item.href}
            className={({ isActive }) =>
              cn(
                "group flex items-center rounded-md px-2 py-2 text-sm font-medium transition-all duration-300 ease-in-out",
                isActive
                  ? "bg-[var(--accent)] text-[var(--accent-foreground)]"
                  : "text-[var(--sidebar-foreground)] hover:bg-[var(--sidebar-accent)] hover:text-[var(--sidebar-accent-foreground)]",
              )
            }
            onClick={() => setSidebarOpen(false)}
          >
            <item.icon
              className={cn("mr-3 h-5 w-5 flex-shrink-0 transition-transform duration-300", "group-hover:scale-110")}
              aria-hidden="true"
            />
            {item.name}
          </NavLink>
        ))}
      </div>
    )
  }

  // Enhanced User Profile Section
  const UserProfileSection = () => {
    return (
      <div className="relative flex flex-shrink-0 border-t border-[var(--sidebar-border)] p-4">
        <TooltipProvider delayDuration={300}>
          <button
            onClick={() => setUserMenuOpen(!userMenuOpen)}
            className="group flex w-full items-center rounded-lg p-2 transition-all duration-200 hover:bg-[var(--sidebar-accent)] focus:outline-none focus:ring-2 focus:ring-[var(--sidebar-ring)] focus:ring-offset-1"
            aria-expanded={userMenuOpen}
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

            <ArrowLeftOnRectangleIcon className="ml-2 h-5 w-5 flex-shrink-0 text-[var(--muted-foreground)] transition-all duration-200 group-hover:text-[var(--sidebar-accent-foreground)]" />
          </button>

          <AnimatePresence>
            {userMenuOpen && (
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
                        onClick={handleViewProfile}
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
                        onClick={handleSettings}
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
                        className="flex w-full items-center rounded-md px-3 py-2 text-sm text-red-500 hover:bg-red-50 hover:text-red-700 dark:hover:bg-red-950/30 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-1"
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
    )
  }

  // Mobile User Profile Section
  const MobileUserProfileSection = () => {
    return (
      <div className="flex flex-shrink-0 border-t border-[var(--sidebar-border)] p-4">
        <button
          onClick={handleLogout}
          className="group flex w-full items-center rounded-lg p-2 transition-all duration-200 hover:bg-[var(--sidebar-accent)] focus:outline-none focus:ring-2 focus:ring-[var(--sidebar-ring)] focus:ring-offset-1"
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

          <div className="ml-3 flex-1">
            <p className="text-sm font-medium text-[var(--sidebar-foreground)] transition-colors group-hover:text-[var(--sidebar-accent-foreground)]">
              {user?.fullName || user?.username || "Client"}
            </p>
            <p className="flex items-center text-xs font-medium text-[var(--muted-foreground)] transition-colors group-hover:text-[var(--sidebar-accent-foreground)]">
              <ArrowLeftOnRectangleIcon className="mr-1 h-4 w-4" />
              Logout
            </p>
          </div>
        </button>
      </div>
    )
  }

  return (
    <div className="flex h-screen overflow-hidden bg-[var(--background)]">
      <div className={cn("fixed inset-0 z-40 flex md:hidden", sidebarOpen ? "block" : "hidden")}>
        <div
          className="fixed inset-0 bg-[var(--background)] bg-opacity-75 transition-opacity duration-300"
          onClick={() => setSidebarOpen(false)}
        ></div>
        <motion.div
          className="relative flex w-full max-w-xs flex-1 flex-col bg-[var(--sidebar-background)]"
          initial={{ x: "-100%" }}
          animate={{ x: "0%" }}
          exit={{ x: "-100%" }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
        >
          <div className="absolute right-0 top-0 -mr-12 pt-2">
            <button
              className="ml-1 flex h-10 w-10 items-center justify-center rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-[var(--ring)]"
              onClick={() => setSidebarOpen(false)}
            >
              <span className="sr-only">Close sidebar</span>
              <XMarkIcon className="h-6 w-6 text-[var(--foreground)]" />
            </button>
          </div>
          <div className="flex h-0 flex-1 flex-col overflow-y-auto pb-4 pt-5">
            <div className="flex flex-shrink-0 items-center px-4">
              <h1 className="text-xl font-bold text-[var(--headline)]">SamTax Client Portal</h1>
            </div>
            <nav className="mt-5 space-y-1 px-2">
              {renderNavItems(
                navigation.filter((item) => item.category === "Main"),
                "Main",
              )}
            </nav>
          </div>
          <MobileUserProfileSection />
        </motion.div>
      </div>

      <div className="hidden md:flex md:flex-shrink-0">
        <div className="flex w-64 flex-col">
          <div className="flex h-0 flex-1 flex-col border-r border-[var(--sidebar-border)] bg-[var(--sidebar-background)]">
            <div className="flex flex-1 flex-col overflow-y-auto pb-4 pt-5">
              <div className="flex flex-shrink-0 items-center px-4">
                <h1 className="text-xl font-bold text-[var(--headline)]">SamTax Client Portal</h1>
              </div>
              <nav className="mt-5 flex-1 space-y-1 px-2">
                {renderNavItems(
                  navigation.filter((item) => item.category === "Main"),
                  "Main",
                )}
              </nav>
            </div>
            <UserProfileSection />
          </div>
        </div>
      </div>

      <div className="flex w-0 flex-1 flex-col overflow-hidden">
        <div className="pl-1 pt-1 sm:pl-3 sm:pt-3 md:hidden">
          <button
            className="-ml-0.5 -mt-0.5 inline-flex h-12 w-12 items-center justify-center rounded-md text-[var(--muted-foreground)] hover:text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-inset focus:ring-[var(--ring)]"
            onClick={() => setSidebarOpen(true)}
          >
            <span className="sr-only">Open sidebar</span>
            <Bars3Icon className="h-6 w-6" aria-hidden="true" />
          </button>
        </div>
        <main className="relative z-0 flex-1 overflow-y-auto focus:outline-none">
          <motion.div className="py-6" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}>
            <div className="mx-auto max-w-7xl px-4 sm:px-6 md:px-8">
              <Outlet />
            </div>
          </motion.div>
        </main>
      </div>
    </div>
  )
}

export default ClientDashboard
