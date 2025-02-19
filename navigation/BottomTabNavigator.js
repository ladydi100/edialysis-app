
import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomePage from '../pages/HomePage';
import MedicationPage from '../pages/MedicationPage'; 
import HealthPage from '../pages/HealthPage'; 
import NutritionPage from '../pages/NutritionPage'; 
import AnalyticsPage from '../pages/AnalyticsPage'; 

const Tab = createBottomTabNavigator();

export default function BottomTabNavigator() {
  return (
    <Tab.Navigator>
      <Tab.Screen name="Home" component={HomePage} />
      <Tab.Screen name="Medicación" component={MedicationPage} />
      <Tab.Screen name="Salud" component={HealthPage} />
      <Tab.Screen name="Nutrición" component={NutritionPage} />
      <Tab.Screen name="Analítica" component={AnalyticsPage} />
    </Tab.Navigator>
  );
}