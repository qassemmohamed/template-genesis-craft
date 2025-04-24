"use client";

import type React from "react";
import { useState, useEffect, type FormEvent } from "react";
import { api } from "../utils/api";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { Plus, Pencil, Trash2, Edit2Icon, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

// Interfaces for FAQ and form data
interface FAQ {
  _id: string;
  question: string;
  answer: string;
  active: boolean;
  order: number;
}

interface FormData {
  question: string;
  answer: string;
}

export default function FAQs() {
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [currentFaq, setCurrentFaq] = useState<FAQ | null>(null);
  const [formData, setFormData] = useState<FormData>({
    question: "",
    answer: "",
  });
  const [deleteDialogOpen, setDeleteDialogOpen] = useState<boolean>(false);
  const [faqToDelete, setFaqToDelete] = useState<string | null>(null);
  const [previewMode, setPreviewMode] = useState<boolean>(false);

  useEffect(() => {
    fetchFaqs();
  }, []);

  const fetchFaqs = async () => {
    try {
      setLoading(true);
      const response = await api.get("/faqs");
      setFaqs(response.data);
    } catch (err) {
      console.error("Error fetching FAQs:", err);
      setError("Failed to load FAQs");
      toast.error("Failed to load FAQs");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleAddFaq = () => {
    setCurrentFaq(null);
    setFormData({
      question: "",
      answer: "",
    });
    setIsModalOpen(true);
  };

  const handleEditFaq = (faq: FAQ) => {
    setCurrentFaq(faq);
    setFormData({
      question: faq.question,
      answer: faq.answer,
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    // Validate inputs
    if (!formData.question.trim() || !formData.answer.trim()) {
      toast.error("Question and answer are required");
      return;
    }

    try {
      setLoading(true);

      const dataToSend = {
        ...formData,
        active: currentFaq ? currentFaq.active : true,
        order: currentFaq ? currentFaq.order : faqs.length,
      };

      if (currentFaq) {
        await api.put(`/faqs/${currentFaq._id}`, dataToSend);
        toast.success("FAQ updated successfully");
      } else {
        await api.post("/faqs", dataToSend);
        toast.success("FAQ created successfully");
      }

      fetchFaqs();
      setIsModalOpen(false);
    } catch (err: any) {
      console.error("Error saving FAQ:", err);
      toast.error(err.response?.data?.message || "Failed to save FAQ");
    } finally {
      setLoading(false);
    }
  };

  const confirmDeleteFaq = (id: string) => {
    setFaqToDelete(id);
    setDeleteDialogOpen(true);
  };

  const handleDeleteFaq = async () => {
    if (!faqToDelete) return;

    try {
      setLoading(true);
      await api.delete(`/faqs/${faqToDelete}`);
      toast.success("FAQ deleted successfully");
      fetchFaqs();
    } catch (err: any) {
      console.error("Error deleting FAQ:", err);
      toast.error("Failed to delete FAQ");
    } finally {
      setLoading(false);
      setDeleteDialogOpen(false);
      setFaqToDelete(null);
    }
  };

  const toggleFaqStatus = async (faq: FAQ) => {
    try {
      setLoading(true);
      await api.put(`/faqs/${faq._id}`, {
        ...faq,
        active: !faq.active,
      });
      toast.success(
        `FAQ ${faq.active ? "deactivated" : "activated"} successfully`,
      );
      fetchFaqs();
    } catch (err: any) {
      console.error("Error updating FAQ status:", err);
      toast.error("Failed to update FAQ status");
    } finally {
      setLoading(false);
    }
  };

  if (loading && faqs.length === 0) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-t-2 border-primary"></div>
      </div>
    );
  }

  const activeFaqs = faqs
    .filter((faq) => faq.active)
    .sort((a, b) => a.order - b.order);

  return (
    <Card className="shadow-lg">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 border-b bg-muted pb-4">
        <CardTitle className="text-2xl font-bold text-primary">
          Manage FAQs
        </CardTitle>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => setPreviewMode(!previewMode)}
            className="transition-all hover:bg-primary/20"
          >
            {previewMode ? "Edit Mode" : "Preview Mode"}
            {previewMode ? (
              <Edit2Icon className="icon" />
            ) : (
              <Eye className="icon" />
            )}
          </Button>
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button
              onClick={handleAddFaq}
              className="bg-primary hover:bg-primary/90"
            >
              <Plus className="mr-2 h-4 w-4" />
              Add FAQ
            </Button>
          </motion.div>
        </div>
      </CardHeader>
      <CardContent className="p-6">
        {error && (
          <div className="mb-6 rounded-md bg-destructive/10 p-4 text-destructive">
            <h3 className="text-sm font-medium">Error</h3>
            <p className="mt-1 text-sm">{error}</p>
          </div>
        )}

        {previewMode ? (
          <div className="mt-4">
            <h2 className="mb-4 text-xl font-semibold text-primary">
              Frequently Asked Questions
            </h2>
            {activeFaqs.length === 0 ? (
              <p className="text-muted-foreground">No FAQs available.</p>
            ) : (
              <Accordion type="single" collapsible className="w-full">
                {activeFaqs.map((faq, index) => (
                  <AccordionItem
                    key={faq._id}
                    value={`item-${index}`}
                    className="border-b border-muted/60"
                  >
                    <AccordionTrigger className="text-left font-medium hover:text-primary">
                      {faq.question}
                    </AccordionTrigger>
                    <AccordionContent className="text-muted-foreground">
                      {faq.answer}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            )}
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="overflow-x-auto"
          >
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50">
                  <TableHead>Question</TableHead>
                  <TableHead>Answer</TableHead>
                  {/* <TableHead>Status</TableHead> */}
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {faqs.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={4}
                      className="py-8 text-center text-muted-foreground"
                    >
                      No FAQs found. Click "Add FAQ" to create one.
                    </TableCell>
                  </TableRow>
                ) : (
                  faqs.map((faq) => (
                    <motion.tr
                      key={faq._id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.3 }}
                      className="border-b border-muted/30 [&>td]:p-4"
                    >
                      <TableCell className="max-w-[250px] truncate font-medium">
                        {faq.question}
                      </TableCell>
                      <TableCell className="max-w-[300px] truncate">
                        {faq.answer}
                      </TableCell>
                      {/* <TableCell>
                        <Badge
                          variant={faq.active ? "success" : "secondary"}
                          className="cursor-pointer"
                          onClick={() => toggleFaqStatus(faq)}
                        >
                          {faq.active ? "Active" : "Inactive"}
                        </Badge>
                      </TableCell> */}
                      <TableCell className="text-right">
                        <motion.div
                          className="inline-block"
                          whileHover={{ scale: 1.1 }}
                        >
                          <Button
                            variant="ghost"
                            onClick={() => handleEditFaq(faq)}
                            className="mr-1 text-primary"
                          >
                            <Pencil className="h-4 w-4" />
                            <span className="sr-only">Edit</span>
                          </Button>
                        </motion.div>
                        <motion.div
                          className="inline-block"
                          whileHover={{ scale: 1.1 }}
                        >
                          <Button
                            variant="ghost"
                            onClick={() => confirmDeleteFaq(faq._id)}
                            className="text-destructive"
                          >
                            <Trash2 className="h-4 w-4" />
                            <span className="sr-only">Delete</span>
                          </Button>
                        </motion.div>
                      </TableCell>
                    </motion.tr>
                  ))
                )}
              </TableBody>
            </Table>
          </motion.div>
        )}
      </CardContent>

      {/* Modal for Add/Edit FAQ */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>{currentFaq ? "Edit" : "Add"} FAQ</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="question">Question</Label>
              <Input
                id="question"
                name="question"
                value={formData.question}
                onChange={handleChange}
                placeholder="Enter FAQ question"
                required
                className="w-full"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="answer">Answer</Label>
              <Textarea
                id="answer"
                name="answer"
                value={formData.answer}
                onChange={handleChange}
                placeholder="Enter FAQ answer"
                className="min-h-[100px] w-full"
                required
              />
            </div>
            <DialogFooter className="mt-6">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsModalOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={loading}>
                {loading ? "Saving..." : currentFaq ? "Update" : "Add"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the
              FAQ.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteFaq}
              className="bg-red-500 text-[var(--headline)] hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Card>
  );
}
