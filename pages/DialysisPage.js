// DialysisPage.js - Página de Control de Diálisis
import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';

const DialysisPage = () => {
    const navigation = useNavigation();
    const route = useRoute();
    const { reminders } = route.params || { reminders: {} };

    return (
        <ScrollView style={styles.container}>
            <Text style={styles.title}>Control de Diálisis</Text>
            
            <Text style={styles.description}>
                Lleva un registro de tus sesiones de diálisis y consulta datos importantes.
            </Text>

            <TouchableOpacity 
                style={styles.addButton}
                onPress={() => navigation.navigate('DialysisDaysPage')}
            >
                <Text style={styles.buttonText}>Añadir sesión</Text>
            </TouchableOpacity>

            <View style={styles.historyContainer}>
                <Text style={styles.historyTitle}>Historial de sesiones</Text>
                {Object.keys(reminders).length > 0 ? (
                    Object.entries(reminders).map(([day, time], index) => (
                        <View key={index} style={styles.sessionItem}>
                            <Text style={styles.sessionText}>{day}: {time ? new Date(time).toLocaleTimeString() : 'Sin hora definida'}</Text>
                        </View>
                    ))
                ) : (
                    <Text style={styles.noDataText}>No hay sesiones registradas.</Text>
                )}
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FAFAFA',
        padding: 20,
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
    historyContainer: {
        padding: 15,
        backgroundColor: '#E3E3E3',
        borderRadius: 10,
    },
    historyTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#101432',
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
});

export default DialysisPage;