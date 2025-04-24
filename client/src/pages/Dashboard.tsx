"use client";

import { useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Bars3Icon } from "@heroicons/react/24/outline";
import { useAuth } from "@/context/AuthContext";
import { DashboardNavbar } from "../components/layouts/navbar/dashboard/DashboardNavbar";
import { AppSidebar } from "@/components/layouts/sidebar/app-sidebar";

const Dashboard = (): JSX.Element => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      {/* Mobile Sidebar */}
      <AppSidebar
        isMobile
        open={mobileSidebarOpen}
        onMobileClose={() => setMobileSidebarOpen(false)}
      />

      {/* Desktop Sidebar */}
      <div className="hidden md:block">
        <AppSidebar open={sidebarOpen} onOpenChange={setSidebarOpen} />
      </div>

      {/* Main Content */}
      <div className="flex flex-1 flex-col">
        {/* Topbar (Mobile) */}
        <div className="p-3 md:hidden">
          <button
            className="h-10 w-10 text-muted-foreground hover:text-foreground"
            onClick={() => setMobileSidebarOpen(true)}
          >
            <Bars3Icon className="h-6 w-6" />
          </button>
        </div>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto">
          <motion.div
            className="flex flex-col"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            {/* Enhanced Navbar */}
            <DashboardNavbar />

            <div className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 md:px-3 ">
              <Outlet />
            </div>
          </motion.div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
