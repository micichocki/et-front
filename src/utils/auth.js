
import axios from '../axiosConfig';

export const verifyToken = async () => {
  const token = localStorage.getItem('accessToken');
  if (!token) return false;

  try {
    const response = await axios.post('api/token/verify/', { token });
    return response.data.isValid;
  } catch (error) {
    return false;
  }
};