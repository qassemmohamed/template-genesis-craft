
import axios from '@/lib/axios';
import { useQuery, useMutation } from '@tanstack/react-query';

export const documentApi = {
  extract: (formData: FormData) => axios.post('/api/documents/extract', formData),
  getAll: () => axios.get('/api/documents'),
  getById: (id: string) => axios.get(`/api/documents/${id}`),
  delete: (id: string) => axios.delete(`/api/documents/${id}`),
};

export const useDocuments = () => {
  return useQuery({
    queryKey: ['documents'],
    queryFn: documentApi.getAll,
  });
};

export const useExtractDocument = () => {
  return useMutation({
    mutationFn: documentApi.extract,
  });
};
