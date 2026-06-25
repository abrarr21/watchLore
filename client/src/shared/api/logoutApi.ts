import { axiosInstance } from '../../config/axiosInstance';

export const logoutApi = async () => {
  try {
    const res = await axiosInstance.post(`/auth/users/logout`);
    return res;
  } catch (error) {
    console.log(`Error logout: `, error);
  }
};
