// api/messageApi.ts
import { Message, MessageCreateData, MessageReplyData } from "@/types/message";
import API_LINKS from "./apis";
import { api } from "./api";

// Helper to generate FormData
const createFormData = (data: Record<string, any>) => {
  const formData = new FormData();
  Object.entries(data).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      formData.append(key, value);
    }
  });
  return formData;
};

export const messageApi = {
  // Get all messages for the current user
  getMessages: async (): Promise<Message[]> => {
    try {
      const response = await api.get(API_LINKS.MESSAGES.GET_ALL);
      return response.data;
    } catch (error) {
      console.error("Error getting messages:", error);
      throw error;
    }
  },

  // Get a specific message by ID
  getMessage: async (messageId: string): Promise<Message> => {
    try {
      const response = await api.get(API_LINKS.MESSAGES.GET_ONE(messageId));
      return response.data;
    } catch (error) {
      console.error(`Error getting message ${messageId}:`, error);
      throw error;
    }
  },

  // Create a new message
  createMessage: async (data: MessageCreateData): Promise<Message> => {
    try {
      const formData = createFormData({
        subject: data.subject,
        content: data.content,
        recipientId: data.recipientId,
        recipientRole: data.recipientRole,
        attachment: data.attachment,
      });

      const response = await api.post(API_LINKS.MESSAGES.CREATE, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      return response.data;
    } catch (error: any) {
      console.error("Error creating message:", error);

      if (error.response) {
        console.error("Server response:", error.response.data);
        console.error("Status code:", error.response.status);
      }

      throw error;
    }
  },

  // Reply to a message
  replyToMessage: async (
    messageId: string,
    data: MessageReplyData,
  ): Promise<Message> => {
    try {
      if (
        !messageId ||
        typeof messageId !== "string" ||
        messageId.length !== 24
      ) {
        throw new Error("Invalid message ID format");
      }

      const formData = createFormData({
        content: data.content,
        attachment: data.attachment,
      });

      const response = await api.post(
        API_LINKS.MESSAGES.REPLY(messageId),
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        },
      );

      return response.data;
    } catch (error: any) {
      console.error(`Error replying to message ${messageId}:`, error);

      if (error.response) {
        console.error("Server response:", error.response.data);
        console.error("Status code:", error.response.status);
      }

      throw error;
    }
  },

  // Mark message as read
  markAsRead: async (messageId: string): Promise<Message> => {
    try {
      const response = await api.put(API_LINKS.MESSAGES.READ(messageId));
      return response.data;
    } catch (error) {
      console.error(`Error marking message ${messageId} as read:`, error);
      throw error;
    }
  },

  // Delete message
  deleteMessage: async (messageId: string): Promise<void> => {
    try {
      await api.delete(API_LINKS.MESSAGES.DELETE(messageId));
    } catch (error) {
      console.error(`Error deleting message ${messageId}:`, error);
      throw error;
    }
  },

  // Get unread count
  getUnreadCount: async (): Promise<number> => {
    try {
      const response = await api.get(API_LINKS.MESSAGES.UNREAD);
      return response.data.unreadCount;
    } catch (error) {
      console.error("Error getting unread message count:", error);
      throw error;
    }
  },
};
