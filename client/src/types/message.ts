// types/message.ts
export interface MessageParticipant {
  _id: string;
  username: string;
  fullName?: string;
  role: string;
  avatarUrl?: string;
}

export interface MessageAttachment {
  name: string;
  url: string;
  size: number;
  type: string;
}

export interface MessageItem {
  content: string;
  timestamp: string;
  sender: MessageParticipant;
  isRead: boolean;
  attachment?: MessageAttachment;
}

export interface Message {
  _id: string;
  subject: string;
  conversation: MessageItem[];
  participants: MessageParticipant[];
  lastUpdated: string;
  createdAt: string;
}

export enum UserRole {
  Admin = "admin",
  User = "user",
  Support = "support",
}

export interface MessageCreateData {
  subject: string;
  content: string;
  recipientId: string;
  recipientRole?: UserRole;
  attachment?: File;
}

export interface MessageReplyData {
  content: string;
  attachment?: File;
}
