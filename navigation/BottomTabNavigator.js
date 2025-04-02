// navigation/BottomTabNavigator.js
//import React from 'react';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import React, { useCallback } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import Icon from 'react-native-vector-icons/Ionicons';
import HomePage from '../pages/HomePage';
import MedicationPage from '../pages/MedicationPage';
import HealthPage from '../pages/HealthPage';
import NutritionPage from '../pages/NutritionPage';
import AnalyticsPage from '../pages/AnalyticsPage';
import DialysisPage from '../pages/DialysisPage';
import DialysisSetupPage from '../pages/DialysisSetupPage';
import DialysisStartDatePage from '../pages/DialysisStartDatePage';
import DialysisDaysPage from '../pages/DialysisDaysPage';
import DialysisWeightPage from '../pages/DialysisWeightPage';
import DialysisRemindersPage from '../pages/DialysisRemindersPage';
import { getFocusedRouteNameFromRoute } from '@react-navigation/native';

const Tab = createBottomTabNavigator();
const HealthStack = createStackNavigator();

// Crea un stack navigator para la sección de Salud
function HealthStackScreen() {
  const navigation = useNavigation();

  useFocusEffect(
    useCallback(() => {
      // Usar getState() para v6+
      const state = navigation.getState();
      
      // Comprobar si estamos en una pantalla profunda
      const isNested = state?.routes[0]?.state?.index > 0;
      
      if (isNested) {
        // Resetear suavemente a HealthMain
        navigation.dispatch(
          CommonActions.reset({
            index: 0,
            routes: [{ name: 'HealthMain' }],
          })
        );
      }
    }, [navigation])
  );


  return (
    <HealthStack.Navigator screenOptions={{ headerShown: false }}>
      <HealthStack.Screen name="HealthMain" component={HealthPage} />
      <HealthStack.Screen name="DialysisPage" component={DialysisPage} />
      <HealthStack.Screen name="DialysisSetupPage" component={DialysisSetupPage} />
      <HealthStack.Screen name="DialysisStartDatePage" component={DialysisStartDatePage} />
      <HealthStack.Screen name="DialysisDaysPage" component={DialysisDaysPage} />
      <HealthStack.Screen name="DialysisWeightPage" component={DialysisWeightPage} />
      <HealthStack.Screen name="DialysisRemindersPage" component={DialysisRemindersPage} />
    </HealthStack.Navigator>
  );
}

export default function BottomTabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === 'Home') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'Medicación') {
            iconName = focused ? 'medkit' : 'medkit-outline';
          } else if (route.name === 'Salud') {
            iconName = focused ? 'heart' : 'heart-outline';
          } else if (route.name === 'Nutrición') {
            iconName = focused ? 'fast-food' : 'fast-food-outline';
          } else if (route.name === 'Analítica') {
            iconName = focused ? 'bar-chart' : 'bar-chart-outline';
          }

          return <Icon name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#2b3991',
        tabBarInactiveTintColor: 'gray',
        tabBarStyle: { paddingBottom: 5, height: 60 },
      })}
    >
      <Tab.Screen name="Home" component={HomePage} />
      <Tab.Screen name="Medicación" component={MedicationPage} />
        <Tab.Screen 
        name="Salud" 
        component={HealthStackScreen}
        listeners={({ navigation }) => ({
          tabPress: (e) => {
            // Resetear el stack de navegación al presionar la pestaña
            navigation.navigate('Salud', {
              screen: 'HealthMain'
            });
          },
        })}
      />
      <Tab.Screen name="Nutrición" component={NutritionPage} />
      <Tab.Screen name="Analítica" component={AnalyticsPage} />
    </Tab.Navigator>
  );
}