import React, { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { useAuth } from "@/context/AuthContext";
import ChatInterface from "@/components/chat/ChatInterface";
import { useChat } from "@/hooks/useChat";
import { Button } from "@/components/ui/button";
import { RefreshCw, AlertCircle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

const ClientMessages: React.FC = () => {
  const { user } = useAuth();
  const { messages, isLoading, fetchMessages, sendMessage, replyToMessage } = useChat();
  const [activeChat, setActiveChat] = useState<any | null>(null);
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
    // Set the active chat to the first chat if there are messages
    if (messages.length > 0 && !activeChat) {
      setActiveChat(messages[0]);
    }
  }, [messages, activeChat]);

  const handleSendMessage = async (content: string, attachment?: File) => {
    if (!user) return;
    
    try {
      setError(null);
      
      if (activeChat) {
        // If there's an existing chat, reply to it
        await replyToMessage(activeChat._id, content, attachment);
      } else {
        // If no existing chat, create a new one with an admin
        // Use role-based routing instead of direct ID
        const newMessage = await sendMessage(content, "admin", attachment);
        setActiveChat(newMessage);
      }
    } catch (err) {
      setError("Failed to send message. Please try again.");
      console.error("Error in handleSendMessage:", err);
    }
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
    <Card className="h-[calc(100vh-2rem)]">
      <div className="flex items-center p-3 border-b">
        <h2 className="text-lg font-semibold flex-1">Support Chat</h2>
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={handleRefresh} 
          disabled={isLoading}
          title="Refresh"
        >
          <RefreshCw className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
        </Button>
      </div>
      
      {error && (
        <Alert variant="destructive" className="m-3">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      
      {activeChat ? (
        <ChatInterface
          messages={activeChat.conversation}
          onSendMessage={handleSendMessage}
          isLoading={isLoading}
          currentUser={{
            id: user?.id || "",
            role: user?.role || "client",
            username: user?.username || "",
            fullName: user?.fullName,
            avatarUrl: user?.avatarUrl,
          }}
        />
      ) : (
        <div className="flex-1 flex items-center justify-center p-6 flex-col gap-4">
          <p className="text-muted-foreground text-center">
            You don't have any active conversations. Start a new conversation with support.
          </p>
          <Button 
            onClick={() => handleSendMessage("Hello, I need assistance with my account.")}
            disabled={isLoading}
          >
            Start New Conversation
          </Button>
        </div>
      )}
    </Card>
  );
};

export default ClientMessages;
  
