// NutritionPage.js - Página de Nutrición actualizada
import React, { useLayoutEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

const recipes = [
    {
        title: 'Chilaquiles para pacientes en diálisis',
        image: require('../assets/chilaquiles.png'),
        video: 'https://www.youtube.com/watch?v=KyJ2QV99W9o',
        description: 'Una versión adaptada de los tradicionales chilaquiles, baja en sodio y adecuada para pacientes renales.',
    },
    {
        title: 'Pechuga de pollo con pasta y verduras',
        image: require('../assets/pollo_pasta.png'),
        video: 'https://www.youtube.com/watch?v=DZCIEuMXuKM',
        description: 'Un platillo balanceado que combina proteínas magras con carbohidratos complejos y vegetales, ideal para una dieta renal.',
    },
    {
        title: 'Pechuga de pollo rellena de requesón en salsa',
        image: require('../assets/pollo_relleno.png'),
        video: 'https://www.youtube.com/watch?v=QFDELMWWw1g',
        description: 'Una deliciosa pechuga de pollo rellena de requesón, bañada en una salsa suave, especialmente diseñada para pacientes en hemodiálisis.',
    },
    {
        title: 'Menú completo para pacientes renales',
        image: require('../assets/menu_completo.png'),
        video: 'https://www.youtube.com/watch?v=bRnK7-UFpO0',
        description: 'Una guía completa que incluye desayuno, comida y cena, adaptada para personas con enfermedad renal.',
    },
    {
        title: 'Cenas ligeras para pacientes renales',
        image: require('../assets/cenas_ligeras.png'),
        video: 'https://www.youtube.com/watch?v=_RUjRo-WXEg',
        description: 'Tres opciones de cenas fáciles de preparar, bajas en sodio y potasio, ideales para mantener una dieta adecuada en pacientes con enfermedad renal.',
    },
];

const NutritionPage = () => {
    const navigation = useNavigation();
  useLayoutEffect(() => {
        navigation.setOptions({
            headerTitle: 'Recetas de Nutrición',
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



    return (
        <ScrollView style={styles.container}>
            <Text style={styles.title}>Recetas recomendadas</Text>
            
            {recipes.map((recipe, index) => (
                <TouchableOpacity key={index} style={styles.card} onPress={() => alert(`Ver receta: ${recipe.title}\nVideo: ${recipe.video}`)}>
                    <Image source={recipe.image} style={styles.image} />
                    <View style={styles.cardContent}>
                        <Text style={styles.cardTitle}>{recipe.title}</Text>
                        <Text style={styles.cardDescription}>{recipe.description}</Text>
                    </View>
                </TouchableOpacity>
            ))}
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
        marginBottom: 15,
    },
    card: {
        backgroundColor: '#E3E3E3',
        borderRadius: 10,
        marginBottom: 15,
        padding: 10,
        flexDirection: 'row',
        alignItems: 'center',
    },
    image: {
        width: 80,
        height: 80,
        borderRadius: 10,
        marginRight: 10,
    },
    cardContent: {
        flex: 1,
    },
    cardTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#101432',
    },
    cardDescription: {
        fontSize: 14,
        color: '#5A5555',
    },
});

export default NutritionPage;
