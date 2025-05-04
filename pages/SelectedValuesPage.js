import React, { useState, useEffect , useLayoutEffect} from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator, fetchLatestValues } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import axios from 'axios';
import API_URL from '../config/config';
import AsyncStorage from '@react-native-async-storage/async-storage';
import BackButton from '../components/BackButton';


const SelectedValuesPage = () => {
  const route = useRoute();
  const navigation = useNavigation();

  const [latestValues, setLatestValues] = useState({
    bloodPressure: null,
    heartRate: null,
    weight: null,
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

 useLayoutEffect(() => {
  navigation.setOptions({
     headerTitle: '',
    headerLeft: () => <BackButton navigation={navigation} />
  });
}, [navigation]);


  useEffect(() => {
    const fetchLatestValues = async () => {
      const token = await AsyncStorage.getItem('userToken');

      try {
        const bloodPressureResponse = await axios.get(`${API_URL}/blood-pressure/latest`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const heartRateResponse = await axios.get(`${API_URL}/heart-rate/latest`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const weightResponse = await axios.get(`${API_URL}/weight/latest`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setLatestValues({
          bloodPressure: bloodPressureResponse.data || null,
          heartRate: heartRateResponse.data || null,
          weight: weightResponse.data || null,
        });
      } catch (error) {
        console.error('Error fetching latest values:', error);
        setError('Error al obtener los datos');
      } finally {
        setLoading(false);
      }
    };

    fetchLatestValues();
  }, []);

  const getFormattedValue = (paramId) => {
    switch (paramId) {
      case 'bloodPressure':
        return latestValues.bloodPressure && latestValues.bloodPressure.systolic && latestValues.bloodPressure.diastolic
          ? `${latestValues.bloodPressure.systolic}/${latestValues.bloodPressure.diastolic} mmHg`
          : 'No ingresado';
      case 'heartRate':
        return latestValues.heartRate && latestValues.heartRate.heart_rate
          ? `${latestValues.heartRate.heart_rate} bpm`
          : 'No ingresado';
      case 'weight':
        return latestValues.weight && latestValues.weight.weight
          ? `${latestValues.weight.weight} kg`
          : 'No ingresado';
      default:
        return 'No ingresado';
    }
  };

  const goToParameterPage = (parameterId) => {
    navigation.navigate(parameterScreenMap[parameterId], {
      selectedParameters: route.params?.selectedParameters || [],
      updatedValues: latestValues,
      onSave: fetchLatestValues,
    });
  };

  const parameterScreenMap = {
    bloodPressure: 'BloodPressure',
    heartRate: 'HeartRate',
    weight: 'Weight',
  };

  const parameterLabelMap = {
    bloodPressure: 'Presión arterial',
    heartRate: 'Frecuencia cardíaca',
    weight: 'Peso',
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#3B49B4" />
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
      <Text style={styles.title}>Configura tus valores</Text>

      {route.params?.selectedParameters?.map((paramId) => (
        <TouchableOpacity
          key={paramId}
          style={styles.paramButton}
          onPress={() => goToParameterPage(paramId)}
        >
          <Text style={styles.paramText}>
            {parameterLabelMap[paramId]}: {getFormattedValue(paramId)}
          </Text>
        </TouchableOpacity>
      ))}

      <View style={styles.graphContainer}>
        <Text style={styles.graphPlaceholder}>
          Aquí podrías mostrar un gráfico de ejemplo
        </Text>
      </View>
    </View>
  );
};

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
    marginBottom: 20,
  },
  paramButton: {
    backgroundColor: '#E3E3E3',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
  },
  paramText: {
    fontSize: 18,
    color: '#101432',
  },
  graphContainer: {
    flex: 1,
    backgroundColor: '#F0F0F0',
    marginTop: 20,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  graphPlaceholder: {
    color: '#999',
  },
  errorText: {
    color: 'red',
    fontSize: 16,
    textAlign: 'center',
  },
});

export default SelectedValuesPage;