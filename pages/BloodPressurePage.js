import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, Switch, TouchableOpacity } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';

const BloodPressurePage = () => {
  const navigation = useNavigation();
  const route = useRoute();

  const [systolic, setSystolic] = useState('');
  const [diastolic, setDiastolic] = useState('');
  const [notes, setNotes] = useState('');
  const [connectAppleHealth, setConnectAppleHealth] = useState(false);

  const handleSave = () => {
    if (!systolic || !diastolic) {
      alert('Por favor, introduce valores válidos.');
      return;
    }

    navigation.navigate('SelectedValues', {
      selectedParameters: route.params?.selectedParameters || [],
      updatedValues: {
        ...route.params?.updatedValues,
        bloodPressure: `${systolic}/${diastolic} mmHg`
      }
    });
  };

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
