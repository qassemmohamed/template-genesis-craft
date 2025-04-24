import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import {
  MessageSquareIcon,
  PaperclipIcon,
  SendIcon,
  UserIcon,
  PhoneIcon,
  MailIcon,
  CalendarIcon,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useTranslation } from "react-i18next";

// Mock clients
const clients = [
  {
    id: "1",
    name: "Ahmed Khan",
    email: "ahmed.khan@example.com",
    phone: "+1 (215) 555-1234",
    avatar: null,
    lastContact: "2024-04-02",
    service: "Tax Filing",
  },
  {
    id: "2",
    name: "Maria Garcia",
    email: "maria.garcia@example.com",
    phone: "+1 (215) 555-5678",
    avatar: null,
    lastContact: "2024-03-28",
    service: "Bookkeeping",
  },
  {
    id: "3",
    name: "Jean Dupont",
    email: "jean.dupont@example.com",
    phone: "+1 (215) 555-9012",
    avatar: null,
    lastContact: "2024-04-01",
    service: "Translation",
  },
  {
    id: "4",
    name: "John Smith",
    email: "john.smith@example.com",
    phone: "+1 (215) 555-3456",
    avatar: null,
    lastContact: "2024-03-25",
    service: "Immigration",
  },
  {
    id: "5",
    name: "Fatima Rahman",
    email: "fatima.rahman@example.com",
    phone: "+1 (215) 555-7890",
    avatar: null,
    lastContact: "2024-03-30",
    service: "Notary",
  },
];

// Mock conversation history
const initialConversations: Record<string, Message[]> = {
  "1": [
    {
      id: "m1",
      sender: "client",
      content:
        "Hello, I have a question about my tax filing status for this year.",
      timestamp: "2024-04-02T10:30:00",
      read: true,
    },
    {
      id: "m2",
      sender: "admin",
      content:
        "Hello Ahmed, I'd be happy to help. What would you like to know about your filing status?",
      timestamp: "2024-04-02T10:35:00",
      read: true,
    },
    {
      id: "m3",
      sender: "client",
      content: "I got married in January. How does that affect my filing?",
      timestamp: "2024-04-02T10:38:00",
      read: true,
    },
    {
      id: "m4",
      sender: "admin",
      content:
        "Congratulations! Since you were married on or before December 31st of last year, you can file jointly with your spouse for the entire year. This often results in a better tax situation. I'll need some information about your spouse to update your filing.",
      timestamp: "2024-04-02T10:42:00",
      read: true,
    },
  ],
  "2": [
    {
      id: "m5",
      sender: "client",
      content: "Hi, I need to review my monthly bookkeeping statement.",
      timestamp: "2024-03-28T14:15:00",
      read: true,
    },
    {
      id: "m6",
      sender: "admin",
      content:
        "Hello Maria, I'll send over the latest statement for your review shortly.",
      timestamp: "2024-03-28T14:20:00",
      read: true,
    },
  ],
  "3": [
    {
      id: "m7",
      sender: "client",
      content: "Bonjour, j'ai besoin de traduire des documents d'immigration.",
      timestamp: "2024-04-01T09:10:00",
      read: true,
    },
    {
      id: "m8",
      sender: "admin",
      content:
        "Bonjour Jean, je serais heureux de vous aider avec la traduction de vos documents. Pouvez-vous me donner plus de détails sur les documents et les langues requises?",
      timestamp: "2024-04-01T09:15:00",
      read: true,
    },
  ],
  "4": [],
  "5": [],
};

interface Client {
  id: string;
  name: string;
  email: string;
  phone: string;
  avatar: string | null;
  lastContact: string;
  service: string;
}

interface Message {
  id: string;
  sender: "client" | "admin";
  content: string;
  timestamp: string;
  read: boolean;
  attachment?: string;
}

const ClientCommunication: React.FC = () => {
  const { t } = useTranslation();
  const { toast } = useToast();
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [conversations, setConversations] =
    useState<Record<string, Message[]>>(initialConversations);
  const [newMessage, setNewMessage] = useState<string>("");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [messageType, setMessageType] = useState<string>("message");

  // Quick message templates
  const messageTemplates = [
    {
      id: "t1",
      name: "Document Request",
      content:
        "Hello [Client], I need some additional documents for your [Service]. Could you please send the following: 1. [Document1] 2. [Document2]",
    },
    {
      id: "t2",
      name: "Appointment Confirmation",
      content:
        "Hello [Client], This is to confirm your appointment on [Date] at [Time] for [Service]. Please arrive 10 minutes early and bring all relevant documents.",
    },
    {
      id: "t3",
      name: "Service Completion",
      content:
        "Hello [Client], I'm pleased to inform you that your [Service] has been completed. You can find the final documents attached to this message. Please review and let me know if you have any questions.",
    },
  ];

  // Filter clients by search term
  const filteredClients = clients.filter(
    (client) =>
      client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.service.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  // Get messages for selected client
  const getMessages = () => {
    if (!selectedClient) return [];
    return conversations[selectedClient.id] || [];
  };

  // Send a new message
  const sendMessage = () => {
    if (!selectedClient || !newMessage.trim()) {
      toast({
        title: "Cannot send message",
        description: "Please select a client and enter a message",
        variant: "destructive",
      });
      return;
    }

    const clientId = selectedClient.id;
    const message: Message = {
      id: `new-${Date.now()}`,
      sender: "admin",
      content: newMessage,
      timestamp: new Date().toISOString(),
      read: false,
    };

    setConversations((prev) => ({
      ...prev,
      [clientId]: [...(prev[clientId] || []), message],
    }));

    setNewMessage("");

    toast({
      title: "Message sent",
      description: `Your message has been sent to ${selectedClient.name}`,
    });
  };

  // Format timestamp
  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  // Apply message template
  const applyTemplate = (template: string) => {
    if (!selectedClient) return;

    // Replace placeholders with client info
    let content = template
      .replace("[Client]", selectedClient.name)
      .replace("[Service]", selectedClient.service)
      .replace("[Date]", new Date().toLocaleDateString())
      .replace("[Time]", "10:00 AM");

    setNewMessage(content);
  };

  return (
    <div className="grid gap-6 md:grid-cols-[300px_1fr]">
      <Card>
        <CardHeader>
          <CardTitle>Clients</CardTitle>
          <CardDescription>Manage your client communications</CardDescription>
          <div className="mt-2">
            <Input
              placeholder="Search clients..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[500px]">
            <div className="space-y-2">
              {filteredClients.length === 0 ? (
                <div className="py-8 text-center text-[var(--paragraph)]">
                  No clients found
                </div>
              ) : (
                filteredClients.map((client) => (
                  <div
                    key={client.id}
                    className={`flex cursor-pointer items-center space-x-3 rounded-md p-3 hover:bg-gray-100 ${
                      selectedClient?.id === client.id
                        ? "border border-blue-200 bg-blue-50"
                        : ""
                    }`}
                    onClick={() => setSelectedClient(client)}
                  >
                    <Avatar>
                      <AvatarFallback>{client.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div className="min-w-0 flex-1">
                      <p className="truncate font-medium">{client.name}</p>
                      <p className="truncate text-sm text-[var(--paragraph)]">
                        {client.service}
                      </p>
                    </div>
                    {conversations[client.id]?.length > 0 && (
                      <div className="flex flex-col items-end">
                        <span className="text-xs text-[var(--paragraph)]">
                          {new Date(
                            conversations[client.id][
                              conversations[client.id].length - 1
                            ].timestamp,
                          ).toLocaleDateString()}
                        </span>
                        {conversations[client.id].some(
                          (m) => !m.read && m.sender === "client",
                        ) && (
                          <span className="mt-1 h-2 w-2 rounded-full bg-blue-600"></span>
                        )}
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>

      <Card>
        {selectedClient ? (
          <>
            <CardHeader className="border-b">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Avatar className="h-10 w-10">
                    <AvatarFallback>
                      {selectedClient.name.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <CardTitle>{selectedClient.name}</CardTitle>
                    <CardDescription>{selectedClient.service}</CardDescription>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <Button variant="outline">
                    <PhoneIcon className="h-4 w-4" />
                  </Button>
                  <Button variant="outline">
                    <MailIcon className="h-4 w-4" />
                  </Button>
                  <Button variant="outline">
                    <CalendarIcon className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <div className="flex h-[500px] flex-col">
                <ScrollArea className="flex-1 p-4">
                  <div className="space-y-4">
                    {getMessages().length === 0 ? (
                      <div className="py-20 text-center text-[var(--paragraph)]">
                        <MessageSquareIcon className="mx-auto mb-4 h-12 w-12 text-gray-300" />
                        <p>No conversation history with this client</p>
                        <p className="text-sm">
                          Send a message to start the conversation
                        </p>
                      </div>
                    ) : (
                      getMessages().map((message) => (
                        <div
                          key={message.id}
                          className={`flex ${message.sender === "admin" ? "justify-end" : "justify-start"}`}
                        >
                          <div
                            className={`max-w-[70%] rounded-lg p-3 ${
                              message.sender === "admin"
                                ? "bg-blue-600 text-[var(--headline)]"
                                : "bg-gray-200 text-[var(--headline)]"
                            }`}
                          >
                            <p>{message.content}</p>
                            <p
                              className={`mt-1 text-right text-xs ${
                                message.sender === "admin"
                                  ? "text-blue-100"
                                  : "text-[var(--paragraph)]"
                              }`}
                            >
                              {formatTimestamp(message.timestamp)}
                            </p>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </ScrollArea>

                <div className="border-t p-4">
                  <Tabs
                    defaultValue="message"
                    className="mb-4"
                    onValueChange={setMessageType}
                  >
                    <TabsList className="grid w-full grid-cols-3">
                      <TabsTrigger value="message">Message</TabsTrigger>
                      <TabsTrigger value="template">Templates</TabsTrigger>
                      <TabsTrigger value="notes">Client Notes</TabsTrigger>
                    </TabsList>

                    <TabsContent value="message">
                      <div className="flex items-start space-x-2">
                        <Textarea
                          placeholder={`Type a message to ${selectedClient.name}...`}
                          value={newMessage}
                          onChange={(e) => setNewMessage(e.target.value)}
                          className="min-h-[80px] flex-1"
                        />
                        <div className="flex flex-col space-y-2">
                          <Button variant="outline">
                            <PaperclipIcon className="h-4 w-4" />
                          </Button>
                          <Button
                            className="px-3"
                            onClick={sendMessage}
                            disabled={!newMessage.trim()}
                          >
                            <SendIcon className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </TabsContent>

                    <TabsContent value="template">
                      <div className="space-y-3">
                        {messageTemplates.map((template) => (
                          <div
                            key={template.id}
                            className="cursor-pointer rounded-md border p-3 hover:bg-gray-50"
                            onClick={() => applyTemplate(template.content)}
                          >
                            <p className="mb-1 font-medium">{template.name}</p>
                            <p className="line-clamp-2 text-sm text-[var(--paragraph)]">
                              {template.content}
                            </p>
                          </div>
                        ))}
                      </div>
                    </TabsContent>

                    <TabsContent value="notes">
                      <div className="space-y-3">
                        <Textarea
                          placeholder="Add notes about this client..."
                          className="min-h-[100px]"
                        />
                        <Button className="w-full">Save Notes</Button>
                      </div>
                    </TabsContent>
                  </Tabs>
                </div>
              </div>
            </CardContent>
          </>
        ) : (
          <div className="flex h-[500px] flex-col items-center justify-center text-[var(--paragraph)]">
            <UserIcon className="mb-4 h-16 w-16" />
            <h3 className="mb-2 text-xl font-medium">Select a Client</h3>
            <p className="max-w-md text-center">
              Choose a client from the list to view conversation history and
              send messages
            </p>
          </div>
        )}
      </Card>
    </div>
  );
};

export default ClientCommunication;
