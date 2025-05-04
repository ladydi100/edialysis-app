import React, { useState } from 'react';
import { View, Text, TextInput, Alert, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { registerUser } from '../services/registerService';

const RegisterPage = ({ navigation }) => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleRegister = async () => {
    try {
      await registerUser(firstName, lastName, email, password);
      Alert.alert('Registro exitoso', 'Tu cuenta ha sido creada correctamente');
      navigation.navigate('Login'); // Redirige a la pantalla de inicio de sesión
    } catch (error) {
      console.error('Error en el registro:', error);
      Alert.alert('Error', error);
    }
  };

  return (
    <View style={styles.container}>
      <Image source={require('../assets/logo-redi.png')} style={styles.logo} />
      <Text style={styles.title}>Crea tu cuenta</Text>
      <Text style={styles.subtitle}>REDI</Text>

      <TextInput
        placeholder="Nombre"
        value={firstName}
        onChangeText={setFirstName}
        style={styles.input}
        placeholderTextColor="#B9BEE8"
      />
      <TextInput
        placeholder="Apellido"
        value={lastName}
        onChangeText={setLastName}
        style={styles.input}
        placeholderTextColor="#B9BEE8"
      />
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

      <TouchableOpacity style={styles.button} onPress={handleRegister}>
        <Text style={styles.buttonText}>Registrarse</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate('Login')}>
        <Text style={styles.loginText}>¿Ya tienes una cuenta? Inicia sesión</Text>
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
    width: 100,
    height: 100,
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
    marginBottom: 20,
  },
  input: {
    width: '100%',
    height: 50,
    backgroundColor: '#5573B3',
    borderRadius: 10,
    paddingHorizontal: 15,
    marginBottom: 10,
    fontSize: 16,
    color: '#EEEFF9',
  },
  button: {
    width: '100%',
    height: 50,
    backgroundColor: '#EEEFF9',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    marginTop: 10,
  },
  buttonText: {
    color: '#3B49B4',
    fontWeight: 'bold',
    fontSize: 18,
  },
  loginText: {
    color: '#B9BEE8',
    fontSize: 14,
    marginTop: 10,
  },
});

export default RegisterPage;
