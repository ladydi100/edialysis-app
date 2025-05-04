// DialysisRemindersPage.js - Página para configurar recordatorios de diálisis
import React, { useState, useEffect, useContext, useLayoutEffect  } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, FlatList, Button } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import * as Notifications from 'expo-notifications';
import { useNavigation, useRoute } from '@react-navigation/native';
import { AuthContext } from '../context/AuthContext';
import { saveDialysisTreatment } from '../services/dialysisService';
import BackButton from '../components/BackButton';


const DialysisRemindersPage = () => {
  const navigation = useNavigation();
    const { userToken } = useContext(AuthContext);
  const route = useRoute();
  //const { selectedDays, weight, treatmentType, startDate } = route.params || {};
  
   const { 
    selectedDays = [], 
    weight = null, 
    treatmentType = '', 
    startDate = null 
  } = route.params || {};

  const parsedStartDate = startDate ? new Date(startDate) : null;
 
  const [reminders, setReminders] = useState(
    selectedDays.reduce((acc, day) => ({ ...acc, [day]: null }), {})
  );

  const [selectedDay, setSelectedDay] = useState(null);
  const [selectedTime, setSelectedTime] = useState(new Date());
  const [showTimePicker, setShowTimePicker] = useState(false);
 const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    console.log('Fecha recibida:', startDate);
    console.log('Fecha convertida:', parsedStartDate);
    Notifications.requestPermissionsAsync();
  }, [startDate, parsedStartDate]);

useLayoutEffect(() => {
  navigation.setOptions({
    headerTitle: '',
    headerLeft: () => <BackButton navigation={navigation} />
  });
}, [navigation]);

 const handleSetReminder = (day) => {
    setSelectedDay(day);
    setSelectedTime(new Date());
    setShowTimePicker(true);
  };

   const onChangeTime = (event, selectedDate) => {
    setShowTimePicker(false);
    if (selectedDate && selectedDay) {
      setReminders((prev) => ({ ...prev, [selectedDay]: selectedDate }));
    }
  };

  const handleSave = async () => {
  setIsSaving(true);

  console.log('Datos recibidos:', {
      startDate,
      parsedStartDate,
      selectedDays,
      weight,
      treatmentType
    });


  try {
    if (!parsedStartDate || isNaN(parsedStartDate.getTime())) {
        alert('Por favor, selecciona una fecha de inicio válida');
        return;
      }

    // Asegúrate de que startDate es un objeto Date válido
   /* const parsedStartDate = new Date(startDate);
    if (isNaN(parsedStartDate.getTime())) {
      throw new Error('Fecha de inicio no válida');
    }*/

    // Preparar los datos para enviar al backend
      const daysData = Object.entries(reminders).map(([day, time]) => ({
        day,
        reminder_time: time ? time.toTimeString().substring(0, 5) : null
      }));

    const treatmentData = {
      treatment_type: treatmentType,
      start_date: parsedStartDate.toISOString().split('T')[0], // Formato YYYY-MM-DD
      dry_weight: weight,
      days: daysData
    };

    console.log('Datos a enviar:', treatmentData); // Para depuración

    await saveDialysisTreatment(treatmentData, userToken);
    
   navigation.navigate('DialysisPage', { 
        reminders,
        weight,
        treatmentType
      });

  } catch (error) {
   console.error('Error al guardar:', {
        error: error.message,
        response: error.response?.data
      });
      alert(`Error al guardar: ${error.message}`);
  } finally {
    setIsSaving(false);
  }
};

  const handleSkip = () => {
    navigation.navigate('DialysisPage', { 
      reminders: {}, 
      weight: weight,
      treatmentType: treatmentType
    });
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
            <Button 
              title={reminders[item] ? reminders[item].toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) : 'Seleccionar hora'} 
              onPress={() => handleSetReminder(item)} 
            />
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
           <TouchableOpacity 
        style={[styles.saveButton, isSaving && styles.disabledButton]} 
        onPress={handleSave}
        disabled={isSaving}
      >
        <Text style={styles.buttonText}>
          {isSaving ? 'Guardando...' : 'Guardar'}
        </Text>
      </TouchableOpacity>
      
      <TouchableOpacity 
        style={styles.skipButton} 
        onPress={handleSkip}
        disabled={isSaving}
      >
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
    marginBottom: 9,
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
    marginBottom: 9,
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