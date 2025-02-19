import React, { useContext } from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { AuthContext } from './context/AuthContext';
import LoginPage from './pages/LoginPage';
import HomePage from './pages/HomePage';
import WelcomePage from './pages/WellcomePage';
import RegisterPage from './pages/RegisterPage';


const Stack = createStackNavigator();

export default function AppNavigator() {
  const { userToken } = useContext(AuthContext);

  return (
    <Stack.Navigator>
      {userToken ? (
        <Stack.Screen name="Home" component={HomePage} />
      ) : (
        <>
          <Stack.Screen name="Welcome" component={WelcomePage} options={{ headerShown: false }} />
          <Stack.Screen name="Login" component={LoginPage} />
          <Stack.Screen name="Register" component={RegisterPage} />
          
        </>
      )}
    </Stack.Navigator>
  );
}