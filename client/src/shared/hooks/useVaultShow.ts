import { useQuery } from '@tanstack/react-query';
import fetchVaultShowApi from '../api/fetchVaultShowApi';

export const useVaultShow = () => {
  const vault = useQuery({
    queryKey: ['vaultShows'],
    queryFn: fetchVaultShowApi,
    staleTime: 30000,
  });

  return {
    vault: vault.data || [],
  };
};
