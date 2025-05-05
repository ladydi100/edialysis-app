// src/screens/NotificationTest.js
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import * as Notifications from 'expo-notifications';

const NotificationTest = () => {
  const enviarNotificacion = async () => {
    try {
      await Notifications.scheduleNotificationAsync({
        content: {
          title: '🔔 Notificación de prueba',
          body: 'Esto es una prueba para confirmar que funciona.',
          sound: true,
        },
        trigger: { seconds: 5 },
      });

      Alert.alert('✅ Notificación programada', 'Se enviará en 5 segundos');
    } catch (error) {
      console.error('Error al programar notificación:', error);
      Alert.alert('❌ Error', 'No se pudo programar la notificación');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Prueba de Notificaciones</Text>
      <TouchableOpacity style={styles.button} onPress={enviarNotificacion}>
        <Text style={styles.buttonText}>Enviar notificación de prueba</Text>
      </TouchableOpacity>
    </View>
  );
};

export default NotificationTest;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FAFAFA',
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 20,
    marginBottom: 20,
    color: '#101432',
  },
  button: {
    backgroundColor: '#3B49B4',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
  },
});
