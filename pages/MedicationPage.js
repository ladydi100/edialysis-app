import React, { useState, useEffect, useContext } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useIsFocused } from '@react-navigation/native';
import { AuthContext } from '../context/AuthContext';
import { getMedicationsByDate, updateMedicationTakenStatus } from '../services/medicationService';
import WeeklyCalendar from '../components/WeeklyCalendar';
import { Ionicons } from '@expo/vector-icons';
import Svg, { Circle, G } from 'react-native-svg';


const MedicationPage = ({ navigation }) => {
  const [selectedDate, setSelectedDate] = useState(new Date()); 
  const [medications, setMedications] = useState([]);
  const [hasUserSelectedDate, setHasUserSelectedDate] = useState(false); 
  const { userToken } = useContext(AuthContext);
  const isFocused = useIsFocused(); 

  useEffect(() => {
    if (isFocused && !hasUserSelectedDate) {
      setSelectedDate(new Date()); 
    }
  }, [isFocused, hasUserSelectedDate]);

  useEffect(() => {
    fetchMedications(selectedDate);
  }, [selectedDate]);

  const fetchMedications = async (date) => {
  try {
    // Formatea la fecha manualmente en el formato YYYY-MM-DD
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Los meses van de 0 a 11
    const day = String(date.getDate()).padStart(2, '0');
    const formattedDate = `${year}-${month}-${day}`;

   // console.log('Fecha enviada a la API:', formattedDate); // Verifica la fecha en la consola

    const meds = await getMedicationsByDate(formattedDate, userToken);

   const medicationsWithTaken = meds.map((med) => ({
        ...med,
        taken: med.taken || false,
      }));

 setMedications(medicationsWithTaken);

    //setMedications(meds);
  } catch (error) {
    console.error('Error fetching medications:', error);
  }
};

  const handleDateSelect = (date) => {
    setSelectedDate(date);
    setHasUserSelectedDate(true); 
  };

  // Función para formatear la fecha como "Lunes 25 enero"
  const formatDate = (date) => {
    const dayOfWeek = date.toLocaleString('es-ES', { weekday: 'long' });
    const day = date.getDate();
    const month = date.toLocaleString('es-ES', { month: 'long' });
    return `${dayOfWeek} ${day} ${month}`;
  };



const toggleMedication = async(time_id) => {
  //console.log('Toggle medication time_id:', time_id); // Verifica el time_id
  try {
    const medication = medications.find((med) => med.time_id === time_id);
    if (!medication) {
      console.error('Medication not found');
      return;
    }
 
     // Invierte el estado `taken`
    const newTakenStatus = !medication.taken;

    // Llama al servicio para actualizar el estado en la base de datos
    await updateMedicationTakenStatus(time_id, newTakenStatus, userToken);
  
  setMedications((prevMeds) =>
    prevMeds.map((med) => 
    //  console.log('Medication:', med); // Verifica la estructura de cada medicamento
      med.time_id === time_id ? { ...med, taken: newTakenStatus } : med
    )
  );
  } catch (error) {
    console.error('Error toggling medication status:', error);
  }
};


 const calculatePercentageTaken = () => {
    const totalMedications = medications.length;
    if (totalMedications === 0) return 0;

    const takenMedications = medications.filter((med) => med.taken).length;
    return (takenMedications / totalMedications) * 100;
  };

  const percentageTaken = calculatePercentageTaken();

const radius = 40; // Radio del círculo
  const strokeWidth = 10; // Grosor del borde
  const circumference = 2 * Math.PI * radius; // Circunferencia del círculo
  const progress = (percentageTaken / 100) * circumference; // Longitud del progreso

  // Cantidad de medicamentos tomados
  const takenMedications = medications.filter((med) => med.taken).length;
  const totalMedications = medications.length;

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
                strokeLinecap="round" // Bordes redondeados
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
        <TouchableOpacity onPress={() => navigation.navigate('AddMedication')}>
          <Text style={styles.addButton}>+ Añadir nuevo</Text>
        </TouchableOpacity>
      </View>


       <ScrollView style={styles.medicationList}>
        {medications.map((med) => (
          <TouchableOpacity
            key={med.time_id}
            style={styles.medicationItem}
            onPress={() => navigation.navigate('MedicationDetail', { medication: med })}
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