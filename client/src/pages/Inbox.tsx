"use client";

import type React from "react";

import { useState, useEffect, useRef } from "react";
import { api } from "@/utils/api";
import { AnimatePresence, motion } from "framer-motion";
import {
  Archive,
  Check,
  ChevronLeft,
  ChevronRight,
  Clock,
  Mail,
  MailOpen,
  MailQuestion,
  RefreshCw,
  Reply,
  Search,
  Trash2,
  Trash2Icon,
  X,
} from "lucide-react";
import { format, formatDistanceToNow } from "date-fns";
import { useToast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { CiMenuKebab } from "react-icons/ci";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";

import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";

interface ContactMessage {
  _id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  status: "new" | "read" | "replied" | "archived";
  isRead: boolean;
  reply?: {
    text: string;
    date: Date;
  };
  createdAt: string;
  updatedAt: string;
}

const Inbox = () => {
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentMessage, setCurrentMessage] = useState<ContactMessage | null>(
    null,
  );
  const [replyText, setReplyText] = useState("");
  const [isReplying, setIsReplying] = useState(false);
  const [activeTab, setActiveTab] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [messageToDelete, setMessageToDelete] = useState<ContactMessage | null>(
    null,
  );
  const { toast } = useToast();
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Message counts
  const [messageCounts, setMessageCounts] = useState({
    all: 0,
    new: 0,
    read: 0,
    replied: 0,
    archived: 0,
  });

  // Fetch messages
  useEffect(() => {
    fetchMessages();
  }, [activeTab, page]);

  // Focus search input when search is opened
  useEffect(() => {
    if (isSearchOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isSearchOpen]);

  const fetchMessages = async () => {
    try {
      setLoading(true);
      setIsRefreshing(true);
      const params: Record<string, any> = {
        page,
        limit: 10,
      };

      if (activeTab !== "all") {
        params.status = activeTab;
      }

      if (searchQuery) {
        params.search = searchQuery;
      }

      const response = await api.get("/contacts", { params });
      setMessages(response.data.contacts);
      setTotalPages(response.data.totalPages);

      // Fetch message counts
      const countsResponse = await api.get("/contacts/counts");
      setMessageCounts(countsResponse.data);
    } catch (err) {
      console.error("Error fetching messages:", err);
      // setError("Failed to load messages");
      toast({
        title: "Failed to load messages",
        description: "Please try again later or contact support.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
      setTimeout(() => setIsRefreshing(false), 500); // Add a small delay for animation
    }
  };

  // View message details
  const handleViewMessage = async (message: ContactMessage) => {
    try {
      setCurrentMessage(null); // Clear current message for loading state
      const response = await api.get(`/contacts/${message._id}`);
      setCurrentMessage(response.data);
      setReplyText("");

      // Mark as read if it's a new message
      if (response.data.status === "new") {
        handleUpdateStatus(message._id, "read");
      }
    } catch (err) {
      console.error("Error fetching message details:", err);
      toast({
        title: "Failed to load message details",
        description: "Please try again later or contact support.",
        variant: "destructive",
      });
    }
  };

  // Send reply via email client
  const handleSendEmailReply = (email: string, subject: string) => {
    const mailtoSubject = `Re: ${subject}`;
    window.location.href = `mailto:${email}?subject=${encodeURIComponent(
      mailtoSubject,
    )}&body=${encodeURIComponent(`\n\nOriginal message:\n${currentMessage?.message || ""}`)}`;
  };

  // Update message status
  const handleUpdateStatus = async (id: string, status: string) => {
    try {
      await api.put(`/contacts/${id}/status`, { status });

      // Refresh messages
      fetchMessages();

      // If current message is being updated, refresh it
      if (currentMessage && currentMessage._id === id) {
        handleViewMessage({ ...currentMessage, _id: id } as ContactMessage);
      }

      toast({
        title: `Message marked as ${status}`,
        description: "",
      });
    } catch (err) {
      console.error("Error updating message status:", err);
      toast({
        title: "Failed to update message status",
        description: "Please try again later or contact support.",
        variant: "destructive",
      });
    }
  };

  const handleRequestDelete = (message: ContactMessage) => {
    setMessageToDelete(message);
    setOpenDeleteDialog(true);
  };

  // Delete message
  const handleDeleteMessage = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this message?")) {
      return;
    }

    try {
      await api.delete(`/contacts/${id}`);

      toast({
        title: "Message deleted successfully",
        description: "",
      });

      // Refresh messages
      fetchMessages();

      // If current message is being deleted, clear it
      if (currentMessage && currentMessage._id === id) {
        setCurrentMessage(null);
      }
    } catch (err) {
      console.error("Error deleting message:", err);
      toast({
        title: "Failed to delete message",
        description: "Please try again later or contact support.",
        variant: "destructive",
      });
    }
  };

  // Format date
  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), "MMM d, yyyy h:mm a");
    } catch (err) {
      return dateString;
    }
  };

  // Format relative date
  const formatRelativeDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return formatDistanceToNow(date, { addSuffix: true });
    } catch (err) {
      return dateString;
    }
  };

  // Handle search
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1); // Reset to first page when searching
    fetchMessages();
    setIsSearchOpen(false);
  };

  // Clear search
  const handleClearSearch = () => {
    setSearchQuery("");
    setPage(1);
    fetchMessages();
  };

  // Get status badge color
  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case "new":
        return "default";
      case "read":
        return "secondary";
      case "replied":
        return "success";
      case "archived":
        return "outline";
      default:
        return "default";
    }
  };

  // Get initials for avatar
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .substring(0, 2);
  };

  // Get avatar color based on name
  const getAvatarColor = (name: string) => {
    const colors = [
      "bg-red-500",
      "bg-blue-500",
      "bg-green-500",
      "bg-yellow-500",
      "bg-purple-500",
      "bg-pink-500",
      "bg-indigo-500",
      "bg-teal-500",
    ];
    const index =
      name.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0) %
      colors.length;
    return colors[index];
  };

  // Render message list item
  const renderMessageItem = (message: ContactMessage) => {
    const isActive = currentMessage && currentMessage._id === message._id;
    const isNew = message.status === "new";

    return (
      <motion.div
        onClick={() => handleViewMessage(message)}
        className={cn(
          "group relative cursor-pointer border-b border-border p-4 transition-all hover:bg-accent/10",
          isActive && "bg-accent/20 hover:bg-accent/20",
          isNew && "bg-primary/5",
        )}
      >
        <div className="flex items-start gap-3">
          <Avatar className="h-10 w-10 shrink-0">
            <AvatarFallback className={getAvatarColor(message.name)}>
              {getInitials(message.name)}
            </AvatarFallback>
          </Avatar>
          <div className="relative min-w-0 flex-1">
            <div className="flex items-center justify-between">
              <h3
                className={cn("truncate font-medium", isNew && "font-semibold")}
              >
                {message.name}
              </h3>
              <span className="absolute bottom-0 right-0 ml-2 shrink-0 text-[10px] text-muted-foreground opacity-80">
                {formatRelativeDate(message.createdAt)}
              </span>
            </div>
            <p className="mt-1 truncate text-sm font-medium">
              {message.subject}
            </p>
            <p className="mt-1 truncate text-xs text-muted-foreground">
              {message.email}
            </p>
          </div>
        </div>
        <div className="absolute right-3 top-3">
          {isNew ? (
            <Badge variant="default" className="animate-pulse">
              New
            </Badge>
          ) : (
            <Badge
              variant={getStatusBadgeVariant(message.status)}
              className="opacity-70 transition-opacity group-hover:opacity-100"
            >
              {message.status}
            </Badge>
          )}
        </div>
      </motion.div>
    );
  };

  // Render loading skeleton
  const renderLoadingSkeleton = () => {
    return Array.from({ length: 5 }).map((_, index) => (
      <div
        key={index}
        className="flex items-start gap-3 border-b border-border p-4"
      >
        <Skeleton className="h-10 w-10 rounded-full" />
        <div className="flex-1">
          <Skeleton className="mb-2 h-4 w-1/3" />
          <Skeleton className="mb-2 h-4 w-3/4" />
          <Skeleton className="h-3 w-1/2" />
        </div>
      </div>
    ));
  };

  return (
    <div>
      <AlertDialog open={openDeleteDialog} onOpenChange={setOpenDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the
              message from {messageToDelete?.email}.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={async () => {
                if (messageToDelete) {
                  await handleDeleteMessage(messageToDelete._id);
                }
                setOpenDeleteDialog(false);
                setMessageToDelete(null);
              }}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <motion.div className="mb-6 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Inbox</h1>
          <p className="text-muted-foreground">Manage your contact messages</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {/* Search Button */}
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsSearchOpen(!isSearchOpen)}
                  className={cn(isSearchOpen && "bg-accent")}
                >
                  <Search className="mr-2 h-4 w-4" />
                  {searchQuery
                    ? `"${searchQuery.substring(0, 15)}${searchQuery.length > 15 ? "..." : ""}"`
                    : "Search"}
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Search messages</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          {/* Refresh Button */}
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={fetchMessages}
                  disabled={isRefreshing}
                  className="relative"
                >
                  <RefreshCw
                    className={cn("h-4 w-4", isRefreshing && "animate-spin")}
                  />
                  <span className="ml-2 hidden sm:inline">Refresh</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Refresh messages</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </motion.div>

      {/* Search Panel */}
      <AnimatePresence>
        {isSearchOpen && (
          <motion.div
            className="mb-6 overflow-hidden"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ delay: 0.2, duration: 0.4, ease: "easeOut" }}
          >
            <Card>
              <CardContent className="pt-6">
                <form onSubmit={handleSearch} className="flex gap-2">
                  <Input
                    ref={searchInputRef}
                    placeholder="Search by name, email or subject..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="flex-1"
                  />
                  {searchQuery && (
                    <Button
                      type="button"
                      variant="ghost"
                      onClick={handleClearSearch}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  )}
                  <Button type="submit">Search</Button>
                </form>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {error && (
        <motion.div className="mb-6 rounded-md bg-destructive/10 p-4 text-destructive">
          <p>{error}</p>
        </motion.div>
      )}

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Messages List */}
        <div className="lg:col-span-1">
          <Card className="overflow-hidden">
            <CardHeader className="p-4 pb-0">
              <Tabs
                defaultValue="all"
                value={activeTab}
                onValueChange={(value) => {
                  setActiveTab(value);
                  setPage(1);
                }}
              >
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="all" className="relative">
                    All
                    {messageCounts.all > 0 && (
                      <Badge variant="secondary" className="ml-1">
                        {messageCounts.all}
                      </Badge>
                    )}
                  </TabsTrigger>
                  <TabsTrigger value="new" className="relative">
                    New
                    {messageCounts.new > 0 && (
                      <Badge variant="default" className="ml-1">
                        {messageCounts.new}
                      </Badge>
                    )}
                  </TabsTrigger>
                  <TabsTrigger value="replied">Replied</TabsTrigger>
                  <TabsTrigger value="archived">Archived</TabsTrigger>
                </TabsList>
              </Tabs>
            </CardHeader>

            <ScrollArea className="h-[calc(100vh-280px)] min-h-[400px]">
              {loading && messages.length === 0 ? (
                renderLoadingSkeleton()
              ) : messages.length === 0 ? (
                <div className="flex h-40 flex-col items-center justify-center p-4 text-center">
                  <MailQuestion className="mb-2 h-10 w-10 text-muted-foreground" />
                  <p className="text-muted-foreground">No messages found</p>
                  {searchQuery && (
                    <Button
                      variant="link"
                      size="sm"
                      onClick={handleClearSearch}
                    >
                      Clear search
                    </Button>
                  )}
                </div>
              ) : (
                <AnimatePresence initial={false}>
                  {messages.map((message) => renderMessageItem(message))}
                </AnimatePresence>
              )}
            </ScrollArea>

            {/* Pagination */}
            {totalPages > 1 && (
              <CardFooter className="flex items-center justify-between border-t p-4">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setPage(Math.max(1, page - 1))}
                  disabled={page === 1}
                  className="h-8"
                >
                  <ChevronLeft className="mr-1 h-4 w-4" />
                  Previous
                </Button>
                <span className="text-sm text-muted-foreground">
                  Page {page} of {totalPages}
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setPage(Math.min(totalPages, page + 1))}
                  disabled={page === totalPages}
                  className="h-8"
                >
                  Next
                  <ChevronRight className="ml-1 h-4 w-4" />
                </Button>
              </CardFooter>
            )}
          </Card>
        </div>

        {/* Message Details */}
        <div className="lg:col-span-2">
          <AnimatePresence mode="wait">
            {currentMessage ? (
              <motion.div key="message-details">
                <Card>
                  <CardHeader className="border-b pb-4">
                    <div className="relative flex w-full flex-wrap items-start justify-between gap-4">
                      <div className="flex items-start gap-4">
                        <Avatar className="h-12 w-12">
                          <AvatarFallback
                            className={getAvatarColor(currentMessage.name)}
                          >
                            {getInitials(currentMessage.name)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <CardTitle className="text-xl">
                            {currentMessage.subject}
                          </CardTitle>
                          <CardDescription className="mt-1">
                            From: {currentMessage.name} ({currentMessage.email})
                          </CardDescription>
                          <div className="mt-1 flex items-center gap-2">
                            <Badge
                              variant={getStatusBadgeVariant(
                                currentMessage.status,
                              )}
                            >
                              {currentMessage.status}
                            </Badge>
                            <span className="flex items-center text-xs text-muted-foreground">
                              <Clock className="mr-1 h-3 w-3" />
                              {formatDate(currentMessage.createdAt)}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="absolute right-0 top-0 flex flex-wrap gap-2">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="icon" size="sm">
                              <CiMenuKebab />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>
                              Message Actions
                            </DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              onClick={() =>
                                handleSendEmailReply(
                                  currentMessage.email,
                                  currentMessage.subject,
                                )
                              }
                            >
                              <Reply className="mr-2 h-4 w-4" />
                              Reply via Email
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() =>
                                handleUpdateStatus(currentMessage._id, "read")
                              }
                              disabled={currentMessage.status === "read"}
                            >
                              <MailOpen className="mr-2 h-4 w-4" />
                              Mark as Read
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() =>
                                handleUpdateStatus(
                                  currentMessage._id,
                                  "archived",
                                )
                              }
                              disabled={currentMessage.status === "archived"}
                            >
                              <Archive className="mr-2 h-4 w-4" />
                              Archive
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              onClick={() =>
                                handleDeleteMessage(currentMessage._id)
                              }
                              className="text-destructive focus:text-destructive"
                            >
                              <Trash2 className="mr-2 h-4 w-4" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>

                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                variant="icon"
                                onClick={() =>
                                  handleSendEmailReply(
                                    currentMessage.email,
                                    currentMessage.subject,
                                  )
                                }
                              >
                                <Reply className="h-4 w-4" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Reply via Email</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>

                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                variant={"icon"}
                                onClick={() =>
                                  handleDeleteMessage(currentMessage._id)
                                }
                              >
                                <Trash2Icon className="h-4 w-4" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Delete Message</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="p-6">
                    <div className="rounded-lg bg-muted/50 p-4">
                      <div className="whitespace-pre-line">
                        {currentMessage.message}
                      </div>
                    </div>

                    {currentMessage.reply && (
                      <motion.div className="mt-6">
                        <div className="mb-2 flex items-center">
                          <Check className="mr-2 h-4 w-4 text-green-500" />
                          <h4 className="font-medium">Your Reply:</h4>
                        </div>
                        <div className="rounded-lg bg-primary/5 p-4">
                          <div className="whitespace-pre-line">
                            {currentMessage.reply.text}
                          </div>
                          <div className="mt-2 text-right text-xs text-muted-foreground">
                            Sent on{" "}
                            {formatDate(currentMessage.reply.date.toString())}
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            ) : messages.length > 0 ? (
              <motion.div
                key="empty-state"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5, duration: 0.5 }}
              >
                <Card className="flex h-[calc(100vh-280px)] min-h-[400px] flex-col items-center justify-center p-6 text-center">
                  <Mail className="h-16 w-16 text-muted-foreground/30" />
                  <h3 className="mt-4 text-xl font-medium">
                    No message selected
                  </h3>
                  <p className="mt-2 text-muted-foreground">
                    Select a message from the list to view its details
                  </p>
                </Card>
              </motion.div>
            ) : null}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default Inbox;
