"use client";

import {
  MoonIcon,
  SunIcon,
  LaptopIcon,
  SmartphoneIcon,
  TabletIcon,
  MonitorIcon,
  ChevronDown,
} from "lucide-react";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useTranslation } from "react-i18next";

type DeviceType = "pc" | "laptop" | "tablet" | "mobile" | "default";

const styles = {
  iconStyle: "h-5 w-5",
  flexContainer: "flex items-center gap-2 text-sm",
};

export default function ThemeSelector() {
  const [theme, setTheme] = useState("default");
  const [deviceType, setDeviceType] = useState<DeviceType>("default");
  const { t } = useTranslation();

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme) {
      setTheme(savedTheme);
      applyTheme(savedTheme);
    } else {
      setTheme("default");
      applyTheme("default");
    }

    detectDeviceType();
    window.addEventListener("resize", detectDeviceType);

    return () => {
      document.body.classList.remove("transition-colors", "duration-500");
      window.removeEventListener("resize", detectDeviceType);
    };
  }, []);

  const detectDeviceType = () => {
    const ua = navigator.userAgent;
    const width = window.innerWidth;

    if (
      /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(ua)
    ) {
      setDeviceType(width >= 768 ? "tablet" : "mobile");
    } else {
      setDeviceType(width >= 1024 ? "pc" : "laptop");
    }
  };

  const applyTheme = (mode: string) => {
    document.body.classList.remove("dark", "light");
    if (mode === "default") {
      const prefersDark = window.matchMedia(
        "(prefers-color-scheme: dark)",
      ).matches;
      document.body.classList.add(prefersDark ? "dark" : "light");
    } else {
      document.body.classList.add(mode);
    }
  };

  const handleThemeChange = (mode: string) => {
    setTheme(mode);
    localStorage.setItem("theme", mode);
    applyTheme(mode);
  };

  const getIcon = () => {
    if (theme === "dark") return <MoonIcon className={styles.iconStyle} />;
    if (theme === "light") return <SunIcon className={styles.iconStyle} />;
    switch (deviceType) {
      case "pc":
        return <MonitorIcon className={styles.iconStyle} />;
      case "laptop":
        return <LaptopIcon className={styles.iconStyle} />;
      case "tablet":
        return <TabletIcon className={styles.iconStyle} />;
      case "mobile":
        return <SmartphoneIcon className={styles.iconStyle} />;
      default:
        return <LaptopIcon className={styles.iconStyle} />;
    }
  };

  const getThemeLabel = () => {
    if (theme === "default") {
      const prefersDark = window.matchMedia(
        "(prefers-color-scheme: dark)",
      ).matches;
      return prefersDark ? t("mode.defaultDark") : t("mode.defaultLight");
    }
    return theme.charAt(0).toUpperCase() + theme.slice(1);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="flex items-center justify-center gap-2 rounded-[10px] border border-[var(--border)] bg-[var(--card-background)] px-2 py-2 text-[var(--headline)] max-md:w-full">
          <AnimatePresence mode="wait">
            <motion.div
              key={theme + deviceType}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className={styles.flexContainer}
            >
              {getIcon()}
              <span>{getThemeLabel()}</span>
            </motion.div>
          </AnimatePresence>
          <ChevronDown className="h-4 w-4 opacity-50" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => handleThemeChange("default")}>
          <div className={styles.flexContainer}>
            {getIcon()} {t("mode.system")}
          </div>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleThemeChange("light")}>
          <div className={styles.flexContainer}>
            <SunIcon className={styles.iconStyle} /> {t("mode.light")}
          </div>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleThemeChange("dark")}>
          <div className={styles.flexContainer}>
            <MoonIcon className={styles.iconStyle} /> {t("mode.dark")}
          </div>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
