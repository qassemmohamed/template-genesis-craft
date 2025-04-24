import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  MessageSquare,
  Search,
  User,
  Trash2,
  CheckCircle,
  XCircle,
  RefreshCw,
  Filter,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useChat } from "@/hooks/useChat";
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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface Client {
  _id: string;
  username: string;
  email: string;
  fullName?: string;
  isActive: boolean;
  createdAt: string;
  avatarUrl?: string;
}

const ClientManagement: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { sendMessage } = useChat();

  const [clients, setClients] = useState<Client[]>([]);
  const [filteredClients, setFilteredClients] = useState<Client[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<
    "all" | "active" | "inactive"
  >("all");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [clientToDelete, setClientToDelete] = useState<Client | null>(null);

  // Fetch all clients when component mounts
  useEffect(() => {
    fetchClients();
  }, []);

  // Apply filters whenever clients, searchQuery or statusFilter changes
  useEffect(() => {
    applyFilters();
  }, [clients, searchQuery, statusFilter]);

  const fetchClients = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/clients");
      if (!response.ok) throw new Error("Failed to fetch clients");

      const data = await response.json();
      setClients(data);
    } catch (error) {
      console.error("Error fetching clients:", error);
      toast({
        title: "Error",
        description: "Failed to load clients. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const applyFilters = () => {
    let result = [...clients];

    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (client) =>
          client.username.toLowerCase().includes(query) ||
          client.email.toLowerCase().includes(query) ||
          (client.fullName && client.fullName.toLowerCase().includes(query)),
      );
    }

    // Apply status filter
    if (statusFilter !== "all") {
      result = result.filter((client) =>
        statusFilter === "active" ? client.isActive : !client.isActive,
      );
    }

    setFilteredClients(result);
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleStatusFilterChange = (status: "all" | "active" | "inactive") => {
    setStatusFilter(status);
  };

  const confirmDeleteClient = (client: Client) => {
    setClientToDelete(client);
    setDeleteDialogOpen(true);
  };

  const deleteClient = async () => {
    if (!clientToDelete) return;

    try {
      const response = await fetch(`/api/clients/${clientToDelete._id}`, {
        method: "DELETE",
      });

      if (!response.ok) throw new Error("Failed to delete client");

      // Remove client from state
      setClients(clients.filter((c) => c._id !== clientToDelete._id));

      toast({
        title: "Success",
        description: `${clientToDelete.username} has been deleted.`,
      });
    } catch (error) {
      console.error("Error deleting client:", error);
      toast({
        title: "Error",
        description: "Failed to delete client. Please try again.",
        variant: "destructive",
      });
    } finally {
      setDeleteDialogOpen(false);
      setClientToDelete(null);
    }
  };

  const toggleClientStatus = async (client: Client) => {
    try {
      const response = await fetch(`/api/clients/${client._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          isActive: !client.isActive,
        }),
      });

      if (!response.ok) throw new Error("Failed to update client status");

      const updatedClient = await response.json();

      // Update client in state
      setClients(
        clients.map((c) => (c._id === client._id ? updatedClient : c)),
      );

      toast({
        title: "Success",
        description: `${client.username} is now ${updatedClient.isActive ? "active" : "inactive"}.`,
      });
    } catch (error) {
      console.error("Error updating client status:", error);
      toast({
        title: "Error",
        description: "Failed to update client status. Please try again.",
        variant: "destructive",
      });
    }
  };

  const startChat = (client: Client) => {
    // Look for existing chat with this client
    navigate(`/dashboard/communication?client=${client._id}`);
  };

  const getInitials = (name: string) => {
    return name.charAt(0).toUpperCase();
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Client Management</h1>
        <Button onClick={fetchClients} variant="outline" size="sm">
          <RefreshCw className="mr-2 h-4 w-4" />
          Refresh
        </Button>
      </div>

      <Card className="p-4">
        <div className="mb-4 flex flex-col gap-4 md:flex-row">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search by name, email, or username..."
              className="pl-8"
              value={searchQuery}
              onChange={handleSearch}
            />
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">
                <Filter className="mr-2 h-4 w-4" />
                Status:{" "}
                {statusFilter === "all"
                  ? "All"
                  : statusFilter === "active"
                    ? "Active"
                    : "Inactive"}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={() => handleStatusFilterChange("all")}>
                All
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => handleStatusFilterChange("active")}
              >
                Active Only
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => handleStatusFilterChange("inactive")}
              >
                Inactive Only
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <Table>
          <TableCaption>
            List of all clients registered in the system
          </TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead>User</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Joined Date</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={5} className="py-8 text-center">
                  <div className="flex items-center justify-center">
                    <RefreshCw className="mr-2 h-5 w-5 animate-spin" />
                    Loading clients...
                  </div>
                </TableCell>
              </TableRow>
            ) : filteredClients.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="py-8 text-center">
                  No clients found
                </TableCell>
              </TableRow>
            ) : (
              filteredClients.map((client) => (
                <TableRow key={client._id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="h-8 w-8">
                        {client.avatarUrl ? (
                          <AvatarImage
                            src={client.avatarUrl}
                            alt={client.username}
                          />
                        ) : null}
                        <AvatarFallback>
                          {getInitials(client.fullName || client.username)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-medium">
                          {client.fullName || client.username}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          @{client.username}
                        </div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>{client.email}</TableCell>
                  <TableCell>
                    <Badge variant={client.isActive ? "default" : "secondary"}>
                      {client.isActive ? "Active" : "Inactive"}
                    </Badge>
                  </TableCell>
                  <TableCell>{formatDate(client.createdAt)}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => toggleClientStatus(client)}
                        title={client.isActive ? "Deactivate" : "Activate"}
                      >
                        {client.isActive ? (
                          <XCircle className="h-4 w-4 text-destructive" />
                        ) : (
                          <CheckCircle className="h-4 w-4 text-emerald-500" />
                        )}
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => confirmDeleteClient(client)}
                        title="Delete"
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                      <Button
                        variant="default"
                        size="sm"
                        onClick={() => startChat(client)}
                        title="Chat"
                      >
                        <MessageSquare className="mr-1 h-4 w-4" />
                        Chat
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </Card>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete {clientToDelete?.username}'s account
              and all associated data. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={deleteClient}
              className="bg-red-500 text-[var(--headline)]"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default ClientManagement;
