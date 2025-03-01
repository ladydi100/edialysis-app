// DialysisRemindersPage.js - Página para configurar recordatorios de diálisis
import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Switch, StyleSheet, FlatList, Button } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import * as Notifications from 'expo-notifications';
import { useNavigation } from '@react-navigation/native';

const DialysisRemindersPage = () => {
  const navigation = useNavigation();
  const [reminders, setReminders] = useState([]);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [selectedTime, setSelectedTime] = useState(new Date());

  useEffect(() => {
    Notifications.requestPermissionsAsync();
  }, []);

  const handleAddReminder = () => {
    setReminders([...reminders, selectedTime]);
    scheduleNotification(selectedTime);
  };

  const handleRemoveReminder = (index) => {
    const updatedReminders = reminders.filter((_, i) => i !== index);
    setReminders(updatedReminders);
  };

  const scheduleNotification = async (time) => {
    await Notifications.scheduleNotificationAsync({
      content: {
        title: "Recordatorio de Diálisis",
        body: "Es hora de tu sesión de diálisis",
      },
      trigger: { hour: time.getHours(), minute: time.getMinutes(), repeats: true },
    });
  };

  const handleSave = () => {
    navigation.navigate('DialysisConfirmationPage');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Activa tus recordatorios diarios</Text>
      <Text style={styles.description}>
        Configura recordatorios para medir y registrar tus parámetros vitales antes y después de la diálisis.
      </Text>
      
      <FlatList
        data={reminders}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item, index }) => (
          <View style={styles.reminderItem}>
            <Text style={styles.reminderText}>{item.toLocaleTimeString()}</Text>
            <Button title="Eliminar" onPress={() => handleRemoveReminder(index)} />
          </View>
        )}
      />
      
      <TouchableOpacity style={styles.addButton} onPress={() => setShowTimePicker(true)}>
        <Text style={styles.buttonText}>Añadir Recordatorio</Text>
      </TouchableOpacity>
      
      {showTimePicker && (
        <DateTimePicker
          value={selectedTime}
          mode="time"
          is24Hour={true}
          display="default"
          onChange={(event, selectedDate) => {
            setShowTimePicker(false);
            if (selectedDate) setSelectedTime(selectedDate);
          }}
        />
      )}
      
      <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
        <Text style={styles.buttonText}>Guardar</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAFAFA',
    padding: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#101432',
    marginBottom: 10,
  },
  description: {
    fontSize: 16,
    color: '#5A5555',
    marginBottom: 20,
  },
  reminderItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#E3E3E3',
    padding: 10,
    borderRadius: 8,
    marginBottom: 10,
  },
  reminderText: {
    fontSize: 16,
    color: '#101432',
  },
  addButton: {
    backgroundColor: '#3B49B4',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 10,
  },
  saveButton: {
    backgroundColor: '#00A86B',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  buttonText: {
    color: '#FAFAFA',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default DialysisRemindersPage;
