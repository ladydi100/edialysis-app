import axios from 'axios';
import API_URL from '../config/config';

export const addMedication = async (medicationData) => {
  try {
    const response = await axios.post(`${API_URL}/medications`, medicationData);
    return response.data;
  } catch (error) {
    console.error('Error adding medication:', error);
    throw new Error(error.response?.data?.error || 'Error al añadir el medicamento');
  }
};