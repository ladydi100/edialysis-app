// SelectValuesPage.js
import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const SelectValuesPage = () => {
  const navigation = useNavigation();

  // Estado para almacenar los parámetros seleccionados
  const [selectedParameters, setSelectedParameters] = useState([]);

  // Lista de parámetros disponibles
  const availableParameters = [
    { id: 'bloodPressure', label: 'Presión arterial' },
    { id: 'heartRate', label: 'Frecuencia cardíaca' },
    { id: 'weight', label: 'Peso' },
  ];

  // Función para seleccionar/deseleccionar parámetros
  const toggleParameter = (parameterId) => {
    if (selectedParameters.includes(parameterId)) {
      setSelectedParameters(selectedParameters.filter((p) => p !== parameterId));
    } else {
      setSelectedParameters([...selectedParameters, parameterId]);
    }
  };

  // Función para continuar a la siguiente pantalla
  const handleContinue = () => {
    if (selectedParameters.length === 0) {
      alert('Selecciona al menos un valor');
      return;
    }

    navigation.navigate('SelectedValues', {
      selectedParameters,
    });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Valores de salud</Text>
      <Text style={styles.subtitle}>Añade los resultados que quieres registrar</Text>
      <Text style={styles.subtitle}>Selecciona al menos 1 valor</Text>

      <View style={styles.parametersContainer}>
        {availableParameters.map((param) => {
          const isSelected = selectedParameters.includes(param.id);
          return (
            <TouchableOpacity
              key={param.id}
              style={[
                styles.parameterButton,
                isSelected && styles.selectedButton,
              ]}
              onPress={() => toggleParameter(param.id)}
            >
              <Text
                style={[
                  styles.parameterText,
                  isSelected && styles.selectedText,
                ]}
              >
                {param.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      <TouchableOpacity
        style={[
          styles.continueButton,
          selectedParameters.length === 0 && { backgroundColor: '#ccc' },
        ]}
        onPress={handleContinue}
        disabled={selectedParameters.length === 0}
      >
        <Text style={styles.continueButtonText}>Continuar</Text>
      </TouchableOpacity>
    </View>
  );
};

export default SelectValuesPage;

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
  subtitle: {
    fontSize: 16,
    color: '#5A5555',
    marginBottom: 8,
  },
  parametersContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginVertical: 16,
  },
  parameterButton: {
    borderWidth: 1,
    borderColor: '#3B49B4',
    borderRadius: 20,
    paddingVertical: 10,
    paddingHorizontal: 15,
    marginRight: 10,
    marginBottom: 10,
  },
  parameterText: {
    color: '#3B49B4',
    fontSize: 14,
  },
  selectedButton: {
    backgroundColor: '#3B49B4',
  },
  selectedText: {
    color: '#FFFFFF',
  },
  continueButton: {
    backgroundColor: '#3B49B4',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  continueButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
