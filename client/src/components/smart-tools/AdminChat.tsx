import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useAuth } from "@/context/AuthContext";
import ChatInterface from "@/components/chat/ChatInterface";
import { useChat } from "@/hooks/useChat";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Message } from "@/utils/messageApi";
import { Button } from "@/components/ui/button";
import { ArrowLeft, RefreshCw, AlertCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

const AdminChat: React.FC = () => {
  const { user } = useAuth();
  const { messages, isLoading, fetchMessages, replyToMessage, sendMessage } =
    useChat();
  const [selectedChat, setSelectedChat] = useState<Message | null>(null);
  const [searchParams] = useSearchParams();
  const clientId = searchParams.get("client");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadMessages = async () => {
      try {
        await fetchMessages();
        setError(null);
      } catch (err) {
        setError("Unable to load messages. Please try again later.");
      }
    };

    loadMessages();
  }, [fetchMessages]);

  useEffect(() => {
    if (clientId && messages.length > 0) {
      // Find chat with this client
      const clientChat = messages.find((msg) =>
        msg.participants.some((p) => p._id === clientId),
      );

      if (clientChat) {
        setSelectedChat(clientChat);
      } else if (user) {
        // If no existing chat, create a new one with this client
        handleCreateNewChat();
      }
    }
  }, [clientId, messages, user]);

  const handleCreateNewChat = async () => {
    if (!clientId || !user) return;

    try {
      setError(null);

      // Validate clientId format (assuming MongoDB ObjectId)
      if (typeof clientId !== "string" || clientId.length !== 24) {
        setError("Invalid client ID format");
        return;
      }

      const newMessage = await sendMessage(
        "Hello! How can I help you today?",
        clientId,
      );

      // Refresh messages to include the new chat
      await fetchMessages();
    } catch (error) {
      console.error("Error creating new chat:", error);
      setError("Failed to create new conversation. Please try again.");
    }
  };

  const handleSendMessage = async (content: string, attachment?: File) => {
    if (!selectedChat || !user) return;

    try {
      setError(null);
      await replyToMessage(selectedChat._id, content, attachment);
    } catch (error) {
      console.error("Error sending message:", error);
      setError("Failed to send message. Please try again.");
    }
  };

  const getInitials = (name: string) => name.charAt(0).toUpperCase();

  const handleClearSelection = () => {
    setSelectedChat(null);
    // Clear the client param from URL
    const newSearchParams = new URLSearchParams(searchParams);
    newSearchParams.delete("client");
    window.history.replaceState(
      {},
      "",
      `${window.location.pathname}?${newSearchParams.toString()}`,
    );
  };

  const handleRefresh = async () => {
    try {
      await fetchMessages();
      setError(null);
    } catch (err) {
      setError("Unable to refresh messages. Please try again later.");
    }
  };

  return (
    <div className="grid h-[calc(100vh-2rem)] grid-cols-1 gap-4 md:grid-cols-[300px_1fr]">
      <Card className="overflow-hidden p-4">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold">Conversations</h2>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleRefresh}
            disabled={isLoading}
            title="Refresh"
          >
            <RefreshCw
              className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`}
            />
          </Button>
        </div>

        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <ScrollArea className="h-[calc(100vh-8rem)]">
          {messages.length === 0 && !isLoading && (
            <div className="p-4 text-center text-muted-foreground">
              No conversations found
            </div>
          )}

          {messages.map((chat) => {
            const client = chat.participants.find((p) => p.role === "client");
            if (!client) return null;

            return (
              <div
                key={chat._id}
                className={`mb-2 flex cursor-pointer items-center rounded-lg p-3 ${
                  selectedChat?._id === chat._id
                    ? "bg-primary/10"
                    : "hover:bg-muted"
                }`}
                onClick={() => setSelectedChat(chat)}
              >
                <Avatar className="mr-3 h-10 w-10">
                  <AvatarImage src={client.avatarUrl || "/placeholder.svg"} />
                  <AvatarFallback>
                    {getInitials(client.fullName || client.username)}
                  </AvatarFallback>
                </Avatar>
                <div className="min-w-0 flex-1">
                  <p className="truncate font-medium">
                    {client.fullName || client.username}
                  </p>
                  <p className="truncate text-sm text-muted-foreground">
                    {chat.conversation[chat.conversation.length - 1]?.content}
                  </p>
                </div>
              </div>
            );
          })}
        </ScrollArea>
      </Card>

      <Card className="flex flex-col overflow-hidden">
        {selectedChat ? (
          <>
            <div className="flex items-center border-b p-3">
              {clientId && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleClearSelection}
                  className="mr-2"
                >
                  <ArrowLeft className="h-4 w-4" />
                </Button>
              )}
              <div className="flex items-center">
                {selectedChat.participants.map((participant) => {
                  if (participant.role === "client") {
                    return (
                      <div key={participant._id} className="flex items-center">
                        <Avatar className="mr-2 h-8 w-8">
                          <AvatarImage
                            src={participant.avatarUrl || "/placeholder.svg"}
                          />
                          <AvatarFallback>
                            {getInitials(
                              participant.fullName || participant.username,
                            )}
                          </AvatarFallback>
                        </Avatar>
                        <span className="font-medium">
                          {participant.fullName || participant.username}
                        </span>
                      </div>
                    );
                  }
                  return null;
                })}
              </div>
            </div>

            {error && (
              <Alert variant="destructive" className="m-3">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <ChatInterface
              messages={selectedChat.conversation}
              onSendMessage={handleSendMessage}
              isLoading={isLoading}
              currentUser={{
                id: user?.id || "",
                role: user?.role || "admin",
                username: user?.username || "",
                fullName: user?.fullName,
                avatarUrl: user?.avatarUrl,
              }}
            />
          </>
        ) : (
          <div className="flex flex-1 items-center justify-center text-muted-foreground">
            Select a conversation to start chatting
          </div>
        )}
      </Card>
    </div>
  );
};

export default AdminChat;
