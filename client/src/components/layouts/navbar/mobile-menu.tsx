"use client";

import { motion } from "framer-motion";
import { X } from "lucide-react";
import { Link } from "react-router-dom";
import { NavigationMenuDemo } from "./navigation-menu-demo";
import { LanguageSelector } from "./language-selector";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import type { MobileMenuProps } from "./types";
import ThemeSelector from "@/components/common/ThemeSelector";
import { Button } from "@/components/ui/button";

export function MobileMenu({
  isMenuOpen,
  setIsMenuOpen,
  selectedLang,
  languages,
  changeLanguage,
  isAuthenticated,
  user,
  getUserInitials,
  handleLogout,
  isAdmin,
}: MobileMenuProps) {
  return (
    <motion.div
      initial={{ x: "100%" }}
      animate={{ x: isMenuOpen ? "0%" : "100%" }}
      transition={{ duration: 0.3 }}
      className={`fixed inset-0 z-50 flex h-screen flex-col items-center justify-center bg-[var(--background)] backdrop-blur-lg ${isMenuOpen ? "flex" : "hidden"}`}
    >
      <button
        className="absolute right-5 top-5 rounded-full bg-[var(--card)] p-2"
        onClick={() => setIsMenuOpen(false)}
      >
        <X className="h-6 w-6 text-[var(--headline)]" />
      </button>

      <div className="flex h-1/3 w-full items-center justify-center">
        <NavigationMenuDemo setIsMenuOpen={setIsMenuOpen} />
      </div>

      <div className="flex h-1/3 w-full flex-col items-center justify-center gap-3 max-md:px-[10px]">

        {/* <LanguageSelector
          selectedLang={selectedLang}
          languages={languages}
          changeLanguage={changeLanguage}
          fullWidth={true}
        /> */}

        {isAuthenticated ? (
          <div className="flex flex-col items-center gap-2">
            <Avatar className="h-12 w-12">
              <AvatarImage src={user?.avatarUrl || "/placeholder.svg"} />
              <AvatarFallback>{getUserInitials()}</AvatarFallback>
            </Avatar>
            <div className="text-center">
              <p className="font-medium">{user?.fullName || user?.username}</p>
              <div className="mt-2 flex gap-2">
                <Button size="sm" asChild variant="outline">
                  <Link to={isAdmin ? "/dashboard" : "/client"}>
                    {isAdmin ? "Admin Dashboard" : "My Dashboard"}
                  </Link>
                </Button>
                <Button size="sm" variant="default" onClick={handleLogout}>
                  Logout
                </Button>
              </div>
            </div>
          </div>
        ) : (
          <Button asChild className="w-full max-w-[200px]">
            <Link to="/login">Login</Link>
          </Button>
        )}
      </div>
    </motion.div>
  );
}
