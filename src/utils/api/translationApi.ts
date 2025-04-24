
import axios from '@/lib/axios';
import { useQuery, useMutation } from '@tanstack/react-query';

export const translationApi = {
  translate: (data: any) => axios.post('/api/translation/translate', data),
  getMemory: (params: any) => axios.get('/api/translation/memory', { params }),
  addMemory: (data: any) => axios.post('/api/translation/memory', data),
  updateMemory: (id: string, data: any) => 
    axios.put(`/api/translation/memory/${id}`, data),
  deleteMemory: (id: string) => axios.delete(`/api/translation/memory/${id}`),
  getHistory: () => axios.get('/api/translation/history'),
  upload: (formData: FormData) => axios.post('/api/translation/upload', formData),
};

export const useTranslationMemory = (params?: any) => {
  return useQuery({
    queryKey: ['translation-memory', params],
    queryFn: () => translationApi.getMemory(params),
  });
};

export const useTranslationHistory = () => {
  return useQuery({
    queryKey: ['translation-history'],
    queryFn: translationApi.getHistory,
  });
};
