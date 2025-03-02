import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const medications = [
  { id: '1', time: '10:00', name: 'Paracetamol', dosage: 'Tomar media pastilla (100g)', completed: true, color: 'green' },
  { id: '2', time: '10:45', name: 'Enalapril', dosage: 'Tomar pastilla entera', completed: true, color: 'purple' },
  { id: '3', time: '11:30', name: 'Diálisis con máquina en casa', dosage: '35 minutos de tratamiento', completed: false, color: 'orange' }
];

const MedicationPage = ({ navigation }) => {
  const [medList, setMedList] = useState(medications);

  const toggleCompletion = (id) => {
    setMedList((prevMeds) =>
      prevMeds.map((med) =>
        med.id === id ? { ...med, completed: !med.completed } : med
      )
    );
  };

  return (
    <View style={styles.container}>
      {/* Header con fecha */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="chevron-back" size={24} color="blue" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Enero</Text>
        <TouchableOpacity>
          <Ionicons name="chevron-forward" size={24} color="blue" />
        </TouchableOpacity>
      </View>

      {/* Sección de progreso */}
      <View style={styles.progressSection}>
        <View style={styles.progressCircle}>
          <Text style={styles.progressText}>15%</Text>
        </View>
        <View style={styles.progressDetails}>
          <Text style={styles.pillCount}>5 pastillas</Text>
          <Text style={styles.treatmentCount}>1 tratamiento</Text>
        </View>
      </View>

      {/* Lista de medicamentos */}
      <View style={styles.medicationHeader}>
        <Text style={styles.medicationTitle}>Medicamentos</Text>
      </View>
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
              <Ionicons name={med.completed ? "checkmark-circle" : "ellipse-outline"} size={24} color={med.completed ? "blue" : "gray"} />
            </TouchableOpacity>
          </View>
        ))}
      </ScrollView>

      {/* Botón de añadir */}
      <TouchableOpacity style={styles.addButton} onPress={() => navigation.navigate('AddMedication')}>
        <Text style={styles.addButtonText}>+ Añadir nuevo</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 20,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  progressSection: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    padding: 20,
    backgroundColor: '#F6F6F6',
    borderRadius: 10,
    marginHorizontal: 20,
  },
  progressCircle: {
    width: 50,
    height: 50,
    borderRadius: 25,
    borderWidth: 5,
    borderColor: 'blue',
    justifyContent: 'center',
    alignItems: 'center',
  },
  progressText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: 'blue',
  },
  medicationHeader: {
    padding: 15,
  },
  medicationTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  medicationItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 1,
    borderColor: '#EEE',
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
  medicationTime: {
    color: 'gray',
  },
  medicationName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  addButton: {
    backgroundColor: 'blue',
    padding: 15,
    alignItems: 'center',
    margin: 20,
    borderRadius: 10,
  },
  addButtonText: {
    color: 'white',
    fontSize: 16,
  },
});

export default MedicationPage;
