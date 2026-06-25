import { axiosInstance } from '../../../config/axiosInstance';

export const AnimeAPI = async (page = 1) => {
  try {
    const res = await axiosInstance.get(`/api/discover/anime?page=${page}`);
    return res.data;
  } catch (error) {
    console.log(`Error fetching anime content`, error);
  }
};
