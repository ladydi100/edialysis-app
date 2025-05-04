// pages/MedicalAppointmentsSelectionPage.js
import React, { useState, useContext , useEffect, useLayoutEffect} from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView,  Alert, Modal } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { AuthContext } from '../context/AuthContext';
import { saveMedicalAppointment, getMedicalAppointments,  updateMedicalAppointment,
  deleteMedicalAppointment } from '../services/medicalAppointmentService';
  import { Ionicons } from '@expo/vector-icons';
  import BackButton from '../components/BackButton';
  import { useNavigation } from '@react-navigation/native';

const MedicalAppointmentsSelectionPage = () => {
   const navigation = useNavigation();
  const { userToken } = useContext(AuthContext);
  const [selectedSpecialty, setSelectedSpecialty] = useState(null);
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [appointments, setAppointments] = useState([]);
  const [displayDate, setDisplayDate] = useState('');
  const [displayTime, setDisplayTime] = useState('');
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [editDate, setEditDate] = useState('');
  const [editTime, setEditTime] = useState('');
  const [editSpecialty, setEditSpecialty] = useState('');


    useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: '',
      headerLeft: () => <BackButton navigation={navigation} />
    });
  }, [navigation]);

  const formatDateToSpanish = (date) => {
    const options = {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    };
    
    return date.toLocaleDateString('es-ES', options);
  };

  const specialties = ['Nefrología', 'Cardiología', 'Endocrinología', 'Nutrición Clínica', 'Psicología Médica'];

   useEffect(() => {
    const loadAppointments = async () => {
      try {
        const appointmentsData = await getMedicalAppointments(userToken);
        setAppointments(appointmentsData);
      } catch (error) {
        console.error('Error al cargar citas:', error);
      }
    };

    if (userToken) {
      loadAppointments();
    }
  }, [userToken]);

 const handleDateChange = (event, selectedDate) => {
    setShowDatePicker(false);
    if (selectedDate) {
      // Ajuste para evitar problemas de zona horaria
      const offset = selectedDate.getTimezoneOffset() * 60000; // offset en milisegundos
      const localDate = new Date(selectedDate.getTime() - offset);
      setDate(selectedDate);
      setDisplayDate(localDate.toISOString().split('T')[0]);
    }
  };


  const handleTimeChange = (event, selectedTime) => {
    setShowTimePicker(false);
    if (selectedTime) {
      setDate(selectedTime);
     const timeString = selectedTime.toTimeString().substring(0, 5); // Formato HH:MM
      setDisplayTime(timeString);
    }
  };

  const handleConfirm = async () => {
    if (!selectedSpecialty) {
      Alert.alert('Error', 'Selecciona una especialidad');
      return;
    }

    if (!displayDate || !displayTime) {
      Alert.alert('Error', 'Selecciona fecha y hora');
      return;
    }
    try {
      const appointmentData = {
        specialty: selectedSpecialty,
        appointment_date: displayDate,
        appointment_time: displayTime
      };

      await saveMedicalAppointment(appointmentData, userToken);

 const updatedAppointments = await getMedicalAppointments(userToken);
      setAppointments(updatedAppointments);


    setSelectedSpecialty(null);
    setDate(new Date());
    setDisplayDate('');
    setDisplayTime('');

  Alert.alert('Éxito', 'Cita médica guardada correctamente');
    } catch (error) {
      Alert.alert('Error', 'No se pudo guardar la cita médica');
      console.error('Error saving appointment:', error);
    }

  };

  const formatDisplayDate = (dateString) => {
    // Asegurarnos de que la fecha se interprete correctamente
    const dateObj = new Date(dateString);
    const options = { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric',
      timeZone: 'UTC' // Forzamos UTC para consistencia
    };
    return dateObj.toLocaleDateString('es-ES', options);
  };


const openEditModal = (appointment) => {
    setSelectedAppointment(appointment);
    setEditSpecialty(appointment.specialty);
    setEditDate(appointment.appointment_date);
    setEditTime(appointment.appointment_time);
    setModalVisible(true);
    setEditMode(true);
  };

  const handleUpdateAppointment = async () => {
    try {
      const updatedData = {
        id: selectedAppointment.id,
        specialty: editSpecialty,
        appointment_date: editDate,
        appointment_time: editTime
      };

      await updateMedicalAppointment(updatedData, userToken);
      const updatedAppointments = await getMedicalAppointments(userToken);
      setAppointments(updatedAppointments);
      setModalVisible(false);
      Alert.alert('Éxito', 'Cita actualizada correctamente');
    } catch (error) {
      Alert.alert('Error', 'No se pudo actualizar la cita');
      console.error('Error updating appointment:', error);
    }
  };

  const handleDeleteAppointment = async () => {
    try {
      await deleteMedicalAppointment(selectedAppointment.id, userToken);
      const updatedAppointments = await getMedicalAppointments(userToken);
      setAppointments(updatedAppointments);
      setModalVisible(false);
      Alert.alert('Éxito', 'Cita eliminada correctamente');
    } catch (error) {
      Alert.alert('Error', 'No se pudo eliminar la cita');
      console.error('Error deleting appointment:', error);
    }
  };



  return (
     <View style={{ flex: 1 }}>
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Citas médicas</Text>

      {/* Sección de Selección de Especialidad */}
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

          {/* Sección de Fecha y Hora */}
          <TouchableOpacity style={styles.dateButton} onPress={() => setShowDatePicker(true)}>
            <Text style={styles.dateButtonText}>Seleccionar fecha</Text>
          </TouchableOpacity>
          
         {displayDate && (
            <Text style={styles.selectedInfo}>Fecha seleccionada: {formatDisplayDate(displayDate)}</Text>
          )}

          <TouchableOpacity style={styles.dateButton} onPress={() => setShowTimePicker(true)}>
            <Text style={styles.dateButtonText}>Seleccionar hora</Text>
          </TouchableOpacity>
          
          {displayTime ? (
            <Text style={styles.selectedInfo}>Hora seleccionada: {displayTime}</Text>
          ) : null}

          {showDatePicker && (
            <DateTimePicker
              value={date}
              mode="date"
              display="default"
              onChange={handleDateChange}
            />
          )}

          {showTimePicker && (
            <DateTimePicker
              value={date}
              mode="time"
              display="default"
              onChange={handleTimeChange}
            />
          )}
          
 

         <Text style={styles.selectedInfo}>
            Fecha:  {formatDateToSpanish(date)} {'\n'}
            Hora: {date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </Text>


          <TouchableOpacity style={styles.confirmButton} onPress={handleConfirm}>
            <Text style={styles.confirmButtonText}>Guardar cita</Text>
          </TouchableOpacity>
        </>
      )}

    
        {/* Sección de Citas Registradas */}
      <View style={styles.appointmentsList}>
        <Text style={styles.appointmentsTitle}>Tus citas registradas</Text>
        {appointments.length > 0 ? (
          appointments.map((appointment) => (
            <TouchableOpacity 
              key={appointment.id} 
              style={styles.appointmentCard}
              onPress={() => openEditModal(appointment)}
            >
              <Text style={styles.appointmentText}>
                <Text style={{ fontWeight: 'bold' }}>Especialidad:</Text> {appointment.specialty}
              </Text>
              <Text style={styles.appointmentText}>
                <Text style={{ fontWeight: 'bold' }}>Fecha:</Text> {formatDisplayDate(appointment.appointment_date)}
              </Text>
              <Text style={styles.appointmentText}>
                <Text style={{ fontWeight: 'bold' }}>Hora:</Text> {appointment.appointment_time}
              </Text>
            </TouchableOpacity>
          ))
        ) : (
          <Text style={styles.noAppointmentsText}>No tienes citas registradas</Text>
        )}
      </View>
 </ScrollView>
      {/* Modal de Edición/Eliminación */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Editar Cita Médica</Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Ionicons name="close" size={24} color="#3B49B4" />
              </TouchableOpacity>
            </View>

            <View style={styles.modalBody}>
              <Text style={styles.modalLabel}>Especialidad:</Text>
              <View style={styles.modalSpecialtiesContainer}>
                {specialties.map((specialty, index) => (
                  <TouchableOpacity
                    key={index}
                    style={[
                      styles.modalSpecialtyButton,
                      editSpecialty === specialty && styles.modalSpecialtyButtonSelected
                    ]}
                    onPress={() => setEditSpecialty(specialty)}
                  >
                    <Text style={styles.modalSpecialtyText}>{specialty}</Text>
                  </TouchableOpacity>
                ))}
              </View>

              <Text style={styles.modalLabel}>Fecha:</Text>
              <TouchableOpacity 
                style={styles.modalInput}
                onPress={() => {
                  setShowDatePicker(true);
                  setEditMode(true);
                }}
              >
                <Text>{formatDisplayDate(editDate)}</Text>
              </TouchableOpacity>

              <Text style={styles.modalLabel}>Hora:</Text>
              <TouchableOpacity 
                style={styles.modalInput}
                onPress={() => {
                  setShowTimePicker(true);
                  setEditMode(true);
                }}
              >
                <Text>{editTime}</Text>
              </TouchableOpacity>

              {showDatePicker && editMode && (
                <DateTimePicker
                  value={new Date(editDate)}
                  mode="date"
                  display="default"
                  onChange={(event, selectedDate) => {
                    setShowDatePicker(false);
                    if (selectedDate) {
                      setEditDate(selectedDate.toISOString().split('T')[0]);
                    }
                  }}
                />
              )}

              {showTimePicker && editMode && (
                <DateTimePicker
                  value={new Date(`1970-01-01T${editTime}`)}
                  mode="time"
                  display="default"
                  onChange={(event, selectedTime) => {
                    setShowTimePicker(false);
                    if (selectedTime) {
                      setEditTime(selectedTime.toTimeString().substring(0, 5));
                    }
                  }}
                />
              )}
            </View>

            <View style={styles.modalFooter}>
              <TouchableOpacity 
                style={[styles.modalButton, styles.deleteButton]}
                onPress={handleDeleteAppointment}
              >
                <Text style={[styles.modalButtonText, {color: '#101432'}]}>Eliminar</Text>
              </TouchableOpacity>

       <TouchableOpacity 
    style={[styles.modalButton, styles.cancelButton]}
    onPress={() => setModalVisible(false)}
  >
 <Text style={[styles.modalButtonText, {color: '#101432'}]}>Cancelar</Text>
  </TouchableOpacity>

              <TouchableOpacity 
                style={[styles.modalButton, styles.saveButton]}
                onPress={handleUpdateAppointment}
              >
                <Text style={styles.modalButtonText}>Guardar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
        </View>
  );
};


// Manteniendo EXACTAMENTE los mismos estilos que ya tenías
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

// Nuevos estilos para el modal
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: '90%',
    backgroundColor: 'white',
    borderRadius: 10,
    overflow: 'hidden',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#E3E3E3',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#101432',
  },
  modalBody: {
    padding: 15,
  },
  modalLabel: {
    fontSize: 16,
    color: '#5A5555',
    marginBottom: 8,
  },
  modalInput: {
    borderWidth: 1,
    borderColor: '#E3E3E3',
    borderRadius: 8,
    padding: 12,
    marginBottom: 15,
  },
  modalSpecialtiesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 15,
  },
  modalSpecialtyButton: {
    backgroundColor: '#E3E3E3',
    padding: 10,
    borderRadius: 8,
    margin: 5,
  },
  modalSpecialtyButtonSelected: {
    backgroundColor: '#3B49B4',
  },
  modalSpecialtyText: {
    color: '#101432',
    fontSize: 14,
  },
  modalFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 15,
    borderTopWidth: 1,
    borderTopColor: '#E3E3E3',
  },
  modalButton: {
    padding: 12,
    borderRadius: 8,
    width: '30%',
    alignItems: 'center',
  },
  deleteButton: {
     backgroundColor: '#F8F9FA',
         borderWidth: 1,
        borderColor: '#D64550',
        padding: 15,
        borderRadius: 5,
        flex: 1,
        marginRight: 10,
        alignItems: 'center',
  },

  
  cancelButton: {
    backgroundColor: '#E3E3E3',
        padding: 15,
        borderRadius: 5,
        flex: 1,
        marginRight: 10,
        alignItems: 'center',
},
  saveButton: {
     backgroundColor: '#3B49B4',
        padding: 15,
        borderRadius: 5,
        flex: 1,
        alignItems: 'center',
  },
  modalButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },



});

export default MedicalAppointmentsSelectionPage;
