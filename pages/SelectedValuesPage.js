import React, { useState, useEffect, useLayoutEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator, Dimensions } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import axios from 'axios';
import API_URL from '../config/config';
import AsyncStorage from '@react-native-async-storage/async-storage';
import BackButton from '../components/BackButton';
import { Picker } from '@react-native-picker/picker';
import { LineChart } from 'react-native-chart-kit';

const screenWidth = Dimensions.get("window").width - 40;

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
  const [selectedChart, setSelectedChart] = useState('bloodPressure');
  const [chartData, setChartData] = useState([]);
  const [heartRateData, setHeartRateData] = useState([]);



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
          headers: { Authorization: `Bearer ${token}` },
        });

        const heartRateResponse = await axios.get(`${API_URL}/heart-rate/latest`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const weightResponse = await axios.get(`${API_URL}/weight/latest`, {
          headers: { Authorization: `Bearer ${token}` },
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

  const fetchHeartRateData = async () => {
    try {
      const storedHeartRateData = await AsyncStorage.getItem('heartRateData');
      if (storedHeartRateData) {
        setHeartRateData(JSON.parse(storedHeartRateData));
      }
    } catch (error) {
      console.error('Error fetching heart rate data:', error);
    }
  };

  fetchHeartRateData();


  useEffect(() => {
    const loadChartData = async () => {
      if (selectedChart === 'heartRate') {
        // Evitar actualizaciones innecesarias si los datos no han cambiado
        const newData = heartRateData.map(entry => entry.value);
        if (JSON.stringify(newData) !== JSON.stringify(chartData)) {
          setChartData(newData);
        }
      } else {
        const stored = await AsyncStorage.getItem(`chartData_${selectedChart}`);
        const parsedData = stored ? JSON.parse(stored) : [];
        // Evitar actualizaciones innecesarias
        if (JSON.stringify(parsedData) !== JSON.stringify(chartData)) {
          setChartData(parsedData);
        }
      }
    };

    loadChartData();
    // Solo depende de selectedChart y heartRateData
  }, [selectedChart, heartRateData]);



  const getFormattedValue = (paramId) => {
    switch (paramId) {
      case 'bloodPressure':
        return latestValues.bloodPressure?.systolic && latestValues.bloodPressure?.diastolic
          ? `${latestValues.bloodPressure.systolic}/${latestValues.bloodPressure.diastolic} mmHg`
          : 'No ingresado';
      case 'heartRate':
        return latestValues.heartRate?.heart_rate
          ? `${latestValues.heartRate.heart_rate} bpm`
          : 'No ingresado';
      case 'weight':
        return latestValues.weight?.weight
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
      onSave: () => { },
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

  const renderChart = () => {
    if (!chartData.length) {
      return <Text style={styles.graphPlaceholder}>Aún no hay datos disponibles para este parámetro</Text>;
    }

    const labels = selectedChart === 'heartRate'
      ? heartRateData.map(entry => entry.date)
      : chartData.map((_, i) => `${i + 1}`);

    return (
      <LineChart
        data={{
          labels,
          datasets: [{
            data: chartData.map(d => parseFloat(d)),
            strokeWidth: 2
          }]
        }}
        width={screenWidth}
        height={220}
        chartConfig={{
          backgroundColor: '#FAFAFA',
          backgroundGradientFrom: '#FAFAFA',
          backgroundGradientTo: '#FAFAFA',
          decimalPlaces: 0,
          color: (opacity = 1) => `rgba(59, 73, 180, ${opacity})`,
          labelColor: () => '#6B7280',
          style: { borderRadius: 16 },
          propsForDots: {
            r: "4",
            strokeWidth: "2",
            stroke: "#3B49B4"
          }
        }}
        bezier
        style={{ borderRadius: 16 }}
      />
    );
  };

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
        <Picker
          selectedValue={selectedChart}
          onValueChange={(itemValue) => setSelectedChart(itemValue)}
          style={{ width: '100%' }}
        >
          <Picker.Item label="Presión arterial" value="bloodPressure" />
          <Picker.Item label="Frecuencia cardíaca" value="heartRate" />
          <Picker.Item label="Peso" value="weight" />
        </Picker>
        {renderChart()}
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
    padding: 10,
    alignItems: 'center',
  },
  graphPlaceholder: {
    color: '#999',
    marginTop: 20,
  },
  errorText: {
    color: 'red',
    fontSize: 16,
    textAlign: 'center',
  },
});

export default SelectedValuesPage;