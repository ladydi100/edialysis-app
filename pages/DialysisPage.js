// DialysisPage.js - Nueva pantalla de Diálisis
import React from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const DialysisPage = () => {
    const navigation = useNavigation();

    return (
        <ScrollView style={{ flex: 1, backgroundColor: '#FAFAFA', padding: 20 }}>
            <Text style={{ fontSize: 24, fontWeight: 'bold', color: '#101432', marginBottom: 10 }}>
                Control de Diálisis
            </Text>
            
            <Text style={{ fontSize: 16, color: '#5A5555', marginBottom: 20 }}>
                Lleva un registro de tus sesiones de diálisis y consulta datos importantes.
            </Text>

            <TouchableOpacity 
                style={{
                    backgroundColor: '#3B49B4', 
                    padding: 15, 
                    borderRadius: 10, 
                    alignItems: 'center',
                    marginBottom: 20
                }}
                onPress={() => navigation.navigate('DialysisSetupPage')}
            >
                <Text style={{ color: '#FAFAFA', fontSize: 16, fontWeight: 'bold' }}>Añadir sesión</Text>
            </TouchableOpacity>

            <View style={{ padding: 15, backgroundColor: '#E3E3E3', borderRadius: 10 }}>
                <Text style={{ fontSize: 18, fontWeight: 'bold', color: '#101432' }}>Historial de sesiones</Text>
                <Text style={{ color: '#5A5555', marginTop: 5 }}>Aquí aparecerán tus sesiones de diálisis anteriores.</Text>
            </View>
        </ScrollView>
    );
};

export default DialysisPage;
