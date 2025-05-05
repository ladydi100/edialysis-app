import axios from 'axios';
import API_URL from '../config/config';

export const sendPasswordResetEmail = async (email) => {
  try {
    const response = await axios.post(`${API_URL}/forgot-password`, { email });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.error || 'Error al enviar el correo de recuperación');
  }
};


import ForgotPasswordPage from './pages/ForgotPasswordPage';

<Stack.Screen name="ForgotPassword" component={ForgotPasswordPage} />;
