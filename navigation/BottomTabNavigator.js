import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/Ionicons';
import HomePage from '../pages/HomePage';
import MedicationPage from '../pages/MedicationPage';
import HealthPage from '../pages/HealthPage';
import NutritionPage from '../pages/NutritionPage';
import AnalyticsPage from '../pages/AnalyticsPage';

const Tab = createBottomTabNavigator();

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
        tabBarActiveTintColor: '#007AFF',
        tabBarInactiveTintColor: 'gray',
        tabBarStyle: { paddingBottom: 5, height: 60 },
      })}
    >
      <Tab.Screen name="Home" component={HomePage} />
      <Tab.Screen name="Medicación" component={MedicationPage} />
      <Tab.Screen name="Salud" component={HealthPage} />
      <Tab.Screen name="Nutrición" component={NutritionPage} />
      <Tab.Screen name="Analítica" component={AnalyticsPage} />
    </Tab.Navigator>
  );
}
