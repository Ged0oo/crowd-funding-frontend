import { useQuery } from '@tanstack/react-query';
import { fetchMyDonationsApi } from '../api/usersApi';

export const useMyDonations = () => {
  return useQuery({
    queryKey: ['myDonations'],
    queryFn: () => fetchMyDonationsApi(),
  });
};
