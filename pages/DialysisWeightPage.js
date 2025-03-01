// DialysisWeightPage.js - Página para ingresar el peso seco
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, KeyboardAvoidingView, Platform, TouchableWithoutFeedback, Keyboard } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const DialysisWeightPage = () => {
  const navigation = useNavigation();
  const [weight, setWeight] = useState('');

  const handleSave = () => {
    if (weight) {
      // Guardar el peso ingresado y continuar al siguiente paso
      navigation.navigate('DialysisRemindersPage', { weight });
    } else {
      alert('Por favor, ingresa tu peso seco.');
    }
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
        <View style={styles.container}>
          <Text style={styles.title}>¿Cuál es el objetivo de tu peso seco?</Text>
          <Text style={styles.description}>
            Introduce el peso que debes alcanzar después de cada tratamiento de diálisis.
            También puede llamarse "peso seco". Si no lo sabes, consúltalo con tu nefrólogo.
          </Text>

          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="70"
              placeholderTextColor="#898483"
              keyboardType="numeric"
              value={weight}
              onChangeText={setWeight}
            />
            <Text style={styles.unit}>kg</Text>
          </View>

          <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
            <Text style={styles.buttonText}>Guardar</Text>
          </TouchableOpacity>
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
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
    fontSize: 22,
    fontWeight: 'bold',
    color: '#101432',
    marginBottom: 10,
  },
  description: {
    fontSize: 16,
    color: '#5A5555',
    marginBottom: 20,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E3E3E3',
    borderRadius: 10,
    paddingHorizontal: 15,
    paddingVertical: 10,
    marginBottom: 20,
  },
  input: {
    flex: 1,
    fontSize: 18,
    color: '#101432',
  },
  unit: {
    fontSize: 18,
    color: '#5A5555',
  },
  saveButton: {
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

export default DialysisWeightPage;
