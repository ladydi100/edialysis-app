import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, TouchableOpacity, Switch, ScrollView, Modal } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import RNPickerSelect from 'react-native-picker-select';
import { addMedication } from '../services/medicationService';
import Icon from 'react-native-vector-icons/FontAwesome';


const colors = [
  { label: '🔴', value: '#FF0000', color: '#FF0000' }, // Rojo
  { label: '🟠', value: '#FFA500', color: '#FFA500' }, // Naranja
  { label: '🟡', value: '#FFFF00', color: '#FFFF00' }, // Amarillo
  { label: '🟢', value: '#00FF00', color: '#00FF00' }, // Verde
  { label: '🔵', value: '#0000FF', color: '#0000FF' }, // Azul
  { label: '🟣', value: '#800080', color: '#800080' }, // Morado
];



const daysOfWeek = [
  { label: 'Lunes', value: 'Monday' },
  { label: 'Martes', value: 'Tuesday' },
  { label: 'Miércoles', value: 'Wednesday' },
  { label: 'Jueves', value: 'Thursday' },
  { label: 'Viernes', value: 'Friday' },
  { label: 'Sábado', value: 'Saturday' },
  { label: 'Domingo', value: 'Sunday' },
];


const AddMedicationPage = ({ navigation }) => {
  const [medicationName, setMedicationName] = useState('');
  const [dosage, setDosage] = useState('');
  const [time, setTime] = useState(new Date());
  const [selectedColor, setSelectedColor] = useState('');
  const [notes, setNotes] = useState('');
  const [alarmEnabled, setAlarmEnabled] = useState(false);
  const [times, setTimes] = useState([]);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [selectedTimeIndex, setSelectedTimeIndex] = useState(null);
  const [selectedDays, setSelectedDays] = useState([]); 
  const [showDaysModal, setShowDaysModal] = useState(false);


  const handleSave = async () => {
    const medicationData = {
      name: medicationName,
      dosage,
      times: times.map(t => t.toISOString()),
      color: selectedColor,
      notes,
      alarmEnabled,
      days: selectedDays,
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
    setShowTimePicker(false);
    if (selectedTimeIndex !== null) {
      const updatedTimes = [...times];
      updatedTimes[selectedTimeIndex] = currentDate;
      setTimes(updatedTimes);
      setSelectedTimeIndex(null);
    } else {
      setTimes([...times, currentDate]);
    }
  };


  const handleDeleteTime = (index) => {
    const updatedTimes = times.filter((_, i) => i !== index);
    setTimes(updatedTimes);
  };


   const toggleDay = (day) => {
    if (selectedDays.includes(day)) {
      setSelectedDays(selectedDays.filter(d => d !== day)); 
    } else {
      setSelectedDays([...selectedDays, day]); 
    }
  };

  return (
    <ScrollView style={styles.container}>
      {/* Nombre del medicamento */}
      <TextInput
        placeholder="Nombre del medicamento"
        value={medicationName}
        onChangeText={setMedicationName}
        style={styles.input}
      />


  {/* Frecuencia de uso: Selección de días de la semana */}
      <View style={styles.section}>
        <TouchableOpacity onPress={() => setShowDaysModal(true)} style={styles.calendarIconContainer}>
          <Text style={styles.sectionTitle}>Frecuencia de uso</Text>
          <Icon name="calendar" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.selectedDaysText}>
          Días seleccionados: {selectedDays.join(', ')}
        </Text>
      </View>

       <Modal
        visible={showDaysModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowDaysModal(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Selecciona los días</Text>
            {daysOfWeek.map((day, index) => (
              <TouchableOpacity
                key={index}
                style={[
                  styles.dayButton,
                  selectedDays.includes(day.value) && styles.dayButtonSelected
                ]}
                onPress={() => toggleDay(day.value)}
              >
                <Text style={styles.dayButtonText}>{day.label}</Text>
              </TouchableOpacity>
            ))}
            <Button title="Cerrar" onPress={() => setShowDaysModal(false)} />
          </View>
        </View>
      </Modal>






      {/* Dosis */}
      <TextInput
        placeholder="Dosis"
        value={dosage}
        onChangeText={setDosage}
        style={styles.input}
      />
      

 <TouchableOpacity onPress={() => setShowTimePicker(true)}>
        <Text style={styles.input}>Añadir hora de toma</Text>
      </TouchableOpacity>
      {showTimePicker && (
        <DateTimePicker
          value={time}
          mode="time"
          is24Hour={true}
          display="default"
          onChange={onChangeTime}
        />
      )}

      {/* Horas de toma */}
      {times.map((time, index) => (
        <View key={index} style={styles.timeContainer}>
          <Text>{time.toLocaleTimeString()}</Text>
          <Button title="Editar" onPress={() => {
            setSelectedTimeIndex(index);
            setTime(times[index]);
            setShowTimePicker(true);
          }} />
          <Button title="Eliminar" onPress={() => handleDeleteTime(index)} />
        </View>
      ))}
     

      {/* Color */}
      <View style={styles.colorContainer}>
        <Text style={styles.colorLabel}>Color</Text>
        <RNPickerSelect
          onValueChange={(value) => setSelectedColor(value)}
          items={colors}
          placeholder={{ label: 'Selecciona un color', value: null }}
          style={pickerSelectStyles}
          
        />
        {selectedColor && (
          <View style={[styles.colorCircle, { backgroundColor: selectedColor }]} />
        )}
      </View>

      {/* Notas importantes */}
      <TextInput
        placeholder="Notas importantes"
        value={notes}
        onChangeText={setNotes}
        style={styles.input}
        multiline
      />

      {/* Alarma */}
      <View style={styles.switchContainer}>
        <Text>Activar alarma</Text>
        <Switch
          value={alarmEnabled}
          onValueChange={setAlarmEnabled}
        />
      </View>

      {/* Botones de guardar y cancelar */}
      <Button title="Guardar" onPress={handleSave} />
      <Button title="Cancelar" onPress={() => navigation.goBack()} />
    </ScrollView>
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
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  dayButton: {
    padding: 10,
    marginVertical: 5,
    backgroundColor: '#e0e0e0',
    borderRadius: 5,
    alignItems: 'center',
  },
  dayButtonSelected: {
    backgroundColor: '#a0a0a0',
  },
  dayButtonText: {
    fontSize: 16,
  },
  selectedDaysText: {
    marginTop: 10,
    fontStyle: 'italic',
  },
  timeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  switchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  colorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  colorLabel: {
    fontSize: 16,
    marginRight: 10,
  },
  colorCircle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    marginLeft: 10,
  },
  calendarIconContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '80%',
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
});



const pickerSelectStyles = StyleSheet.create({
  inputIOS: {
    fontSize: 16,
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 4,
    color: 'black',
    paddingRight: 30,
  },
  inputAndroid: {
    fontSize: 16,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderWidth: 0.5,
    borderColor: 'gray',
    borderRadius: 8,
    color: 'black',
    paddingRight: 30,
  },
});

export default AddMedicationPage;