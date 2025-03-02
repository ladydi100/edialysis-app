/*import axios from 'axios';
import API_URL from '../config/config';

export const addMedication = async (medicationData) => {
  try {
    const response = await axios.post(`${API_URL}/medications`, medicationData);
    return response.data;
  } catch (error) {
    console.error('Error adding medication:', error);
    throw new Error(error.response?.data?.error || 'Error al añadir el medicamento');
  }
};*/


import axios from 'axios';
import API_URL from '../config/config';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const addMedication = async (medicationData) => {
  const token = await AsyncStorage.getItem('userToken');
    console.log('Token:', token); // Verificar el token
  try {
    const response = await axios.post(`${API_URL}/medications`, medicationData, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error adding medication:', error);
    throw new Error(error.response?.data?.error || 'Error al añadir el medicamento');
  }
};