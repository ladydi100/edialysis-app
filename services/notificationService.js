// src/services/notificationService.js
import * as Notifications from 'expo-notifications';
import { getMedicationsByDate } from './medicationService';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const registerForPushNotificationsAsync = async () => {
  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;

  if (existingStatus !== 'granted') {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }

  if (finalStatus !== 'granted') {
    console.warn('🚫 Permiso de notificaciones no concedido');
     return;
  }

if (Platform.OS === 'android') {
   await Notifications.setNotificationChannelAsync('medication-reminders', {
  name: 'Recordatorios de Medicación',
  importance: Notifications.AndroidImportance.MAX, // ⚠️ CAMBIADO A MAX
  sound: 'default',
  vibrationPattern: [0, 250, 250, 250],
  lightColor: '#FF231F7C',
});
  }



};




const convertToTodayDate = (timeStr) => {
  const [hour, minute] = timeStr.split(':').map(Number);
  const now = new Date();
  return new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate(),
    hour,
    minute,
    0,
    0
  );
};




export const scheduleMedicationNotifications = async (date) => {
  if (!date || typeof date.toISOString !== 'function') {
    console.warn('⚠️ Parámetro inválido en scheduleMedicationNotifications:', date);
    return;
  }

  const token = await AsyncStorage.getItem('userToken');
  const formattedDate = date.toISOString().split('T')[0];

  try {
    const medications = await getMedicationsByDate(formattedDate, token);

    for (const med of medications) {
      const taken = med.taken === 1 || med.taken === true;
      const alarm = med.alarm_enabled === 1 || med.alarm_enabled === true;

      if (!alarm || taken) continue;

      const alarmTime = convertToTodayDate(med.time);
      const now = new Date();

const secondsUntil = Math.floor((alarmTime.getTime() - now.getTime()) / 1000);

console.log('resultado...', secondsUntil);
      

      if (secondsUntil > 0 && secondsUntil <= 300) {
         console.log(`✅ Agendando notificación para ${med.name} a las ${alarmTime.toLocaleTimeString()}`);

        await Notifications.scheduleNotificationAsync({
          content: {
            title: `💊 ${med.name}`,
            body: `Dosis: ${med.dosage}. ¡No olvides tomarlo!`,
            sound: true,
            priority: Notifications.AndroidNotificationPriority.HIGH,
             channelId: 'medication-reminders',
          },
         trigger: {
         
  
      seconds: secondsUntil 
  },
        });

        console.log(`⏰ Notificación agendada: ${med.name} a las ${med.time}`);
      } else {
        console.log(`⏩ Hora ya pasada para: ${med.name}, no se agenda.`);
      }
    }
  } catch (error) {
    console.error('❌ Error al agendar notificaciones:', error);
  }
};
