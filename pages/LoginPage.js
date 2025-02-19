import React, { useState, useContext } from 'react';
import { View, TextInput, Button, Alert, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { loginUser } from '../services/authService';  //servicio loginUser
import { AuthContext } from '../context/AuthContext';


const LoginPage = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useContext(AuthContext);

  const handleLogin = async () => {
    try {
      const userData = await loginUser(email, password);
      login(userData.token); // Guardar el token en el estado de autenticación
      //navigation.navigate('Home'); // Redirigir al usuario
    } catch (error) {
      Alert.alert('Error', error.message);
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        style={styles.input}
      />
      <TextInput
        placeholder="Contraseña"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        style={styles.input}
      />
      <Button title="Iniciar Sesión" onPress={handleLogin} />
     
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

   forgotPasswordText: {
    marginTop: 10,
    color: 'blue',
    textAlign: 'center',
  },

});

export default LoginPage;