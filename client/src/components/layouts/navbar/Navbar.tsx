"use client";

import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import i18n from "@/i18n";
import { toast } from "@/hooks/use-toast";
import { useAuth } from "@/context/AuthContext";

import { DesktopNavbar } from "./desktop-navbar";
import { MobileMenu } from "./mobile-menu";

// Import language flags
import enFlag from "@/assets/english.svg";
import arFlag from "@/assets/arabic.svg";
import frFlag from "@/assets/fransh.svg";
import { AdminNavbar } from "../admin-navbar";
import { MobileNavbar } from "./mobile-navbar";
import { Language } from "./types";

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { t } = useTranslation();
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const languages: Language[] = [
    { code: "en", name: "English", flag: enFlag },
    { code: "ar", name: "العربية", flag: arFlag },
    { code: "fr", name: "Français", flag: frFlag },
  ];

  // Initialize selected language based on current i18n language or localStorage
  const [selectedLang, setSelectedLang] = useState<Language>(() => {
    const savedLang =
      localStorage.getItem("selectedLanguage") || i18n.language || "en";
    return languages.find((lang) => lang.code === savedLang) || languages[0];
  });

  // Effect to update document direction and language when component mounts
  useEffect(() => {
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
  }, [i18n]);

  const changeLanguage = (lang: Language) => {
    if (lang.code === selectedLang.code) {
      setIsMenuOpen(false);
      return; // No need to change if it's the same language
    }

    i18n.changeLanguage(lang.code);
    localStorage.setItem("selectedLanguage", lang.code);
    document.documentElement.lang = lang.code;
    document.documentElement.dir = lang.code === "ar" ? "rtl" : "ltr";
    setSelectedLang(lang);
    toast({ title: t("navbar.languageToast") });
    setIsMenuOpen(false);
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
    return "U";
  };

  // Check if user is admin
  const isAdmin = user?.role === "admin" || user?.role === "owner";

  // Determine if we should render admin navbar
  if (
    isAuthenticated &&
    isAdmin &&
    window.location.pathname.startsWith("/dashboard")
  ) {
    return <AdminNavbar />;
  }

  // Determine if user is on client dashboard, don't show navbar at all
  if (isAuthenticated && window.location.pathname.startsWith("/client")) {
    return null;
  }

  // Common props to pass to both desktop and mobile components
  const navbarProps = {
    selectedLang,
    languages,
    changeLanguage,
    isAuthenticated,
    user,
    getUserInitials,
    handleLogout,
    isAdmin,
  };

  return (
    <nav className="sticky top-0 z-50 border-b-2 border-[var(--input)] shadow-sm backdrop-blur-lg max-md:bg-[var(--background)]">
      <div className="container mx-auto flex items-center justify-between py-4 max-md:px-[10px]">
        {/* Desktop Navbar */}
        <DesktopNavbar {...navbarProps} setIsMenuOpen={setIsMenuOpen} />

        {/* Mobile Navbar */}
        <MobileNavbar setIsMenuOpen={setIsMenuOpen} />
      </div>

      {/* Mobile Menu */}
      <MobileMenu
        isMenuOpen={isMenuOpen}
        setIsMenuOpen={setIsMenuOpen}
        {...navbarProps}
      />
    </nav>
  );
}
