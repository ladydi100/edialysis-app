import React, { useContext } from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { AuthContext } from '../context/AuthContext';
import LoginPage from '../pages/LoginPage';
import WelcomePage from '../pages/WellcomePage';
import RegisterPage from '../pages/RegisterPage';
import ForgotPasswordPage from '../pages/ForgotPasswordPage';
import BottomTabNavigator from './BottomTabNavigator';
import AddMedicationPage from '../pages/AddMedicationPage';
import DialysisPage from '../pages/DialysisPage';
import DialysisSetupPage from '../pages/DialysisSetupPage';
import DialysisStartDatePage from '../pages/DialysisStartDatePage';
import DialysisDaysPage from '../pages/DialysisDaysPage'; 
import DialysisWeightPage from '../pages/DialysisWeightPage';
import DialysisRemindersPage from '../pages/DialysisRemindersPage';
import MedicalAppointmentsSelectionPage from '../pages/MedicalAppointmentsSelectionPage';


// Importamos las nuevas pantallas de valores de salud
import SelectValuesPage from '../pages/SelectValuesPage';
import SelectedValuesPage from '../pages/SelectedValuesPage';
import HeartRatePage from '../pages/HeartRatePage';
import BloodPressurePage from '../pages/BloodPressurePage';
import WeightPage from '../pages/WeightPage';

const Stack = createStackNavigator();

export default function AppNavigator() {
  const { userToken } = useContext(AuthContext);

  return (
    <Stack.Navigator>
      {userToken ? (
        <>
          {/* Navegación principal con pestañas */}
          <Stack.Screen 
  name="BottomTabNavigator" 
  component={BottomTabNavigator} 
  options={{ headerShown: false, title: '' }} 
/>


          {/* Pantallas de diálisis */}
          <Stack.Screen name="DialysisPage" component={DialysisPage} />
          <Stack.Screen name="DialysisSetupPage" component={DialysisSetupPage} />
          <Stack.Screen name="DialysisStartDatePage" component={DialysisStartDatePage} />
          <Stack.Screen name="DialysisDaysPage" component={DialysisDaysPage} />
          <Stack.Screen name="DialysisWeightPage" component={DialysisWeightPage} />
          <Stack.Screen name="DialysisRemindersPage" component={DialysisRemindersPage} />

          {/* 🚀 NUEVAS PANTALLAS DE VALORES DE SALUD 🚀 */}
          <Stack.Screen name="SelectValues" component={SelectValuesPage} />
          <Stack.Screen name="SelectedValues" component={SelectedValuesPage} />
          <Stack.Screen name="HeartRate" component={HeartRatePage} />
          <Stack.Screen name="BloodPressure" component={BloodPressurePage} />
          <Stack.Screen name="Weight" component={WeightPage} />
        </>
      ) : (
        <>
          {/* Si el usuario NO ha iniciado sesión, muestra las pantallas de autenticación */}
          <Stack.Screen name="Welcome" component={WelcomePage} />
          <Stack.Screen name="Login" component={LoginPage} />
          <Stack.Screen name="Register" component={RegisterPage} />
          <Stack.Screen name="ForgotPassword" component={ForgotPasswordPage} />
        </>
      )}

      {/* Pantalla de agregar medicación, accesible en cualquier momento */}
      <Stack.Screen name="AddMedication" component={AddMedicationPage} />

      <Stack.Screen name="MedicalAppointmentsSelectionPage" component={MedicalAppointmentsSelectionPage} />
    </Stack.Navigator>
  );
}
