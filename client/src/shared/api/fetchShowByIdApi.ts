import { axiosInstance } from '../../config/axiosInstance';

const fetchShowByIdApi = async (id: string) => {
  try {
    const res = await axiosInstance.get(`/api/shows/${id}`);
    return res.data.data;
  } catch (error) {
    console.error(`Error fetching show by ID (${id}):`, error);
    throw error;
  }
};

export default fetchShowByIdApi;
