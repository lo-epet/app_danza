import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

// Importá todas las pantallas
import LoginScreen from '../screens/LoginScreen';
import RegistroScreen from '../screens/RegistroScreen';
import PerfilScreen from '../screens/PerfilScreen';
import CalendarioScreen from '../screens/CalendarioScreen';
import AgregarAlumnoScreen from '../screens/AgregarAlumnoScreen';
import AgregarEventoScreen from '../screens/AgregarEventoScreen';
import DocumentosAlumnoScreen from '../screens/DocumentosAlumnoScreen';
import EditarPerfilScreen from '../screens/EditarPerfilScreen';
import InfoAlumnoScreen from '../screens/InfoAlumnoScreen';
import ListaAlumnosScreen from '../screens/ListaAlumnosScreen';
import PagosAlumnoScreen from '../screens/PagosAlumnoScreen';
import EliminarAlumnoScreen from '../screens/EliminarAlumnoScreen';
import ParticipantesScreen from '../screens/ParticipantesScreen';
import AuthLoadingScreen from '../screens/AuthLoadingScreen';




const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  return (
    
    <Stack.Navigator initialRouteName="AuthLoading" screenOptions={{ headerShown: false }}>
      <Stack.Screen name="AuthLoading" component={AuthLoadingScreen} />
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Registro" component={RegistroScreen} />
      <Stack.Screen name="Perfil" component={PerfilScreen} />
      <Stack.Screen name="Calendario" component={CalendarioScreen} />
      <Stack.Screen name="AgregarAlumno" component={AgregarAlumnoScreen} />
      <Stack.Screen name="AgregarEvento" component={AgregarEventoScreen} />
      <Stack.Screen name="DocumentosAlumno" component={DocumentosAlumnoScreen} />
      <Stack.Screen name="EditarPerfil" component={EditarPerfilScreen} />
      <Stack.Screen name="InfoAlumno" component={InfoAlumnoScreen} />
      <Stack.Screen name="ListaAlumnos" component={ListaAlumnosScreen} />
      <Stack.Screen name="PagosAlumno" component={PagosAlumnoScreen} />
      <Stack.Screen name="Participantes" component={ParticipantesScreen} />
      <Stack.Screen name="EliminarAlumno" component={EliminarAlumnoScreen} />
    </Stack.Navigator>
  );
}