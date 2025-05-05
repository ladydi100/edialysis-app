import React, { useState, useEffect, useContext } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ActivityIndicator,  Alert} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { AuthContext } from '../context/AuthContext';
import { getMedicalAppointments,  deleteMedicalAppointment, updateMedicalAppointment  } from '../services/medicalAppointmentService';
import { useIsFocused } from '@react-navigation/native';
import DateTimePicker from '@react-native-community/datetimepicker';


const MedicalAppointments = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [appointments, setAppointments] = useState([]);
  const [filteredAppointments, setFilteredAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const { userToken } = useContext(AuthContext);
  const isFocused = useIsFocused(); 
  

    // Estados para el modal y datepicker
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [newDate, setNewDate] = useState(new Date());
  const [isUpdating, setIsUpdating] = useState(false);
 
      const fetchAppointments = async () => {
    try {
      setLoading(true);
      const appointmentsData = await getMedicalAppointments(userToken);
      setAppointments(appointmentsData);
      
      // Filtrar citas desde hoy en adelante
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      const futureAppointments = appointmentsData.filter(appointment => {
        const appointmentDate = new Date(appointment.appointment_date);
        return appointmentDate >= today;
      }).sort((a, b) => new Date(a.appointment_date) - new Date(b.appointment_date));
      
      setFilteredAppointments(futureAppointments);
      setCurrentIndex(0); // Resetear el índice al cargar nuevas citas
    } catch (error) {
      console.error('Error fetching appointments:', error);
      Alert.alert('Error', 'No se pudieron cargar las citas médicas');
    } finally {
      setLoading(false);
    }
  };


  useEffect(() => {
    if (isFocused) {
      fetchAppointments();
    }
  }, [userToken, isFocused]);



   const nextAppointment = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % filteredAppointments.length);
  };

  const prevAppointment = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + filteredAppointments.length) % filteredAppointments.length);
  };

 const handleDeleteAppointment = async () => {
    if (filteredAppointments.length === 0) return;
    
    const currentAppointment = filteredAppointments[currentIndex];
    
    Alert.alert(
      'Anular Cita',
      `¿Estás seguro que deseas anular la cita de ${currentAppointment.specialty}?`,
      [
        {
          text: 'Cancelar',
          style: 'cancel',
        },
        {
          text: 'Anular',
          onPress: async () => {
            try {
              await deleteMedicalAppointment(currentAppointment.id, userToken);
              Alert.alert('Éxito', 'La cita ha sido anulada correctamente');
              fetchAppointments(); 
            } catch (error) {
              console.error('Error deleting appointment:', error);
              Alert.alert('Error', 'No se pudo anular la cita');
            }
          },
        },
      ],
      { cancelable: false }
    );
  };

   const handleChangeDate = () => {
    if (filteredAppointments.length === 0) return;
    const currentAppointment = filteredAppointments[currentIndex];
    setNewDate(new Date(currentAppointment.appointment_date));
    setShowDatePicker(true);
  };

  const handleDateChange = async (event, selectedDate) => {
    setShowDatePicker(false);
    
    if (selectedDate) {
      const currentAppointment = filteredAppointments[currentIndex];
      const formattedDate = selectedDate.toISOString().split('T')[0];
      
      try {
        setIsUpdating(true);
        await updateMedicalAppointment({
          id: currentAppointment.id,
          specialty: currentAppointment.specialty,
          appointment_date: formattedDate,
          appointment_time: currentAppointment.appointment_time
        }, userToken);
        
        Alert.alert('Éxito', 'Fecha de la cita actualizada correctamente');
        fetchAppointments();
      } catch (error) {
        console.error('Error updating appointment:', error);
        Alert.alert('Error', 'No se pudo actualizar la fecha de la cita');
      } finally {
        setIsUpdating(false);
      }
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const options = { 
      weekday: 'long', 
      day: 'numeric', 
      month: 'long',
      timeZone: 'UTC' 
    };

 const formattedDate = date.toLocaleDateString('es-ES', options);
    return formattedDate.charAt(0).toUpperCase() + formattedDate.slice(1);
  };

    if (loading || isUpdating) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#3B49B4" />
      </View>
    );
  }

   if (filteredAppointments.length === 0) {
    return (
      <View style={styles.appointmentContainer}>
        <Text style={styles.sectionTitle}>Citas médicas</Text>
        <View style={styles.appointmentCard}>
          <Text style={styles.noAppointmentsText}>No tienes citas médicas programadas</Text>
        </View>
      </View>
    );
  }

 return (
    <View style={styles.appointmentContainer}>
      <Text style={styles.sectionTitle}>Citas médicas</Text>
      <View style={styles.appointmentCard}>
        <View style={styles.appointmentHeader}>
          <Ionicons name="calendar-outline" size={20} color="#3E3E3E" />
          <Text style={styles.appointmentTitle}>Próximas citas</Text>
        </View>
        <Text style={styles.department}>
          <Text style={styles.boldText}>{filteredAppointments[currentIndex].specialty}</Text>
        </Text>

        <View style={styles.navigationContainer}>
          <TouchableOpacity onPress={prevAppointment} style={styles.arrowButton}>
            <Ionicons name="chevron-back-outline" size={24} color="#3E3E3E" />
          </TouchableOpacity>

          <View style={styles.dateBox}>
            <Text style={styles.dateText}>{formatDate(filteredAppointments[currentIndex].appointment_date)}</Text>
            <View style={styles.timeContainer}>
              <Ionicons name="time-outline" size={16} color="#3E3E3E" />
              <Text style={styles.timeText}>{filteredAppointments[currentIndex].appointment_time}</Text>
            </View>
          </View>

          <TouchableOpacity onPress={nextAppointment} style={styles.arrowButton}>
            <Ionicons name="chevron-forward-outline" size={24} color="#3E3E3E" />
          </TouchableOpacity>
        </View>

        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.changeButton} 
            onPress={handleChangeDate}
            disabled={isUpdating}>
            <Text style={styles.changeText}>Cambiar fecha</Text>
          </TouchableOpacity>


          <TouchableOpacity style={styles.confirmButton} onPress={handleDeleteAppointment}>
            <Text style={styles.confirmText}>Anular Cita</Text>
          </TouchableOpacity>
        </View>
      </View>


       {showDatePicker && (
        <DateTimePicker
          value={newDate}
          mode="date"
          display="default"
          minimumDate={new Date()} // Solo permite fechas futuras
          onChange={handleDateChange}
        />
      )}
    </View>
  );
};


const styles = StyleSheet.create({
  appointmentContainer: { 
    marginTop: 32 
  },
  appointmentCard: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3
  },
  appointmentHeader: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    marginBottom: 5 
  },
  sectionTitle: { 
    fontSize: 20, 
    color: '#3E3E3E', 
    fontWeight: '600', 
    marginBottom: 12 
  },
  appointmentTitle: { 
    fontSize: 18, 
    fontWeight: 'bold', 
    marginLeft: 8, 
    color: '#3E3E3E' 
  },
  department: { 
    color: '#6D6D6D', 
    marginBottom: 10 
  },
  boldText: { 
    fontWeight: '600', 
    color: '#3E3E3E' 
  },
  navigationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12
  },
  arrowButton: {
    padding: 10
  },
  dateBox: {
    backgroundColor: '#E3F2FD',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 180,
  },
  dateText: {
    fontSize: 16,
    color: '#3E3E3E',
    fontWeight: '600',
  },
  timeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 5
  },
  timeText: {
    fontSize: 16,
    color: '#3E3E3E',
    marginLeft: 5
  },
  buttonContainer: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    marginTop: 12 
  },
  changeButton: {
    borderWidth: 1,
    borderColor: '#3E3EEC',
    padding: 12,
    borderRadius: 8,
    flex: 1,
    marginRight: 8,
    alignItems: 'center'
  },
  changeText: { 
    fontSize: 16, 
    color: '#3E3EEC', 
    fontWeight: '500' 
  },
  confirmButton: {
    backgroundColor: '#3E3EEC',
    padding: 12,
    borderRadius: 8,
    flex: 1,
    marginLeft: 8,
    alignItems: 'center'
  },
  confirmText: { 
    fontSize: 16, 
    color: '#FFFFFF', 
    fontWeight: '500' 
  }
});

export default MedicalAppointments;