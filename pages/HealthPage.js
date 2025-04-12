
// HealthPage.js - Página de Salud actualizada
import React, { useLayoutEffect } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';


const HealthPage = () => {
    const navigation = useNavigation();

 useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: 'Salud', // Título de la pantalla
      headerLeft: () => (
        <TouchableOpacity 
          onPress={() => navigation.navigate('Home')} // Navega a Home al presionar
          style={{ marginLeft: 15 }}
        >
          <Ionicons name="arrow-back" size={26} color="#3B49B4" />
        </TouchableOpacity>
      ),
      headerStyle: {
        shadowColor: 'transparent', // Elimina la sombra en iOS
        elevation: 0, // Elimina la sombra en Android
      },
    });
  }, [navigation]);

    return (
        <View style={styles.container}>
            {/* Contenedor del título y la imagen */}
            <View style={styles.headerContainer}>
                <View style={styles.textContainer}>
                    <Text style={styles.title}>Datos de salud</Text>
                    <Text style={styles.subtitle}>Seguimiento de valores y diálisis en el día a día</Text>
                </View>
                <Image source={require('../assets/medicos.png')} style={styles.headerImage} />
            </View>

            {/* Opciones de salud */}
            <TouchableOpacity  style={styles.option} 
             onPress={() => navigation.navigate('Salud', { 
              screen: 'SelectValues'})}
            >
                <Icon name="heart" size={24} color="#3B49B4" style={styles.icon} />
                <View>
                    <Text style={styles.optionTitle}>Valores</Text>
                    <Text style={styles.optionSubtitle}>Introduce tus resultados</Text>
                </View>
            </TouchableOpacity>


            <TouchableOpacity style={styles.option} onPress={() => navigation.navigate('DialysisPage')}>
                <Icon name="water" size={24} color="#3B49B4" style={styles.icon} />
                <View>
                    <Text style={styles.optionTitle}>Diálisis</Text>
                    <Text style={styles.optionSubtitle}>Introduce tus resultados</Text>
                </View>
            </TouchableOpacity>

            <TouchableOpacity 
  style={styles.option} 
  onPress={() => navigation.navigate('Salud', { 
    screen: 'MedicalAppointmentsSelectionPage'
  })}
>
                <Ionicons name="calendar" size={24} color="#3B49B4" style={styles.icon} />
                <View>
                    <Text style={styles.optionTitle}>Citas médicas</Text>
                    <Text style={styles.optionSubtitle}>Añade tus próximas citas</Text>
                </View>
            </TouchableOpacity>

        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FAFAFA',
        padding: 20,
    },
    headerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 20,
    },
    textContainer: {
        flex: 1,
    },
    headerImage: {
        width: 130,
        height: 130,
        resizeMode: 'contain',
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#101432',
        marginBottom: 5,
    },
    subtitle: {
        fontSize: 18,
        color: '#5A5555',
    },
    option: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#E3E3E3',
        padding: 15,
        borderRadius: 10,
        marginBottom: 10,
    },
    icon: {
        marginRight: 15,
    },
    optionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#101432',
    },
    optionSubtitle: {
        fontSize: 14,
        color: '#5A5555',
    }
});

export default HealthPage;