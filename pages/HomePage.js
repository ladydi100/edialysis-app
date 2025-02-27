import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image } from 'react-native';
import { MaterialIcons, Ionicons } from '@expo/vector-icons';

const HomePage = ({ navigation }) => {
  const [meds, setMeds] = useState([
    { id: 1, time: '10:00', name: 'Paracetamol', color: 'green', taken: false },
    { id: 2, time: '10:45', name: 'Enalapril', color: 'purple', taken: false },
    { id: 3, time: '11:30', name: 'Diálisis', color: 'orange', taken: false },
    { id: 4, time: '18:00', name: 'Enalapril', color: 'purple', taken: false },
  ]);

  const toggleMedication = (id) => {
    setMeds((prevMeds) =>
      prevMeds.map((med) =>
        med.id === id ? { ...med, taken: !med.taken } : med
      )
    );
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Hola, <Text style={styles.userName}>¡Juan!</Text></Text>
        </View>
        <Image source={require('../assets/Juan.png')} style={styles.avatar} />
      </View>

      <Text style={styles.sectionTitle}>Valores de salud</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.healthValuesContainer}>
        <View style={[styles.healthCard, styles.cardBlue]}>
          <Text style={styles.healthTitle}>Frecuencia cardíaca</Text>
          <Text style={styles.healthValue}>75 bpm</Text>
        </View>
        <View style={[styles.healthCard, styles.cardTeal]}>
          <Text style={styles.healthTitle}>Presión arterial</Text>
          <Text style={styles.healthValue}>180/110</Text>
        </View>
        <View style={[styles.healthCard, styles.cardRed]}>
          <Text style={styles.healthTitle}>Peso</Text>
          <Text style={styles.healthValue}>96 kg</Text>
        </View>
        <View style={[styles.healthCard, styles.cardYellow]}>
          <Text style={styles.healthTitle}>Glucosa</Text>
          <Text style={styles.healthValue}>110 mg/dl</Text>
        </View>
      </ScrollView>
      <TouchableOpacity onPress={() => navigation.navigate('HealthPage')}>
        <Text style={styles.addButton}>+ Añadir nuevo</Text>
      </TouchableOpacity>

      <Text style={[styles.sectionTitle, { marginTop: 32 }]}>Tu medicación</Text>
      <Text style={styles.subText}>Lunes 26 enero</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.medicationContainer}>
        {meds.map((med) => (
          <TouchableOpacity
            key={med.id}
            style={[styles.medCard, med.taken && styles.medCardTaken]}
            onPress={() => toggleMedication(med.id)}
          >
            <View style={styles.medContent}>
              <View style={[styles.medCircle, { backgroundColor: med.color }]} />
              <View>
                <Text style={styles.medTime}>{med.time}</Text>
                <Text style={styles.medName}>{med.name}</Text>
              </View>
            </View>
            <MaterialIcons name={med.taken ? 'check-box' : 'check-box-outline-blank'} size={24} color={med.taken ? 'green' : 'black'} style={styles.checkbox} />
          </TouchableOpacity>
        ))}
      </ScrollView>
      <TouchableOpacity onPress={() => navigation.navigate('AddMedication')}>
        <Text style={styles.addButton}>+ Añadir nuevo</Text>
      </TouchableOpacity>

      <MedicalAppointments />
    </ScrollView>
  );
};

const appointments = [
  { id: 1, department: 'Cardiología', hospital: 'Hospital Universitario de Madrid', date: 'Lunes, 12 de Mayo', time: '11:00 AM' },
  { id: 2, department: 'Nefrología', hospital: 'Clínica Santa María', date: 'Martes, 20 de Junio', time: '09:30 AM' },
  { id: 3, department: 'Endocrinología', hospital: 'Hospital La Paz', date: 'Viernes, 5 de Julio', time: '16:00 PM' }
];

const MedicalAppointments = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextAppointment = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % appointments.length);
  };

  const prevAppointment = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + appointments.length) % appointments.length);
  };

  return (
    <View style={styles.appointmentContainer}>
      <Text style={styles.sectionTitle}>Citas médicas</Text>
      <View style={styles.appointmentCard}>
        <View style={styles.appointmentHeader}>
          <Ionicons name="calendar-outline" size={20} color="#3E3E3E" />
          <Text style={styles.appointmentTitle}>Próximas citas</Text>
        </View>
        <Text style={styles.department}>{appointments[currentIndex].department} • {appointments[currentIndex].hospital}</Text>
        <View style={styles.dateContainer}>
          <TouchableOpacity onPress={prevAppointment}>
            <Ionicons name="chevron-back-outline" size={24} color="#3E3E3E" />
          </TouchableOpacity>
          <View style={styles.dateBox}>
            <Text style={styles.dateText}>{appointments[currentIndex].date}</Text>
            <View style={styles.timeContainer}>
              <Ionicons name="time-outline" size={16} color="#3E3E3E" />
              <Text style={styles.timeText}>{appointments[currentIndex].time}</Text>
            </View>
          </View>
          <TouchableOpacity onPress={nextAppointment}>
            <Ionicons name="chevron-forward-outline" size={24} color="#3E3E3E" />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

// Estilos combinados e integrados
const styles = StyleSheet.create({
  container: { backgroundColor: '#FAFAFA', padding: 20 },

  // Header
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 },
  greeting: { fontSize: 36, color: '#161B43', fontFamily: 'Inter-Regular' },
  userName: { fontWeight: '600', fontFamily: 'Inter-SemiBold' },
  avatar: { width: 50, height: 50, borderRadius: 25 },

  // Section Titles
  sectionTitle: { fontSize: 20, color: '#3E3E3E', fontWeight: '600', marginBottom: 12 },

  // Health Values
  healthValuesContainer: { flexDirection: 'row', gap: 8, marginTop: 8 },
  healthCard: { padding: 15, borderRadius: 8, width: 100, alignItems: 'center', justifyContent: 'center', marginRight: 8 },
  healthTitle: { fontSize: 12, color: '#3E3E3E' },
  healthValue: { fontSize: 20, fontWeight: 'bold', color: '#161B43' },
  cardBlue: { backgroundColor: '#E3F2FD' },
  cardTeal: { backgroundColor: '#E8F5E9' },
  cardRed: { backgroundColor: '#FFEBEE' },
  cardYellow: { backgroundColor: '#FFF9C4' },

  // Medication
  medicationContainer: { flexDirection: 'row', gap: 10, marginTop: 10 },
  medCard: { backgroundColor: '#FFFFFF', padding: 15, borderRadius: 8, width: 168, height: 94, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4, marginRight: 10 },
  medCardTaken: { backgroundColor: '#E3E7FF' },
  medContent: { flexDirection: 'row', alignItems: 'center' },
  medCircle: { width: 10, height: 10, borderRadius: 5, marginRight: 8 },
  medTime: { fontSize: 14, fontWeight: '600', color: '#3E3E3E' },
  medName: { fontSize: 16, fontWeight: 'bold', color: '#161B43' },

  checkbox: { marginLeft: 'auto' },

  // Appointments
  appointmentContainer: { marginTop: 32 },
  appointmentCard: { backgroundColor: '#FFFFFF', padding: 20, borderRadius: 10, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4 },
  appointmentHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 5 },
  appointmentTitle: { fontSize: 18, fontWeight: 'bold', marginLeft: 8, color: '#3E3E3E' },
  department: { color: '#6D6D6D', marginBottom: 10 },
  dateContainer: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: '#E3F2FD', padding: 10, borderRadius: 8, marginBottom: 12 }
});
export default HomePage;
