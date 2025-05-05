import React, { useState, useEffect , useRef } from 'react';
import { View, Text, Modal, TouchableOpacity, StyleSheet, TextInput, Alert,  KeyboardAvoidingView, ScrollView, Platform, Keyboard, Dimensions,  findNodeHandle } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { updateMedication } from '../services/medicationService';
import DateTimePicker from '@react-native-community/datetimepicker';



const screenHeight = Dimensions.get('window').height;
const EditMedicationModal = ({ 
  visible, 
  medication,
  onClose, 
  onSave,
  onDelete
}) => {
  const [editedMedication, setEditedMedication] = useState({
    name: medication.name,
    dosage: medication.dosage,
    time: medication.time,
    notes: medication.notes
  });

 // Estado para el DateTimePicker
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [selectedTime, setSelectedTime] = useState(new Date());
const [keyboardOffset, setKeyboardOffset] = useState(0);
  const notesInputRef = useRef(null);
  const scrollViewRef = useRef(null);

  const handleSave = async () => {
    try {
  
      await onSave(editedMedication);
      onClose();
    } catch (error) {
      console.error('Error al guardar cambios:', error);
      alert('Error al guardar los cambios');
    }
  };


 useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      'keyboardDidShow',
      (e) => {

        if (notesInputRef.current?.isFocused()) {
          scrollToInput(notesInputRef.current);
        }
      }
    );

    return () => {
      keyboardDidShowListener.remove();
    };
  }, []);


 const scrollToInput = (reactNode) => {
    scrollViewRef.current?.scrollResponderScrollNativeHandleToKeyboard(
      findNodeHandle(reactNode),
      100, 
      true
    );
  };


  useEffect(() => {
  const timeParts = medication.time.split(':');
    const timeDate = new Date();
    timeDate.setHours(parseInt(timeParts[0], 10));
    timeDate.setMinutes(parseInt(timeParts[1], 10));
    setSelectedTime(timeDate);

   
    setEditedMedication({
      name: medication.name,
      dosage: medication.dosage,
      time: medication.time,
      notes: medication.notes
    });
  }, [visible, medication]);

 const handleTimeChange = (event, selectedDate) => {
    setShowTimePicker(false);
    if (selectedDate) {
      const formattedTime = selectedDate.toTimeString().substring(0, 5);
      setSelectedTime(selectedDate);
      setEditedMedication({
        ...editedMedication,
        time: formattedTime
      });
    }
  };

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >

 <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : null}
        style={styles.modalOverlay}
         keyboardVerticalOffset={Platform.OS === 'ios' ? 40 : 0}
      >
     <ScrollView
          ref={scrollViewRef}
          contentContainerStyle={styles.scrollContainer}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >



         <View style={[
            styles.modalContainer,
            { maxHeight: screenHeight * 0.8 }
          ]}>
            <View style={styles.modalHeader}>
              <View style={[styles.colorDot, { backgroundColor: medication.color }]} />
              <Text style={styles.modalTitle}>Editar Medicamento</Text>
              <TouchableOpacity onPress={onClose}>
                <Ionicons name="close" size={24} color="#6B7280" />
              </TouchableOpacity>
            </View>

          <View style={styles.modalContent}>
            {/* Nombre del medicamento */}
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Nombre</Text>
              <TextInput
                style={styles.input}
                value={editedMedication.name}
                onChangeText={(text) => setEditedMedication({...editedMedication, name: text})}
              />
            </View>

            {/* Dosis */}
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Dosis</Text>
              <TextInput
                style={styles.input}
                value={editedMedication.dosage}
                onChangeText={(text) => setEditedMedication({...editedMedication, dosage: text})}
                keyboardType="numeric"
              />
            </View>

            {/* Hora */}
           <View style={styles.inputContainer}>
              <Text style={styles.label}>Hora</Text>
              <TouchableOpacity onPress={() => setShowTimePicker(true)}>
                <TextInput
                  style={styles.input}
                  value={editedMedication.time}
                  editable={false}
                  placeholder="Seleccionar hora"
                />
              </TouchableOpacity>
              {showTimePicker && (
                <DateTimePicker
                  value={selectedTime}
                  mode="time"
                  is24Hour={true}
                  display="default"
                  onChange={handleTimeChange}
                />
              )}
            </View>

            {/* Notas */}
             <View style={styles.inputContainer}>
              <Text style={styles.label}>Notas</Text>
              <TextInput
                ref={notesInputRef}
                style={[styles.notesInput, { height: 100 }]}
                value={editedMedication.notes}
                onChangeText={(text) => setEditedMedication({...editedMedication, notes: text})}
                multiline
                textAlignVertical="top"
                onFocus={() => {
                  setTimeout(() => {
                    scrollToInput(notesInputRef.current);
                  }, 100);
                }}
              />
            </View>

            <View style={styles.actionButtons}>
                           
              <TouchableOpacity onPress={handleSave} style={styles.saveButton}>
                <Text style={styles.saveButtonText}>Guardar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
        
     </ScrollView>
      </KeyboardAvoidingView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
   scrollContainer: {
    flexGrow: 1,
    justifyContent: 'flex-end',
  },
  modalContainer: {
    width: '100%',
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 25,
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  colorDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 10,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    flex: 1,
  },
  modalContent: {
    marginBottom: 20,
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    color: '#505050',
    marginBottom: 8,
    fontWeight: '500',
  },
  input: {
    height: 50,
    borderColor: '#D1D5DB',
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 14,
    backgroundColor: '#F8FAFC',
    fontSize: 16,
    color: '#374151',
  },
  actionButtons: {
   alignItems: 'center', 
    marginTop: 15,
  },
  deleteButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#EF4444',
  },
 
  saveButton: {
    backgroundColor: '#3B49B4',
    paddingVertical: 12,
    paddingHorizontal: 12,
    //padding: 12,
    borderRadius: 8,
      alignItems: 'center',
    width: 100,
   
    
    
  },
  saveButtonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 16,
  },
    notesInput: {
    borderColor: '#D1D5DB',
    borderWidth: 1,
    borderRadius: 10,
    padding: 14,
    backgroundColor: '#F8FAFC',
    fontSize: 16,
    color: '#374151',
    textAlignVertical: 'top',
  },
});

export default EditMedicationModal;