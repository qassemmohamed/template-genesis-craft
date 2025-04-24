"use client";

import { motion } from "framer-motion";
import { FaExpand, FaCompress } from "react-icons/fa"; // Fullscreen icons from React Icons
import ThemeSelector from "@/components/common/ThemeSelector";
import AdminAvatar from "@/components/layouts/AdminAvatar";
import { Breadcrumbs } from "./Breadcrumbs";
import { SearchBox } from "./SearchBox";
import { Notifications } from "./Notifications";
import { useState } from "react";
import { toast } from "sonner"; // Import the toast function

export function DashboardNavbar() {
  const [isFullScreen, setIsFullScreen] = useState(false);

  const toggleFullScreen = () => {
    if (!isFullScreen) {
      if (document.documentElement.requestFullscreen) {
        document.documentElement.requestFullscreen();
      } else if (document.documentElement.mozRequestFullScreen) {
        // Firefox
        document.documentElement.mozRequestFullScreen();
      } else if (document.documentElement.webkitRequestFullscreen) {
        // Chrome, Safari, Opera
        document.documentElement.webkitRequestFullscreen();
      } else if (document.documentElement.msRequestFullscreen) {
        // IE/Edge
        document.documentElement.msRequestFullscreen();
      }
      setIsFullScreen(true);
      toast.success("Entered Full Screen mode!", { autoClose: 2000 });
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      } else if (document.mozCancelFullScreen) {
        // Firefox
        document.mozCancelFullScreen();
      } else if (document.webkitExitFullscreen) {
        // Chrome, Safari, Opera
        document.webkitExitFullscreen();
      } else if (document.msExitFullscreen) {
        // IE/Edge
        document.msExitFullscreen();
      }
      setIsFullScreen(false);
      toast.success("Exited Full Screen mode!", { autoClose: 2000 });
    }
  };

  return (
    <motion.nav
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="top-0 z-10 flex h-16 items-center justify-between border-b px-4"
    >
      <div className="flex items-center gap-4">
        <Breadcrumbs />
      </div>

      <div className="flex items-center gap-1 sm:gap-2">
        <SearchBox />
        <Notifications />
        <ThemeSelector />
        <div className="ml-1">
          <AdminAvatar />
        </div>
        <motion.button
          onClick={toggleFullScreen}
          className="ml-2 rounded bg-[var(--card-background)] p-2 "
          whileHover={{ scale: 1.1 }} // Framer Motion hover effect
          whileTap={{ scale: 0.95 }} // Framer Motion tap effect
        >
          {isFullScreen ? (
            <FaCompress size={20} /> // Compress (Exit Fullscreen)
          ) : (
            <FaExpand size={20} /> // Expand (Enter Fullscreen)
          )}
        </motion.button>
      </div>
    </motion.nav>
  );
}
