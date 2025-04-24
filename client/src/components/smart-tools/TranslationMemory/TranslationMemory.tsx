
import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";

import TranslateTab from "./tabs/TranslateTab";
import MemoryTab from "./tabs/MemoryTab";
import HistoryTab from "./tabs/HistoryTab";
import UploadTab from "./tabs/UploadTab";

const TranslationMemory: React.FC = () => {
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Translation Memory</CardTitle>
        <CardDescription>
          Translate texts and manage your translation memory database
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="translate">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="translate">Translate</TabsTrigger>
            <TabsTrigger value="memory">Memory</TabsTrigger>
            <TabsTrigger value="history">History</TabsTrigger>
            <TabsTrigger value="upload">Upload</TabsTrigger>
          </TabsList>
          
          <TabsContent value="translate" className="mt-6">
            <TranslateTab />
          </TabsContent>
          
          <TabsContent value="memory" className="mt-6">
            <MemoryTab />
          </TabsContent>
          
          <TabsContent value="history" className="mt-6">
            <HistoryTab />
          </TabsContent>
          
          <TabsContent value="upload" className="mt-6">
            <UploadTab />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default TranslationMemory;
