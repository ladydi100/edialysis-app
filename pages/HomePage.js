import React, { useState, useContext, useCallback, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image, ActivityIndicator, RefreshControl } from 'react-native';
import { MaterialIcons, Ionicons } from '@expo/vector-icons';
import { AuthContext } from '../context/AuthContext';
import { useFocusEffect, useIsFocused  } from '@react-navigation/native';
import axios from 'axios';
import API_URL from '../config/config';
import AsyncStorage from '@react-native-async-storage/async-storage';
import MedicalAppointments from './MedicalAppointments'; // Asegúrate de que la ruta sea correcta
import { getMedicationsByDate } from '../services/medicationService';
import { updateMedicationTakenStatus } from '../services/medicationService';

 

const HomePage = ({ navigation }) => {
    const { userData, userToken } = useContext(AuthContext);
    const [meds, setMeds] = useState([]);
    const [loadingMeds, setLoadingMeds] = useState(true);
    const isFocused = useIsFocused();
    const [healthData, setHealthData] = useState({
    heartRate: null,
    bloodPressure: null,
    weight: null,
    glucose: '110'
  });

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
 
// Función para formatear la fecha como "Lunes 25 enero"
 const formatDate = (date) => {
    const dayOfWeek = date.toLocaleString('es-ES', { weekday: 'long' });
    const day = date.getDate();
    const month = date.toLocaleString('es-ES', { month: 'long' });
    return `${dayOfWeek.charAt(0).toUpperCase() + dayOfWeek.slice(1)} ${day} ${month}`;
  };




  const fetchHealthData = async () => {
    const token = await AsyncStorage.getItem('userToken');
    
    try {
      const heartRateResponse = await axios.get(`${API_URL}/heart-rate/latest`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      const bloodPressureResponse = await axios.get(`${API_URL}/blood-pressure/latest`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      const weightResponse = await axios.get(`${API_URL}/weight/latest`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setHealthData({
        heartRate: heartRateResponse.data?.heart_rate || null,
        bloodPressure: bloodPressureResponse.data || null,
        weight: weightResponse.data?.weight || null,
        glucose: '110'
      });
    } catch (error) {
      console.error('Error fetching health data:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

 // Función para obtener medicamentos del día actual
  const fetchTodayMedications = async () => {
    try {
      const today = new Date();
      const adjustedDate = new Date(today);
      adjustedDate.setMinutes(adjustedDate.getMinutes() - adjustedDate.getTimezoneOffset());
      const formattedDate = adjustedDate.toISOString().split('T')[0];
      
      const medications = await getMedicationsByDate(formattedDate, userToken);
      
      const formattedMeds = medications.map(med => ({
        ...med,
        time: new Date(`1970-01-01T${med.time}`).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        taken: med.taken || false
      })).sort((a, b) => a.time.localeCompare(b.time));
      
      setMeds(formattedMeds);
    } catch (error) {
      console.error('Error fetching medications:', error);
    } finally {
      setLoading(false);
    }
  };



useFocusEffect(
    useCallback(() => {
      fetchTodayMedications();
    }, [isFocused])
  );




    const toggleMedication = async (time_id) => {
    try {
      const today = new Date();
      const formattedDate = today.toISOString().split('T')[0];
      
      const medication = meds.find(med => med.time_id === time_id);
      const newTakenStatus = !medication.taken;
      
      await updateMedicationTakenStatus(time_id, formattedDate, newTakenStatus, userToken);
      
      setMeds(prev => prev.map(med => 
        med.time_id === time_id ? { ...med, taken: newTakenStatus } : med
      ));
    } catch (error) {
      console.error('Error toggling medication:', error);
    }
  };



    // Cargar datos al enfocar
  useEffect(() => {
    if (isFocused) {
      setLoading(true);
      fetchHealthData();
      fetchTodayMedications();
    }
  }, [isFocused]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchHealthData();
  }, []);



  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#3B49B4" />
      </View>
    );
  }

  return (
    <ScrollView 
      style={styles.container}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
          colors={['#3B49B4']}
          tintColor="#3B49B4"
        />
      }
    >
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Hola, <Text style={styles.userName}>¡{userData?.name || 'Usuario'}!</Text></Text>
        </View>
        <Image source={require('../assets/Juan.png')} style={styles.avatar} />
      </View>

      <Text style={styles.sectionTitle}>Valores de salud</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.healthValuesContainer}>
        <View style={[styles.healthCard, styles.cardBlue]}>
          <Text style={styles.healthTitle}>Frecuencia cardíaca</Text>
          <Text style={styles.healthValue}>
            {healthData.heartRate ? `${healthData.heartRate} bpm` : '--'}
          </Text>
        </View>
        <View style={[styles.healthCard, styles.cardTeal]}>
          <Text style={styles.healthTitle}>Presión arterial</Text>
          <Text style={styles.healthValue}>
            {healthData.bloodPressure ? 
              `${healthData.bloodPressure.systolic}/${healthData.bloodPressure.diastolic} mmHg` : 
              '--/--'}
          </Text>
        </View>
        <View style={[styles.healthCard, styles.cardRed]}>
          <Text style={styles.healthTitle}>Peso</Text>
          <Text style={styles.healthValue}>
            {healthData.weight ? `${healthData.weight} kg` : '--'}
          </Text>
        </View>
     
      </ScrollView>

      <TouchableOpacity style={styles.addButton} onPress={() => navigation.navigate('Salud', { 
  screen: 'SelectValues' 
})}>
        <Ionicons name="add-outline" size={18} color="#3E3EEC" style={styles.addIcon} />
        <Text style={styles.addButtonText}>Añadir nuevo</Text>
      </TouchableOpacity>

      <Text style={[styles.sectionTitle, { marginTop: 32 }]}>Tu medicación</Text>
      <Text style={styles.subText}>{formatDate(new Date())}</Text>
      
      
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.medicationContainer}>
        {meds.map((med) => (
          <TouchableOpacity
            key={med.time_id}
            style={[styles.medCard, med.taken && styles.medCardTaken]}
            onPress={() => toggleMedication(med.time_id)}
          >
            <View style={styles.medContent}>
              <View style={[styles.medCircle, { backgroundColor: med.color }]} />
              <View>
                <Text style={styles.medTime}>{med.time}</Text>
                <Text style={styles.medName}>{med.name}</Text>
              </View>
            </View>
            <MaterialIcons 
              name={med.taken ? 'check-box' : 'check-box-outline-blank'} 
              size={24} 
              color={med.taken ? 'green' : 'black'} 
              style={styles.checkbox} 
            />
          </TouchableOpacity>
        ))}
      </ScrollView>

      <TouchableOpacity style={styles.addButton} onPress={() => navigation.navigate('Medicación', { screen: 'AddMedication' })}>
        <Ionicons name="add-outline" size={18} color="#3E3EEC" style={styles.addIcon} />
        <Text style={styles.addButtonText}>Añadir nuevo</Text>
      </TouchableOpacity>

      <MedicalAppointments />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { 
    backgroundColor: '#FAFAFA', 
    padding: 20, 
    paddingTop: 0
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FAFAFA'
  },
  header: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'space-between', 
    marginBottom: 20 
  },
  greeting: { 
    fontSize: 36, 
    color: '#161B43', 
    fontFamily: 'Inter-Regular' 
  },
  userName: { 
    fontWeight: '600', 
    fontFamily: 'Inter-SemiBold' 
  },
  avatar: { 
    width: 50, 
    height: 50, 
    borderRadius: 25 
  },
  sectionTitle: { 
    fontSize: 20, 
    color: '#3E3E3E', 
    fontWeight: '600', 
    marginBottom: 12 
  },
  subText: {
    fontSize: 14,
    color: '#888',
    marginBottom: 10
  },
  healthValuesContainer: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 12,
    paddingHorizontal: 10,
  },
  healthCard: {
    padding: 20,
    borderRadius: 14,
    width: 130,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 3,
    marginRight: 14,
  },
  healthTitle: {
    fontSize: 13,
    color: '#3E3E3E',
    fontWeight: '500',
    textAlign: 'center',
  },
  healthValue: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#161B43',
    marginTop: 6,
  },
  cardBlue: { 
    backgroundColor: '#D9EFFF' 
  },
  cardTeal: { 
    backgroundColor: '#D1F2E8' 
  },
  cardRed: { 
    backgroundColor: '#FFD9D9' 
  },
  cardYellow: { 
    backgroundColor: '#FFF4CC' 
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F4F4FF',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 20,
    alignSelf: 'center',
    marginTop: 8,
  },
  addIcon: {
    marginRight: 6,
  },
  addButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#3E3EEC',
  },
  medicationContainer: { 
    flexDirection: 'row', 
    gap: 10, 
    marginTop: 10 
  },
  medCard: { 
    backgroundColor: '#FFFFFF', 
    padding: 15, 
    borderRadius: 8, 
    width: 168, 
    height: 94, 
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'space-between', 
    shadowColor: '#000', 
    shadowOffset: { width: 0, height: 2 }, 
    shadowOpacity: 0.1, 
    shadowRadius: 4, 
    marginRight: 10 
  },
  medCardTaken: { 
    backgroundColor: '#E3E7FF' 
  },
  medContent: { 
    flexDirection: 'row', 
    alignItems: 'center' 
  },
  medCircle: { 
    width: 10, 
    height: 10, 
    borderRadius: 5, 
    marginRight: 8 
  },
  medTime: { 
    fontSize: 14, 
    fontWeight: '600', 
    color: '#3E3E3E' 
  },
  medName: { 
    fontSize: 16, 
    fontWeight: 'bold', 
    color: '#161B43' 
  },
  checkbox: { 
    marginLeft: 'auto' 
  },
});

export default HomePage;