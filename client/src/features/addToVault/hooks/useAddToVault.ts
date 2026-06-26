import { useForm } from 'react-hook-form';
import { useLocation, useNavigate } from 'react-router';
import addShowToVaultAPI from '../../../shared/api/AddShowToVaultApi';
import { useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';
import updateVaultShowApi from '../../../shared/api/updateVaultShowApi';
import { axiosInstance } from '../../../config/axiosInstance';

export interface NewEntryFormData {
  title: string;
  type: 'anime' | 'movie' | 'series';
  status: 'watching' | 'completed' | 'planned';
  genre: string[];
  rating: number;
  review: string;
  coverImage: File | null;
}

export const useAddToVault = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const queryClient = useQueryClient();

  const editShow = location.state?.editShow;

  const { register, handleSubmit, setValue, watch, reset } = useForm<NewEntryFormData>({
    defaultValues: {
      title: editShow?.title || '',
      type: editShow?.type || 'anime',
      status: editShow?.status || 'watching',
      genre: editShow?.genre || ['Psychological', 'Sci-Fi'],
      rating: editShow?.rating || 0,
      review: editShow?.review || '',
      coverImage: null,
    },
  });

  useEffect(() => {
    if (editShow) {
      reset({
        title: editShow.title || '',
        type: editShow.type || 'anime',
        status: editShow.status || 'watching',
        genre: editShow.genre || [],
        rating: editShow.rating || 0,
        review: editShow.review || '',
        coverImage: null,
      });
    }
  }, [editShow, reset]);

  const onSubmit = async (data: NewEntryFormData) => {
    try {
      console.log('Submitting entry form data:', data);

      if (editShow?.id) {
        // ── EDIT MODE (Updating existing show) ──

        // 1. Update details (status, rating, review, genre) via PATCH
        await updateVaultShowApi(editShow.id, {
          status: data.status,
          rating: data.rating,
          review: data.review,
          genre: data.genre,
        });

        // 2. If a new cover image file was uploaded, send it to the upload endpoint
        if (data.coverImage) {
          const imageFormData = new FormData();
          imageFormData.append('image', data.coverImage);
          await axiosInstance.post(`/api/shows/${editShow.id}/images/upload`, imageFormData, {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          });
        }

        // Invalidate single show query cache
        queryClient.invalidateQueries({ queryKey: ['vaultShow', editShow.id] });
        alert(`Success! Entry "${data.title}" updated.`);
      } else {
        // ── CREATE MODE (Adding new show) ──
        await addShowToVaultAPI({
          title: data.title,
          type: data.type,
          status: data.status,
          genre: data.genre,
          rating: data.rating,
          review: data.review,
          imageFile: data.coverImage || undefined,
        });

        alert(`Success! Entry "${data.title}" has been archived.`);
      }

      // Invalidate shows list query cache to trigger real-time refresh
      queryClient.invalidateQueries({ queryKey: ['vaultShows'] });
      reset();
      navigate('/vault');
    } catch (error) {
      console.error('Failed to submit entry:', error);
      alert('An error occurred during submission.');
    }
  };

  return {
    register,
    handleSubmit,
    setValue,
    watch,
    onSubmit,
    navigate,
  };
};
