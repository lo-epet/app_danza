import React, { useState, useContext } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { DarkModeContext } from '../context/DarkModeContext';
import { getGlobalStyles } from '../style/globalStyles';

import { Tipografia } from '../style/tipografia';
import { Colors } from '../style/colors';
import { Espacios } from '../style/espacios';
import { CalendarioStyles } from '../style/calendarioScreenStyle'; 

export default function InfoAlumnoScreen({ route }) {
    const { modoOscuro } = useContext(DarkModeContext);
    const GlobalStyles = getGlobalStyles(modoOscuro);
  const { alumno } = route.params;
  const navigation = useNavigation();

  const irADocumentos = () => {
    navigation.navigate('DocumentosAlumno', { alumnoId: alumno.id });
  };

  const irAPagos = () => {
    navigation.navigate('PagosAlumno', { alumnoId: alumno.id });
  };

  return (
    <View style={GlobalStyles.screenContainer}>
  <Text style={[Tipografia.H1, { color: modoOscuro ? '#fff' : '#333', marginBottom: 10 }]}>
    {alumno.nombre}
  </Text>

  <Text style={{ color: modoOscuro ? '#ccc' : '#333' }}>ID: {alumno.id}</Text>
  <Text style={{ color: modoOscuro ? '#ccc' : '#333' }}>DNI: {alumno.dni}</Text>
  <Text style={{ color: modoOscuro ? '#ccc' : '#333' }}>
    Edad: {alumno.edad ?? 'No especificada'}
  </Text>
  <Text style={{ color: modoOscuro ? '#ccc' : '#333' }}>Email: {alumno.email}</Text>
  <Text style={{ color: modoOscuro ? '#ccc' : '#333' }}>
    Ciudad: {alumno.ciudad ?? 'No especificada'}
  </Text>
  <Text style={{ color: modoOscuro ? '#ccc' : '#333' }}>
    Fecha de alta: {new Date(alumno.fecha_alta).toLocaleDateString()}
  </Text>

  <TouchableOpacity style={GlobalStyles.primaryButton} onPress={irADocumentos}>
    <Text style={GlobalStyles.primaryButtonText}>📄 Ver Documentos</Text>
  </TouchableOpacity>

  <TouchableOpacity style={GlobalStyles.primaryButton} onPress={irAPagos}>
    <Text style={GlobalStyles.primaryButtonText}>💳 Ver Pagos</Text>
  </TouchableOpacity>
</View>

  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, justifyContent: 'center' },
  title: { fontSize: 28, fontWeight: 'bold', marginBottom: 20, textAlign: 'center' },
  button: {
    backgroundColor: '#007AFF',
    paddingVertical: 15,
    borderRadius: 8,
    marginTop: 20,
  },
  buttonText: { color: '#fff', textAlign: 'center', fontSize: 16, fontWeight: 'bold' },
});
