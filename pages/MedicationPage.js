

import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
//import { Calendar } from 'react-native-calendars';

const MedicationPage = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <Text>Medicación</Text>
      <TouchableOpacity onPress={() => navigation.navigate('AddMedication')}>
        <Text style={styles.addButton}>+ Añadir nuevo</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addButton: {
    marginTop: 20,
    color: 'blue',
    fontSize: 18,
  },
});


export default MedicationPage;