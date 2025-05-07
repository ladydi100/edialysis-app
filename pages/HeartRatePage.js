import React, { useState, useEffect, useLayoutEffect } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import axios from 'axios';
import API_URL from '../config/config';
import AsyncStorage from '@react-native-async-storage/async-storage';
import BackButton from '../components/BackButton';

const HeartRatePage = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const [heartRate, setHeartRate] = useState('');
  const [heartRateData, setHeartRateData] = useState([]); // Array para almacenar valores
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: '',
      headerLeft: () => <BackButton navigation={navigation} />
    });
  }, [navigation]);

  useEffect(() => {
    const fetchLatestHeartRate = async () => {
      const token = await AsyncStorage.getItem('userToken');

      try {
        const response = await axios.get(`${API_URL}/heart-rate/latest`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.data.heart_rate) {
          setHeartRate(response.data.heart_rate.toString());
        }

        // Si hay datos previos guardados, los cargamos
        const storedData = await AsyncStorage.getItem('heartRateData');
        if (storedData) {
          setHeartRateData(JSON.parse(storedData));
        }

      } catch (error) {
        console.error('Error fetching latest heart rate:', error);
        setError('Error al obtener los datos de frecuencia cardíaca');
      } finally {
        setLoading(false);
      }
    };

    fetchLatestHeartRate();
  }, []);

  const handleSave = async () => {
    if (!heartRate) {
      Alert.alert('Por favor, introduce un valor válido.');
      return;
    }

    const token = await AsyncStorage.getItem('userToken');
    const timestamp = new Date().toISOString().slice(0, 10); // Fecha actual en formato YYYY-MM-DD

    try {
      // Guardar en el backend (opcional)
      await axios.post(`${API_URL}/heart-rate`, { heartRate }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      // Crear un nuevo registro con la fecha y el valor
      const newEntry = { date: timestamp, value: parseInt(heartRate) };
      const updatedData = [...heartRateData, newEntry];

      // Guardar en AsyncStorage
      await AsyncStorage.setItem('heartRateData', JSON.stringify(updatedData));

      // Actualizar el estado local
      setHeartRateData(updatedData);

      // Redirigir a la página de valores seleccionados
      navigation.navigate('SelectedValues', {
        selectedParameters: route.params?.selectedParameters || [],
        updatedValues: {
          ...route.params?.updatedValues,
          heartRate: updatedData,
        },
      });

    } catch (error) {
      console.error('Error saving heart rate:', error);
      Alert.alert('Error', 'No se pudo guardar la frecuencia cardíaca. Inténtalo de nuevo.');
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
      <Text style={styles.title}>Frecuencia Cardíaca</Text>
      <TextInput
        style={styles.input}
        placeholder="Ej: 70"
        keyboardType="numeric"
        value={heartRate}
        onChangeText={setHeartRate}
      />
      <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
        <Text style={styles.saveButtonText}>Guardar datos</Text>
      </TouchableOpacity>
    </View>
  );
};

export default HeartRatePage;

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
    marginTop: 20,
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
