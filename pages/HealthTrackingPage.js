import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons';
import { LineChart } from 'react-native-chart-kit';
import { Dimensions } from 'react-native';

const HealthTrackingPage = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { selectedValues, updatedValues } = route.params || { selectedValues: [], updatedValues: {} };

  // Diccionario de datos de salud con pantallas bien definidas
  const [healthData, setHealthData] = useState({
    "Frecuencia cardiaca": { screen: "SetHeartRate", icon: 'heart', unit: 'bpm', value: 75 },
    "Presión arterial": { screen: "SetBloodPressurePage", icon: 'heart-outline', unit: 'mmHg', value: "110/80" },
    "Glucosa": { screen: "SetGlucose", icon: 'water', unit: 'mg/dl', value: 110 },
    "Peso": { screen: "SetWeight", icon: 'barbell', unit: 'kg', value: 85 },
  });

  useEffect(() => {
    if (updatedValues) {
      setHealthData(prevData => ({ ...prevData, ...updatedValues }));
    }
  }, [updatedValues]);

  // Datos de ejemplo para la gráfica
  const graphData = {
    labels: ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"],
    datasets: [{
      data: [70, 75, 72, 78, 80, 82, 81, 79, 85, 88, 87, 86],
      strokeWidth: 2
    }]
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Seguimiento de Salud</Text>

      {selectedValues.length > 0 ? (
        selectedValues.map((param) => (
          <TouchableOpacity
            key={param}
            style={styles.card}
            onPress={() => navigation.navigate(healthData[param]?.screen, { parameter: param })}
          >
            <View style={styles.cardContent}>
              <Icon name={healthData[param]?.icon || 'alert-circle'} size={24} color="#3B49B4" style={styles.icon} />
              <View>
                <Text style={styles.paramTitle}>{param}</Text>
                <Text style={styles.paramValue}>{healthData[param]?.value} {healthData[param]?.unit}</Text>
              </View>
            </View>
            <Icon name="chevron-forward" size={20} color="#101432" />
          </TouchableOpacity>
        ))
      ) : (
        <Text style={styles.noDataText}>No has seleccionado valores para el seguimiento.</Text>
      )}

      <Text style={styles.graphTitle}>Evolución de valores</Text>
      <LineChart
        data={graphData}
        width={Dimensions.get("window").width - 40}
        height={220}
        chartConfig={{
          backgroundColor: "#ffffff",
          backgroundGradientFrom: "#ffffff",
          backgroundGradientTo: "#ffffff",
          decimalPlaces: 0,
          color: (opacity = 1) => `rgba(59, 73, 180, ${opacity})`,
          labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
        }}
        style={{ marginVertical: 10, borderRadius: 10 }}
      />
    </ScrollView>
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
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#E3E3E3',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
  },
  cardContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    marginRight: 15,
  },
  paramTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#101432',
  },
  paramValue: {
    fontSize: 16,
    color: '#5A5555',
  },
  graphTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#101432',
    marginTop: 20,
    marginBottom: 10,
  },
  noDataText: {
    fontSize: 16,
    color: '#5A5555',
    textAlign: 'center',
    marginTop: 20,
  },
});

export default HealthTrackingPage;
