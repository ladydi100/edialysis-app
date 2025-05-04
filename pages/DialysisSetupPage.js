// DialysisSetupPage.js - Selección del tipo de diálisis
import React, { useState ,  useLayoutEffect} from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import BackButton from '../components/BackButton';

const DialysisSetupPage = () => {
    const navigation = useNavigation();
    const [selectedType, setSelectedType] = useState(null);

useLayoutEffect(() => {
  navigation.setOptions({
    headerTitle: '',
    headerLeft: () => <BackButton navigation={navigation} confirm={true} />
  });
}, [navigation]);


    const dialysisTypes = [
        'Hemodiálisis en el centro de diálisis',
        'Hemodiálisis en casa',
        'Diálisis peritoneal en el centro de diálisis',
        'Diálisis peritoneal en casa',
    ];

        const handleNext = () => {
        navigation.navigate('DialysisStartDatePage', { 
            treatmentType: selectedType 
        });
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>¿Qué tipo de tratamiento de diálisis sigues?</Text>
            <Text style={styles.subtitle}>Selecciona el tipo de tratamiento al que te sometes habitualmente.</Text>
            
            {dialysisTypes.map((type, index) => (
                <TouchableOpacity 
                    key={index} 
                    style={[styles.option, selectedType === type && styles.selectedOption]} 
                    onPress={() => setSelectedType(type)}
                >
                    <Text style={styles.optionText}>{type}</Text>
                </TouchableOpacity>
            ))}

          <TouchableOpacity 
    style={[styles.button, !selectedType && styles.buttonDisabled]} 
    onPress={() => selectedType && navigation.navigate('DialysisStartDatePage', { treatmentType: selectedType })}
    disabled={!selectedType}
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

export default DialysisSetupPage;
