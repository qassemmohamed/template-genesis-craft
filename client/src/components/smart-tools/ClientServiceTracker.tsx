"use client";

import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
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
  Plus,
  Check,
  RefreshCw,
  Clock,
  Calendar,
  MoreHorizontal,
  Search,
  Filter,
  UserPlus,
  Edit,
  Trash2,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { format } from "date-fns";

// Define client type
interface Client {
  id: string;
  name: string;
  service: string;
  status: "awaiting" | "in-progress" | "filed" | "completed";
  date: string;
  email?: string;
  priority?: "low" | "medium" | "high";
  notes?: string;
  avatar?: string;
}

// Initial data
const initialClients: Client[] = [
  {
    id: "1",
    name: "John Smith",
    email: "john.smith@example.com",
    service: "Tax Filing - Individual",
    status: "awaiting",
    date: "2023-04-15",
    priority: "high",
    notes: "Waiting for W-2 forms and last year's tax return",
  },
  {
    id: "2",
    name: "ABC Corporation",
    email: "finance@abccorp.com",
    service: "Tax Filing - Business",
    status: "in-progress",
    date: "2023-03-20",
    priority: "medium",
    notes: "Quarterly filing in progress, need to verify deductions",
  },
  {
    id: "3",
    name: "Maria Garcia",
    email: "maria.g@example.com",
    service: "Translation - Spanish",
    status: "completed",
    date: "2023-03-10",
    priority: "low",
    notes: "All documents translated and delivered",
  },
  {
    id: "4",
    name: "Ahmed Hassan",
    email: "ahmed.h@example.com",
    service: "Immigration Assistance",
    status: "filed",
    date: "2023-03-05",
    priority: "high",
    notes: "USCIS forms submitted, awaiting confirmation",
  },
  {
    id: "5",
    name: "Sarah Johnson",
    email: "sarah.j@example.com",
    service: "Notary Service",
    status: "completed",
    date: "2023-03-01",
    priority: "low",
    notes: "Documents notarized and returned to client",
  },
];

// Status columns configuration
const columns = [
  {
    id: "awaiting",
    title: "Awaiting Documents",
    icon: <Clock className="h-5 w-5 text-amber-500" />,
    color: "border-amber-500",
    bgColor: "bg-amber-50 dark:bg-amber-950/20",
    description: "Clients who need to submit documents",
  },
  {
    id: "in-progress",
    title: "In Progress",
    icon: <RefreshCw className="h-5 w-5 text-blue-500" />,
    color: "border-blue-500",
    bgColor: "bg-blue-50 dark:bg-blue-950/20",
    description: "Working on these client services",
  },
  {
    id: "filed",
    title: "Filed",
    icon: <Calendar className="h-5 w-5 text-purple-500" />,
    color: "border-purple-500",
    bgColor: "bg-purple-50 dark:bg-purple-950/20",
    description: "Submitted to appropriate authorities",
  },
  {
    id: "completed",
    title: "Completed",
    icon: <Check className="h-5 w-5 text-green-500" />,
    color: "border-green-500",
    bgColor: "bg-green-50 dark:bg-green-950/20",
    description: "All steps finished successfully",
  },
];

// Priority configuration
const priorities = {
  high: {
    label: "High",
    color: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300",
  },
  medium: {
    label: "Medium",
    color:
      "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300",
  },
  low: {
    label: "Low",
    color:
      "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300",
  },
};

const ClientServiceTracker: React.FC = () => {
  const { toast } = useToast();
  const [clients, setClients] = useState<Client[]>(initialClients);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterPriority, setFilterPriority] = useState<string | null>(null);
  const [isAddClientOpen, setIsAddClientOpen] = useState(false);
  const [isClientDetailsOpen, setIsClientDetailsOpen] = useState(false);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const draggedItem = useRef<Client | null>(null);
  const draggedOverColumn = useRef<string | null>(null);

  // Filter clients by status and search/filter criteria
  const getFilteredClientsByStatus = (status: string) => {
    return clients.filter(
      (client) =>
        client.status === status &&
        (searchQuery === "" ||
          client.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          client.service.toLowerCase().includes(searchQuery.toLowerCase())) &&
        (filterPriority === null || client.priority === filterPriority),
    );
  };

  // Handle status change
  const updateClientStatus = (
    clientId: string,
    newStatus: "awaiting" | "in-progress" | "filed" | "completed",
    showToast = true,
  ) => {
    setClients((prev) =>
      prev.map((client) =>
        client.id === clientId ? { ...client, status: newStatus } : client,
      ),
    );

    if (showToast) {
      const statusLabel =
        columns.find((col) => col.id === newStatus)?.title || newStatus;
      toast({
        title: "Client status updated",
        description: `Client service status changed to ${statusLabel}`,
      });
    }
  };

  // Handle client selection for details view
  const handleClientSelect = (client: Client) => {
    setSelectedClient(client);
    setIsClientDetailsOpen(true);
  };

  // Format date for display
  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), "MMM d, yyyy");
    } catch (error) {
      return dateString;
    }
  };

  // Get initials for avatar
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  // Handle drag start
  const handleDragStart = (client: Client) => {
    draggedItem.current = client;
    setIsDragging(true);
  };

  // Handle drag over
  const handleDragOver = (e: React.DragEvent, columnId: string) => {
    e.preventDefault();
    draggedOverColumn.current = columnId;
  };

  // Handle drop
  const handleDrop = (e: React.DragEvent, columnId: string) => {
    e.preventDefault();
    if (draggedItem.current && draggedItem.current.status !== columnId) {
      updateClientStatus(draggedItem.current.id, columnId as any);
    }
    draggedItem.current = null;
    draggedOverColumn.current = null;
    setIsDragging(false);
  };

  // Handle drag end
  const handleDragEnd = () => {
    draggedItem.current = null;
    draggedOverColumn.current = null;
    setIsDragging(false);
  };

  // Clear filters
  const clearFilters = () => {
    setSearchQuery("");
    setFilterPriority(null);
  };

  return (
    <div className="py-6">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"
      >
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Client Service Tracker
          </h1>
          <p className="text-muted-foreground">
            Track and manage client services across all stages
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button onClick={() => setIsAddClientOpen(true)}>
            <UserPlus className="mr-2 h-4 w-4" />
            Add Client
          </Button>
        </div>
      </motion.div>

      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search clients or services..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
          {searchQuery && (
            <Button
              variant="ghost"
              size="sm"
              className="absolute right-1 top-1 h-8 w-8 rounded-full p-0"
              onClick={() => setSearchQuery("")}
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="gap-2">
              <Filter className="h-4 w-4" />
              <span className="hidden sm:inline">Filter</span>
              {filterPriority && (
                <Badge variant="secondary">{filterPriority}</Badge>
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>Filter by Priority</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className={cn(filterPriority === "high" && "bg-accent")}
              onClick={() =>
                setFilterPriority(filterPriority === "high" ? null : "high")
              }
            >
              <span className="mr-2 h-2 w-2 rounded-full bg-red-500" />
              High Priority
            </DropdownMenuItem>
            <DropdownMenuItem
              className={cn(filterPriority === "medium" && "bg-accent")}
              onClick={() =>
                setFilterPriority(filterPriority === "medium" ? null : "medium")
              }
            >
              <span className="mr-2 h-2 w-2 rounded-full bg-amber-500" />
              Medium Priority
            </DropdownMenuItem>
            <DropdownMenuItem
              className={cn(filterPriority === "low" && "bg-accent")}
              onClick={() =>
                setFilterPriority(filterPriority === "low" ? null : "low")
              }
            >
              <span className="mr-2 h-2 w-2 rounded-full bg-green-500" />
              Low Priority
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={clearFilters}>
              <X className="mr-2 h-4 w-4" />
              Clear Filters
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
        {columns.map((column) => {
          const columnClients = getFilteredClientsByStatus(column.id);
          return (
            <motion.div
              key={column.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.3,
                delay: columns.findIndex((c) => c.id === column.id) * 0.1,
              }}
            >
              <Card
                className={cn(
                  "border-t-4 transition-all",
                  column.color,
                  draggedOverColumn.current === column.id &&
                    "ring-2 ring-primary ring-offset-2",
                )}
                onDragOver={(e) => handleDragOver(e, column.id)}
                onDrop={(e) => handleDrop(e, column.id)}
              >
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2 text-lg font-medium">
                      {column.icon}
                      {column.title}
                    </CardTitle>
                    <Badge variant="secondary" className="rounded-full px-2.5">
                      {columnClients.length}
                    </Badge>
                  </div>
                  <CardDescription>{column.description}</CardDescription>
                </CardHeader>
                <CardContent className="px-3">
                  <ScrollArea className="h-[calc(100vh-280px)] min-h-[300px] px-1">
                    <AnimatePresence initial={false}>
                      {columnClients.length > 0 ? (
                        <div className="space-y-3 py-1">
                          {columnClients.map((client) => (
                            <motion.div
                              key={client.id}
                              layout
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{
                                opacity: 0,
                                height: 0,
                                marginTop: 0,
                                marginBottom: 0,
                              }}
                              transition={{ duration: 0.2 }}
                              className={cn(
                                "group cursor-pointer rounded-md border bg-card p-3 shadow-sm transition-all hover:shadow",
                                isDragging &&
                                  draggedItem.current?.id === client.id &&
                                  "opacity-50",
                              )}
                              onClick={() => handleClientSelect(client)}
                              draggable
                              onDragStart={() => handleDragStart(client)}
                              onDragEnd={handleDragEnd}
                            >
                              <div className="mb-2 flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                  <Avatar className="h-8 w-8">
                                    <AvatarFallback>
                                      {getInitials(client.name)}
                                    </AvatarFallback>
                                  </Avatar>
                                  <div>
                                    <div className="font-medium">
                                      {client.name}
                                    </div>
                                    <div className="text-xs text-muted-foreground">
                                      {client.email}
                                    </div>
                                  </div>
                                </div>
                                <DropdownMenu>
                                  <DropdownMenuTrigger asChild>
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      className="h-8 w-8 opacity-0 group-hover:opacity-100"
                                      onClick={(e) => e.stopPropagation()}
                                    >
                                      <MoreHorizontal className="h-4 w-4" />
                                    </Button>
                                  </DropdownMenuTrigger>
                                  <DropdownMenuContent align="end">
                                    <DropdownMenuLabel>
                                      Actions
                                    </DropdownMenuLabel>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem
                                      onClick={(e) => e.stopPropagation()}
                                    >
                                      <Edit className="mr-2 h-4 w-4" />
                                      Edit Client
                                    </DropdownMenuItem>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem
                                      className="text-destructive focus:text-destructive"
                                      onClick={(e) => e.stopPropagation()}
                                    >
                                      <Trash2 className="mr-2 h-4 w-4" />
                                      Remove Client
                                    </DropdownMenuItem>
                                  </DropdownMenuContent>
                                </DropdownMenu>
                              </div>
                              <div className="mb-3 text-sm">
                                {client.service}
                              </div>
                              <div className="flex items-center justify-between">
                                <Badge
                                  variant="outline"
                                  className={cn(
                                    "font-normal",
                                    client.priority &&
                                      priorities[client.priority].color,
                                  )}
                                >
                                  {client.priority
                                    ? priorities[client.priority].label
                                    : "No"}{" "}
                                  Priority
                                </Badge>
                                <span className="text-xs text-muted-foreground">
                                  {formatDate(client.date)}
                                </span>
                              </div>
                              <div className="mt-2 line-clamp-2 text-xs text-muted-foreground">
                                {client.notes || "No notes available"}
                              </div>
                            </motion.div>
                          ))}
                        </div>
                      ) : (
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          className={cn(
                            "flex h-24 flex-col items-center justify-center rounded-md border border-dashed p-4 text-center text-sm text-muted-foreground",
                            column.bgColor,
                          )}
                        >
                          <p>No clients in this stage</p>
                          {(searchQuery || filterPriority) && (
                            <Button
                              variant="ghost"
                              size="sm"
                              className="mt-2"
                              onClick={clearFilters}
                            >
                              Clear filters
                            </Button>
                          )}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </ScrollArea>
                </CardContent>
                <CardFooter className="flex justify-center border-t bg-muted/50 px-6 py-3">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-auto w-full justify-start px-2 py-1 text-xs"
                  >
                    <Plus className="mr-1 h-3 w-3" />
                    Add client to {column.title.toLowerCase()}
                  </Button>
                </CardFooter>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {/* Client Details Dialog */}
      <Dialog open={isClientDetailsOpen} onOpenChange={setIsClientDetailsOpen}>
        <DialogContent className="sm:max-w-[500px]">
          {selectedClient && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback>
                      {getInitials(selectedClient.name)}
                    </AvatarFallback>
                  </Avatar>
                  <span>{selectedClient.name}</span>
                </DialogTitle>
                <DialogDescription>{selectedClient.email}</DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h4 className="mb-1 text-sm font-medium">Service</h4>
                    <p className="text-sm">{selectedClient.service}</p>
                  </div>
                  <div>
                    <h4 className="mb-1 text-sm font-medium">Status</h4>
                    <Badge
                      variant="outline"
                      className={cn(
                        "font-normal",
                        columns.find((col) => col.id === selectedClient.status)
                          ?.color,
                      )}
                    >
                      {
                        columns.find((col) => col.id === selectedClient.status)
                          ?.title
                      }
                    </Badge>
                  </div>
                  <div>
                    <h4 className="mb-1 text-sm font-medium">Date</h4>
                    <p className="text-sm">{formatDate(selectedClient.date)}</p>
                  </div>
                  <div>
                    <h4 className="mb-1 text-sm font-medium">Priority</h4>
                    <Badge
                      variant="outline"
                      className={cn(
                        "font-normal",
                        selectedClient.priority &&
                          priorities[selectedClient.priority].color,
                      )}
                    >
                      {selectedClient.priority
                        ? priorities[selectedClient.priority].label
                        : "No"}{" "}
                      Priority
                    </Badge>
                  </div>
                </div>

                <div>
                  <h4 className="mb-1 text-sm font-medium">Notes</h4>
                  <div className="rounded-md bg-muted p-3 text-sm">
                    {selectedClient.notes || "No notes available"}
                  </div>
                </div>

                <div>
                  <h4 className="mb-2 text-sm font-medium">Change Status</h4>
                  <div className="flex flex-wrap gap-2">
                    {columns.map(
                      (col) =>
                        col.id !== selectedClient.status && (
                          <TooltipProvider key={col.id}>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="h-9 gap-1"
                                  onClick={() => {
                                    updateClientStatus(
                                      selectedClient.id,
                                      col.id as any,
                                    );
                                    setSelectedClient({
                                      ...selectedClient,
                                      status: col.id as any,
                                    });
                                  }}
                                >
                                  {col.icon}
                                  <span className="hidden sm:inline">
                                    {col.title}
                                  </span>
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>Move to {col.title}</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        ),
                    )}
                  </div>
                </div>
              </div>
              <DialogFooter className="flex sm:justify-between">
                <Button
                  variant="outline"
                  onClick={() => setIsClientDetailsOpen(false)}
                >
                  Close
                </Button>
                <div className="flex gap-2">
                  <Button variant="outline">
                    <Edit className="mr-2 h-4 w-4" />
                    Edit
                  </Button>
                  <Button variant="default">
                    <Trash2 className="mr-2 h-4 w-4" />
                    Delete
                  </Button>
                </div>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Add Client Dialog (placeholder) */}
      <Dialog open={isAddClientOpen} onOpenChange={setIsAddClientOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Client</DialogTitle>
            <DialogDescription>
              Enter client details to add them to the tracker.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <p className="text-center text-muted-foreground">
              Add Client form would go here
            </p>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddClientOpen(false)}>
              Cancel
            </Button>
            <Button onClick={() => setIsAddClientOpen(false)}>
              Add Client
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ClientServiceTracker;
