import React, { useState } from 'react';
import { View, TextInput, Button, StyleSheet, Text } from 'react-native';

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState('');

  const handleSend = () => {
   
    alert(`Se enviará un correo a: ${email}`);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Recuperar Contraseña</Text>
      <TextInput
        placeholder="Ingresa tu correo electrónico"
        value={email}
        onChangeText={setEmail}
        style={styles.input}
      />
      <Button title="Enviar" onPress={handleSend} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
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