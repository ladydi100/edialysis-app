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


export const getMedicationsByDate = async (date, token) => {
  try {
    const response = await axios.get(`${API_URL}/medications?date=${date}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching medications:', error);
    throw new Error(error.response?.data?.error || 'Error al obtener los medicamentos');
  }
};


export const updateMedicationTakenStatus = async (time_id, taken, token) => {
  try {
    const response = await axios.put(
      `${API_URL}/medications/taken`,
      { time_id, taken },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error('Error updating medication status:', error);
    throw new Error(error.response?.data?.error || 'Error updating medication status');
  }
};