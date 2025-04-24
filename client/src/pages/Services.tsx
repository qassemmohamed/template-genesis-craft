import type React from "react";

import { useState, useEffect, type FormEvent } from "react";
import { api } from "../utils/api";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { Plus, Pencil, Trash2, ImageIcon } from "lucide-react";
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

// Interfaces for service and form data
interface Service {
  _id: string;
  title: string;
  description: string;
  key: string;
  imageUrl: string | null;
  active: boolean;
}

interface FormData {
  title: string;
  description: string;
}

export default function Services() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [currentService, setCurrentService] = useState<Service | null>(null);
  const [formData, setFormData] = useState<FormData>({
    title: "",
    description: "",
  });
  const [file, setFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState<boolean>(false);
  const [serviceToDelete, setServiceToDelete] = useState<string | null>(null);

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      setLoading(true);
      const response = await api.get("/services");
      setServices(response.data);
    } catch (err) {
      console.error("Error fetching services:", err);
      setError("Failed to load services");
      toast.error("Failed to load services");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files ? e.target.files[0] : null;
    setFile(selectedFile);

    // Create preview for the selected image
    if (selectedFile) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(selectedFile);
    } else {
      setImagePreview(null);
    }
  };

  const handleAddService = () => {
    setCurrentService(null);
    setFormData({
      title: "",
      description: "",
    });
    setFile(null);
    setImagePreview(null);
    setIsModalOpen(true);
  };

  const handleEditService = (service: Service) => {
    setCurrentService(service);
    setFormData({
      title: service.title,
      description: service.description,
    });
    setFile(null);
    setImagePreview(service.imageUrl);
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    try {
      setLoading(true);

      const formDataObj = new FormData();
      formDataObj.append("title", formData.title);
      formDataObj.append("description", formData.description);

      if (file) {
        formDataObj.append("image", file);
      }

      let response;

      if (currentService) {
        response = await api.put(
          `/services/${currentService._id}`,
          formDataObj,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          },
        );
        toast.success("Service updated successfully");
      } else {
        response = await api.post("/services", formDataObj, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
        toast.success("Service created successfully");
      }

      fetchServices();
      setIsModalOpen(false);
    } catch (err: any) {
      console.error("Error saving service:", err);
      toast.error(err.response?.data?.message || "Failed to save service");
    } finally {
      setLoading(false);
    }
  };

  const confirmDeleteService = (id: string) => {
    setServiceToDelete(id);
    setDeleteDialogOpen(true);
  };

  const handleDeleteService = async () => {
    if (!serviceToDelete) return;

    try {
      setLoading(true);
      await api.delete(`/services/${serviceToDelete}`);
      toast.success("Service deleted successfully");
      fetchServices();
    } catch (err: any) {
      console.error("Error deleting service:", err);
      toast.error("Failed to delete service");
    } finally {
      setLoading(false);
      setDeleteDialogOpen(false);
      setServiceToDelete(null);
    }
  };

  if (loading && services.length === 0) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-t-2 border-primary"></div>
      </div>
    );
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-2xl font-bold">Manage Services</CardTitle>
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Button onClick={handleAddService}>
            <Plus className="mr-2 h-4 w-4" />
            Add Service
          </Button>
        </motion.div>
      </CardHeader>
      <CardContent>
        {error && (
          <div className="mb-6 rounded-md bg-destructive/10 p-4 text-destructive">
            <h3 className="text-sm font-medium">Error</h3>
            <p className="mt-1 text-sm">{error}</p>
          </div>
        )}

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Description</TableHead>
                {/* <TableHead>Image</TableHead> */}
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {services.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={4}
                    className="py-8 text-center text-muted-foreground"
                  >
                    No services found. Click "Add Service" to create one.
                  </TableCell>
                </TableRow>
              ) : (
                services.map((service) => (
                  <motion.tr
                    key={service._id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3 }}
                    className="[&>td]:p-4"
                  >
                    <TableCell className="font-medium">
                      {service.title}
                    </TableCell>
                    <TableCell className="max-w-[300px] truncate">
                      {service.description}
                    </TableCell>
                    {/* <TableCell>
                      {service.imageUrl ? (
                        <div className="relative h-12 w-12 overflow-hidden rounded-md">
                          <img
                            src={service.imageUrl || "/placeholder.svg"}
                            alt={service.title}
                            className="h-full w-full object-cover"
                          />
                        </div>
                      ) : (
                        <div className="flex h-12 w-12 items-center justify-center rounded-md bg-muted">
                          <ImageIcon className="h-6 w-6 text-muted-foreground" />
                        </div>
                      )}
                    </TableCell> */}
                    <TableCell className="text-right">
                      <motion.div
                        className="inline-block"
                        whileHover={{ scale: 1.1 }}
                      >
                        <Button
                          variant="ghost"
                          onClick={() => handleEditService(service)}
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
                          onClick={() => confirmDeleteService(service._id)}
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
      </CardContent>

      {/* Modal for Add/Edit Service */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>{currentService ? "Edit" : "Add"} Service</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="Enter service title"
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Enter service description"
                className="min-h-[100px]"
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
                {loading ? "Saving..." : currentService ? "Update" : "Add"}
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
              service and remove it from our servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteService}
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
