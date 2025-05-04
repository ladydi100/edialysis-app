import axios from 'axios';
import API_URL from '../config/config';

export const loginUser = async (email, password) => {
  try {
    const response = await axios.post(`${API_URL}/login`, { email, password });

    console.log('resultado--------', response.data.user);
     return {
      token: response.data.token,
      user: response.data.user // Asegúrate de que el backend devuelva esta información
    };

  } catch (error) {
    console.error('Error en loginUser:', {
      message: error.message,
      code: error.code,
      config: error.config,
      request: error.request ? "Sí" : "No",
      response: error.response ? {
        status: error.response.status,
        data: error.response.data,
        headers: error.response.headers
      } : "No hay respuesta del servidor"
    });

    throw new Error(error.response?.data?.error || 'Error al iniciar sesión');
  }
};


