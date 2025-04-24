import React, { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  MessageSquare,
  Send,
  PaperclipIcon,
  Loader2,
  AlertCircle,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface ChatMessage {
  content: string;
  timestamp: string;
  sender: {
    _id: string;
    username: string;
    fullName?: string;
    role: string;
    avatarUrl?: string;
  };
  attachment?: {
    name: string;
    url: string;
    size: number;
    type: string;
  };
}

interface ChatInterfaceProps {
  messages: ChatMessage[];
  onSendMessage: (content: string, attachment?: File) => Promise<void>;
  isLoading?: boolean;
  currentUser: {
    id: string;
    role: string;
    username: string;
    fullName?: string;
    avatarUrl?: string;
  };
}

const ChatInterface: React.FC<ChatInterfaceProps> = ({
  messages,
  onSendMessage,
  isLoading = false,
  currentUser,
}) => {
  const [newMessage, setNewMessage] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [sendingError, setSendingError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (!newMessage.trim() && !selectedFile) return;

    try {
      setSendingError(null);
      await onSendMessage(newMessage, selectedFile || undefined);
      setNewMessage("");
      setSelectedFile(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    } catch (error) {
      console.error("Error in ChatInterface.handleSendMessage:", error);
      setSendingError("Failed to send message. Please try again.");
      toast({
        title: "Error",
        description: "Failed to send message",
        variant: "destructive",
      });
    }
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        // 5MB limit
        toast({
          title: "Error",
          description: "File size must be less than 5MB",
          variant: "destructive",
        });
        return;
      }
      setSelectedFile(file);
    }
  };

  const formatTimestamp = (timestamp: string) => {
    try {
      return new Date(timestamp).toLocaleString();
    } catch (error) {
      console.error("Invalid timestamp format:", timestamp);
      return "Unknown time";
    }
  };

  const getInitials = (name: string) => {
    if (!name) return "?";
    return name.charAt(0).toUpperCase();
  };

  return (
    <div className="flex h-full flex-col">
      <ScrollArea className="flex-1 p-4">
        <div className="space-y-4">
          {messages.map((message, index) => (
            <div
              key={index}
              className={`flex ${
                message.sender._id === currentUser.id
                  ? "justify-end"
                  : "justify-start"
              }`}
            >
              <div
                className={`flex ${
                  message.sender._id === currentUser.id
                    ? "flex-row-reverse"
                    : "flex-row"
                } items-start space-x-2`}
              >
                <Avatar className="h-8 w-8">
                  <AvatarImage
                    src={message.sender.avatarUrl || "/placeholder.svg"}
                  />
                  <AvatarFallback>
                    {getInitials(
                      message.sender.fullName || message.sender.username,
                    )}
                  </AvatarFallback>
                </Avatar>
                <div
                  className={`max-w-[70%] rounded-lg p-3 ${
                    message.sender._id === currentUser.id
                      ? "ml-2 bg-primary text-primary-foreground"
                      : "mr-2 bg-muted"
                  }`}
                >
                  <p className="text-sm">{message.content}</p>
                  {message.attachment && (
                    <a
                      href={message.attachment.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-2 flex items-center text-sm underline"
                    >
                      <PaperclipIcon className="mr-1 h-4 w-4" />
                      {message.attachment.name}
                    </a>
                  )}
                  <p className="mt-1 text-xs opacity-70">
                    {formatTimestamp(message.timestamp)}
                  </p>
                </div>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
      </ScrollArea>

      <div className="border-t p-4">
        {sendingError && (
          <Alert variant="destructive" className="mb-3">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{sendingError}</AlertDescription>
          </Alert>
        )}

        {selectedFile && (
          <div className="mb-2 flex items-center text-sm">
            <PaperclipIcon className="mr-1 h-4 w-4" />
            <span className="flex-1 truncate">{selectedFile.name}</span>
            <button
              onClick={() => setSelectedFile(null)}
              className="ml-2 text-destructive hover:text-destructive/80"
            >
              Remove
            </button>
          </div>
        )}
        <div className="flex items-center space-x-2">
          <Input
            type="file"
            ref={fileInputRef}
            onChange={handleFileSelect}
            className="hidden"
            accept="image/*,.pdf,.doc,.docx"
          />
          <Button
            variant="outline"
            size="icon"
            onClick={() => fileInputRef.current?.click()}
            disabled={isLoading}
          >
            <PaperclipIcon className="h-4 w-4" />
          </Button>
          <Input
            placeholder="Type your message..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSendMessage();
              }
            }}
            disabled={isLoading}
          />
          <Button onClick={handleSendMessage} disabled={isLoading}>
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Send className="h-4 w-4" />
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ChatInterface;
