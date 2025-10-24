import React, { useState, useContext } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { DarkModeContext } from '../context/DarkModeContext';
import { getGlobalStyles } from '../style/globalStyles';


import { Tipografia } from '../style/tipografia';
import { Colors } from '../style/colors';
import { Espacios } from '../style/espacios';
import { CalendarioStyles } from '../style/calendarioScreenStyle'; 



export default function ParticipantesScreen() {
  const { modoOscuro } = useContext(DarkModeContext);
    const GlobalStyles = getGlobalStyles(modoOscuro);
  const navigation = useNavigation();

  const handleAgregar = () => {
    navigation.navigate('AgregarAlumno'); // pantalla de registro
  };

  const handleEliminar = () => {
    navigation.navigate('EliminarAlumno'); // pantalla para borrar
  };

  const handleVer = () => {
    navigation.navigate('ListaAlumnos'); // pantalla con lista
  };

  return (
    <View style={GlobalStyles.screenContainer}>
      <Text style={[Tipografia.H1, { color: modoOscuro ? '#fff' : '#333', marginBottom: 20 }]}>
        👥 Participantes
      </Text>

      <TouchableOpacity style={GlobalStyles.primaryButton} onPress={handleAgregar}>
        <Text style={GlobalStyles.primaryButtonText}>➕ Agregar Alumno</Text>
      </TouchableOpacity>

      <TouchableOpacity style={GlobalStyles.primaryButton} onPress={handleEliminar}>
        <Text style={GlobalStyles.primaryButtonText}>🗑️ Eliminar Alumno</Text>
      </TouchableOpacity>

      <TouchableOpacity style={GlobalStyles.primaryButton} onPress={handleVer}>
        <Text style={GlobalStyles.primaryButtonText}>👁️ Ver Alumnos</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
  title: { fontSize: 28, fontWeight: 'bold', marginBottom: 40 },
  button: {
    backgroundColor: '#007AFF',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 8,
    marginBottom: 20,
    width: '80%',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});
