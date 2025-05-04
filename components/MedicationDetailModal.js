import React, { useRef, useEffect , useState, useContext } from 'react';
import { View, Text, Modal, TouchableOpacity, StyleSheet, Switch, Animated, Easing , Alert} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import EditMedicationModal from './EditMedicationModal';
import { AuthContext } from '../context/AuthContext';
import { softDeleteMedication  } from '../services/medicationService';



const MedicationDetailModal = ({ 
  visible, 
  medication = {
    taken: false,
    alarmEnabled: false,
    time_id: null,
    color: '#FFFFFF',
    name: '',
    dosage: '',
    notes: '',
    time: ''
  },
  onClose, 
  onToggleAlarm, 
  onEdit, 
  onDelete, 
  selectedDate,
  onToggleTaken,
  refreshMedications 
}) => {

  const { userToken } = useContext(AuthContext);
  // Estado local para la animación
  const [localTaken, setLocalTaken] = useState(medication.taken);
  const [localAlarm, setLocalAlarm] = useState(medication.alarmEnabled);

  const takenAnim = useRef(new Animated.Value(medication.taken ? 1 : 0)).current;
  const alarmAnim = useRef(new Animated.Value(medication.alarmEnabled ? 1 : 0)).current;
  const [editModalVisible, setEditModalVisible] = useState(false);



 useEffect(() => {
setLocalTaken(medication.taken);
setLocalAlarm(medication.alarmEnabled);

   // Animar el switch cuando cambia el estado
    Animated.timing(takenAnim, {
      toValue: medication.taken ? 1 : 0,
      duration: 300,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: false,
    }).start();
  }, [medication]);

    const animateSwitch = (animRef, toValue, callback) => {
    Animated.timing(animRef, {
      toValue,
      duration: 200,
      easing: Easing.out(Easing.quad),
      useNativeDriver: false,
    }).start(callback);
  };

// Estilo del Switch animado
 const handleTakenToggle = () => {
    const newValue = !localTaken;
    setLocalTaken(newValue);
    
    // Animar inmediatamente para feedback visual
    animateSwitch(takenAnim, newValue ? 1 : 0, () => {
      // Luego de la animación, llamar a la función para actualizar en el backend
      if (medication.time_id) {
        onToggleTaken(medication.time_id, newValue).catch(() => {
          // Si falla, revertir la animación y el estado
          setLocalTaken(!newValue);
          animateSwitch(takenAnim, newValue ? 0 : 1);
        });
      }
    });
  };


  const handleAlarmToggle = () => {
    const newValue = !localAlarm;
    setLocalAlarm(newValue);
    animateSwitch(alarmAnim, newValue ? 1 : 0, () => {
      onToggleAlarm().catch(() => {
        setLocalAlarm(!newValue);
        animateSwitch(alarmAnim, newValue ? 0 : 1);
      });
    });
  };


 const handleDelete = async () => {
  Alert.alert(
    "Confirmar eliminación",
    "¿Estás seguro de que quieres eliminar este medicamento?",
    [
      { text: "Cancelar", style: "cancel" },
      { 
        text: "Eliminar", 
        onPress: async () => {
          try {
            console.log('Token:', userToken); // Verifica que el token no sea null
            console.log('Medication ID:', medication.time_id);

             const response = await softDeleteMedication(medication.time_id, userToken);

            if (response?.success) {
              refreshMedications();
              onClose();
              Alert.alert('Éxito', response.message || 'Medicamento eliminado');
            } else {
              Alert.alert('Error', response?.error || 'Error desconocido');
            }
          } catch (error) {
            console.error('Error completo:', {
              message: error.message,
              response: error.response?.data,
              request: error.request
            });
            Alert.alert('Error', 'No se pudo eliminar. Verifica la conexión.');
          }
        }
      }
    ]
  );
};





const switchStyle = (anim) => ({
    track: {
      width: 50,
      height: 30,
      borderRadius: 15,
      backgroundColor: anim.interpolate({
        inputRange: [0, 1],
        outputRange: ['#E0E0E0', '#00a887']
      }),
      justifyContent: 'center',
      paddingHorizontal: 2,
    },
    thumb: {
      width: 26,
      height: 26,
      borderRadius: 13,
      backgroundColor: '#FFFFFF',
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.2,
      shadowRadius: 1.5,
      elevation: 2,
      transform: [{
        translateX: anim.interpolate({
          inputRange: [0, 1],
          outputRange: [2, 22]
        })
      }]
    }
  });

  if (!medication) return null;

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const options = { 
      weekday: 'long', 
      day: 'numeric', 
      month: 'long',
      timeZone: 'UTC'
    };
    return date.toLocaleDateString('es-ES', options);
  };


const displayDate = medication.date ? medication.date : 
                    selectedDate ? selectedDate.toISOString().split('T')[0] : 
                    new Date().toISOString().split('T')[0];

const handleEditPress = () => {
  setEditModalVisible(true);
};


const handleSaveEdit = async (editedData) => {
  try {

  onEdit(editedData); 
  setEditModalVisible(false);
        Alert.alert('Éxito', 'Cambios guardados correctamente');
  } catch (error) {
    console.error('Error al guardar cambios:', error);
    Alert.alert('Error al guardar los cambios');
  }
};

const handleEdit = (editedMedication) => {
  setMedications(prevMeds => 
    prevMeds.map(med => 
      med.time_id === editedMedication.time_id ? { ...med, ...editedMedication } : med
    )
  );
  refreshMedications(); // Opcional: doble verificación con nueva carga
};


  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <View style={[styles.colorDot, { backgroundColor: medication.color }]} />
            <Text style={styles.medicationName}>{medication.name}   
             

            </Text>
              <TouchableOpacity onPress={handleDelete} style={{ marginRight: 130 }}>
                <Ionicons name="trash-outline" size={24} color="#EF4444" />
              </TouchableOpacity> 
            <TouchableOpacity onPress={onClose}>
              <Ionicons name="close" size={24} color="#6B7280" />
            </TouchableOpacity>
            
          </View>

          <View style={styles.modalContent}>
            <Text style={styles.dosageText}>
             {formatDate(displayDate)} - {medication.time}
            </Text>
            
            <Text style={styles.dateText}>
              Tomar ({medication.dosage}) de {medication.name} {medication.notes}, según indicación médica.
            </Text>
            
        {/* Switch para estado "tomado" */}
            <View style={styles.switchRow}>
              <Text style={styles.switchLabel}>Desactivar alarma</Text>
              <TouchableOpacity 
                onPress={handleTakenToggle}
                activeOpacity={0.9}
              >
                <Animated.View style={switchStyle(takenAnim).track}>
                  <Animated.View style={switchStyle(takenAnim).thumb} />
                </Animated.View>
              </TouchableOpacity>
            </View>
        

            
            <View style={styles.actionButtons}>
             
             <TouchableOpacity onPress={handleEditPress}  style={styles.editButton}>
             <Text style={styles.editButtonText}>Editar</Text>
            </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>

<EditMedicationModal
  visible={editModalVisible}
  medication={medication}
  onClose={() => setEditModalVisible(false)}
  onSave={handleSaveEdit}
  onDelete={onDelete}
/>


    </Modal>





  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContainer: {
    width: '100%',
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 35,
    maxHeight: '70%',
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
  medicationName: {
    fontSize: 20,
    fontWeight: 'bold',
    flex: 1,
  },
  modalContent: {
    marginBottom: 20,
  },
  dosageText: {
    fontSize: 16,
    marginBottom: 10,
    color: '#6c6a6a',
    fontWeight: 'bold',
  },
  dateText: {
    fontSize: 16,
    color: '#6B7280',
    marginBottom: 20,
  },
  switchRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  switchLabel: {
    fontSize: 16,
    color: '#505050',
    fontWeight: '500',
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    marginTop: 18,
  },
  editButton: {
    borderWidth: 1,
    borderColor: '#3b47b5',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 28,
    backgroundColor: 'white',
  },
  editButtonText: {
    color: '#3b47b5',
    fontWeight: 'bold',
    fontSize: 16,
  },

});

export default MedicationDetailModal;