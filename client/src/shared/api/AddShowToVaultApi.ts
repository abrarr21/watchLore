import { axiosInstance } from '../../config/axiosInstance';

export interface ShowPayload {
  title: string;
  type: 'movie' | 'series' | 'anime';
  genre: string[];
  rating?: number;
  imageUrl?: string;
  status?: 'watching' | 'completed' | 'planned';
}

const addShowToVaultAPI = async (showType: ShowPayload) => {
  const formData = new FormData();

  formData.append('title', showType.title);
  formData.append('type', showType.type);
  formData.append('status', showType.status || 'planned');

  if (showType.rating !== undefined) {
    formData.append('rating', showType.rating.toString());
  }

  if (showType.genre && showType.genre.length > 0) {
    showType.genre.forEach((g) => formData.append('genre', g));
  }
  // Step 1: Create the show record
  const createRes = await axiosInstance.post('/api/shows', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  const createdShow = createRes.data.data;

  const showId = createdShow?.id || createdShow?.ID;

  // Step 2: Attach the external poster image if URL is provided
  if (showId && showType.imageUrl) {
    await axiosInstance.post(`/api/shows/${showId}/images/url`, {
      url: showType.imageUrl,
    });
  }
  return createdShow;
};

export default addShowToVaultAPI;
