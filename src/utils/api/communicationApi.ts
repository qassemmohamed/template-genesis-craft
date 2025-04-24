
import axios from '@/lib/axios';
import { useQuery, useMutation } from '@tanstack/react-query';

export const communicationApi = {
  getMessages: () => axios.get('/api/communication/messages'),
  sendMessage: (data: any) => axios.post('/api/communication/messages', data),
  getMessage: (id: string) => axios.get(`/api/communication/messages/${id}`),
  replyToMessage: (id: string, data: any) => 
    axios.post(`/api/communication/messages/${id}/reply`, data),
  deleteMessage: (id: string) => axios.delete(`/api/communication/messages/${id}`),
  markAsRead: (id: string) => axios.patch(`/api/communication/messages/${id}/read`),
  getUnreadCount: () => axios.get('/api/communication/messages/unread/count'),
};

export const useMessages = () => {
  return useQuery({
    queryKey: ['messages'],
    queryFn: communicationApi.getMessages,
  });
};

export const useUnreadCount = () => {
  return useQuery({
    queryKey: ['unread-count'],
    queryFn: communicationApi.getUnreadCount,
  });
};
