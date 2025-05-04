// components/BackButton.js
import React from 'react';
import { TouchableOpacity, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const BackButton = ({ onPress, navigation, confirm = false }) => {
  const handlePress = () => {
    if (confirm) {
      Alert.alert(
        'Confirmar',
        '¿Estás seguro de que quieres salir? Los cambios no guardados se perderán.',
        [
          { text: 'Cancelar', style: 'cancel' },
          { text: 'Salir', onPress: () => navigation.goBack() }
        ]
      );
    } else {
      navigation.goBack();
    }
  };

  return (
    <TouchableOpacity onPress={handlePress} style={{ marginLeft: 15 }}>
      <Ionicons name="arrow-back" size={26} color="#3B49B4" />
    </TouchableOpacity>
  );
};

export default BackButton;