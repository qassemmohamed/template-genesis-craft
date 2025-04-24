
import axios from '@/lib/axios';
import { useQuery, useMutation } from '@tanstack/react-query';
import { Task } from '@/components/smart-tools/Tasks/types';

export const taskApi = {
  getAll: () => axios.get('/api/tasks'),
  getByService: (service: string) => axios.get(`/api/tasks/service/${service}`),
  create: (data: Task) => axios.post('/api/tasks', data),
  update: (id: string, data: Task) => axios.put(`/api/tasks/${id}`, data),
  delete: (id: string) => axios.delete(`/api/tasks/${id}`),
  updateStatus: (id: string, status: Task['status']) => 
    axios.patch(`/api/tasks/${id}/status`, { status }),
};

export const useTasks = (service?: string) => {
  return useQuery({
    queryKey: ['tasks', service],
    queryFn: () => service ? taskApi.getByService(service) : taskApi.getAll(),
  });
};
