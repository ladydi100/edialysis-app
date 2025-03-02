// MedicalAppointmentsSelectionPage.js
import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';

const MedicalAppointmentsSelectionPage = () => {
  const [selectedSpecialty, setSelectedSpecialty] = useState(null);
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [appointments, setAppointments] = useState([]);

  const specialties = ['Nefrología', 'Cardiología', 'Endocrinología', 'Nutrición Clínica', 'Psicología Médica'];

  const handleConfirm = () => {
    if (!selectedSpecialty) {
      alert('Selecciona una especialidad');
      return;
    }

    const newAppointment = {
      id: Math.random().toString(),
      specialty: selectedSpecialty,
      date: date.toDateString(),
      time: date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setAppointments([...appointments, newAppointment]);

    // Reinicia la selección para la siguiente cita
    setSelectedSpecialty(null);
    setDate(new Date());
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Citas médicas</Text>

      {/* 📌 Sección de Selección de Especialidad */}
      {!selectedSpecialty ? (
        <>
          <Text style={styles.subtitle}>Selecciona la especialidad</Text>
          <View style={styles.specialtiesContainer}>
            {specialties.map((specialty, index) => (
              <TouchableOpacity
                key={index}
                style={styles.specialtyButton}
                onPress={() => setSelectedSpecialty(specialty)}
              >
                <Text style={styles.specialtyText}>{specialty}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </>
      ) : (
        <>
          <Text style={styles.selectedSpecialty}>Especialidad seleccionada: {selectedSpecialty}</Text>

          {/* 📌 Sección de Fecha y Hora */}
          <TouchableOpacity style={styles.dateButton} onPress={() => setShowDatePicker(true)}>
            <Text style={styles.dateButtonText}>Seleccionar fecha</Text>
          </TouchableOpacity>
          {showDatePicker && (
            <DateTimePicker
              value={date}
              mode="date"
              display="default"
              onChange={(event, selectedDate) => {
                setShowDatePicker(false);
                if (selectedDate) setDate(selectedDate);
              }}
            />
          )}

          <TouchableOpacity style={styles.dateButton} onPress={() => setShowTimePicker(true)}>
            <Text style={styles.dateButtonText}>Seleccionar hora</Text>
          </TouchableOpacity>
          {showTimePicker && (
            <DateTimePicker
              value={date}
              mode="time"
              display="default"
              onChange={(event, selectedTime) => {
                setShowTimePicker(false);
                if (selectedTime) setDate(selectedTime);
              }}
            />
          )}

          <Text style={styles.selectedInfo}>
            Fecha: {date.toDateString()} {'\n'}
            Hora: {date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </Text>

          <TouchableOpacity style={styles.confirmButton} onPress={handleConfirm}>
            <Text style={styles.confirmButtonText}>Guardar cita</Text>
          </TouchableOpacity>
        </>
      )}

      {/* 📌 Sección de Citas Registradas */}
      {appointments.length > 0 && (
        <View style={styles.appointmentsList}>
          <Text style={styles.appointmentsTitle}>Citas registradas</Text>
          {appointments.map((item) => (
            <View key={item.id} style={styles.appointmentCard}>
              <Text style={styles.appointmentText}>Especialidad: {item.specialty}</Text>
              <Text style={styles.appointmentText}>Fecha: {item.date}</Text>
              <Text style={styles.appointmentText}>Hora: {item.time}</Text>
            </View>
          ))}
        </View>
      )}
    </ScrollView>
  );
};

export default MedicalAppointmentsSelectionPage;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FAFAFA', padding: 20 },
  title: { fontSize: 24, fontWeight: 'bold', color: '#101432', marginBottom: 8 },
  subtitle: { fontSize: 16, color: '#5A5555', marginBottom: 12 },
  specialtiesContainer: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center' },
  specialtyButton: { backgroundColor: '#3B49B4', padding: 10, borderRadius: 8, margin: 5 },
  specialtyText: { color: '#FFFFFF', fontSize: 14 },
  selectedSpecialty: { fontSize: 18, color: '#3B49B4', fontWeight: 'bold', marginVertical: 10, textAlign: 'center' },
  dateButton: { backgroundColor: '#E3E3E3', padding: 10, borderRadius: 10, marginVertical: 5 },
  dateButtonText: { textAlign: 'center', color: '#101432', fontSize: 16 },
  selectedInfo: { marginTop: 10, color: '#5A5555', textAlign: 'center' },
  confirmButton: { backgroundColor: '#3B49B4', padding: 15, borderRadius: 10, marginTop: 20 },
  confirmButtonText: { color: '#FFFFFF', fontSize: 16, textAlign: 'center' },
  appointmentsList: { marginTop: 20 },
  appointmentsTitle: { fontSize: 18, fontWeight: 'bold', color: '#101432', marginBottom: 10 },
  appointmentCard: {
    backgroundColor: '#E3E3E3',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
  },
  appointmentText: { fontSize: 16, color: '#5A5555' },
});
