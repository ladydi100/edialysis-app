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


export const updateMedicationTakenStatus = async (time_id, date, taken, token) => {
  try {
    const response = await axios.put(
      `${API_URL}/medications/intake`,
      { time_id, date, taken },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return response.data;
  } catch (error) {
    console.error('Error updating medication intake:', error);
    throw error;
  }
};


export const updateMedication = async (time_id, medicationData) => {
  const token = await AsyncStorage.getItem('userToken');
  try {
    const response = await axios.put(
      `${API_URL}/medications/${time_id}`,
      medicationData,
      {
        headers: { Authorization: `Bearer ${token}`,
        },
      }
    );

    
    return response.data;
  } catch (error) {
    console.error('Error updating medication:', error);
    throw new Error(error.response?.data?.error || 'Error al actualizar el medicamento');
  }
};


export const softDeleteMedication = async (time_id, userToken) => {
  try {
    const response = await axios.put(
      `${API_URL}/medications/soft-delete/${time_id}`,
      {}, // Body vacío
      {
        headers: {
          Authorization: `Bearer ${userToken}`
        }
      }
    );
    return response.data;
  } catch (error) {
    console.error('Error in softDeleteMedication:', error);
    throw error;
  }
};


export const updateMedicationAlarmStatus = async (time_id, alarmEnabled, token) => {
  try {
    const response = await axios.put(
      `${API_URL}/medications/${time_id}/alarm`,
      { alarmEnabled },
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );
    return response.data;
  } catch (error) {
    console.error('Error actualizando estado de alarma:', error);
    throw error;
  }
};
