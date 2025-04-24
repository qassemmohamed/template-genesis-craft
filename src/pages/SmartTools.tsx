import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useTranslation } from "react-i18next";
import DocumentExtractor from "@/components/smart-tools/DocumentExtractor";
import ClientServiceTracker from "@/components/smart-tools/ClientServiceTracker";
import IntegratedCalendar from "@/components/smart-tools/Calendar/IntegratedCalendar";
import TemplateGenerator from "@/components/smart-tools/Templates/TemplateGenerator";
import SmartReports from "@/components/smart-tools/SmartReports";
import TranslationMemory from "@/components/smart-tools/TranslationMemory/TranslationMemory";
import ClientCommunication from "@/components/smart-tools/ClientCommunication";
import TaskManagement from "@/components/smart-tools/Tasks/TaskManagement";

const SmartTools: React.FC = () => {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState("document-extractor");

  return (
    <div className="container mx-auto p-4">
      <h1 className="mb-6 text-2xl font-bold text-blue-600">Smart Tools</h1>
      <p className="mb-6 text-[var(--paragraph)]">
        Streamline your workflow with these intelligent tools designed to boost
        productivity and enhance client experience.
      </p>

      <Tabs
        defaultValue="document-extractor"
        onValueChange={setActiveTab}
        value={activeTab}
      >
        <TabsList className="mb-6 grid grid-cols-4 md:grid-cols-8">
          <TabsTrigger value="document-extractor">
            Document Extractor
          </TabsTrigger>
          <TabsTrigger value="service-tracker">Service Tracker</TabsTrigger>
          <TabsTrigger value="calendar">Calendar</TabsTrigger>
          <TabsTrigger value="template-generator">Templates</TabsTrigger>
          <TabsTrigger value="task-management">Tasks</TabsTrigger>
          <TabsTrigger value="reports">Reports</TabsTrigger>
          <TabsTrigger value="translation-memory">Translation</TabsTrigger>
          <TabsTrigger value="client-communication">Communication</TabsTrigger>
        </TabsList>

        <TabsContent value="document-extractor">
          <DocumentExtractor />
        </TabsContent>

        <TabsContent value="service-tracker">
          <ClientServiceTracker />
        </TabsContent>

        <TabsContent value="calendar">
          <IntegratedCalendar />
        </TabsContent>

        <TabsContent value="template-generator">
          <TemplateGenerator />
        </TabsContent>

        <TabsContent value="task-management">
          <TaskManagement />
        </TabsContent>

        <TabsContent value="reports">
          <SmartReports />
        </TabsContent>

        <TabsContent value="translation-memory">
          <TranslationMemory />
        </TabsContent>

        <TabsContent value="client-communication">
          <ClientCommunication />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SmartTools;
