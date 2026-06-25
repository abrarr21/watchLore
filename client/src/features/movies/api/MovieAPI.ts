import { axiosInstance } from '../../../config/axiosInstance';

export const MovieApi = async (page = 1) => {
  try {
    const res = await axiosInstance.get(`/api/discover/movies?page=${page}`);
    console.log(res.data);
    return res.data;
  } catch (error) {
    console.log(`Error fetching Movie content: `, error);
  }
};
