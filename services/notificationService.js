import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import { Platform } from 'react-native';

// Configuración inicial de notificaciones
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

// Función para programar notificaciones recurrentes
export const scheduleDialysisNotifications = async (treatmentData) => {
  // 1. Cancelar notificaciones previas
  await Notifications.cancelAllScheduledNotificationsAsync();

  // 2. Verificar si hay días programados
  if (!treatmentData?.days || treatmentData.days.length === 0) return;

  // 3. Obtener fecha de inicio (usar hoy si no hay fecha)
  const startDate = treatmentData.start_date 
    ? new Date(treatmentData.start_date) 
    : new Date();

  // 4. Programar para cada día
  for (const day of treatmentData.days) {
    if (!day.reminder_time) continue;

    const [hours, minutes] = day.reminder_time.split(':').map(Number);
    
    await scheduleWeeklyNotification(
      day.day_of_week, 
      hours, 
      minutes, 
      startDate
    );
  }
};

// Función auxiliar para programar notificación semanal
const scheduleWeeklyNotification = async (weekday, hours, minutes, startDate) => {
  const weekdayIndex = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado']
    .indexOf(weekday);

  // Calcular próxima ocurrencia del día después de la fecha de inicio
  const now = new Date();
  const nextDate = new Date(startDate);
  
  // Ajustar a la próxima ocurrencia del día programado
  while (nextDate.getDay() !== weekdayIndex || nextDate < now) {
    nextDate.setDate(nextDate.getDate() + 1);
  }

  // Configurar hora exacta
  nextDate.setHours(hours, minutes, 0, 0);

  // Programar notificación recurrente (semanal)
  await Notifications.scheduleNotificationAsync({
    content: {
      title: "Recordatorio de Diálisis",
      body: `Tienes programado tu tratamiento para hoy a las ${day.reminder_time}`,
      sound: true,
      data: { type: 'dialysis-reminder' },
    },
    trigger: {
      repeats: true,
      weekday: weekdayIndex + 1, // 1-7 (Domingo=1)
      hour: hours,
      minute: minutes,
      // Notificar 1 hora antes (opcional)
      seconds: 0,
    },
  });

  // Notificación de recordatorio (1 hora antes)
  await Notifications.scheduleNotificationAsync({
    content: {
      title: "Recordatorio de Diálisis",
      body: `En 1 hora tienes programado tu tratamiento a las ${day.reminder_time}`,
      sound: true,
    },
    trigger: {
      repeats: true,
      weekday: weekdayIndex + 1,
      hour: hours - 1, // 1 hora antes
      minute: minutes,
      seconds: 0,
    },
  });
};

// Pedir permisos al iniciar la app
export const registerForPushNotifications = async () => {
  if (!Device.isDevice) return;

  const { status } = await Notifications.getPermissionsAsync();
  if (status !== 'granted') {
    await Notifications.requestPermissionsAsync();
  }
};