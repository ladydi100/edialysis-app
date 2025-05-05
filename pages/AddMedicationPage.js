import React, { useState, useLayoutEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet, TouchableOpacity, Switch, ScrollView, Modal } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import RNPickerSelect from 'react-native-picker-select';
import { addMedication } from '../services/medicationService';
import Icon from 'react-native-vector-icons/FontAwesome';
import BackButton from '../components/BackButton';

const colors = [
  { label: '🔴', value: '#FF0000', color: '#FF0000' }, // Rojo
  { label: '🟠', value: '#FFA500', color: '#FFA500' }, // Naranja
  { label: '🟡', value: '#FFFF00', color: '#FFFF00' }, // Amarillo
  { label: '🟢', value: '#00FF00', color: '#00FF00' }, // Verde
  { label: '🔵', value: '#0000FF', color: '#0000FF' }, // Azul
  { label: '🟣', value: '#800080', color: '#800080' }, // Morado
];



const daysOfWeek = [
  { label: 'Lunes', value: 'Lunes' },
  { label: 'Martes', value: 'Martes' },
  { label: 'Miércoles', value: 'Miércoles' },
  { label: 'Jueves', value: 'Jueves' },
  { label: 'Viernes', value: 'Viernes' },
  { label: 'Sábado', value: 'Sábado' },
  { label: 'Domingo', value: 'Domingo' },
];


const DAYS_MAPPING = {
  'Lunes': 'Monday',
  'Martes': 'Tuesday',
  'Miércoles': 'Wednesday',
  'Jueves': 'Thursday',
  'Viernes': 'Friday',
  'Sábado': 'Saturday',
  'Domingo': 'Sunday'
};



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
  


    useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: 'Añadir Medicamento',
      headerLeft: () => (
        <BackButton 
          navigation={navigation}
          onPress={() => navigation.goBack()}
        />
      ),
    });
  }, [navigation]);


  
 
const handleSave = async () => {
  const medicationData = {
    name: medicationName,
    dosage,
    times: times.map(t => t.toISOString().split('T')[1].substring(0, 5)), 
    color: selectedColor,
    notes,
    alarmEnabled,
    days: selectedDays.map(day => DAYS_MAPPING[day])
  };

  console.log('Enviando datos:', medicationData); 

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
      <View style={styles.inputContainer}>

        <TextInput
          placeholder="Nombre del medicamento"
          value={medicationName}
          onChangeText={setMedicationName}
          style={styles.input}
          placeholderTextColor="#6B7280" 
        />
      </View>



      {/* Frecuencia de uso: Selección de días de la semana */}
      <View style={styles.section}>
        <TouchableOpacity onPress={() => setShowDaysModal(true)} style={styles.calendarIconContainer}>
          <Text style={{ fontSize: 16, color: '#6B7280', fontWeight: '500' }}>Frecuencia de uso</Text>
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
                style={[styles.dayButton, selectedDays.includes(day.value) && styles.dayButtonSelected]}
                onPress={() => toggleDay(day.value)}
              >
                <Text style={StyleSheet.flatten([
                  styles.dayButtonText,
                  selectedDays.includes(day.value) && styles.dayButtonTextSelected
                ])}>
                  {day.label}
                </Text>
              </TouchableOpacity>
            ))}
            <TouchableOpacity style={styles.closeButton} onPress={() => setShowDaysModal(false)}>
              <Button title="Cerrar" onPress={() => setShowDaysModal(false)} />
            </TouchableOpacity>
          </View>
        </View>
      </Modal>







      {/* Dosis */}
      <View style={styles.inputContainer}>
        <TextInput
          placeholder="Dosis"
          value={dosage}
          onChangeText={setDosage}
          style={styles.input}
          placeholderTextColor="#6B7280" 
        />
      </View>



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
        <Text style={styles.colorLabel} >Color</Text>

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
    backgroundColor: '#F8F9FC', 
  },

  input: {
    height: 50,
    borderColor: '#D1D5DB',
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 14,
    backgroundColor: '#F8FAFC',
    marginBottom: 16,
    fontSize: 16,
    color: '#374151', 
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },


  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#374151',
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
  calendarIconContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 14,
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#D1D5DB',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
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
    fontSize: 18, 
    color: '#007AFF',
    marginHorizontal: 10,
  },
  monthTitle: {
    fontSize: 16, 
    fontWeight: 'bold',
    color: '#000',
  },
  yearTitle: {
    fontSize: 14, 
    color: '#000',
  },
  headerWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 10, 
    width: '100%', 
  },


  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(90, 90, 90, 0.6)', 
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    borderRadius: 15,
    width: '85%',
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 16, 
    fontWeight: '500',
    marginBottom: 15,
    color: '#4A4A4A', 
  },
  dayButton: {
    width: '100%',
    backgroundColor: '#E0E0E0', 
    paddingVertical: 16, 
    borderRadius: 10,
    marginBottom: 12, 
    alignItems: 'center',
    justifyContent: 'center',
  },
  dayButtonSelected: {
    backgroundColor: '#2D47C3', 
  },
  dayButtonText: {
    fontSize: 16,
    color: '#000', 
    fontWeight: '500',
  },
  dayButtonTextSelected: {
    color: '#FFFFFF',  
  },
  closeButtonContainer: {
    width: '100%',
    marginTop: 15,
    alignItems: 'center',
  },
  closeButton: {
    width: '50%',
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
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

  frequencyText: {
    fontSize: 16,
    color: '#4a4950', 
    fontWeight: '100',
    paddingVertical: 12,
    paddingHorizontal: 14,
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#D1D5DB',
    textAlign: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },



});


export default AddMedicationPage;
