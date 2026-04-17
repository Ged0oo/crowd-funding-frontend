import { useQuery } from '@tanstack/react-query';
import { fetchMyProjectsApi } from '../api/usersApi';

export const useMyProjects = () => {
  return useQuery({
    queryKey: ['myProjects'],
    queryFn: () => fetchMyProjectsApi(),
  });
};
