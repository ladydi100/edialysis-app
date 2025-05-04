import React, { useState,useEffect, useLayoutEffect  } from 'react';
import { View, Text, TextInput, StyleSheet, Switch, TouchableOpacity,Alert } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import axios from 'axios';
import API_URL from '../config/config';
import AsyncStorage from '@react-native-async-storage/async-storage';
import BackButton from '../components/BackButton';

const BloodPressurePage = () => {
  const navigation = useNavigation();
  const route = useRoute();

  const [systolic, setSystolic] = useState('');
  const [diastolic, setDiastolic] = useState('');
  const [loading, setLoading] = useState(true); // Para mostrar un indicador de carga
  const [error, setError] = useState(null); // Para manejar errores

 useLayoutEffect(() => {
  navigation.setOptions({
    headerTitle: '',
    headerLeft: () => <BackButton navigation={navigation} />
  });
}, [navigation]);

 useEffect(() => {
    const fetchLatestBloodPressure = async () => {
      const token = await AsyncStorage.getItem('userToken');

      try {
        const response = await axios.get(`${API_URL}/blood-pressure/latest`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.data.systolic && response.data.diastolic) {
          setSystolic(response.data.systolic.toString());
          setDiastolic(response.data.diastolic.toString());
        }
      } catch (error) {
        console.error('Error fetching latest blood pressure:', error);
         setError('Error al obtener los datos de presión arterial');
      }finally {
        setLoading(false); // Finalizar la carga
      }
    };

    fetchLatestBloodPressure();
  }, []);


  const handleSave = async() => {
 const systolicValue = parseInt(systolic, 10);
 const diastolicValue = parseInt(diastolic, 10);



    if (!systolic || !diastolic) {
      Alert.alert('Por favor, introduce valores válidos.');
      return;
    }
       if (isNaN(systolicValue)) {
      Alert.alert('Error', 'La presión sistólica debe ser un número válido.');
      return;
    }
    if (isNaN(diastolicValue)) {
      Alert.alert('Error', 'La presión diastólica debe ser un número válido.');
      return;
    }
    
    const token = await AsyncStorage.getItem('userToken');

     try {
      await axios.post(`${API_URL}/blood-pressure`, { systolic, diastolic }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

   // Llamar a la función de actualización si existe
      if (route.params?.onSave) {
        route.params.onSave();
      } 
      
    navigation.navigate('SelectedValues', {
      selectedParameters: route.params?.selectedParameters || [],
      updatedValues: {
        ...route.params?.updatedValues,
        bloodPressure: `${systolic}/${diastolic} mmHg`
      }
    });
 
} catch (error) {
      console.error('Error saving blood pressure:', error);
       Alert.alert('Error', 'No se pudo guardar la presión arterial. Inténtalo de nuevo.');
    }


  };

 if (loading) {
    return (
      <View style={styles.container}>
        <Text>Cargando...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }


  return (
    <View style={styles.container}>
      <Text style={styles.title}>Presión arterial</Text>
      <Text style={styles.dateText}>Lunes 26 enero · 12:32</Text>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Presión arterial sistólica</Text>
        <TextInput
          style={styles.input}
          placeholder="Ej: 120"
          keyboardType="numeric"
          value={systolic}
          onChangeText={setSystolic}
        />
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Presión arterial diastólica</Text>
        <TextInput
          style={styles.input}
          placeholder="Ej: 80"
          keyboardType="numeric"
          value={diastolic}
          onChangeText={setDiastolic}
        />
      </View>

      <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
        <Text style={styles.saveButtonText}>Guardar datos</Text>
      </TouchableOpacity>
    </View>
  );
};

export default BloodPressurePage;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAFAFA',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#101432',
    marginBottom: 8,
  },
  dateText: {
    fontSize: 14,
    color: '#888',
    marginBottom: 20,
  },
  inputContainer: {
    marginBottom: 15,
  },
  label: {
    fontSize: 16,
    color: '#101432',
    marginBottom: 5,
  },
  input: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    borderRadius: 8,
  },
  saveButton: {
    backgroundColor: '#3B49B4',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
