// WeightPage.js
import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, Switch, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const WeightPage = () => {
  const navigation = useNavigation();

  const [weight, setWeight] = useState('');
  const [notes, setNotes] = useState('');
  const [connectAppleHealth, setConnectAppleHealth] = useState(false);

  const handleSave = () => {
    alert('Peso guardado correctamente');
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Peso</Text>
      <Text style={styles.dateText}>Lunes 26 enero · 12:32</Text>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Peso (kg)</Text>
        <TextInput
          style={styles.input}
          placeholder="Ej: 70"
          keyboardType="numeric"
          value={weight}
          onChangeText={setWeight}
        />
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Notas importantes</Text>
        <TextInput
          style={[styles.input, styles.notesInput]}
          placeholder="Ingresa tus notas aquí"
          multiline
          value={notes}
          onChangeText={setNotes}
        />
      </View>

      <View style={styles.switchContainer}>
        <Text style={styles.label}>Conectar con Apple Health</Text>
        <Switch
          value={connectAppleHealth}
          onValueChange={setConnectAppleHealth}
        />
      </View>

      <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
        <Text style={styles.saveButtonText}>Guardar datos</Text>
      </TouchableOpacity>
    </View>
  );
};

export default WeightPage;

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
  notesInput: {
    height: 80,
  },
  switchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 30,
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
