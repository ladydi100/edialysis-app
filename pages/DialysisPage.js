import React, { useEffect, useState, useContext } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, 
  ActivityIndicator,  Alert  } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons';
import { AuthContext } from '../context/AuthContext';
import { getDialysisTreatment } from '../services/dialysisService';

const DialysisPage = () => {
    const navigation = useNavigation();
    const route = useRoute();
    const { userToken } = useContext(AuthContext);
    const [treatmentData, setTreatmentData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    // Cargar los datos del tratamiento al montar el componente
    useEffect(() => {
        const loadTreatmentData = async () => {
            try {
                const data = await getDialysisTreatment(userToken);
                setTreatmentData(data);
            } catch (error) {
                console.error('Error loading treatment data:', error);
            } finally {
                setIsLoading(false);
            }
        };

        loadTreatmentData();
    }, [userToken]);

    if (isLoading) {
        return (
            <View style={styles.container}>
                <Text>Cargando datos...</Text>
            </View>
        );
    }


const handleNext = () => {
    if (selectedDays.length > 0) {
        navigation.navigate('DialysisRemindersPage', { 
            weight: route.params?.weight,
            selectedDays,
            treatmentType: route.params?.treatmentType,
            startDate: route.params?.startDate
        });
    } else {
        alert('Por favor, selecciona al menos un día.');
    }
};

    return (
        <ScrollView style={styles.container}>
            <Text style={styles.title}>Control de Diálisis</Text>
            
            <Text style={styles.description}>
                Registra tus tratamientos
            </Text>

            <TouchableOpacity 
                style={styles.addButton}
                onPress={() => navigation.navigate('DialysisSetupPage')}
            >
                <Text style={styles.buttonText}>
                    {treatmentData ? 'Añadir tratamiento' : 'Añadir tratamiento'}
                </Text>
            </TouchableOpacity>

            {treatmentData?.dry_weight && (
                <View style={styles.weightContainer}>
                    <Text style={styles.weightTitle}>Peso seco registrado</Text>
                    <Text style={styles.weightText}>{treatmentData.dry_weight} kg</Text>
                </View>
            )}

            {treatmentData?.treatment_type && (
                <View style={styles.typeContainer}>
                    <Text style={styles.typeTitle}>Tipo de tratamiento</Text>
                    <Text style={styles.typeText}>{treatmentData.treatment_type}</Text>
                </View>
            )}

            <View style={styles.historyContainer}>
                <Text style={styles.historyTitle}>Historial de tratamientos</Text>
                {treatmentData?.days && treatmentData.days.length > 0 ? (
                    treatmentData.days.map((day, index) => (
                        <View key={index} style={styles.sessionItem}>
                            <Text style={styles.sessionText}>
                                {day.day_of_week}: {day.reminder_time || 'Sin hora definida'}
                            </Text>
                        </View>
                    ))
                ) : (
                    <Text style={styles.noDataText}>No hay sesiones registradas.</Text>
                )}
            </View>
        </ScrollView>
    );
};

// Estilos
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FAFAFA',
        padding: 20,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#FAFAFA',
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
        marginTop: 10,
    },
    backButton: {
        marginLeft: 15,
    },
});

export default DialysisPage;
