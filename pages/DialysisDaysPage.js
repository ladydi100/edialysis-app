// DialysisDaysPage.js - Selección de días de diálisis
import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';

const DialysisDaysPage = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { weight } = route.params || {};
  const [selectedDays, setSelectedDays] = useState([]);

  const daysOfWeek = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado", "Domingo"];

  const toggleDaySelection = (day) => {
    setSelectedDays((prevDays) =>
      prevDays.includes(day)
        ? prevDays.filter((d) => d !== day)
        : [...prevDays, day]
    );
  };

  const handleNext = () => {
    if (selectedDays.length > 0) {
      navigation.navigate('DialysisRemindersPage', { weight, selectedDays });
    } else {
      alert('Por favor, selecciona al menos un día.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>¿Cuándo son tus días de diálisis?</Text>
      <Text style={styles.description}>
        Selecciona los días durante los cuales sueles realizar el tratamiento de diálisis.
      </Text>

      {daysOfWeek.map((day) => (
        <TouchableOpacity
          key={day}
          style={[styles.dayButton, selectedDays.includes(day) && styles.selectedDay]}
          onPress={() => toggleDaySelection(day)}
        >
          <Text style={[styles.dayText, selectedDays.includes(day) && styles.selectedDayText]}>{day}</Text>
        </TouchableOpacity>
      ))}

      <TouchableOpacity style={styles.nextButton} onPress={handleNext}>
        <Text style={styles.buttonText}>Siguiente</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAFAFA',
    padding: 20,
    justifyContent: 'center',
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
  dayButton: {
    backgroundColor: '#E3E3E3',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    alignItems: 'center',
  },
  selectedDay: {
    backgroundColor: '#3B49B4',
  },
  dayText: {
    fontSize: 16,
    color: '#101432',
  },
  selectedDayText: {
    color: '#FAFAFA',
  },
  nextButton: {
    backgroundColor: '#3B49B4',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 20,
  },
  buttonText: {
    color: '#FAFAFA',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default DialysisDaysPage;