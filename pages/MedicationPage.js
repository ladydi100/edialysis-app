import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const medications = [
  { id: '1', time: '10:00', name: 'Paracetamol', dosage: 'Tomar media pastilla (100g)', completed: true, color: 'green' },
  { id: '2', time: '10:45', name: 'Enalapril', dosage: 'Tomar pastilla entera', completed: true, color: 'purple' },
  { id: '3', time: '11:30', name: 'Diálisis con máquina en casa', dosage: '35 minutos de tratamiento', completed: false, color: 'orange' }
];

const MedicationPage = ({ navigation }) => {
  // Estado para la fecha seleccionada
  const [selectedDate, setSelectedDate] = useState(25);
  const [currentWeek, setCurrentWeek] = useState([
    { day: "Sab", date: 23 },
    { day: "Dom", date: 24 },
    { day: "Lun", date: 25 },
    { day: "Mar", date: 26 },
    { day: "Mie", date: 27 }
  ]);

  const [medList, setMedList] = useState(medications);

  // Función para cambiar de semana
  const changeWeek = (direction) => {
    setCurrentWeek((prevWeek) =>
      prevWeek.map(({ day, date }) => ({
        day,
        date: date + direction * 7, // Suma o resta 7 días
      }))
    );
    setSelectedDate(null); // Desmarcar el día al cambiar de semana
  };

  // Función para marcar/desmarcar un medicamento como completado
  const toggleCompletion = (id) => {
    setMedList((prevMeds) =>
      prevMeds.map((med) =>
        med.id === id ? { ...med, completed: !med.completed } : med
      )
    );
  };

  return (
    <View style={styles.container}>
      {/* 📅 Selector de Fecha */}
      <View style={styles.dateSelector}>
        <TouchableOpacity onPress={() => changeWeek(-1)} style={styles.arrowButton}>
          <Ionicons name="chevron-back" size={24} color="#3B49B4" />
        </TouchableOpacity>

        <Text style={styles.monthText}>Enero</Text>

        <TouchableOpacity onPress={() => changeWeek(1)} style={styles.arrowButton}>
          <Ionicons name="chevron-forward" size={24} color="#3B49B4" />
        </TouchableOpacity>
      </View>

      {/* 🗓️ Semana actual */}
      <View style={styles.weekContainer}>
        {currentWeek.map(({ day, date }) => (
          <TouchableOpacity
            key={date}
            style={[styles.dayContainer, selectedDate === date && styles.selectedDay]}
            onPress={() => setSelectedDate(date)}
          >
            <Text style={[styles.dayText, selectedDate === date && styles.selectedDayText]}>
              {day}
            </Text>
            <Text style={[styles.dateText, selectedDate === date && styles.selectedDateText]}>
              {date}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* 🔵 Sección de Progreso */}
      <View style={styles.progressSection}>
        <View style={styles.progressCircle}>
          <Text style={styles.progressText}>15%</Text>
        </View>
        <View style={styles.progressDetails}>
          <Text style={styles.pillCount}>5 pastillas</Text>
          <Text style={styles.treatmentCount}>1 tratamiento</Text>
        </View>
      </View>

      {/* 💊 Lista de Medicación */}
      <Text style={styles.sectionTitle}>Medicación</Text>
      <ScrollView style={styles.scrollView}>
        {medList.map((med) => (
          <View key={med.id} style={styles.medicationItem}>
            <View style={[styles.dot, { backgroundColor: med.color }]} />
            <View style={styles.medicationInfo}>
              <Text style={styles.medicationTime}>{med.time}</Text>
              <Text style={styles.medicationName}>{med.name}</Text>
              <Text style={styles.medicationDosage}>{med.dosage}</Text>
            </View>
            <TouchableOpacity onPress={() => toggleCompletion(med.id)}>
              <Ionicons
                name={med.completed ? "checkmark-circle" : "ellipse-outline"}
                size={24}
                color={med.completed ? "#3B49B4" : "gray"}
              />
            </TouchableOpacity>
          </View>
        ))}
      </ScrollView>

      {/* ➕ Botón de Añadir Medicación */}
      <TouchableOpacity style={styles.addButton} onPress={() => navigation.navigate('AddMedication')}>
        <Text style={styles.addButtonText}>+ Añadir nuevo</Text>
      </TouchableOpacity>
    </View>
  );
};

export default MedicationPage;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAFAFA',
    paddingHorizontal: 20,
  },
  dateSelector: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginVertical: 15,
  },
  monthText: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#101432",
  },
  arrowButton: {
    padding: 10,
  },
  weekContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  dayContainer: {
    alignItems: "center",
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 10,
  },
  selectedDay: {
    backgroundColor: "#3B49B4",
  },
  dayText: {
    fontSize: 14,
    color: "#6B7280",
  },
  selectedDayText: {
    color: "#FFFFFF",
  },
  dateText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#101432",
  },
  selectedDateText: {
    color: "#FFFFFF",
  },
  progressSection: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
    padding: 20,
    backgroundColor: "#F6F6F6",
    borderRadius: 10,
    marginBottom: 20,
  },
  progressCircle: {
    width: 50,
    height: 50,
    borderRadius: 25,
    borderWidth: 5,
    borderColor: "#3B49B4",
    justifyContent: "center",
    alignItems: "center",
  },
  progressText: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#3B49B4",
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#101432",
    marginBottom: 10,
  },
  medicationItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 15,
    borderBottomWidth: 1,
    borderColor: "#EEE",
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 10,
  },
  medicationInfo: {
    flex: 1,
  },
  addButton: {
    backgroundColor: "#3B49B4",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    marginVertical: 15,
  },
  addButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
  },
});
