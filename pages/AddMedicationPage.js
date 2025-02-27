import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, TouchableOpacity, Switch, ScrollView, Modal } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import CalendarPicker from 'react-native-calendar-picker';
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


const AddMedicationPage = ({ navigation }) => {
  const [medicationName, setMedicationName] = useState('');
  const [dosage, setDosage] = useState('');
  const [time, setTime] = useState(new Date());
  //const [color, setColor] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [notes, setNotes] = useState('');
  const [alarmEnabled, setAlarmEnabled] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showCalendarModal, setShowCalendarModal] = useState(false); // Estado para mostrar/ocultar el calendario
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [times, setTimes] = useState([]);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [selectedTimeIndex, setSelectedTimeIndex] = useState(null);

  const handleSave = async () => {
    const medicationData = {
      name: medicationName,
      startDate: startDate ? startDate.toISOString() : null,
      endDate: endDate ? endDate.toISOString() : null,
      dosage,
      times: times.map(t => t.toISOString()),
      color: selectedColor,
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

  const onDateChange = (date, type) => {
    if (type === 'END_DATE') {
      setEndDate(date);
    } else {
      setStartDate(date);
      setEndDate(date);
    }
  };

  const handleDeleteTime = (index) => {
    const updatedTimes = times.filter((_, i) => i !== index);
    setTimes(updatedTimes);
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

      {/* Frecuencia de uso con ícono de calendario */}
      <TouchableOpacity
        style={styles.frequencyContainer}
        onPress={() => setShowCalendarModal(true)}
      >
        <Text style={styles.frequencyText}>Frecuencia de uso</Text>
        <Icon name="calendar" size={20} color="#000" />
      </TouchableOpacity>

      {/* Mostrar fechas seleccionadas */}
      {startDate && <Text>Fecha de inicio: {startDate.toDateString()}</Text>}
      {endDate && <Text>Fecha de fin: {endDate.toDateString()}</Text>}

      {/* Modal para el calendario */}
     <Modal
  visible={showCalendarModal}
  transparent={true}
  animationType="slide"
  onRequestClose={() => setShowCalendarModal(false)}
>
  <View style={styles.modalContainer}>
    <View style={styles.calendarContainer}>
      <CalendarPicker
        startFromMonday={true}
        allowRangeSelection={true}
        onDateChange={onDateChange}
        previousComponent={<Text style={styles.navText}>‹</Text>} // Flecha izquierda
        nextComponent={<Text style={styles.navText}>›</Text>} // Flecha derecha
        monthTitleStyle={styles.monthTitle} // Estilo para el título del mes
        yearTitleStyle={styles.yearTitle} // Estilo para el año
        headerWrapperStyle={styles.headerWrapper} // Estilo para el contenedor del encabezado
      />
      <Button title="Cerrar" onPress={() => setShowCalendarModal(false)} />
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
  frequencyContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  frequencyText: {
    fontSize: 16,
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