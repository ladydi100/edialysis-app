import axios from 'axios';
import API_URL from '../config/config';

export const loginUser = async (email, password) => {
  try {
    const response = await axios.post(`${API_URL}/login`, { email, password });
    return response.data; // Devuelve los datos 
  } catch (error) {
   // console.error('Error en loginUser:', error);
    throw new Error(error.response?.data?.error || 'Error al iniciar sesión');
  }
};


