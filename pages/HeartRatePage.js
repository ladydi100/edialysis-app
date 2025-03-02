import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';

const HeartRatePage = () => {
  const navigation = useNavigation();
  const route = useRoute();

  const [heartRate, setHeartRate] = useState('');

  const handleSave = () => {
    if (!heartRate) {
      alert('Por favor, introduce un valor válido.');
      return;
    }

    navigation.navigate('SelectedValues', {
      selectedParameters: route.params?.selectedParameters || [],
      updatedValues: {
        ...route.params?.updatedValues,
        heartRate: `${heartRate} bpm`
      }
    });
  };

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
