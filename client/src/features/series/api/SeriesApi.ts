import { axiosInstance } from '../../../config/axiosInstance';

export const SeriesApi = async (page = 1) => {
  try {
    const res = await axiosInstance.get(`/api/discover/series?page=${page}`);
    console.log(res.data);
    return res.data;
  } catch (error) {
    console.log(`Error fetching series content: `, error);
  }
};
