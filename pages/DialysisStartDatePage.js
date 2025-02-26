// DialysisStartDatePage.js - Selección de la fecha de inicio del tratamiento
import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useNavigation } from '@react-navigation/native';

const DialysisStartDatePage = () => {
    const navigation = useNavigation();
    const [date, setDate] = useState(new Date());
    const [showPicker, setShowPicker] = useState(false);

    return (
        <View style={styles.container}>
            <Text style={styles.title}>¿Cuándo empezaste el tratamiento?</Text>
            <Text style={styles.subtitle}>Selecciona la fecha en la que iniciaste tu tratamiento de diálisis.</Text>
            
            <TouchableOpacity style={styles.dateButton} onPress={() => setShowPicker(true)}>
                <Text style={styles.dateText}>{date.toDateString()}</Text>
            </TouchableOpacity>

            {showPicker && (
                <DateTimePicker
                    value={date}
                    mode="date"
                    display="default"
                    onChange={(event, selectedDate) => {
                        setShowPicker(false);
                        if (selectedDate) setDate(selectedDate);
                    }}
                />
            )}

            <TouchableOpacity 
                style={styles.button} 
                onPress={() => navigation.navigate('DialysisDaysPage', { startDate: date })}
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
    dateButton: {
        backgroundColor: '#E3E3E3',
        padding: 15,
        borderRadius: 10,
        alignItems: 'center',
        marginBottom: 20,
    },
    dateText: {
        fontSize: 16,
        color: '#101432',
    },
    button: {
        backgroundColor: '#3B49B4',
        padding: 15,
        borderRadius: 10,
        alignItems: 'center',
    },
    buttonText: {
        color: '#FAFAFA',
        fontSize: 16,
        fontWeight: 'bold',
    },
});

export default DialysisStartDatePage;
