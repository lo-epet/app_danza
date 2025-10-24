import React, { useState, useContext } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { DarkModeContext } from '../context/DarkModeContext';
import { getGlobalStyles } from '../style/globalStyles';

import { Tipografia } from '../style/tipografia';
import { Colors } from '../style/colors';
import { Espacios } from '../style/espacios';
import { CalendarioStyles } from '../style/calendarioScreenStyle'; 

export default function RegistroScreen() {
  const { modoOscuro } = useContext(DarkModeContext);
    const GlobalStyles = getGlobalStyles(modoOscuro);
  const navigation = useNavigation();
  const [nombre, setNombre] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const registrar = async () => {
    try {
      const response = await fetch('http://128.3.254.138:8000/usuarios/crear', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nombre, email, password }),
      });

      const data = await response.json();
      console.log('Respuesta del backend:', data);

      if (response.ok) {
        Alert.alert('✅ Usuario creado', 'Ya podés usar el calendario');
        navigation.replace('Calendario'); // 👈 Te lleva directo al calendario
      } else {  
        Alert.alert('❌ Error', data.detail || 'No se pudo registrar');
      }
    } catch (error) {
      console.error('Error de red:', error);
      Alert.alert('❌ Error de conexión', 'No se pudo conectar al servidor');
    }
  };

  return (
    <View style={GlobalStyles.screenContainer}>
  <Text style={[Tipografia.H1, { color: modoOscuro ? '#fff' : '#333', marginBottom: 20 }]}>
    📝 Crear Cuenta
  </Text>

  <View style={GlobalStyles.inputContainer}>
    <TextInput
      style={GlobalStyles.textInput}
      placeholder="Nombre"
      value={nombre}
      onChangeText={setNombre}
      placeholderTextColor={modoOscuro ? '#aaa' : '#666'}
    />
  </View>

  <View style={GlobalStyles.inputContainer}>
    <TextInput
      style={GlobalStyles.textInput}
      placeholder="Email"
      value={email}
      onChangeText={setEmail}
      autoCapitalize="none"
      placeholderTextColor={modoOscuro ? '#aaa' : '#666'}
    />
  </View>

  <View style={GlobalStyles.inputContainer}>
    <TextInput
      style={GlobalStyles.textInput}
      placeholder="Contraseña"
      value={password}
      onChangeText={setPassword}
      secureTextEntry
      placeholderTextColor={modoOscuro ? '#aaa' : '#666'}
    />
  </View>

  <TouchableOpacity style={GlobalStyles.primaryButton} onPress={registrar}>
    <Text style={GlobalStyles.primaryButtonText}>Registrarse</Text>
  </TouchableOpacity>
</View>

  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', justifyContent: 'center', paddingHorizontal: 30 },
  title: { fontSize: 28, marginBottom: 40, textAlign: 'center', fontWeight: 'bold', color: '#333' },
  input: { height: 50, borderColor: '#ccc', borderWidth: 1, marginBottom: 20, paddingHorizontal: 15, borderRadius: 8 },
  button: { backgroundColor: '#007AFF', paddingVertical: 15, borderRadius: 8 },
  buttonText: { color: '#fff', textAlign: 'center', fontSize: 16, fontWeight: 'bold' },
});
