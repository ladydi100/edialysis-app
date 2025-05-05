import React, { useState, useEffect, useContext,  useLayoutEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView , Alert,} from 'react-native';
import { useIsFocused , useNavigation } from '@react-navigation/native';
import { AuthContext } from '../context/AuthContext';
import { getMedicationsByDate, updateMedicationTakenStatus } from '../services/medicationService';
import WeeklyCalendar from '../components/WeeklyCalendar';
import { Ionicons } from '@expo/vector-icons';
import Svg, { Circle, G } from 'react-native-svg';
import MedicationDetailModal from '../components/MedicationDetailModal';
import { updateMedication } from '../services/medicationService';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { scheduleMedicationNotifications } from '../services/notificationService';
import * as Notifications from 'expo-notifications';


const MedicationPage = ({ navigation }) => {
  const [selectedDate, setSelectedDate] = useState(new Date()); 
  const [medications, setMedications] = useState([]);
  const [hasUserSelectedDate, setHasUserSelectedDate] = useState(false); 
    const [modalVisible, setModalVisible] = useState(false);
  const { userToken } = useContext(AuthContext);
  const isFocused = useIsFocused(); 
 const [selectedMedication, setSelectedMedication] = useState({
  taken: false,
  alarmEnabled: false,
});


  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: 'Medicación',
      headerLeft: () => (
        <TouchableOpacity 
          onPress={() => navigation.navigate('Home')}
          style={{ marginLeft: 15 }}
        >
          <Ionicons name="arrow-back" size={26} color="#3B49B4" />
        </TouchableOpacity>
      ),
    });
  }, [navigation]);

  useEffect(() => {
    if (isFocused && !hasUserSelectedDate) {
      setSelectedDate(new Date()); 
    }
  }, [isFocused, hasUserSelectedDate]);

  useEffect(() => {
if (isFocused) {
    console.log('📥 useEffect ejecutado - intentando obtener medicaciones');
      fetchMedications(selectedDate); // Vuelve a cargar los datos
    }
  }, [isFocused, selectedDate]);


  


const fetchMedications = async (date) => {
    let isCancelled = false;
     console.log('🧪 Ejecutando fetchMedications con fecha:', date);
  try {
    // Ajuste de zona horaria para asegurar el día correcto
    const localDate = new Date(date.getFullYear(), date.getMonth(), date.getDate()); // Solo año/mes/día
    const formattedDate = localDate.toISOString().split('T')[0];
    
    console.log(`Buscando medicamentos para ${formattedDate}`);
    
    const meds = await getMedicationsByDate(formattedDate, userToken);
    console.log('Medicamentos recibidos:', meds);


     const medicationsWithTaken = meds.map(med => ({
      ...med,
      time: new Date(`1970-01-01T${med.time}`).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      taken: med.taken || false,  
      alarmEnabled: Boolean(med.alarm_enabled),
    }));

    
    if (!isCancelled) {
   
    setMedications(medicationsWithTaken);
    }

    
     const today = new Date();
    const todayFormatted = today.toISOString().split('T')[0];
    if (formattedDate === todayFormatted) {
      await scheduleMedicationNotifications(localDate);
    }

  } catch (error) {
     if (!isCancelled) {
      console.error('Error fetching medications:', error);
    }

  }
   return () => {
    isCancelled = true;
  };
};


const handleUpdateAlarmStatus = (time_id, newAlarmStatus) => {
  setMedications(prevMeds =>
    prevMeds.map(med =>
      med.time_id === time_id ? { ...med, alarmEnabled: newAlarmStatus } : med
    )
  );
};



  const handleDateSelect = (date) => {
    setSelectedDate(date);
    setHasUserSelectedDate(true); 
  };

  
  const formatDate = (date) => {
    const dayOfWeek = date.toLocaleString('es-ES', { weekday: 'long' });
    const day = date.getDate();
    const month = date.toLocaleString('es-ES', { month: 'long' });
    return `${dayOfWeek.charAt(0).toUpperCase() + dayOfWeek.slice(1)} ${day} ${month}`;
  };



const toggleMedication = async (time_id) => {
  try {
    const medication = medications.find((med) => med.time_id === time_id);
    if (!medication) return;

    const newTakenStatus = !medication.taken;
    
   
    const year = selectedDate.getFullYear();
    const month = String(selectedDate.getMonth() + 1).padStart(2, '0');
    const day = String(selectedDate.getDate()).padStart(2, '0');
    const formattedDate = `${year}-${month}-${day}`;
    
    console.log("Fecha enviada al backend:", formattedDate); // Para verificación

    await updateMedicationTakenStatus(time_id, formattedDate, newTakenStatus, userToken);

    setMedications(prevMeds =>
      prevMeds.map(med =>
        med.time_id === time_id ? { ...med, taken: newTakenStatus } : med
      )
    );
  } catch (error) {
    console.error('Error toggling medication status:', error);
  }
};


const handleToggleTaken = async (time_id, newTakenStatus) => {
  try {
    const medication = medications.find((med) => med.time_id === time_id);
    if (!medication) return;

    const newTakenStatus = !medication.taken;
    
    // Formatear la fecha correctamente
    const year = selectedDate.getFullYear();
    const month = String(selectedDate.getMonth() + 1).padStart(2, '0');
    const day = String(selectedDate.getDate()).padStart(2, '0');
    const formattedDate = `${year}-${month}-${day}`;
    
    console.log("Actualizando estado taken:", {
      time_id,
      date: formattedDate,
      taken: newTakenStatus
    });

    // Llamar al servicio para actualizar en la base de datos
    await updateMedicationTakenStatus(time_id, formattedDate, newTakenStatus, userToken);

    // Actualizar el estado local
    setMedications(prevMeds =>
      prevMeds.map(med =>
        med.time_id === time_id ? { ...med, taken: newTakenStatus } : med
      )
    );
  } catch (error) {
    console.error('Error al cambiar estado taken:', error);
    // Mostrar alerta al usuario si falla
    Alert.alert('Error', 'No se pudo actualizar el estado del medicamento');
  }
};





 const calculatePercentageTaken = () => {
    const totalMedications = medications.length;
    if (totalMedications === 0) return 0;

    const takenMedications = medications.filter((med) => med.taken).length;
    return (takenMedications / totalMedications) * 100;
  };

  const percentageTaken = isNaN(calculatePercentageTaken()) ? 0 : calculatePercentageTaken();

const radius = 40; // Radio del círculo
  const strokeWidth = 10; // Grosor del borde
  const circumference = 2 * Math.PI * radius; // Circunferencia del círculo
  const progress = isNaN(percentageTaken) ? 0 : (percentageTaken / 100) * circumference;// Longitud del progreso

  // Cantidad de medicamentos tomados
  const takenMedications = medications.filter((med) => med.taken).length;
  const totalMedications = medications.length;

const handleMedicationPress = (medication) => {

  console.log("Medicamento seleccionado-----:", medication);
  setSelectedMedication(medication || { 
    taken: false,
    alarmEnabled: Boolean(medication.alarm_enabled),
    // valores por defecto
  });
  setModalVisible(true);
};

  const handleToggleAlarm = () => {
    // Implementar lógica para cambiar el estado de la alarma
    setSelectedMedication(prev => ({
      ...prev,
      alarmEnabled: !prev.alarmEnabled
    }));
  };

 const handleEdit = async (editedData) => {
  try {
    await updateMedication(selectedMedication.time_id, editedData);
    setMedications(prevMeds => 
      prevMeds.map(med => 
        med.time_id === selectedMedication.time_id ? { ...med, ...editedData } : med
      )
    );
      // Actualiza también el medicamento seleccionado
    setSelectedMedication(prev => ({ ...prev, ...editedData }));
    Alert.alert('Éxito', 'Cambios guardados correctamente');
  } catch (error) {
    Alert.alert('Error', 'No se pudieron guardar los cambios');
  }
};


const handleDelete = async () => {
  console.log('Iniciando eliminación...'); 
  console.log('ID a eliminar:', selectedMedication.time_id); 
  
  try {
    const response = await softDeleteMedication(
      selectedMedication.time_id, 
      userToken
    );
    
    console.log('Respuesta del backend:', response); 

    if (response?.success) {
      // Recarga forzada
      const currentDate = new Date(selectedDate);
      await fetchMedications(currentDate);
      
      setModalVisible(false);
      Alert.alert('Éxito', 'Medicamento desactivado correctamente');
    } else {
      Alert.alert('Error', response?.error || 'Error desconocido');
    }
  } catch (error) {
    console.error('Error completo en frontend:', {
      message: error.message,
      response: error.response?.data
    }); // Debug frontend 4
    
    Alert.alert('Error', 
      error.response?.data?.error || 
      error.message || 
      'Error al contactar al servidor'
    );
  }
};




const refreshMedications = async () => {
  try {
    const token = await AsyncStorage.getItem('userToken');
    const formattedDate = selectedDate.toISOString().split('T')[0];
    const meds = await getMedicationsByDate(formattedDate, token);
    setMedications(meds);
  } catch (error) {
    console.error('Error refreshing medications:', error);
  }




};




 return (
    <View style={styles.container}>
      <WeeklyCalendar onDateSelect={handleDateSelect} selectedDate={selectedDate} />

    {/* Fecha formateada: "Lunes 25 enero" */}
      <Text style={styles.dateText}>{formatDate(selectedDate)}</Text>



         {/* Contenedor para el círculo de progreso y la cantidad de medicamentos */}
      <View style={styles.progressContainer}>
        {/* Círculo de progreso */}
        <View style={styles.circleContainer}>
          <Svg width="100" height="100">
            <G rotation="-90" origin="50, 50">
              {/* Círculo de fondo (azul claro) */}
              <Circle
                cx="50"
                cy="50"
                r={radius}
                stroke="#E3E7FF" // Azul claro
                strokeWidth={strokeWidth}
                fill="transparent"
              />
              {/* Círculo de progreso (azul oscuro) */}
              <Circle
                cx="50"
                cy="50"
                r={radius}
                stroke="#3B49B4" // Azul oscuro
                strokeWidth={strokeWidth}
                fill="transparent"
                strokeDasharray={circumference}
                strokeDashoffset={circumference - progress} // Controla el progreso
                strokeLinecap="round" 
              />
            </G>
          </Svg>
          <Text style={styles.percentageText}>{percentageTaken.toFixed(0)}%</Text>
        </View>

        {/* Cantidad de medicamentos tomados */}
        <View style={styles.medicationCountContainer}>
          <Text style={styles.medicationCountText}>
            {takenMedications} de {totalMedications} medicamentos
          </Text>
        </View>
      </View>

   {/* Encabezado: "Medicación" y "+ Añadir Nuevo" */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Medicación</Text>
       
      </View>

      <View style={styles.header2}>
       <TouchableOpacity 
  style={styles.addButton}
  onPress={() => navigation.navigate('Medicación', { screen: 'AddMedication' })}
>
          <Text style={styles.addButton}>+ Añadir nuevo</Text>
        </TouchableOpacity>
      </View>


       <ScrollView style={styles.medicationList}>
        {medications.map((med) => (
          <TouchableOpacity
            key={med.time_id}
            style={styles.medicationItem}
            onPress={() => handleMedicationPress(med)}
          >
            <View style={styles.medicationHeader}>
              <View style={styles.timeContainer}>
                <View style={[styles.dot, { backgroundColor: med.color }]} />
                <Text style={styles.medicationTime}>{med.time}</Text>
              </View>
              <TouchableOpacity onPress={() => toggleMedication(med.time_id)}>
                <Ionicons
                name={med.taken ? 'checkbox' : 'checkbox-outline'}
                size={24}
                color={med.taken ? '#3B49B4' : '#6B7280'}
               />
              </TouchableOpacity>
            </View>
            <Text style={styles.medicationName}>{med.name}</Text>
            <Text style={styles.medicationDosage}>{med.dosage}</Text>
            <Text style={styles.medicationNotes}>{med.notes}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>






         <MedicationDetailModal
         key={selectedMedication?.time_id || 'modal'}
        visible={modalVisible}
        medication={selectedMedication}
        onClose={() => setModalVisible(false)}
        onToggleAlarm={handleToggleAlarm}
         onEdit={handleEdit}
        
        selectedDate={selectedDate}
        onToggleTaken={handleToggleTaken}
      refreshMedications={refreshMedications}
       onUpdateAlarmStatus={handleUpdateAlarmStatus}
      />
    
    </View>
  );
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAFAFA',
    paddingHorizontal: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 15,
    marginBottom: 1,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#101432',
  },
  addButton: {
    fontSize: 16,
    color: '#3B49B4',
    textAlign: 'right'
  },
  dateText: {
    fontSize: 16,
    color: '#6B7280',
    marginBottom: 20,
  },
 progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  circleContainer: {
    position: 'relative',
    width: 80,
    height: 80,
    justifyContent: 'center',
    alignItems: 'center',
  },
  percentageText: {
    position: 'absolute',
    fontSize: 18,
    fontWeight: 'bold',
    color: '#3B49B4',
  },
  medicationCountContainer: {
    flex: 1,
    marginLeft: 10,
  },
  medicationCountText: {
    fontSize: 16,
    color: '#6B7280',
  },



  medicationList: {
    marginTop: 20,
  },
  medicationItem: {
        backgroundColor: '#FFFFFF',
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
 medicationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
    timeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    alignItems: 'center',
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
    fontSize: 14,
    color: '#6B7280',
  },
  medicationName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#101432',
  },
  medicationDosage: {
    fontSize: 14,
    color: '#6B7280',
  },
  medicationNotes: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 5,
  },
  checkbox: {
    fontSize: 18,
    color: '#3B49B4',
  },
});


export default MedicationPage;