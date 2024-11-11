
import axios from '../axiosConfig';

export const verifyToken = async () => {
  const token = localStorage.getItem('accessToken');
  if (!token) return false;

  try {
    const response = await axios.post('api/token/verify/', { token });
    if (!response.data.isValid) {
      const refreshToken = localStorage.getItem('refreshToken');
      if (!refreshToken) return false;

      const refreshResponse = await axios.post('api/token/refresh/', { refresh: refreshToken });
      localStorage.setItem('accessToken', refreshResponse.data.access);
      return true;
    }
    return response.data.isValid;
  } catch (error) {
    return false;
  }
};