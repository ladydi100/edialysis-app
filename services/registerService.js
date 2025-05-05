import axios from 'axios';
import API_URL from '../config/config';


export const registerUser = async (name, lastname, email, password) => {
  try {
    const response = await axios.post(`${API_URL}/register`, {
      name,
      lastname,
      email,
      password,
    });
    return response.data;
  } catch (error) {
 
   
    if (error.response) {
    /*console.error('Error en registerUser - Respuesta del servidor:', error.response.data);
    console.error('Estado HTTP:', error.response.status);
    console.error('Headers:', error.response.headers);*/
    console.log('Error en registerUser - Respuesta del servidor:', error.response.data);
    console.log('Estado HTTP:', error.response.status);
    console.log('Headers:', error.response.headers);

  } else if (error.request) {
   // console.error('Error en registerUser - No se recibió respuesta:', error.request);
    console.log('Error en registerUser - No se recibió respuesta:', error.request);
  } else {
   // console.error('Error en registerUser - Configuración:', error.message);
   console.log('Error en registerUser - Configuración:', error.message);
  }
  throw 'Hubo un problema al registrarse';




  }
};