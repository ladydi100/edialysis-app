import React, { useState } from 'react';
import { View, TextInput, Button, Alert, StyleSheet } from 'react-native';
import { sendPasswordResetEmail } from '../services/forgotPasswordService';

const ForgotPasswordPage = ({ navigation }) => {
  const [email, setEmail] = useState('');

  const handlePasswordReset = async () => {
    try {
      await sendPasswordResetEmail(email);
      Alert.alert('Éxito', 'Revisa tu correo para restablecer tu contraseña');
      navigation.navigate('Login');
    } catch (error) {
      Alert.alert('Error', error.message);
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        placeholder="Introduce tu correo"
        value={email}
        onChangeText={setEmail}
        style={styles.input}
        keyboardType="email-address"
      />
      <Button title="Enviar" onPress={handlePasswordReset} />
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

export default ForgotPasswordPage;