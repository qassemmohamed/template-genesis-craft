"use client";

import type React from "react";
import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import {
  FileUp,
  FileText,
  Search,
  FileX,
  Edit,
  Save,
  Trash2,
  X,
  Copy,
  FileCheck,
  Loader2,
} from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface ExtractedDataItem {
  key: string;
  value: string;
  confidence: number;
}

const DocumentExtractor: React.FC = () => {
  const { toast } = useToast();
  const [file, setFile] = useState<File | null>(null);
  const [extracting, setExtracting] = useState(false);
  const [progress, setProgress] = useState(0);
  const [extractedData, setExtractedData] = useState<
    ExtractedDataItem[] | null
  >(null);
  const [activeTab, setActiveTab] = useState("upload");
  const [dragActive, setDragActive] = useState(false);
  const [editingItem, setEditingItem] = useState<ExtractedDataItem | null>(
    null,
  );
  const [editValue, setEditValue] = useState("");
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Handle file selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  // Handle file drop
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  // Common file handling logic
  const handleFile = (file: File) => {
    // Check file type
    const validTypes = [
      "application/pdf",
      "image/jpeg",
      "image/png",
      "image/jpg",
    ];
    if (!validTypes.includes(file.type)) {
      toast({
        title: "Invalid file type",
        description: "Please upload a PDF, JPG, or PNG file",
        variant: "destructive",
      });
      return;
    }

    // Check file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "Please upload a file smaller than 10MB",
        variant: "destructive",
      });
      return;
    }

    setFile(file);
    setExtractedData(null);
    toast({
      title: "File selected",
      description: `${file.name} is ready for extraction`,
    });
  };

  // Handle drag events
  const handleDrag = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();

    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  // Extract data from the file
  const extractData = () => {
    if (!file) {
      toast({
        title: "No file selected",
        description: "Please select a file to extract data from",
        variant: "destructive",
      });
      return;
    }

    setExtracting(true);
    setProgress(0);
    setActiveTab("results");

    // Simulate progress
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 5;
      });
    }, 150);

    // Simulate data extraction (in a real app, this would be API call)
    setTimeout(() => {
      clearInterval(interval);
      setProgress(100);

      // Delay a bit to show 100% progress
      setTimeout(() => {
        setExtracting(false);

        // Mock extracted data with confidence levels
        setExtractedData([
          { key: "Full Name", value: "John Doe", confidence: 0.98 },
          { key: "Tax ID", value: "123-45-6789", confidence: 0.95 },
          { key: "Filing Status", value: "Single", confidence: 0.92 },
          { key: "Tax Year", value: "2023", confidence: 0.99 },
          { key: "Income", value: "$75,000", confidence: 0.88 },
          { key: "Due Date", value: "April 15, 2024", confidence: 0.97 },
        ]);

        toast({
          title: "Data extracted successfully",
          description: "All document data has been successfully processed",
        });
      }, 500);
    }, 3000);
  };

  // Reset the form
  const handleReset = () => {
    setFile(null);
    setExtractedData(null);
    setProgress(0);
    setActiveTab("upload");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // Copy extracted data to clipboard
  const copyToClipboard = () => {
    if (!extractedData) return;

    const text = extractedData
      .map((item) => `${item.key}: ${item.value}`)
      .join("\n");

    navigator.clipboard.writeText(text);
    toast({
      title: "Copied to clipboard",
      description: "The extracted data has been copied to your clipboard",
    });
  };

  // Save extracted data
  const saveData = () => {
    toast({
      title: "Data saved",
      description: "The extracted data has been saved to the client profile",
    });
  };

  // Open edit dialog
  const openEditDialog = (item: ExtractedDataItem) => {
    setEditingItem(item);
    setEditValue(item.value);
    setIsEditDialogOpen(true);
  };

  // Save edited value
  const saveEditedValue = () => {
    if (!editingItem || !extractedData) return;

    const updatedData = extractedData.map((item) =>
      item.key === editingItem.key
        ? { ...item, value: editValue, confidence: 1.0 } // Set confidence to 1.0 for manually edited values
        : item,
    );

    setExtractedData(updatedData);
    setIsEditDialogOpen(false);

    toast({
      title: "Value updated",
      description: `"${editingItem.key}" has been updated`,
    });
  };

  // Get confidence badge variant
  const getConfidenceBadge = (confidence: number) => {
    if (confidence >= 0.95) return "success";
    if (confidence >= 0.8) return "warning";
    return "destructive";
  };

  // Get file icon based on file type
  const getFileIcon = () => {
    if (!file) return <FileUp className="h-12 w-12 text-muted-foreground" />;

    const fileType = file.type;
    if (fileType === "application/pdf") {
      return <FileText className="h-12 w-12 text-blue-500" />;
    } else if (fileType.startsWith("image/")) {
      return <FileCheck className="h-12 w-12 text-green-500" />;
    }

    return <FileUp className="h-12 w-12 text-muted-foreground" />;
  };

  return (
    <div className="py-6">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="mb-6">
          <h1 className="text-3xl font-bold tracking-tight">
            Document Extractor
          </h1>
          <p className="text-muted-foreground">
            Upload documents to automatically extract and process key
            information
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="upload" disabled={extracting}>
              <FileUp className="mr-2 h-4 w-4" />
              Upload Document
            </TabsTrigger>
            <TabsTrigger value="results" disabled={!file && !extractedData}>
              <FileText className="mr-2 h-4 w-4" />
              Extracted Results
            </TabsTrigger>
          </TabsList>

          <div className="mt-6">
            <TabsContent value="upload" className="mt-0">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <FileUp className="mr-2 h-5 w-5 text-primary" />
                    Smart Document Extractor
                  </CardTitle>
                  <CardDescription>
                    Upload tax forms, immigration documents, or any paperwork to
                    automatically extract key information.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                  >
                    <div
                      className={cn(
                        "relative mb-6 flex flex-col items-center justify-center rounded-lg border-2 border-dashed p-8 transition-all",
                        dragActive
                          ? "border-primary bg-primary/5"
                          : "border-muted-foreground/25 hover:border-primary/50",
                      )}
                      onDragEnter={handleDrag}
                      onDragLeave={handleDrag}
                      onDragOver={handleDrag}
                      onDrop={handleDrop}
                    >
                      <input
                        type="file"
                        id="file-upload"
                        ref={fileInputRef}
                        className="hidden"
                        onChange={handleFileChange}
                        accept=".pdf,.jpg,.jpeg,.png"
                      />

                      <AnimatePresence mode="wait">
                        {file ? (
                          <motion.div
                            key="file-selected"
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            className="flex flex-col items-center text-center"
                          >
                            {getFileIcon()}
                            <h3 className="mt-4 font-medium">{file.name}</h3>
                            <p className="mt-1 text-sm text-muted-foreground">
                              {(file.size / 1024 / 1024).toFixed(2)} MB
                            </p>
                            <div className="mt-4 flex gap-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => fileInputRef.current?.click()}
                              >
                                Change File
                              </Button>
                              <Button
                                variant="default"
                                size="sm"
                                onClick={handleReset}
                              >
                                <X className="mr-1 h-4 w-4" />
                                Remove
                              </Button>
                            </div>
                          </motion.div>
                        ) : (
                          <motion.div
                            key="no-file"
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            className="flex flex-col items-center text-center"
                          >
                            <FileUp className="mb-4 h-12 w-12 text-muted-foreground" />
                            <h3 className="text-lg font-medium">
                              Drag & Drop your file here
                            </h3>
                            <p className="mt-2 text-sm text-muted-foreground">
                              Supports PDF, JPG, and PNG files (max 10MB)
                            </p>
                            <Button
                              variant="secondary"
                              className="mt-4"
                              onClick={() => fileInputRef.current?.click()}
                            >
                              <FileUp className="mr-2 h-4 w-4" />
                              Browse Files
                            </Button>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>

                    <div className="space-y-4 rounded-lg border bg-muted/40 p-4">
                      <h3 className="font-medium">Supported Document Types:</h3>
                      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                        <div className="flex items-center gap-2 rounded-md bg-background p-3">
                          <FileText className="h-5 w-5 text-blue-500" />
                          <span>Tax Forms (W-2, 1099)</span>
                        </div>
                        <div className="flex items-center gap-2 rounded-md bg-background p-3">
                          <FileText className="h-5 w-5 text-green-500" />
                          <span>ID Documents</span>
                        </div>
                        <div className="flex items-center gap-2 rounded-md bg-background p-3">
                          <FileText className="h-5 w-5 text-amber-500" />
                          <span>Financial Statements</span>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button
                    variant="outline"
                    onClick={handleReset}
                    disabled={!file || extracting}
                  >
                    Reset
                  </Button>
                  <Button
                    onClick={extractData}
                    disabled={!file || extracting}
                    className="relative overflow-hidden"
                  >
                    {extracting ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Extracting Data...
                      </>
                    ) : (
                      <>
                        <Search className="mr-2 h-4 w-4" />
                        Extract Data
                      </>
                    )}
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>

            <TabsContent value="results" className="mt-0">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <FileText className="mr-2 h-5 w-5 text-primary" />
                      <CardTitle>Extracted Information</CardTitle>
                    </div>
                    {file && (
                      <Badge variant="outline" className="font-normal">
                        {file.name}
                      </Badge>
                    )}
                  </div>
                  <CardDescription>
                    Review and validate the automatically extracted data
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {extracting ? (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="space-y-4 py-8"
                    >
                      <div className="flex flex-col items-center justify-center text-center">
                        <div className="relative mb-4 h-16 w-16">
                          <motion.div
                            animate={{
                              rotate: 360,
                            }}
                            transition={{
                              duration: 2,
                              repeat: Number.POSITIVE_INFINITY,
                              ease: "linear",
                            }}
                            className="absolute inset-0"
                          >
                            <Search className="h-16 w-16 text-muted-foreground/20" />
                          </motion.div>
                          <Loader2 className="absolute inset-0 h-16 w-16 animate-spin text-primary/40" />
                        </div>
                        <h3 className="text-lg font-medium">Extracting Data</h3>
                        <p className="mt-1 text-sm text-muted-foreground">
                          Our AI is analyzing your document...
                        </p>
                      </div>
                      <Progress value={progress} className="h-2" />
                      <p className="text-center text-sm text-muted-foreground">
                        {progress}% complete
                      </p>
                    </motion.div>
                  ) : extractedData ? (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.2 }}
                      className="space-y-4"
                    >
                      <div className="rounded-lg border bg-card">
                        <div className="flex items-center justify-between border-b p-3">
                          <h3 className="font-medium">Extracted Fields</h3>
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={copyToClipboard}
                                >
                                  <Copy className="h-4 w-4" />
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>Copy all data</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        </div>
                        <div className="divide-y">
                          {extractedData.map((item, index) => (
                            <motion.div
                              key={item.key}
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: index * 0.1 }}
                              className="flex items-center justify-between p-3 hover:bg-muted/50"
                            >
                              <div className="flex-1">
                                <div className="flex items-center">
                                  <span className="font-medium">
                                    {item.key}:
                                  </span>
                                  <Badge
                                    variant={getConfidenceBadge(
                                      item.confidence,
                                    )}
                                    className="ml-2 text-xs"
                                  >
                                    {Math.round(item.confidence * 100)}%
                                  </Badge>
                                </div>
                                <div className="mt-1 text-sm">{item.value}</div>
                              </div>
                              <TooltipProvider>
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      onClick={() => openEditDialog(item)}
                                    >
                                      <Edit className="h-4 w-4" />
                                    </Button>
                                  </TooltipTrigger>
                                  <TooltipContent>
                                    <p>Edit value</p>
                                  </TooltipContent>
                                </Tooltip>
                              </TooltipProvider>
                            </motion.div>
                          ))}
                        </div>
                      </div>

                      <div className="rounded-lg border bg-muted/40 p-4">
                        <h3 className="mb-2 font-medium">Confidence Levels:</h3>
                        <div className="grid grid-cols-3 gap-2 text-sm">
                          <div className="flex items-center gap-1">
                            <Badge
                              variant="success"
                              className="h-2 w-2 rounded-full p-0"
                            />
                            <span>High (95-100%)</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Badge
                              variant="warning"
                              className="h-2 w-2 rounded-full p-0"
                            />
                            <span>Medium (80-94%)</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Badge
                              variant="default"
                              className="h-2 w-2 rounded-full p-0"
                            />
                            <span>Low (0-79%)</span>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ) : (
                    <div className="flex h-64 flex-col items-center justify-center text-center">
                      <FileX className="mb-4 h-16 w-16 text-muted-foreground/30" />
                      <h3 className="text-lg font-medium">
                        No data extracted yet
                      </h3>
                      <p className="mt-2 text-sm text-muted-foreground">
                        Upload and process a document to see results
                      </p>
                      <Button
                        variant="outline"
                        className="mt-4"
                        onClick={() => setActiveTab("upload")}
                      >
                        Go to Upload
                      </Button>
                    </div>
                  )}
                </CardContent>
                {extractedData && (
                  <CardFooter className="flex justify-between">
                    <Button variant="outline" onClick={handleReset}>
                      <Trash2 className="mr-2 h-4 w-4" />
                      Clear Data
                    </Button>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        onClick={() => setActiveTab("upload")}
                      >
                        <FileUp className="mr-2 h-4 w-4" />
                        Upload New
                      </Button>
                      <Button onClick={saveData}>
                        <Save className="mr-2 h-4 w-4" />
                        Save to Client Profile
                      </Button>
                    </div>
                  </CardFooter>
                )}
              </Card>
            </TabsContent>
          </div>
        </Tabs>
      </motion.div>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Field Value</DialogTitle>
            <DialogDescription>
              Update the extracted information if needed.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="field-name">Field</Label>
              <Input id="field-name" value={editingItem?.key || ""} disabled />
            </div>
            <div className="space-y-2">
              <Label htmlFor="field-value">Value</Label>
              <Input
                id="field-value"
                value={editValue}
                onChange={(e) => setEditValue(e.target.value)}
                autoFocus
              />
            </div>
          </div>
          <DialogFooter className="flex sm:justify-between">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsEditDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button type="button" onClick={saveEditedValue}>
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default DocumentExtractor;
