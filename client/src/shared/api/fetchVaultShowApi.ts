import { axiosInstance } from '../../config/axiosInstance';

const fetchVaultShowApi = async () => {
  try {
    const res = await axiosInstance.get(`/api/shows`);
    return res.data.data;
  } catch (error) {
    console.log(`Error fetching vault show: `, error);
  }
};

export default fetchVaultShowApi;
