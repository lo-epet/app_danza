// frontend/App.js
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import LoginScreen from './screens/LoginScreen';
import CalendarioScreen from './screens/CalendarioScreen';
import AgregarAlumnoScreen from './screens/AgregarAlumnoScreen';
const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Calendario" component={CalendarioScreen} />
        <Stack.Screen name="AgregarAlumno" component={AgregarAlumnoScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
