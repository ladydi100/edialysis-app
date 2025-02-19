// RegisterPage.js
import React, { useState } from 'react';
import { View, TextInput, Button, Alert, StyleSheet } from 'react-native';
import { registerUser } from '../services/registerService';

/*
const RegisterPage = ({ navigation }) => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleRegister = () => {
    // Aquí puedes hacer la lógica de registro
    Alert.alert('Registro exitoso');
    navigation.navigate('Login'); // Redirige a la pantalla de inicio de sesión después del registro
  };

  return (
    <View style={styles.container}>
      <TextInput placeholder="Nombre" value={firstName} onChangeText={setFirstName} style={styles.input} />
      <TextInput placeholder="Apellido" value={lastName} onChangeText={setLastName} style={styles.input} />
      <TextInput placeholder="Correo" value={email} onChangeText={setEmail} style={styles.input} />
      <TextInput placeholder="Contraseña" value={password} onChangeText={setPassword} secureTextEntry style={styles.input} />
      <Button title="Registrarse" onPress={handleRegister} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 16,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 12,
    paddingHorizontal: 8,
  },
});

export default RegisterPage;*/


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
      <TextInput placeholder="Nombre" value={firstName} onChangeText={setFirstName} style={styles.input} />
      <TextInput placeholder="Apellido" value={lastName} onChangeText={setLastName} style={styles.input} />
      <TextInput placeholder="Correo" value={email} onChangeText={setEmail} style={styles.input} />
      <TextInput placeholder="Contraseña" value={password} onChangeText={setPassword} secureTextEntry style={styles.input} />
      <Button title="Registrarse" onPress={handleRegister} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 16,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 12,
    paddingHorizontal: 8,
  },
});

export default RegisterPage;
