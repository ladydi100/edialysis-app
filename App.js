import 'react-native-gesture-handler';
import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { AuthProvider } from './context/AuthContext';
import AppNavigator from './navigation/AppNavigator';
import * as Notifications from 'expo-notifications';
import { Alert } from 'react-native';
import { registerForPushNotificationsAsync , scheduleMedicationNotifications } from './services/notificationService';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});








export default function App() {
  useEffect(() => {
  const setupNotifications = async () => {
    await registerForPushNotificationsAsync();

    if (Platform.OS === 'android') {
      await Notifications.setNotificationChannelAsync('medication-reminders', {
        name: 'Recordatorios de Medicación',
        importance: Notifications.AndroidImportance.MAX,
        sound: 'default',
      });
    }

   // ⚠️ Aquí agregamos la llamada para agendar notificaciones del día actual
    const today = new Date();
    await scheduleMedicationNotifications(today);



    Notifications.addNotificationReceivedListener(notification => {
      console.log('🔔 Notificación recibida:', notification);
    });

    Notifications.addNotificationResponseReceivedListener(response => {
      console.log('📲 Respuesta del usuario a la notificación:', response);
    });
  };

  setupNotifications();
}, []);

  return (
    <AuthProvider>
      <NavigationContainer>
        <AppNavigator />
      </NavigationContainer>
    </AuthProvider>
  );
}