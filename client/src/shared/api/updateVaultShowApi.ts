import { axiosInstance } from '../../config/axiosInstance';
export interface UpdateShowPayload {
  status?: 'watching' | 'completed' | 'planned';
  rating?: number;
  review?: string;
  genre?: string[];
}
const updateVaultShowApi = async (id: string, payload: UpdateShowPayload) => {
  try {
    const res = await axiosInstance.patch(`/api/shows/${id}`, payload);
    return res.data;
  } catch (error) {
    console.error(`Error updating vault show (${id}):`, error);
    throw error;
  }
};
export default updateVaultShowApi;
