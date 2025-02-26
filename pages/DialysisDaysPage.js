// DialysisDaysPage.js - Selección de los días de diálisis
import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';

const DialysisDaysPage = () => {
    const navigation = useNavigation();
    const route = useRoute();
    const { startDate } = route.params;
    const [selectedDays, setSelectedDays] = useState([]);

    const daysOfWeek = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];

    const toggleDay = (day) => {
        setSelectedDays((prevDays) =>
            prevDays.includes(day) ? prevDays.filter((d) => d !== day) : [...prevDays, day]
        );
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>¿Cuándo son tus días de diálisis?</Text>
            <Text style={styles.subtitle}>Selecciona los días en los que sueles realizar el tratamiento.</Text>
            
            {daysOfWeek.map((day) => (
                <TouchableOpacity 
                    key={day} 
                    style={[styles.option, selectedDays.includes(day) && styles.selectedOption]} 
                    onPress={() => toggleDay(day)}
                >
                    <Text style={styles.optionText}>{day}</Text>
                </TouchableOpacity>
            ))}

            <TouchableOpacity 
                style={[styles.button, selectedDays.length === 0 && styles.buttonDisabled]} 
                onPress={() => selectedDays.length > 0 && navigation.navigate('DialysisWeightPage', { startDate, selectedDays })}
                disabled={selectedDays.length === 0}
            >
                <Text style={styles.buttonText}>Siguiente</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FAFAFA',
        padding: 20,
        justifyContent: 'center',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#101432',
        marginBottom: 10,
    },
    subtitle: {
        fontSize: 16,
        color: '#5A5555',
        marginBottom: 20,
    },
    option: {
        padding: 15,
        backgroundColor: '#E3E3E3',
        borderRadius: 10,
        marginBottom: 10,
    },
    selectedOption: {
        backgroundColor: '#3B49B4',
    },
    optionText: {
        fontSize: 16,
        color: '#101432',
    },
    button: {
        backgroundColor: '#3B49B4',
        padding: 15,
        borderRadius: 10,
        alignItems: 'center',
        marginTop: 20,
    },
    buttonDisabled: {
        backgroundColor: '#A0A0A0',
    },
    buttonText: {
        color: '#FAFAFA',
        fontSize: 16,
        fontWeight: 'bold',
    },
});

export default DialysisDaysPage;
