import React from 'react';
import { View, Text, ScrollView, StyleSheet, Image, TouchableOpacity } from 'react-native';

const HomePage = () => {
  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.greeting}>Hola, <Text style={styles.bold}>¡Juan!</Text></Text>
        <Image source={require('../assets/Juan.png')} style={styles.avatar} />
      </View>

      <Text style={styles.sectionTitle}>Valores de salud</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.healthValuesContainer}>
        <View style={[styles.healthCard, styles.cardBlue]}>
          <Image source={require('../assets/frecuencia-cardiaca.png')} style={styles.iconSmall} />
          <Text style={styles.healthValue}>75</Text>
          <Text style={styles.healthLabel}>Frecuencia cardíaca</Text>
        </View>
        <View style={[styles.healthCard, styles.cardTeal]}>
          <Image source={require('../assets/corazon.png')} style={styles.iconSmall} />
          <Text style={styles.healthValue}>180/110</Text>
          <Text style={styles.healthLabel}>Presión arterial</Text>
        </View>
        <View style={[styles.healthCard, styles.cardRed]}>
          <Image source={require('../assets/Peso.png')} style={styles.iconSmall} />
          <Text style={styles.healthValue}>96</Text>
          <Text style={styles.healthLabel}>Peso (kg)</Text>
        </View>
        <View style={[styles.healthCard, styles.cardYellow]}>
          <Image source={require('../assets/Gota.png')} style={styles.iconSmall} />
          <Text style={styles.healthValue}>110</Text>
          <Text style={styles.healthLabel}>Glucosa (mg/dl)</Text>
        </View>
      </ScrollView>

      <Text style={styles.sectionTitle}>Tu medicación</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.medicationContainer}>
        <View style={[styles.medicationCard, styles.selectedMedication]}>
          <View style={styles.medicationHeader}>
            <View style={[styles.dot, { backgroundColor: 'green' }]} />
            <Text style={styles.medicationTime}>10:00</Text>
          </View>
          <Text style={styles.medicationName}>Paracetamol</Text>
          <View style={styles.checkboxSelected} />
        </View>
        <View style={styles.medicationCard}>
          <View style={styles.medicationHeader}>
            <View style={[styles.dot, { backgroundColor: 'purple' }]} />
            <Text style={styles.medicationTime}>10:45</Text>
          </View>
          <Text style={styles.medicationName}>Enalapril</Text>
          <View style={styles.checkbox} />
        </View>
        <View style={styles.medicationCard}>
          <View style={styles.medicationHeader}>
            <View style={[styles.dot, { backgroundColor: 'orange' }]} />
            <Text style={styles.medicationTime}>11:30</Text>
          </View>
          <Text style={styles.medicationName}>Diálisis</Text>
          <View style={styles.checkbox} />
        </View>
      </ScrollView>

      <Text style={styles.sectionTitle}>Citas médicas</Text>
      <View style={styles.appointmentCard}>
        <Text>Próxima cita: Cardiología - Hospital Universitario</Text>
        <TouchableOpacity style={styles.button}><Text style={styles.buttonText}>Confirmar</Text></TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 20,
  },
  greeting: {
    fontSize: 24,
    color: '#22499C',
  },
  bold: {
    fontWeight: 'bold',
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 20,
    color: '#22499C',
  },
  healthValuesContainer: {
    flexDirection: 'row',
    marginTop: 10,
  },
  medicationContainer: {
    flexDirection: 'row',
    marginTop: 10,
  },
  medicationCard: {
    backgroundColor: '#F6F7FB',
    padding: 15,
    borderRadius: 10,
    marginRight: 10,
    width: 140,
    height: 80,
    justifyContent: 'center',
    alignItems: 'center',
  },
  selectedMedication: {
    backgroundColor: '#E3E7FF',
  },
  medicationHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 5,
  },
  medicationTime: {
    fontSize: 12,
    color: '#6C757D',
  },
  medicationName: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  checkbox: {
    width: 16,
    height: 16,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#6C757D',
    position: 'absolute',
    right: 10,
    top: 10,
  },

  cardBlue: { backgroundColor: '#D7E3FC' },
  cardTeal: { backgroundColor: '#BFE9DB' },
  cardRed: { backgroundColor: '#FCCAC2' },
  cardYellow: { backgroundColor: '#F7E8A4' },
  iconSmall: {
    width: 20,
    height: 20,
    marginBottom: 5,
  },


  checkboxSelected: {
    width: 16,
    height: 16,
    borderRadius: 4,
    backgroundColor: '#22499C',
    position: 'absolute',
    right: 10,
    top: 10,
  },
  button: {
    backgroundColor: '#22499C',
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
    alignItems: 'center',
  },
  buttonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
});

export default HomePage;
