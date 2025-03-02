import React, { useContext } from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { AuthContext } from '../context/AuthContext';
import BottomTabNavigator from './BottomTabNavigator';

// Importar todas las páginas
import LoginPage from '../pages/LoginPage';
import WelcomePage from '../pages/WellcomePage';
import RegisterPage from '../pages/RegisterPage';
import ForgotPasswordPage from '../pages/ForgotPasswordPage';
import AddMedicationPage from '../pages/AddMedicationPage';
import DialysisPage from '../pages/DialysisPage';
import DialysisSetupPage from '../pages/DialysisSetupPage';
import DialysisStartDatePage from '../pages/DialysisStartDatePage';
import DialysisDaysPage from '../pages/DialysisDaysPage';
import DialysisWeightPage from '../pages/DialysisWeightPage';
import DialysisRemindersPage from '../pages/DialysisRemindersPage';

/*const Stack = createStackNavigator();

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
          {/* Si el usuario NO ha iniciado sesión, muestra las pantallas de autenticación */}
          <Stack.Screen name="Welcome" component={WelcomePage} />
          <Stack.Screen name="Login" component={LoginPage} />
          <Stack.Screen name="Register" component={RegisterPage} />
          <Stack.Screen name="ForgotPassword" component={ForgotPasswordPage} />
        </>
      )}

{/* Pantalla de agregar medicación, accesible en cualquier momento */ }
<Stack.Screen name="AddMedication" component={AddMedicationPage} />
    </Stack.Navigator >
  );
}*/


const Stack = createStackNavigator();

export default function AppNavigator() {
  const { userToken } = useContext(AuthContext);

  return (
    <Stack.Navigator>
      {userToken ? (
        <>
          <Stack.Screen name="Main" component={BottomTabNavigator} options={{ headerShown: false }} />
          {/* Otras pantallas */}
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
      <Stack.Screen name="DialysisPage" component={DialysisPage} />
      <Stack.Screen name="DialysisSetupPage" component={DialysisSetupPage} />
      <Stack.Screen name="DialysisStartDatePage" component={DialysisStartDatePage} />
      <Stack.Screen name="DialysisDaysPage" component={DialysisDaysPage} />
      <Stack.Screen name="DialysisWeightPage" component={DialysisWeightPage} />
      <Stack.Screen name="DialysisRemindersPage" component={DialysisRemindersPage} />
    </Stack.Navigator>
  );
}