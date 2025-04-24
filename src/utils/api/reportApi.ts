
import axios from '@/lib/axios';
import { useQuery } from '@tanstack/react-query';

export const reportApi = {
  getAll: () => axios.get('/api/reports'),
  getById: (id: string) => axios.get(`/api/reports/${id}`),
  generate: (type: string, params: any) => 
    axios.post(`/api/reports/generate/${type}`, params),
  download: (id: string, format: string) => 
    axios.get(`/api/reports/${id}/download?format=${format}`, {
      responseType: 'blob'
    }),
};

export const useReports = () => {
  return useQuery({
    queryKey: ['reports'],
    queryFn: reportApi.getAll,
  });
};
