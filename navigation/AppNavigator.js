// AppNavigator.js - Configuración de navegación
import React, { useContext } from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { AuthContext } from '../context/AuthContext';
import LoginPage from '../pages/LoginPage';
import HomePage from '../pages/HomePage';
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

const Stack = createStackNavigator();

export default function AppNavigator() {
  const { userToken } = useContext(AuthContext);

  return (
    <Stack.Navigator>
      {userToken ? (
        <>
          <Stack.Screen name="Main" component={BottomTabNavigator} options={{ headerShown: false }} />
          <Stack.Screen name="DialysisPage" component={DialysisPage} />
          <Stack.Screen name="DialysisSetupPage" component={DialysisSetupPage} />
          <Stack.Screen name="DialysisStartDatePage" component={DialysisStartDatePage} />
          <Stack.Screen name="DialysisDaysPage" component={DialysisDaysPage} />
          <Stack.Screen name="DialysisWeightPage" component={DialysisWeightPage} />
          <Stack.Screen name="DialysisRemindersPage" component={DialysisRemindersPage} />


        </>
      ) : (
        <>
          <Stack.Screen name="Welcome" component={WelcomePage} options={{ headerShown: false }} />
          <Stack.Screen name="Login" component={LoginPage} />
          <Stack.Screen name="Register" component={RegisterPage} />
          <Stack.Screen name="ForgotPassword" component={ForgotPasswordPage} />
        </>
      )}
      <Stack.Screen name="AddMedication" component={AddMedicationPage} />
    </Stack.Navigator>
  );
}