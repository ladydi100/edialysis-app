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
  //const navigation = useNavigation();


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



  // En la función handleSave, asegúrate que los días se guarden en inglés
  const handleSave = async () => {
    const medicationData = {
      name: medicationName,
      dosage,
      times: times.map(t => t.getHours().toString().padStart(2, '0') + ':' + t.getMinutes().toString().padStart(2, '0')),
      color: selectedColor,
      notes,
      alarmEnabled,
      days: selectedDays.map(day => DAYS_MAPPING[day])
    };

    console.log('Enviando datos:', medicationData); // Para debug

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
          placeholderTextColor="#6B7280" // Gris más claro para el placeholder
        />
      </View>



      {/* Frecuencia de uso: Selección de días de la semana */}
      <View style={styles.section}>
        <TouchableOpacity onPress={() => setShowDaysModal(true)} style={styles.calendarIconContainer}>
          <Text style={{ fontSize: 16, color: '#6B7280', fontWeight: '400' }}>Frecuencia de uso</Text>
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
              <Button title="Aceptar" onPress={() => setShowDaysModal(false)} />
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
          placeholderTextColor="#6B7280" // Gris más claro para el placeholder
        />
      </View>



      <TouchableOpacity onPress={() => setShowTimePicker(true)} style={styles.timeInput}>
        <Text style={styles.timeInputText}>Añadir hora de toma</Text>
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

      {/* Alarma 
      <View style={styles.switchContainer}>
        <Text>Activar alarma</Text>
        <Switch
          value={alarmEnabled}
          onValueChange={setAlarmEnabled}
        />
      </View>

      */}

      {/* Botones de guardar y cancelar */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.cancelButton} onPress={() => navigation.goBack()}>
          <Text style={styles.cancelButtonText}>Cancelar</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
          <Text style={styles.saveButtonText}>Guardar</Text>
        </TouchableOpacity>
      </View>

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
    height: 50,
    borderColor: '#D1D5DB',
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 14,
    backgroundColor: '#F8FAFC',
    marginBottom: 16,
    fontSize: 16,
    color: '#374151', //  Asegúrate de que este color sea igual al de "Añadir hora de toma"
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
    color: '#374151', //  Mismo gris oscuro que "Añadir hora de toma"
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
    borderRadius: 10,
    paddingLeft: 12,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    marginBottom: 12,
  },
  colorLabel: {
    fontSize: 16,
    color: '#6B7280',
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


  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(90, 90, 90, 0.6)', // Gris más claro con opacidad reducida
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    borderRadius: 15,
    width: '85%',
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 16, // Menos llamativo
    fontWeight: '500',
    marginBottom: 15,
    color: '#4A4A4A', // Gris oscuro
  },
  dayButton: {
    width: '100%',
    backgroundColor: '#E0E0E0', // Gris más oscuro cuando no está seleccionado
    paddingVertical: 16, // Más separación
    borderRadius: 10,
    marginBottom: 12, // Más espacio entre los días
    alignItems: 'center',
    justifyContent: 'center',
  },
  dayButtonSelected: {
    backgroundColor: '#2D47C3', // Azul más oscuro cuando está seleccionado
  },
  dayButtonText: {
    fontSize: 16,
    color: '#000', // Letra en negro cuando no está seleccionado
    fontWeight: '500',
  },
  dayButtonTextSelected: {
    color: '#FFFFFF',  // Texto en blanco cuando está seleccionado
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

  timeInput: {
    height: 50,
    borderColor: '#D1D5DB',
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 14,
    backgroundColor: '#F8FAFC',
    marginBottom: 16,
    justifyContent: 'center',
  },

  timeInputText: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'left',
  },

  selectedDaysText: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 8, //  Añade esta línea para separar
  },

  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 24,
    marginBottom: 32,
  },

  cancelButton: {
    flex: 1,
    height: 50,
    marginRight: 8,
    borderWidth: 1,
    borderColor: '#3B47B4',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#00000000',
  },

  cancelButtonText: {
    fontSize: 16,
    color: '#3B47B4',
  },

  saveButton: {
    flex: 1,
    height: 50,
    marginLeft: 8,
    backgroundColor: '#2D47C3',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },

  saveButtonText: {
    fontSize: 16,
    color: '#FFFFFF',
    fontWeight: '500',
  },




});


const pickerSelectStyles = StyleSheet.create({
  inputIOS: {
    height: 50,
    borderColor: '#D1D5DB',
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 14,
    backgroundColor: '#F8FAFC',
    marginBottom: 16,
    fontSize: 16,
    color: '#374151',
  },
  inputAndroid: {
    height: 50,
    borderColor: '#D1D5DB',
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 14,
    backgroundColor: '#F8FAFC',
    marginBottom: 16,
    fontSize: 16,
    color: '#374151',
  },

  frequencyText: {
    fontSize: 16,
    color: '#4a4950', // 🔥 Mismo gris oscuro para coherencia
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
