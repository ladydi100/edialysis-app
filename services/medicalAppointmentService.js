import axios from 'axios';
import API_URL from '../config/config';

export const saveMedicalAppointment = async (appointmentData, token) => {
  try {
    const response = await axios.post(`${API_URL}/medical-appointments`, appointmentData, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error saving medical appointment:', error);
    throw error.response?.data?.error || 'Error al guardar la cita médica';
  }
};

export const getMedicalAppointments = async (token) => {
  try {
    const response = await axios.get(`${API_URL}/medical-appointments`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching medical appointments:', error);
    throw error.response?.data?.error || 'Error al obtener las citas médicas';
  }
};

export const updateMedicalAppointment = async (appointmentData, token) => {
  try {
    const response = await axios.put(`${API_URL}/medical-appointments`, appointmentData, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error updating medical appointment:', error);
    throw error.response?.data?.error || 'Error al actualizar la cita médica';
  }
};

export const deleteMedicalAppointment = async (id, token) => {
  try {
    const response = await axios.delete(`${API_URL}/medical-appointments`, {
      headers: { 
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      data: { id }
    });
    return response.data;
  } catch (error) {
    console.error('Error deleting medical appointment:', error);
    throw error.response?.data?.error || 'Error al eliminar la cita médica';
  }
};