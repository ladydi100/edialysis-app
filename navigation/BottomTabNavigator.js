
import React, { useCallback } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { useNavigation } from '@react-navigation/native';
import { TouchableOpacity, View } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { Ionicons } from '@expo/vector-icons';
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
import MedicalAppointmentsSelectionPage from '../pages/MedicalAppointmentsSelectionPage';
import SelectValuesPage from '../pages/SelectValuesPage';
import SelectedValuesPage from '../pages/SelectedValuesPage';
import BloodPressurePage from '../pages/BloodPressurePage'
import HeartRatePage from '../pages/HeartRatePage';
import WeightPage from '../pages/WeightPage';
import AddMedicationPage from '../pages/AddMedicationPage';

const Tab = createBottomTabNavigator();
const HealthStack = createStackNavigator();
const NutritionStack = createStackNavigator();
const AnalyticsStack = createStackNavigator();
const MedicationStack = createStackNavigator();
const HomeStack = createStackNavigator();

// Componente personalizado para el botón de retroceso
const BackButton = ({ onPress }) => (
  <TouchableOpacity onPress={onPress} style={{ marginLeft: 15 }}>
    <Ionicons name="arrow-back" size={24} color="#3B49B4" />
  </TouchableOpacity>
);


function HealthStackScreen() {
  const navigation = useNavigation();

  return (
  <HealthStack.Navigator
      screenOptions={({ route }) => ({
        headerLeft: (props) => (
          <TouchableOpacity 
            onPress={() => {
             
              navigation.goBack();
            }}
            style={{ marginLeft: 15 }}
          >
            <Ionicons name="arrow-back" size={24} color="#3B49B4" />
          </TouchableOpacity>
        ),
        headerTitle: route.params?.title || route.name,
        headerBackTitleVisible: false,
      })}
    >


      <HealthStack.Screen 
        name="HealthMain" 
        component={HealthPage}
        options={{ headerShown: true ,  headerTitle: '',}}
      />

  <HealthStack.Screen 
  name="SelectValues" 
  component={SelectValuesPage}
  options={{ title: 'Seleccionar Valores' }}
/>

<HealthStack.Screen 
  name="SelectedValues" 
  component={SelectedValuesPage}
  options={{ title: 'Mis Valores' }}
/>

<HealthStack.Screen 
  name="BloodPressure" 
  component={BloodPressurePage}
  options={{ title: 'Presión Arterial' }}
/>

<HealthStack.Screen 
  name="HeartRate" 
  component={HeartRatePage}
  options={{ title: 'Frecuencia Cardíaca' }}
/>

<HealthStack.Screen 
  name="Weight" 
  component={WeightPage}
  options={{ title: 'Peso' }}
/>



<HealthStack.Screen 
  name="MedicalAppointmentsSelectionPage" 
  component={MedicalAppointmentsSelectionPage}
  options={{ 
    title: 'Citas médicas',
    headerBackTitleVisible: false
  }
  }/>



      <HealthStack.Screen 
        name="DialysisPage" 
        component={DialysisPage}
        options={{ title: 'Diálisis' }}
      />
      <HealthStack.Screen 
        name="DialysisSetupPage" 
        component={DialysisSetupPage}
        options={{ title: 'Configurar Diálisis' }}
      />
      <HealthStack.Screen 
        name="DialysisStartDatePage" 
        component={DialysisStartDatePage}
        options={{ title: 'Fecha de Inicio' }}
      />
      <HealthStack.Screen 
        name="DialysisDaysPage" 
        component={DialysisDaysPage}
        options={{ title: 'Días de Tratamiento' }}
      />
      <HealthStack.Screen 
        name="DialysisWeightPage" 
        component={DialysisWeightPage}
        options={{ title: 'Peso Seco' }}
      />
      <HealthStack.Screen 
        name="DialysisRemindersPage" 
        component={DialysisRemindersPage}
        options={{ title: 'Recordatorios' }}
      />



    </HealthStack.Navigator>

    
  );
}


function HomeStackScreen() {
  return (
    <HomeStack.Navigator
      screenOptions={{
        headerShown: true,
        headerTitle: '',
        headerStyle: {
          backgroundColor: '#FAFAFA',
          elevation: 0,
          shadowOpacity: 0,
        },
      }}
    >
      <HomeStack.Screen 
        name="HomeMain" 
        component={HomePage}
      />
    </HomeStack.Navigator>
  );
}


function MedicationStackScreen() {
  const navigation = useNavigation();

  return (
    <MedicationStack.Navigator
      screenOptions={{
        headerLeft: () => (
          <TouchableOpacity 
            onPress={() => navigation.goBack()}
            style={{ marginLeft: 15 }}
          >
            <Ionicons name="arrow-back" size={24} color="#3B49B4" />
          </TouchableOpacity>
        ),
        headerTitle: 'Medicación',
        headerBackTitleVisible: false,
      }}
    >
      <MedicationStack.Screen 
        name="MedicationMain" 
        component={MedicationPage}
        options={{ headerShown: true }}
      />

      <MedicationStack.Screen 
      name="AddMedication" 
      component={AddMedicationPage}
      options={{ 
      title: 'Añadir Medicamento',
      headerBackTitleVisible: false
      }}
     />
    </MedicationStack.Navigator>
  );
}



function AnalyticsStackScreen() {
  const navigation = useNavigation();

  return (
    <AnalyticsStack.Navigator
      screenOptions={{
        headerLeft: () => (
          <TouchableOpacity 
            onPress={() => navigation.goBack()}
            style={{ marginLeft: 15 }}
          >
            <Ionicons name="arrow-back" size={24} color="#3B49B4" />
          </TouchableOpacity>
        ),
        headerTitle: 'Analíticas',
        headerBackTitleVisible: false,
      }}
    >
      <AnalyticsStack.Screen 
        name="AnalyticsMain" 
        component={AnalyticsPage}
        options={{ headerShown: true }}
      />
    </AnalyticsStack.Navigator>
  );
}


function NutritionStackScreen() {
  const navigation = useNavigation();

  return (
    <NutritionStack.Navigator
      screenOptions={{
        headerLeft: () => (
          <TouchableOpacity 
            onPress={() => navigation.goBack()}
            style={{ marginLeft: 15 }}
          >
            <Ionicons name="arrow-back" size={24} color="#3B49B4" />
          </TouchableOpacity>
        ),
        headerTitle: 'Nutrición',
        headerBackTitleVisible: false,
      }}
    >
      <NutritionStack.Screen 
        name="NutritionMain" 
        component={NutritionPage}
        options={{ headerShown: true }}
      />
    </NutritionStack.Navigator>
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
        tabBarActiveTintColor: '#3B49B4',
        tabBarInactiveTintColor: 'gray',
        tabBarStyle: { 
          paddingBottom: 5, 
          height: 60,
          borderTopWidth: 0,
          elevation: 0,
          shadowOpacity: 0,
        },
        tabBarLabelStyle: {
          fontSize: 11,
          marginBottom: 5,
        },
        headerShown: false,
      })}
    >
    <Tab.Screen 
    name="Home" 
    component={HomeStackScreen}
    options={{
    tabBarLabel: 'Inicio',
    }}
   />
     <Tab.Screen 
     name="Medicación" 
     component={MedicationStackScreen}
     options={{
     tabBarLabel: 'Medicación',
     }}
     />
      <Tab.Screen 
        name="Salud" 
        component={HealthStackScreen}
        listeners={({ navigation }) => ({
          tabPress: (e) => {
  
            navigation.navigate('Salud', {
              screen: 'HealthMain'
            });
          },
        })}
        options={{
          tabBarLabel: 'Salud',
        }}
      />
      <Tab.Screen 
      name="Nutrición" 
      component={NutritionStackScreen}
      options={{
      tabBarLabel: 'Nutrición',
      }}
      />


     <Tab.Screen 
     name="Analítica" 
     component={AnalyticsStackScreen}
     options={{
     tabBarLabel: 'Analítica',
     }}
     />
    </Tab.Navigator>
  );
}