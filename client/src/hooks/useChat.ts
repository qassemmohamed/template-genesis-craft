import { useState, useCallback } from "react";
import { messageApi, type Message, type MessageCreateData, type MessageReplyData } from "@/utils/messageApi";
import { useToast } from "@/hooks/use-toast";

export const useChat = (messageId?: string) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const fetchMessages = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await messageApi.getMessages();
      setMessages(data);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load messages. Please try again later.",
        variant: "destructive",
      });
      console.error("Error fetching messages:", error);
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  const sendMessage = async (content: string, recipientId: string, attachment?: File) => {
    setIsLoading(true);
    try {
      // Check if recipientId is "admin" - if so, use role-based routing
      const messageData: MessageCreateData = {
        subject: "New Message",
        content,
        recipientId,
        ...(recipientId === "admin" && { recipientRole: "admin" }),
        attachment,
      };
      
      const newMessage = await messageApi.createMessage(messageData);
      
      // Update local state with the new message
      setMessages((prev) => {
        // Check if the message already exists in the array
        const exists = prev.some(msg => msg._id === newMessage._id);
        if (exists) {
          return prev.map(msg => msg._id === newMessage._id ? newMessage : msg);
        } else {
          return [...prev, newMessage];
        }
      });
      
      return newMessage;
    } catch (error) {
      let errorMessage = "Failed to send message";
      
      // Extract more specific error message if available
      if (error.response && error.response.data && error.response.data.message) {
        errorMessage = error.response.data.message;
      }
      
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
      
      console.error("Error sending message:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const replyToMessage = async (messageId: string, content: string, attachment?: File) => {
    setIsLoading(true);
    try {
      // Validate messageId
      if (!messageId || typeof messageId !== 'string') {
        throw new Error("Invalid message ID");
      }
      
      const messageData: MessageReplyData = {
        content,
        attachment,
      };
      
      const updatedMessage = await messageApi.replyToMessage(messageId, messageData);
      
      // Update the messages state with the updated message
      setMessages((prev) =>
        prev.map((msg) => (msg._id === messageId ? updatedMessage : msg))
      );
      
      return updatedMessage;
    } catch (error) {
      let errorMessage = "Failed to reply to message";
      
      // Extract more specific error message if available
      if (error.response && error.response.data && error.response.data.message) {
        errorMessage = error.response.data.message;
      }
      
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
      
      console.error("Error replying to message:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    messages,
    isLoading,
    fetchMessages,
    sendMessage,
    replyToMessage,
  };
};
  
