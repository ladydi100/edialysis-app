import React, { useState, useEffect, useLayoutEffect } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import axios from 'axios';
import API_URL from '../config/config';
import AsyncStorage from '@react-native-async-storage/async-storage';
import BackButton from '../components/BackButton';

const WeightPage = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const [weight, setWeight] = useState('');

 const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

   useLayoutEffect(() => {
  navigation.setOptions({
    headerTitle: '',
    headerLeft: () => <BackButton navigation={navigation} />
  });
}, [navigation]);

 useEffect(() => {
    const fetchLatestWeight = async () => {
      const token = await AsyncStorage.getItem('userToken');

      try {
        const response = await axios.get(`${API_URL}/weight/latest`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.data.weight) {
          setWeight(response.data.weight.toString());
        }
      } catch (error) {
        console.error('Error fetching latest weight:', error);
        setError('Error al obtener los datos de peso');
      }finally {
        setLoading(false);
      }
    };

    fetchLatestWeight();
  }, []);




   const handleSave = async () => {
    if (!weight) {
     Alert.alert('Por favor, introduce un valor válido.');
      return;
    }

  
     const token = await AsyncStorage.getItem('userToken');

       try {
      await axios.post(`${API_URL}/weight`, { weight }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

    navigation.navigate('SelectedValues', {
      selectedParameters: route.params?.selectedParameters || [],
      updatedValues: {
        ...route.params?.updatedValues,
        weight: `${weight} kg`
      }
    });
    } catch (error) {
      console.error('Error saving weight:', error);
       Alert.alert('Error', 'No se pudo guardar el peso. Inténtalo de nuevo.');
    }
  };

   if (loading) {
    return (
      <View style={styles.container}>
        <Text>Cargando...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }


  return (
    <View style={styles.container}>
      <Text style={styles.title}>Peso</Text>
      <TextInput
        style={styles.input}
        placeholder="Ej: 70"
        keyboardType="numeric"
        value={weight}
        onChangeText={setWeight}
      />
      <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
        <Text style={styles.saveButtonText}>Guardar datos</Text>
      </TouchableOpacity>
    </View>
  );
};

export default WeightPage;

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
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    borderRadius: 8,
  },
  saveButton: {
    backgroundColor: '#3B49B4',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 20,
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
