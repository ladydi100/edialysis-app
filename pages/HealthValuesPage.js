import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';

const HealthValuesPage = () => {
  const navigation = useNavigation();
  const [selectedValues, setSelectedValues] = useState([]);

  const parameters = [
    { label: "Frecuencia cardiaca", key: "heartRate" },
    { label: "Presión arterial", key: "bloodPressure" },
    { label: "Tasa de filtración glomerular", key: "filtrationRate" },
    { label: "Peso", key: "weight" },
    { label: "Proteinuria", key: "proteinuria" },
    { label: "Temperatura corporal", key: "temperature" },
    { label: "Albúmina/creatinina", key: "albumin" },
    { label: "Urea", key: "urea" },
    { label: "Glucosa", key: "glucose" }
  ];

  const toggleSelection = (key) => {
    setSelectedValues(prev =>
      prev.includes(key) ? prev.filter(item => item !== key) : [...prev, key]
    );
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>¿Qué valores deseas seguir?</Text>
      <Text style={styles.subtitle}>
        Selecciona los valores que deseas monitorizar y registrar.
      </Text>

      <View style={styles.listContainer}>
        {parameters.map((param) => (
          <TouchableOpacity
            key={param.key}
            style={[
              styles.listItem,
              selectedValues.includes(param.key) && styles.selectedItem
            ]}
            onPress={() => toggleSelection(param.key)}
          >
            <View style={styles.checkbox}>
              {selectedValues.includes(param.key) && (
                <Icon name="checkmark" size={18} color="#FAFAFA" />
              )}
            </View>
            <Text style={styles.itemText}>{param.label}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <TouchableOpacity
        style={styles.nextButton}
        onPress={() => navigation.navigate('HealthTrackingPage', { selectedValues })}
      >
        <Text style={styles.nextButtonText}>Continuar</Text>
      </TouchableOpacity>
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
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#5A5555',
    marginBottom: 20,
  },
  listContainer: {
    backgroundColor: '#F5F5F5',
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
    backgroundColor: 'transparent',
  },
  itemText: {
    fontSize: 16,
    color: '#101432',
  },
  nextButton: {
    backgroundColor: '#3B49B4',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 20,
  },
  nextButtonText: {
    color: '#FAFAFA',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default HealthValuesPage;
