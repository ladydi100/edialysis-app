import React, { useEffect, useState, useContext ,  useLayoutEffect} from 'react';
import {   View, Text, TouchableOpacity, ScrollView, StyleSheet, 
  ActivityIndicator, Modal, TextInput, Alert, FlatList } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { AuthContext } from '../context/AuthContext';
import { getDialysisTreatment, updateDialysisTreatment } from '../services/dialysisService';
import DateTimePicker from '@react-native-community/datetimepicker';
import Icon from 'react-native-vector-icons/Ionicons';
import { Ionicons } from '@expo/vector-icons';
import BackButton from '../components/BackButton';


const DialysisPage = () => {
    const navigation = useNavigation();
    const { userToken } = useContext(AuthContext);
    const [treatmentData, setTreatmentData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [editModalVisible, setEditModalVisible] = useState(false); // Añadido esta línea
    const [dayModalVisible, setDayModalVisible] = useState(false);
    const [currentField, setCurrentField] = useState(null);
    const [currentDay, setCurrentDay] = useState(null); // Añadido esta línea
    const [tempValue, setTempValue] = useState('');
    const [tempTime, setTempTime] = useState(''); // Añadido esta línea
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [showTimePicker, setShowTimePicker] = useState(false); // Añadido esta línea
    const [isUpdating, setIsUpdating] = useState(false);

 useLayoutEffect(() => {
  navigation.setOptions({
    headerTitle: '',
    headerLeft: () => <BackButton navigation={navigation} />
  });
}, [navigation]);


    useEffect(() => {
        loadTreatmentData();
    }, [userToken]);

    const loadTreatmentData = async () => {
        setIsLoading(true);
        try {
            const data = await getDialysisTreatment(userToken);
            setTreatmentData(data);
        } catch (error) {
            console.error('Error loading treatment data:', error);
            Alert.alert('Error', 'No se pudo cargar la información del tratamiento');
        } finally {
            setIsLoading(false);
        }
    };

    // Funciones para editar campos principales (tipo, fecha, peso)
    const handleEditField = (field, value) => {
        setCurrentField(field);
        setTempValue(value || '');
        setEditModalVisible(true);
    };

    const handleSave = async () => {
        if (currentField === 'dry_weight' && isNaN(parseFloat(tempValue))) {
            Alert.alert('Error', 'Por favor ingrese un valor numérico válido para el peso');
            return;
        }

        try {
            const updatedData = {
                ...treatmentData,
                [currentField]: currentField === 'dry_weight' ? parseFloat(tempValue) : tempValue
            };
            
            await updateDialysisTreatment(userToken, updatedData);
            setTreatmentData(updatedData);
            setEditModalVisible(false);
            Alert.alert('Éxito', 'Datos actualizados correctamente');
        } catch (error) {
            console.error('Error updating treatment:', error);
            Alert.alert('Error', 'No se pudo actualizar la información');
        }
    };

    const handleDateChange = async (event, selectedDate) => {
        setShowDatePicker(false);
        
        if (selectedDate) {
            setIsUpdating(true);
            const formattedDate = selectedDate.toISOString().split('T')[0];
            
            try {
                setTreatmentData(prev => ({
                    ...prev,
                    start_date: formattedDate
                }));
                
                await updateDialysisTreatment(userToken, {
                    ...treatmentData,
                    start_date: formattedDate
                });
                
            } catch (error) {
                console.error('Error updating date:', error);
                Alert.alert('Error', 'No se pudo actualizar la fecha');
                loadTreatmentData();
            } finally {
                setIsUpdating(false);
            }
        }
    };

    // Funciones para editar días de tratamiento
    const handleEditDay = (day) => {
        setCurrentDay(day);
        setTempTime(day.reminder_time || '');
        setDayModalVisible(true);
    };

    const handleAddDay = () => {
        setCurrentDay({ day_of_week: 'Lunes', reminder_time: null });
        setTempTime('');
        setDayModalVisible(true);
    };

    const handleSaveDay = async () => {
        if (!currentDay) return;
        
        setIsUpdating(true);
        try {
            const updatedDays = treatmentData.days ? [...treatmentData.days] : [];
            const existingIndex = updatedDays.findIndex(d => d.day_of_week === currentDay.day_of_week);
            
            if (existingIndex >= 0) {
                updatedDays[existingIndex] = {
                    ...updatedDays[existingIndex],
                    reminder_time: tempTime || null
                };
            } else {
                updatedDays.push({
                    day_of_week: currentDay.day_of_week,
                    reminder_time: tempTime || null
                });
            }
            
            await updateDialysisTreatment(userToken, {
                ...treatmentData,
                days: updatedDays
            });
            
            setTreatmentData(prev => ({
                ...prev,
                days: updatedDays
            }));
            
            setDayModalVisible(false);
        } catch (error) {
            console.error('Error saving day:', error);
            Alert.alert('Error', 'No se pudo guardar los cambios');
        } finally {
            setIsUpdating(false);
        }
    };

    const handleDeleteDay = async () => {
        if (!currentDay) return;
        
        Alert.alert(
            'Confirmar eliminación',
            `¿Estás seguro de eliminar el tratamiento del ${currentDay.day_of_week}?`,
            [
                { text: 'Cancelar', style: 'cancel' },
                { 
                    text: 'Eliminar', 
                    style: 'destructive',
                    onPress: async () => {
                        setIsUpdating(true);
                        try {
                            const updatedDays = treatmentData.days.filter(
                                d => d.day_of_week !== currentDay.day_of_week
                            );
                            
                            await updateDialysisTreatment(userToken, {
                                ...treatmentData,
                                days: updatedDays
                            });
                            
                            setTreatmentData(prev => ({
                                ...prev,
                                days: updatedDays
                            }));
                            
                            setDayModalVisible(false);
                        } catch (error) {
                            console.error('Error deleting day:', error);
                            Alert.alert('Error', 'No se pudo eliminar el día');
                        } finally {
                            setIsUpdating(false);
                        }
                    }
                }
            ]
        );
    };

    const handleTimeChange = (event, selectedTime) => {
        setShowTimePicker(false);
        if (selectedTime) {
            const hours = selectedTime.getHours().toString().padStart(2, '0');
            const minutes = selectedTime.getMinutes().toString().padStart(2, '0');
            setTempTime(`${hours}:${minutes}`);
        }
    };

    const renderDayItem = ({ item }) => (
        <View style={styles.sessionItem}>
            <Text style={styles.sessionText}>
                {item.day_of_week} | {item.reminder_time || 'Sin hora definida'}
            </Text>
            <TouchableOpacity 
                style={styles.editButton}
                onPress={() => handleEditDay(item)}
            >
                <Icon name="create-outline" size={20} color="#3B49B4" />
            </TouchableOpacity>
        </View>
    );

    const formatDate = (dateString) => {
        if (!dateString) return 'No especificada';
        const options = { day: 'numeric', month: 'long', year: 'numeric' };
        return new Date(dateString).toLocaleDateString('es-ES', options);
    };

    if (isLoading) {
        return (
            <View style={styles.container}>
                <ActivityIndicator size="large" color="#3B49B4" />
            </View>
        );
    }

    return (
        <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
            {isUpdating && (
                <View style={styles.updatingOverlay}>
                    <ActivityIndicator size="large" color="#3B49B4" />
                </View>
            )}

            <Text style={styles.title}>Control de Diálisis</Text>
            <Text style={styles.description}>Registra tus tratamientos</Text>

            <TouchableOpacity 
                style={styles.addButton}
                onPress={() => navigation.navigate('DialysisSetupPage')}
            >
                <Text style={styles.buttonText}>Añadir tratamiento</Text>
            </TouchableOpacity>

            {/* Campos principales editables */}
            <TouchableOpacity 
                style={styles.typeContainer} 
                onPress={() => handleEditField('treatment_type', treatmentData?.treatment_type)}
            >
                <Text style={styles.typeTitle}>Tipo de tratamiento</Text>
                <Text style={styles.typeText}>
                    {treatmentData?.treatment_type || 'No especificado'}
                </Text>
            </TouchableOpacity>

            <TouchableOpacity 
                style={styles.typeContainer}
                onPress={() => setShowDatePicker(true)}
                disabled={isUpdating}
            >
                <Text style={styles.typeTitle}>Fecha de inicio</Text>
                <Text style={styles.typeText}>
                    {formatDate(treatmentData?.start_date)}
                </Text>
            </TouchableOpacity>

            <TouchableOpacity 
                style={styles.weightContainer}
                onPress={() => handleEditField('dry_weight', treatmentData?.dry_weight)}
            >
                <Text style={styles.weightTitle}>Peso seco</Text>
                <Text style={styles.weightText}>
                    {treatmentData?.dry_weight ? `${treatmentData.dry_weight} kg` : 'No especificado'}
                </Text>
            </TouchableOpacity>

            {/* Historial de tratamientos */}
            <View style={styles.historyContainer}>
                <View style={styles.historyHeader}>
                    <Text style={styles.historyTitle}>Historial de tratamientos</Text>
                    <TouchableOpacity 
                        style={styles.addDayButton}
                        onPress={handleAddDay}
                    >
                        <Icon name="add" size={24} color="#3B49B4" />
                    </TouchableOpacity>
                </View>
                
                {treatmentData?.days && treatmentData.days.length > 0 ? (
                    <FlatList
                        data={treatmentData.days}
                        renderItem={renderDayItem}
                        keyExtractor={(item, index) => index.toString()}
                        scrollEnabled={false}
                    />
                ) : (
                    <Text style={styles.noDataText}>No hay sesiones registradas</Text>
                )}
            </View>

            <View style={styles.bottomSpacer} />

            {/* Modal para editar campos principales */}
            <Modal
                visible={editModalVisible}
                animationType="slide"
                transparent={true}
                onRequestClose={() => setEditModalVisible(false)}
            >
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>
                            Editar {currentField === 'treatment_type' ? 'Tipo de tratamiento' : 'Peso seco'}
                        </Text>
                        
                        {currentField === 'treatment_type' ? (
                            <View style={styles.pickerContainer}>
                                {[
                                    'Hemodiálisis en centro', 
                                    'Hemodiálisis en casa', 
                                    'Diálisis peritoneal en centro', 
                                    'Diálisis peritoneal en casa'
                                ].map((item, index) => (
                                    <TouchableOpacity
                                        key={index}
                                        style={[
                                            styles.optionItem,
                                            tempValue === item && styles.selectedOption
                                        ]}
                                        onPress={() => setTempValue(item)}
                                    >
                                        <Text style={styles.optionText}>{item}</Text>
                                    </TouchableOpacity>
                                ))}
                            </View>
                        ) : (
                            <View style={styles.inputContainer}>
                                <TextInput
                                    style={styles.input}
                                    keyboardType="numeric"
                                    value={tempValue ? tempValue.toString() : ''}
                                    onChangeText={setTempValue}
                                    placeholder="Ingrese el peso seco"
                                />
                                <Text style={styles.unitText}>kg</Text>
                            </View>
                        )}

                        <View style={styles.modalButtons}>
                            <TouchableOpacity 
                                style={styles.cancelButton}
                                onPress={() => setEditModalVisible(false)}
                            >
                                <Text style={styles.cancelButtonText}>Cancelar</Text>
                            </TouchableOpacity>
                            <TouchableOpacity 
                                style={styles.saveButton}
                                onPress={handleSave}
                            >
                                <Text style={styles.saveButtonText}>Guardar</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>

            {/* Modal para editar días */}
            <Modal
                visible={dayModalVisible}
                animationType="slide"
                transparent={true}
                onRequestClose={() => setDayModalVisible(false)}
            >
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>
                            {currentDay?.reminder_time ? 'Editar tratamiento' : 'Agregar tratamiento'}
                        </Text>
                        
                        <View style={styles.dayPickerContainer}>
                            <Text style={styles.label}>Día de la semana:</Text>
                            <View style={styles.dayPicker}>
                                {['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'].map(day => (
                                    <TouchableOpacity
                                        key={day}
                                        style={[
                                            styles.dayOption,
                                            currentDay?.day_of_week === day && styles.selectedDayOption
                                        ]}
                                        onPress={() => setCurrentDay(prev => ({ ...prev, day_of_week: day }))}
                                    >
                                        <Text style={styles.dayOptionText}>{day}</Text>
                                    </TouchableOpacity>
                                ))}
                            </View>
                        </View>
                        
                        <View style={styles.timeContainer}>
                            <Text style={styles.label}>Hora del tratamiento:</Text>
                            <TouchableOpacity 
                                style={styles.timeInput}
                                onPress={() => setShowTimePicker(true)}
                            >
                                <Text style={styles.timeText}>
                                    {tempTime || 'Seleccionar hora'}
                                </Text>
                            </TouchableOpacity>
                        </View>
                        
                        <View style={styles.modalButtons}>
                            {currentDay?.reminder_time && (
                                <TouchableOpacity 
                                    style={styles.deleteButton}
                                    onPress={handleDeleteDay}
                                    disabled={isUpdating}
                                >
                                    <Text style={[styles.modalButtonTextd, styles.actionButtonText]}>Eliminar</Text>
                                </TouchableOpacity>
                            )}
                            
                            <TouchableOpacity 
                                style={styles.cancelButton}
                                onPress={() => setDayModalVisible(false)}
                                disabled={isUpdating}
                            >
                                <Text style={[styles.modalButtonText, styles.cancelButtonTexth]}>Cancelar</Text>
                            </TouchableOpacity>
                            
                            <TouchableOpacity 
                                style={styles.saveButton}
                                onPress={handleSaveDay}
                                disabled={isUpdating}
                            >
                                <Text style={[styles.modalButtonTextg, styles.actionButtonText]}>Guardar</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>

            {showDatePicker && (
                <DateTimePicker
                    value={treatmentData?.start_date ? new Date(treatmentData.start_date) : new Date()}
                    mode="date"
                    display="default"
                    onChange={handleDateChange}
                    locale="es-ES"
                />
            )}

            {showTimePicker && (
                <DateTimePicker
                    value={tempTime ? new Date(`1970-01-01T${tempTime}`) : new Date()}
                    mode="time"
                    is24Hour={true}
                    display="default"
                    onChange={handleTimeChange}
                />
            )}
        </ScrollView>
    );
};

// Estilos (mantener los mismos que en tu código original)
const styles = StyleSheet.create({
   container: {
        flex: 1,
        backgroundColor: '#FAFAFA',
        padding: 20,
    },
    scrollContent: {
        paddingBottom: 80,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#101432',
        marginBottom: 10,
    },
    description: {
        fontSize: 16,
        color: '#5A5555',
        marginBottom: 20,
    },
    addButton: {
        backgroundColor: '#3B49B4',
        padding: 15,
        borderRadius: 10,
        alignItems: 'center',
        marginBottom: 20,
    },
    buttonText: {
        color: '#FAFAFA',
        fontSize: 16,
        fontWeight: 'bold',
    },
    typeContainer: {
        padding: 15,
        backgroundColor: '#E3E3E3',
        borderRadius: 10,
        marginBottom: 20,
    },
    typeTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#101432',
    },
    typeText: {
        fontSize: 16,
        color: '#101432',
        marginTop: 5,
    },
    weightContainer: {
        padding: 15,
        backgroundColor: '#E3E3E3',
        borderRadius: 10,
        marginBottom: 20,
    },
    weightTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#101432',
    },
    weightText: {
        fontSize: 16,
        color: '#101432',
        marginTop: 5,
    },
    historyContainer: {
        padding: 15,
        backgroundColor: '#E3E3E3',
        borderRadius: 10,
    },
    historyTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#101432',
        marginBottom: 10,
    },
    sessionItem: {
        marginTop: 10,
        padding: 10,
        backgroundColor: '#D7DAF2',
        borderRadius: 8,
    },
    sessionText: {
        color: '#101432',
        fontSize: 16,
    },
    noDataText: {
        color: '#5A5555',
        fontSize: 14,
        marginTop: 5,
    },
    bottomSpacer: {
        height: 10,
    },
    // Estilos para el modal de edición
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.5)',
    },
    modalContent: {
        width: '90%',
        backgroundColor: 'white',
        borderRadius: 10,
        padding: 20,
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 20,
        textAlign: 'center',
        color: '#101432',
    },
    pickerContainer: {
        marginBottom: 20,
    },
    optionItem: {
        padding: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    selectedOption: {
        backgroundColor: '#F0F4FF',
    },
    optionText: {
        fontSize: 16,
        color: '#101432',
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        paddingHorizontal: 15,
        marginBottom: 20,
    },
    input: {
        flex: 1,
        fontSize: 16,
        paddingVertical: 15,
        color: '#101432',
    },
    unitText: {
        fontSize: 16,
        color: '#5A5555',
        marginLeft: 10,
    },
      modalButtons: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 15,
        paddingHorizontal: 5,
    },
    cancelButton: {
        backgroundColor: '#E3E3E3',
        padding: 15,
        borderRadius: 5,
        flex: 1,
        marginRight: 10,
        alignItems: 'center',
    },
    saveButton: {
        backgroundColor: '#3B49B4',
        padding: 15,
        borderRadius: 5,
        flex: 1,
        alignItems: 'center',
    },
    cancelButtonText: {
        color: '#101432',
        fontSize: 16,
        fontWeight: 'bold',
    },
     cancelButtonTexth: {
        color: '#101432',
        fontSize: 13,
        fontWeight: 'bold',
    },
    saveButtonText: {
        color: '#FAFAFA',
        fontSize: 16,
        fontWeight: 'bold',
    },
      updatingOverlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(255,255,255,0.7)',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1000,
    },
 historyHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 10,
    },
    addDayButton: {
        padding: 5,
    },
    sessionItem: {
        marginTop: 10,
        padding: 10,
        backgroundColor: '#D7DAF2',
        borderRadius: 8,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    editButton: {
        padding: 5,
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.5)',
    },
    modalContent: {
        width: '90%',
        backgroundColor: 'white',
        borderRadius: 10,
        padding: 20,
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 20,
        textAlign: 'center',
        color: '#101432',
    },
    dayPickerContainer: {
        marginBottom: 20,
    },
    dayPicker: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        marginTop: 10,
    },
    dayOption: {
        width: '30%',
        padding: 10,
        marginBottom: 10,
        borderWidth: 1,
        borderColor: '#E3E3E3',
        borderRadius: 5,
        alignItems: 'center',
    },
    selectedDayOption: {
        backgroundColor: '#F0F4FF',
        borderColor: '#3B49B4',
    },
    dayOptionText: {
        fontSize: 14,
    },
    timeContainer: {
        marginBottom: 20,
    },
    label: {
        fontSize: 16,
        marginBottom: 5,
        color: '#101432',
    },
    timeInput: {
        borderWidth: 1,
        borderColor: '#E3E3E3',
        borderRadius: 5,
        padding: 15,
    },
    timeText: {
        fontSize: 16,
    },

    deleteButton: {
        backgroundColor: '#F8F9FA',
         borderWidth: 1,
        borderColor: '#D64550',
        padding: 15,
        borderRadius: 5,
        flex: 1,
        marginRight: 10,
        alignItems: 'center',
    },
  deleteButtonText: {
        color: 'white',
        fontWeight: 'bold',
    },

     modalButtonText: {
        fontSize: 13,        // Reducido ligeramente
        fontWeight: 'bold',
        textAlign: 'center',
    },

     modalButtonTextd: {
        fontSize: 13,        // Reducido ligeramente
        fontWeight: 'bold',
        textAlign: 'center',
        marginLeft: 5
    },

       modalButtonTextg: {
        fontSize: 13,        // Reducido ligeramente
        fontWeight: 'bold',
        textAlign: 'center',
          color: '#FAFAFA',
    },

   modalActionButton: {
        flex: 1,
        paddingVertical: 10,  // Reducido de 15 a 10
        paddingHorizontal: 5,
        borderRadius: 5,
        alignItems: 'center',
        justifyContent: 'center',
        marginHorizontal: 4,  // Espaciado más ajustado
        minHeight: 40,       // Altura mínima definida
    },





});

export default DialysisPage;
