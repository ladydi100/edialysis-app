import React, { useState, useContext } from 'react';
import { View, TextInput, Alert, StyleSheet, Text, TouchableOpacity, Image } from 'react-native';
import { loginUser } from '../services/authService';  
import { AuthContext } from '../context/AuthContext';
import AsyncStorage from '@react-native-async-storage/async-storage';

const LoginPage = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useContext(AuthContext);


const handleLogin = async () => {
  try {
    const { token, user } = await loginUser(email, password);
    login(token, user); 
    await AsyncStorage.setItem('userToken', token);
    await AsyncStorage.setItem('userData', JSON.stringify(user));
    navigation.navigate('BottomTabNavigator');
  } catch (error) {
    Alert.alert('Error', error.message);
  }
};

  return (
    <View style={styles.container}>
      <Image source={require('../assets/logo-redi.png')} style={styles.logo} />
      <Text style={styles.title}>Bienvenido/a</Text>
      <Text style={styles.subtitle}>REDI</Text>
      <Text style={styles.description}>Apoyo renal a pacientes</Text>

      <TextInput
        placeholder="Correo electrónico"
        value={email}
        onChangeText={setEmail}
        style={styles.input}
        placeholderTextColor="#B9BEE8"
      />
      <TextInput
        placeholder="Contraseña"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        style={styles.input}
        placeholderTextColor="#B9BEE8"
      />

      <Text style={styles.loginText}>¿No tienes un perfil? <Text style={styles.loginLink} onPress={() => navigation.navigate('Register')}>Regístrate</Text></Text>

      <View style={styles.checkboxContainer}>
        <TouchableOpacity style={styles.checkbox}>
          <View style={styles.checked} />
        </TouchableOpacity>
        <Text style={styles.termsText}>Estoy de acuerdo con los términos de servicio y privacidad</Text>
      </View>

      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Iniciar sesión</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#22499C',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  logo: {
    width: 80,
    height: 80,
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#EEEFF9',
  },
  subtitle: {
    fontSize: 30,
    fontWeight: 'bold',
    color: '#EEEFF9',
  },
  description: {
    fontSize: 14,
    color: '#D7DAF2',
    marginBottom: 20,
  },
  input: {
    width: '100%',
    height: 50,
    backgroundColor: '#5573B3',
    borderRadius: 10,
    paddingHorizontal: 15,
    marginBottom: 10,
    color: '#EEEFF9',
    fontSize: 16,
  },
  loginText: {
    color: '#EEEFF9',
    fontSize: 14,
    marginBottom: 10,
  },
  loginLink: {
    color: '#B9BEE8',
    fontWeight: 'bold',
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  checkbox: {
    width: 22,
    height: 22,
    borderWidth: 1,
    borderColor: '#EEEFF9',
    backgroundColor: '#FFF',
    marginRight: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checked: {
    width: 14,
    height: 14,
    backgroundColor: '#3B49B4',
  },
  termsText: {
    color: '#EEEFF9',
    fontSize: 12,
  },
  button: {
    width: '100%',
    height: 50,
    backgroundColor: '#EEEFF9',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
  },
  buttonText: {
    color: '#3B49B4',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default LoginPage;
