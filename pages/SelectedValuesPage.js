import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';

const SelectedValuesPage = () => {
  const route = useRoute();
  const navigation = useNavigation();

  // Recuperar los valores seleccionados y los valores actualizados
  const { selectedParameters = [] } = route.params || {};
  const [values, setValues] = useState(route.params?.updatedValues || {});

  useEffect(() => {
    if (route.params?.updatedValues) {
      setValues(prevValues => ({
        ...prevValues,
        ...route.params.updatedValues // Mantener valores previos y actualizar nuevos
      }));
    }
  }, [route.params?.updatedValues]);

  // Mapear IDs de parámetros con nombres de pantalla y etiquetas
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

  const goToParameterPage = (parameterId) => {
    navigation.navigate(parameterScreenMap[parameterId], {
      selectedParameters,
      updatedValues: values,
    });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Configura tus valores</Text>

      {selectedParameters.map((paramId) => (
        <TouchableOpacity
          key={paramId}
          style={styles.paramButton}
          onPress={() => goToParameterPage(paramId)}
        >
          <Text style={styles.paramText}>
            {parameterLabelMap[paramId]}: {values[paramId] || 'No ingresado'}
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

export default SelectedValuesPage;

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
});
