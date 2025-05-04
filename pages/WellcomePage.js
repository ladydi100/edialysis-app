import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';

const WelcomePage = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <Image source={require('../assets/logo-redi.png')} style={styles.logo} />
      <Text style={styles.title}>Bienvenido/a a</Text>
      <Text style={styles.subtitle}>REDI</Text>
      <Text style={styles.description}>Apoyo renal a pacientes</Text>

      <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Login')}>
        <Text style={styles.buttonText}>Iniciar Sesión</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.secondaryButton} onPress={() => navigation.navigate('Register')}>
        <Text style={styles.secondaryButtonText}>Registrarse</Text>
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
    fontSize: 36,
    fontWeight: 'bold',
    color: '#EEEFF9',
    marginBottom: 10,
  },
  description: {
    fontSize: 16,
    color: '#D7DAF2',
    marginBottom: 40,
    textAlign: 'center',
  },
  button: {
    width: '100%',
    height: 50,
    backgroundColor: '#EEEFF9',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    marginBottom: 15,
  },
  buttonText: {
    color: '#3B49B4',
    fontWeight: 'bold',
    fontSize: 18,
  },
  secondaryButton: {
    width: '100%',
    height: 50,
    borderWidth: 2,
    borderColor: '#EEEFF9',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
  },
  secondaryButtonText: {
    color: '#EEEFF9',
    fontWeight: 'bold',
    fontSize: 18,
  }
});

export default WelcomePage;
