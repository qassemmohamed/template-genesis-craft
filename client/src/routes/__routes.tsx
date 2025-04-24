import React, { Suspense, lazy } from "react";
import { Routes, Route } from "react-router-dom";

import LoadingPage from "@/pages/LoadingPage";
import ProtectedRoute from "@/components/common/ProtectedRoute";
import Dashboard from "@/pages/Dashboard";
import FAQs from "@/pages/FAQs";
import Languages from "@/pages/Languages";
import Login from "@/pages/Login";
import Services from "@/pages/Services";
import Statistics from "@/pages/Statistics";
import Inbox from "@/pages/Inbox";
import Profile from "@/pages/Profile";
import ForgotPassword from "@/pages/ForgotPassword";
import ResetPassword from "@/pages/ResetPassword";
import Register from "@/pages/Register";

// Import SmartTools components
import DocumentExtractor from "@/components/smart-tools/DocumentExtractor";
import ClientServiceTracker from "@/components/smart-tools/ClientServiceTracker";
import IntegratedCalendar from "@/components/smart-tools/Calendar/IntegratedCalendar";
import TemplateGenerator from "@/components/smart-tools/Templates/TemplateGenerator";
import TaskManagement from "@/components/smart-tools/TaskManagement";
import SmartReports from "@/components/smart-tools/SmartReports";
import TranslationMemory from "@/components/smart-tools/TranslationMemory/TranslationMemory";
import ClientCommunication from "@/components/smart-tools/ClientCommunication";

// Import Client Dashboard components
import ClientDashboard from "@/components/layouts/ClientDashboard";
import ClientOverview from "@/pages/ClientOverview";
import ClientMessages from "@/pages/ClientMessages";
import ClientServices from "@/pages/ClientServices";
import ClientProfile from "@/pages/ClientProfile";

const HomePage = lazy(() => import("@/pages/HomePage"));
const Contact = lazy(() => import("@/pages/Contact"));
const NotFoundPage = lazy(() => import("@/pages/NotFoundPage"));

const AdminChat = lazy(() => import("@/components/smart-tools/AdminChat"));
const ClientManagement = lazy(() => import("@/pages/ClientManagement"));

const AppRoutes: React.FC = () => {
  return (
    <Suspense fallback={<LoadingPage />}>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<HomePage />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Admin Dashboard Routes */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        >
          <Route index element={<Statistics />} />
          <Route path="services" element={<Services />} />
          <Route path="faqs" element={<FAQs />} />
          <Route path="languages" element={<Languages />} />
          <Route path="inbox" element={<Inbox />} />
          <Route path="profile" element={<Profile />} />
          <Route path="clients" element={<ClientManagement />} />

          {/* Smart Tools Routes */}
          <Route path="document-extractor" element={<DocumentExtractor />} />
          <Route path="service-tracker" element={<ClientServiceTracker />} />
          <Route path="calendar" element={<IntegratedCalendar />} />
          <Route path="templates" element={<TemplateGenerator />} />
          <Route path="tasks" element={<TaskManagement />} />
          <Route path="reports" element={<SmartReports />} />
          <Route path="translation" element={<TranslationMemory />} />
          <Route path="communication" element={<AdminChat />} />
        </Route>

        {/* Client Dashboard Routes */}
        <Route
          path="/client"
          element={
            <ProtectedRoute>
              <ClientDashboard />
            </ProtectedRoute>
          }
        >
          <Route index element={<ClientOverview />} />
          <Route path="messages" element={<ClientMessages />} />
          <Route path="services" element={<ClientServices />} />
          <Route path="profile" element={<ClientProfile />} />
        </Route>

        {/* Catch-all for 404 */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Suspense>
  );
};

export default AppRoutes;
