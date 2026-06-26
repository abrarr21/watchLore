import { useQuery } from '@tanstack/react-query';
import fetchVaultShowApi from '../../../shared/api/fetchVaultShowApi';

export const useVault = () => {
  const vaultQuery = useQuery({
    queryKey: ['vaultShows'],
    queryFn: fetchVaultShowApi,
    staleTime: 30000,
  });

  return { vaultShow: vaultQuery.data || [], isPending: vaultQuery.isPending };
};
