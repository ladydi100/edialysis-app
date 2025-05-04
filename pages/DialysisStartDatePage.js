import React, { useState, useLayoutEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useNavigation , useRoute} from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons';
import BackButton from '../components/BackButton';

const DialysisStartDatePage = () => {
    const navigation = useNavigation();
    const route = useRoute();
    const [date, setDate] = useState(new Date());
    const [showPicker, setShowPicker] = useState(false);




     const handleNext = () => {
    navigation.navigate('DialysisWeightPage', { 
      startDate: date.toISOString(), 
      treatmentType: route.params?.treatmentType 
    });
  };
useLayoutEffect(() => {
  navigation.setOptions({
    headerTitle: '',
    headerLeft: () => <BackButton navigation={navigation} />
  });
}, [navigation]);


  
    return (
        <View style={styles.container}>
           

            <Text style={styles.title}>¿Cuándo empezaste el tratamiento?</Text>
            <Text style={styles.subtitle}>
                Selecciona la fecha en la que iniciaste tu tratamiento de diálisis.
            </Text>
            
            {/* Selector de fecha */}
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

            {/* Botón para avanzar a la siguiente pantalla (DialysisWeightPage) */}
           <TouchableOpacity 
    style={styles.button} 
    onPress={() => navigation.navigate('DialysisWeightPage', { 
        startDate: date,
        treatmentType: route.params?.treatmentType 
    })}
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
    backButton: {
        position: 'absolute',
        top: 20,
        left: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#101432',
        marginBottom: 10,
        textAlign: 'center',
    },
    subtitle: {
        fontSize: 16,
        color: '#5A5555',
        marginBottom: 20,
        textAlign: 'center',
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
