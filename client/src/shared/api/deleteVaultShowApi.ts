import { axiosInstance } from '../../config/axiosInstance';

const deleteVaultShowApi = async (id: string) => {
  try {
    const res = await axiosInstance.delete(`/api/shows/${id}`);
    return res.data;
  } catch (error) {
    console.error(`Error deleting vault show (${id}):`, error);
    throw error;
  }
};

export default deleteVaultShowApi;
