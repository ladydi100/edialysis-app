import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, TouchableOpacity, Switch } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { addMedication } from '../services/medicationService';

const AddMedicationPage = ({ navigation }) => {
  const [medicationName, setMedicationName] = useState('');
  const [frequency, setFrequency] = useState('');
  const [dosage, setDosage] = useState('');
  const [time, setTime] = useState(new Date());
  const [color, setColor] = useState('');
  const [notes, setNotes] = useState('');
  const [alarmEnabled, setAlarmEnabled] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);

  const handleSave = async () => {
    const medicationData = {
      name: medicationName,
      frequency,
      dosage,
      time: time.toISOString(),
      color,
      notes,
      alarmEnabled,
    };

    try {
      await addMedication(medicationData);
      navigation.goBack();
    } catch (error) {
      console.error('Error saving medication:', error);
      alert('Error al guardar el medicamento');
    }
  };

  const onChangeTime = (event, selectedDate) => {
    const currentDate = selectedDate || time;
    setShowDatePicker(false);
    setTime(currentDate);
  };

  return (
    <View style={styles.container}>
      <TextInput
        placeholder="Nombre del medicamento"
        value={medicationName}
        onChangeText={setMedicationName}
        style={styles.input}
      />
      <TextInput
        placeholder="Frecuencia de uso"
        value={frequency}
        onChangeText={setFrequency}
        style={styles.input}
      />
      <TextInput
        placeholder="Dosis"
        value={dosage}
        onChangeText={setDosage}
        style={styles.input}
      />
      <TouchableOpacity onPress={() => setShowDatePicker(true)}>
        <Text style={styles.input}>Hora de toma: {time.toLocaleTimeString()}</Text>
      </TouchableOpacity>
      {showDatePicker && (
        <DateTimePicker
          value={time}
          mode="time"
          is24Hour={true}
          display="default"
          onChange={onChangeTime}
        />
      )}
      <TextInput
        placeholder="Color"
        value={color}
        onChangeText={setColor}
        style={styles.input}
      />
      <TextInput
        placeholder="Notas importantes"
        value={notes}
        onChangeText={setNotes}
        style={styles.input}
      />
      <View style={styles.switchContainer}>
        <Text>Activar alarma</Text>
        <Switch
          value={alarmEnabled}
          onValueChange={setAlarmEnabled}
        />
      </View>
      <Button title="Guardar" onPress={handleSave} />
      <Button title="Cancelar" onPress={() => navigation.goBack()} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 12,
    paddingHorizontal: 8,
  },
  switchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
});

export default AddMedicationPage;