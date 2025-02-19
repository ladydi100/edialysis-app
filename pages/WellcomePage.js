import React from 'react';
import { View, Button, StyleSheet } from 'react-native';

const WelcomePage = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <Button title="Iniciar Sesión" onPress={() => navigation.navigate('Login')} />
      <Button title="Registrarse" onPress={() => navigation.navigate('Register')} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default WelcomePage;