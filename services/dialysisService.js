import axios from 'axios';
import API_URL from '../config/config';

export const saveDialysisTreatment = async (treatmentData, token) => {
  try {
     console.log('Enviando al backend:', treatmentData);
    
    if (!treatmentData.start_date || !treatmentData.treatment_type) {
      throw new Error('Datos incompletos del tratamiento');
    }

    const response = await axios.post(`${API_URL}/dialysis`, treatmentData, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }

    });
     console.log('Respuesta del backend:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error detallado:', {
      message: error.message,
      request: error.config?.data,
      response: error.response?.data,
      stack: error.stack
    });
    throw new Error(error.response?.data?.error || 'Error al guardar el tratamiento');
  }
};

export const getDialysisTreatment = async (token) => {
  try {
    const response = await axios.get(`${API_URL}/dialysis`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching dialysis treatment:', error);
    throw error.response?.data?.error || 'Error al obtener el tratamiento';
  }
};


export const updateDialysisTreatment = async (token, treatmentData) => {
  try {
    const response = await axios.put(`${API_URL}/dialysis`, treatmentData, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error updating dialysis treatment:', error);
    throw error.response?.data?.error || 'Error al actualizar el tratamiento';
  }
};