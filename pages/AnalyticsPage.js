import React, { useState, useLayoutEffect } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, FlatList, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as DocumentPicker from 'expo-document-picker';
import { useNavigation } from '@react-navigation/native';


const AnalyticsPage = () => {
  const navigation = useNavigation();
  const [documents, setDocuments] = useState([
    { id: '1', name: 'Analítica 1' },
    { id: '2', name: 'Analítica 2' },
    { id: '3', name: 'Analítica 2' },
    { id: '4', name: 'Analítica 2' },
  ]);


  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: 'Mis Analíticas',
      headerLeft: () => (
        <TouchableOpacity 
          onPress={() => navigation.navigate('Home')}
          style={{ marginLeft: 15 }}
        >
          <Ionicons name="arrow-back" size={26} color="#3B49B4" />
        </TouchableOpacity>
      ),
    });
  }, [navigation]);


  const pickDocument = async () => {
    let result = await DocumentPicker.getDocumentAsync({
      type: '*/*', // Acepta cualquier tipo de archivo
      
    });
    
    if (result.canceled === false) {
      const newDoc = { id: String(Date.now()), name: result.assets[0].name };
      setDocuments([...documents, newDoc]);
    }
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
       
        <Text style={styles.title}>Analíticas</Text>
      </View>

      {/* Barra de búsqueda */}
      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color="#999" style={styles.searchIcon} />
        <TextInput placeholder="Buscar" style={styles.searchInput} />
      </View>

      {/* Documentos */}
      <View style={styles.documentsContainer}>
        <Text style={styles.documentsTitle}>Documentos</Text>
        <TouchableOpacity>
          <Text style={styles.filterText}>Filtros ✖</Text>
        </TouchableOpacity>
      </View>

      {/* Lista de documentos */}
      <FlatList
        data={documents}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.documentItem}>
            <Text>{item.name}</Text>
          </View>
        )}
      />

      {/* Botón flotante de subida */}
      <TouchableOpacity style={styles.uploadButton} onPress={pickDocument}>
        <Ionicons name="cloud-upload-outline" size={24} color="black" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#FAFAFA' },
  header: { flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
  title: { fontSize: 20, fontWeight: 'bold', marginLeft: 10 },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EEE',
    borderRadius: 10,
    paddingHorizontal: 10,
    height: 40,
    marginBottom: 10,
  },
  searchIcon: { marginRight: 5 },
  searchInput: { flex: 1 },
  documentsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  documentsTitle: { fontSize: 16, fontWeight: 'bold' },
  filterText: { fontSize: 14, color: '#999' },
  documentItem: {
    backgroundColor: '#EEE',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
  },
  uploadButton: {
    position: 'absolute',
    bottom: 20,
    alignSelf: 'center',
    backgroundColor: '#EEE',
    padding: 15,
    borderRadius: 50,
    elevation: 5,
  },
});

export default AnalyticsPage;
