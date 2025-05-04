// navigation/HealthStackNavigator.js
import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { Ionicons } from '@expo/vector-icons';
import HealthPage from '../pages/HealthPage';
import SelectValuesPage from '../pages/SelectValuesPage';
import SelectedValuesPage from '../pages/SelectedValuesPage';
import HeartRatePage from '../pages/HeartRatePage';
import BloodPressurePage from '../pages/BloodPressurePage';
import WeightPage from '../pages/WeightPage';
import DialysisPage from '../pages/DialysisPage';
import DialysisSetupPage from '../pages/DialysisSetupPage';
import DialysisStartDatePage from '../pages/DialysisStartDatePage';
import DialysisDaysPage from '../pages/DialysisDaysPage';
import DialysisWeightPage from '../pages/DialysisWeightPage';
import DialysisRemindersPage from '../pages/DialysisRemindersPage';

const Stack = createStackNavigator();

export default function HealthStackNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="HealthMain" component={HealthPage} />
      <Stack.Screen name="DialysisPage" component={DialysisPage} />
      <Stack.Screen name="DialysisSetupPage" component={DialysisSetupPage} />
      {/* ... otras pantallas */}
    </Stack.Navigator>
  );
}