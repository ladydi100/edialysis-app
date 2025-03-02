// DialysisRemindersPage.js - Página para configurar recordatorios de diálisis
import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, FlatList, Button } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import * as Notifications from 'expo-notifications';
import { useNavigation, useRoute } from '@react-navigation/native';

const DialysisRemindersPage = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { selectedDays, weight } = route.params || { selectedDays: [], weight: null };
  const [reminders, setReminders] = useState(
    selectedDays.reduce((acc, day) => ({ ...acc, [day]: null }), {})
  );
  const [selectedDay, setSelectedDay] = useState(null);
  const [selectedTime, setSelectedTime] = useState(new Date());
  const [showTimePicker, setShowTimePicker] = useState(false);

  useEffect(() => {
    Notifications.requestPermissionsAsync();
  }, []);

  const handleSetReminder = (day) => {
    setSelectedDay(day);
    setShowTimePicker(true);
  };

  const onChangeTime = (event, selectedDate) => {
    if (selectedDate && selectedDay) {
      setReminders((prev) => ({ ...prev, [selectedDay]: selectedDate }));
    }
    setShowTimePicker(false);
  };

  const handleSave = () => {
    navigation.navigate('DialysisPage', { reminders, weight });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Configura tus recordatorios</Text>
      <Text style={styles.description}>
        Elige la hora de diálisis para cada día seleccionado.
      </Text>
      
      <FlatList
        data={selectedDays}
        keyExtractor={(item) => item}
        renderItem={({ item }) => (
          <View style={styles.reminderItem}>
            <Text style={styles.reminderText}>{item}</Text>
            <Button title={reminders[item] ? reminders[item].toLocaleTimeString() : 'Seleccionar hora'} onPress={() => handleSetReminder(item)} />
          </View>
        )}
      />
      
      {showTimePicker && (
        <DateTimePicker
          value={selectedTime}
          mode="time"
          is24Hour={true}
          display="default"
          onChange={onChangeTime}
        />
      )}
      
      <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
        <Text style={styles.buttonText}>Guardar</Text>
      </TouchableOpacity>
      
      <TouchableOpacity style={styles.skipButton} onPress={() => navigation.navigate('DialysisPage', { reminders: {}, weight })}>
        <Text style={styles.buttonText}>Saltar</Text>
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
  saveButton: {
    backgroundColor: '#3B49B4',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 10,
  },
  skipButton: {
    backgroundColor: '#898483',
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
