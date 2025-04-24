"use client";

import { ChevronDown } from "lucide-react";
import { Link } from "react-router-dom";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import type { UserMenuProps } from "./types";

export function UserMenu({
  user,
  getUserInitials,
  handleLogout,
  isAdmin,
  isMobile = false,
}: UserMenuProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="flex items-center gap-3 rounded-2xl border border-[var(--border)] bg-[var(--card-background)] px-3 py-1.5 text-[var(--headline)] shadow-sm transition-shadow duration-200 hover:shadow-md">
          <Avatar className="h-9 w-9 border border-[var(--border)] bg-[var(--input)]">
            <AvatarImage src={user?.avatarUrl || "/placeholder.svg"} />
            <AvatarFallback className="text-sm font-medium">
              {getUserInitials()}
            </AvatarFallback>
          </Avatar>
          <span className="text-sm font-semibold">
            {user?.fullName || user?.username}
          </span>
          <ChevronDown className="h-4 w-4 opacity-60" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="w-[220px] rounded-xl border border-[var(--border)] shadow-lg"
      >
        {isAdmin ? (
          <DropdownMenuItem asChild>
            <Link
              to="/dashboard"
              className="cursor-pointer rounded-md px-2 py-1.5 transition-colors hover:bg-muted"
            >
              Admin Dashboard
            </Link>
          </DropdownMenuItem>
        ) : (
          <DropdownMenuItem asChild>
            <Link
              to="/client"
              className="cursor-pointer rounded-md px-2 py-1.5 transition-colors hover:bg-muted"
            >
              My Dashboard
            </Link>
          </DropdownMenuItem>
        )}
        <DropdownMenuItem asChild>
          <Link
            to={isAdmin ? "/dashboard/profile" : "/client/profile"}
            className="cursor-pointer rounded-md px-2 py-1.5 transition-colors hover:bg-muted"
          >
            Profile
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={handleLogout}
          className="cursor-pointer rounded-md px-2 py-1.5 text-red-600 transition-colors hover:bg-red-50"
        >
          Logout
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
