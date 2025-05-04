import React, { useState, useLayoutEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons';
import BackButton from '../components/BackButton';

const SelectValuesPage = () => {
  const navigation = useNavigation();
  const [selectedParameters, setSelectedParameters] = useState([]);

  // Lista de parámetros disponibles
  const availableParameters = [
    { id: 'bloodPressure', label: 'Presión arterial' },
    { id: 'heartRate', label: 'Frecuencia cardíaca' },
    { id: 'weight', label: 'Peso' },
  ];

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: '',
      headerLeft: () => (
        <BackButton 
          navigation={navigation} 
          onPress={() => navigation.navigate('Salud', { screen: 'HealthMain' })}
        />
      ),
    });
  }, [navigation]);

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

    navigation.navigate('SelectedValues', { selectedParameters });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>¿Qué valores deseas seguir?</Text>
      <Text style={styles.subtitle}>
        Selecciona los valores que deseas monitorizar y registrar.
      </Text>

      <View style={styles.listContainer}>
        {availableParameters.map((param) => {
          const isSelected = selectedParameters.includes(param.id);
          return (
            <TouchableOpacity
              key={param.id}
              style={[styles.listItem, isSelected && styles.selectedItem]}
              onPress={() => toggleParameter(param.id)}
            >
              <View style={[styles.checkbox, isSelected && styles.checkedBox]}>
                {isSelected && <Icon name="checkmark" size={18} color="#FAFAFA" />}
              </View>
              <Text style={[styles.itemText, isSelected && styles.selectedText]}>{param.label}</Text>
            </TouchableOpacity>
          );
        })}
      </View>

      <TouchableOpacity
        style={[styles.continueButton, selectedParameters.length === 0 && { backgroundColor: '#ccc' }]}
        onPress={handleContinue}
        disabled={selectedParameters.length === 0}
      >
        <Text style={styles.continueButtonText}>Siguiente</Text>
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
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#5A5555',
    marginBottom: 20,
  },
  listContainer: {
    backgroundColor: '#FAFAFA',
    borderRadius: 10,
    paddingVertical: 10,
  },
  listItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
    backgroundColor: '#FAFAFA',
  },
  selectedItem: {
    backgroundColor: '#D7DAF2',
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 5,
    borderWidth: 2,
    borderColor: '#3B49B4',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
    backgroundColor: 'transparent', // Checkbox sin seleccionar: transparente
  },
  checkedBox: {
    backgroundColor: '#3B49B4', // Checkbox seleccionado: azul corporativo
  },
  itemText: {
    fontSize: 16,
    color: '#101432',
  },
  selectedText: {
    fontWeight: 'bold',
  },
  continueButton: {
    backgroundColor: '#3B49B4',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 20,
  },
  continueButtonText: {
    color: '#FAFAFA',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
