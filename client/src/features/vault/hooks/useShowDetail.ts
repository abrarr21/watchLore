import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useParams, useNavigate } from 'react-router';
import fetchShowByIdApi from '../../../shared/api/fetchShowByIdApi';
import updateVaultShowApi, { type UpdateShowPayload } from '../../../shared/api/updateVaultShowApi';
import deleteVaultShowApi from '../../../shared/api/deleteVaultShowApi';
import toast from 'react-hot-toast';
export const useShowDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  // Fetch show details
  const {
    data: show,
    isPending,
    error,
  } = useQuery({
    queryKey: ['vaultShow', id],
    queryFn: () => fetchShowByIdApi(id!),
    enabled: !!id,
    staleTime: 30000,
  });
  // Mutation to update details (status, rating, review)
  const updateMutation = useMutation({
    mutationFn: (payload: UpdateShowPayload) => updateVaultShowApi(id!, payload),
    onSuccess: () => {
      // Refresh details and list query
      queryClient.invalidateQueries({ queryKey: ['vaultShow', id] });
      queryClient.invalidateQueries({ queryKey: ['vaultShows'] });
    },
    onError: (err) => {
      console.error('Failed to update show:', err);
    },
  });
  // Mutation to delete show
  const deleteMutation = useMutation({
    mutationFn: () => deleteVaultShowApi(id!),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['vaultShows'] });
      toast.success('Deleted successfully');
      navigate('/vault');
    },
    onError: (err) => {
      console.error('Failed to delete show:', err);
    },
  });
  const handleStatusChange = (status: 'watching' | 'completed' | 'planned') => {
    updateMutation.mutate({ status });
  };
  const handleUpdateDetails = (rating: number, review: string) => {
    updateMutation.mutate({ rating, review });
  };
  const handleDeleteShow = () => {
    deleteMutation.mutate();
  };
  return {
    show,
    isPending,
    isUpdating: updateMutation.isPending,
    isDeleting: deleteMutation.isPending,
    error,
    handleStatusChange,
    handleUpdateDetails,
    handleDeleteShow,
    navigate,
  };
};
