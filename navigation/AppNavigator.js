import React, { useContext } from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { AuthContext } from '../context/AuthContext';
import LoginPage from '../pages/LoginPage';
import WelcomePage from '../pages/WellcomePage';
import RegisterPage from '../pages/RegisterPage';
import ForgotPasswordPage from '../pages/ForgotPasswordPage';
import BottomTabNavigator from './BottomTabNavigator';
import AddMedicationPage from '../pages/AddMedicationPage';
import MedicationDetail from '../pages/MedicationDetail';
import MedicalAppointmentsSelectionPage from '../pages/MedicalAppointmentsSelectionPage';
import { Ionicons } from '@expo/vector-icons';
import SelectValuesPage from '../pages/SelectValuesPage';
import SelectedValuesPage from '../pages/SelectedValuesPage';
import HeartRatePage from '../pages/HeartRatePage';
import BloodPressurePage from '../pages/BloodPressurePage';
import WeightPage from '../pages/WeightPage';
import DocumentViewer from '../pages/DocumentViewer';

const Stack = createStackNavigator();

export default function AppNavigator() {
  const { userToken } = useContext(AuthContext);

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {userToken ? (
        <>
          {/* Navegación principal con pestañas */}
          <Stack.Screen
            name="BottomTabNavigator"
            component={BottomTabNavigator}
            options={{ headerShown: false }}
          />

          {/* Pantallas modales/emergentes (no están en las tabs) */}
          <Stack.Screen name="MedicationDetail" component={MedicationDetail} />

          {/* Pantallas de valores de salud */}
          <Stack.Screen name="SelectValues" component={SelectValuesPage} />
          <Stack.Screen name="SelectedValues" component={SelectedValuesPage} />
          <Stack.Screen name="HeartRate" component={HeartRatePage} />
          <Stack.Screen name="BloodPressure" component={BloodPressurePage} />
          <Stack.Screen name="Weight" component={WeightPage} />

          {/* Nueva pantalla para visualizar documentos */}
          <Stack.Screen
            name="DocumentViewer"
            component={DocumentViewer}
            options={({ route }) => ({
              headerShown: true,
              headerTitle: route.params?.name ? route.params.name : 'Documento',
              headerTitleAlign: 'center',
              headerStyle: {
                backgroundColor: '#FAFAFA',
              },
              headerTintColor: '#3B49B4',
            })}
          />

        </>
      ) : (
        <>
          {/* Pantallas de autenticación */}
          <Stack.Screen name="Welcome" component={WelcomePage} />
          <Stack.Screen name="Login" component={LoginPage} />
          <Stack.Screen name="Register" component={RegisterPage} />
          <Stack.Screen name="ForgotPassword" component={ForgotPasswordPage} />
        </>
      )}
    </Stack.Navigator>
  );
}
