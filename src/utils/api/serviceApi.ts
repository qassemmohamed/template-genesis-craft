
import axios from '@/lib/axios';
import { useQuery, useMutation } from '@tanstack/react-query';
import { Service } from '@/types';

export const serviceApi = {
  getAll: () => axios.get('/api/services'),
  getById: (id: string) => axios.get(`/api/services/${id}`),
  create: (data: Service) => axios.post('/api/services', data),
  update: (id: string, data: Service) => axios.put(`/api/services/${id}`, data),
  delete: (id: string) => axios.delete(`/api/services/${id}`),
};

export const useServices = () => {
  return useQuery({
    queryKey: ['services'],
    queryFn: serviceApi.getAll,
  });
};
