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
    padding: 20,
    backgroundColor: '#F8F9FC', // Fondo similar al de la imagen
  },
  input: {
    height: 48,
    borderColor: '#E0E0E0',
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 12,
    backgroundColor: '#FFFFFF',
    marginBottom: 12,
    fontSize: 16,
    color: '#333',
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
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  dayButtonText: {
    fontSize: 16,
    color: '#333',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
 calendarContainer: {
    backgroundColor: 'white',
    padding: 10, // Reducir el padding
    borderRadius: 10,
    width: '95%', // Ajustar el ancho del calendario
    maxWidth: 400, // Ancho máximo para pantallas grandes
  },
  timeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    flexWrap: 'wrap',
    marginBottom: 12,
  },
  timeTag: {
    backgroundColor: '#E5E7EB',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    fontSize: 16,
    color: '#333',
    marginRight: 6,
    marginBottom: 6,
  },
  addTimeButton: {
    backgroundColor: '#E5E7EB',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 6,
    fontSize: 16,
    color: '#333',
  },
  switchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  colorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    padding: 14,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    marginBottom: 12,
  },
  colorLabel: {
    fontSize: 16,
    color: '#333',
    flex: 1,
  },
  colorCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
  },
  navText: {
    fontSize: 18, // Reducir el tamaño del texto
    color: '#007AFF',
    marginHorizontal: 10, // Espacio entre flechas y título
  },
monthTitle: {
    fontSize: 16, // Tamaño del texto del mes
    fontWeight: 'bold',
    color: '#000',
  },
  yearTitle: {
    fontSize: 14, // Tamaño del texto del año
    color: '#000',
  },
  headerWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 10, // Espacio interno
    width: '100%', // Asegurar que ocupe todo el ancho
  },


});


const pickerSelectStyles = StyleSheet.create({
  inputIOS: {
    fontSize: 16,
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 10,
    color: '#333',
    backgroundColor: '#FFFFFF',
  },
  inputAndroid: {
    fontSize: 16,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 10,
    color: '#333',
    backgroundColor: '#FFFFFF',
  },
});


export default AddMedicationPage;