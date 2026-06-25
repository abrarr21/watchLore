import { axiosInstance } from '../../../config/axiosInstance';

export type DiscoverType = 'trending' | 'movies' | 'series' | 'anime';

export const dicoverAPI = async (types: DiscoverType, page = 1) => {
  try {
    const res = await axiosInstance.get(`/api/discover/${types}?page=${page}`);
    console.log(res.data);
    return res.data;
  } catch (error) {
    console.log(`Error fetching discover content for ${types}`, error);
    throw error;
  }
};
