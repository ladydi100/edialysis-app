import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const MedicationDetail = ({ route }) => {
  const { medication } = route.params;

  return (
    <View style={styles.container}>
      {/* Primera fila: Color, nombre del medicamento y icono de eliminar */}
      <View style={styles.firstRow}>
        <View style={[styles.colorIndicator, { backgroundColor: medication.color }]} />
        <Text style={styles.medicationName}>{medication.name}</Text>
        <TouchableOpacity onPress={() => console.log('Eliminar medicamento')}>
          <Ionicons name="trash-outline" size={24} color="#FF3B30" />
        </TouchableOpacity>
      </View>

      {/* Segunda fila: Fecha y hora */}
      <View style={styles.secondRow}>
        <Text style={styles.dateText}>
          {medication.date} - {medication.time}
        </Text>
      </View>

      {/* Tercera fila: Dosis y notas */}
      <View style={styles.thirdRow}>
        <Text style={styles.dosageText}>Dosis: {medication.dosage}</Text>
        <Text style={styles.notesText}>Notas: {medication.notes}</Text>
      </View>

      {/* Cuarta fila: Desactivar alarma */}
      <View style={styles.fourthRow}>
        <Text style={styles.alarmText}>Desactivar alarma:</Text>
        <Text style={styles.alarmStatus}>
          {medication.alarmEnabled ? 'Activo' : 'Inactivo'}
        </Text>
      </View>

      {/* Botón de editar */}
      <TouchableOpacity style={styles.editButton} onPress={() => console.log('Editar medicamento')}>
        <Text style={styles.editButtonText}>Editar</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#FAFAFA',
  },
  firstRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  colorIndicator: {
    width: 20,
    height: 20,
    borderRadius: 10,
    marginRight: 10,
  },
  medicationName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#101432',
    flex: 1,
  },
  secondRow: {
    marginBottom: 20,
  },
  dateText: {
    fontSize: 16,
    color: '#6B7280',
  },
  thirdRow: {
    marginBottom: 20,
  },
  dosageText: {
    fontSize: 16,
    color: '#6B7280',
    marginBottom: 10,
  },
  notesText: {
    fontSize: 16,
    color: '#6B7280',
  },
  fourthRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  alarmText: {
    fontSize: 16,
    color: '#6B7280',
    marginRight: 10,
  },
  alarmStatus: {
    fontSize: 16,
    color: '#3B49B4',
    fontWeight: 'bold',
  },
  editButton: {
    backgroundColor: '#3B49B4',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  editButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default MedicationDetail;