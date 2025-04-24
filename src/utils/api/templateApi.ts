
import axios from '@/lib/axios';
import { useQuery, useMutation } from '@tanstack/react-query';
import { Template } from '@/types';

export const templateApi = {
  getAll: () => axios.get('/api/templates'),
  getById: (id: string) => axios.get(`/api/templates/${id}`),
  create: (data: Template) => axios.post('/api/templates', data),
  update: (id: string, data: Template) => axios.put(`/api/templates/${id}`, data),
  delete: (id: string) => axios.delete(`/api/templates/${id}`),
  generate: (templateId: string, data: any) => 
    axios.post(`/api/templates/${templateId}/generate`, data),
};

export const useTemplates = () => {
  return useQuery({
    queryKey: ['templates'],
    queryFn: templateApi.getAll,
  });
};
