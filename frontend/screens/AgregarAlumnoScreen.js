import React, { useState, useContext } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import * as SecureStore from 'expo-secure-store'; // ✅ para recuperar el token
import { DarkModeContext } from '../context/DarkModeContext';
import { getGlobalStyles } from '../style/globalStyles';
import { Tipografia } from '../style/tipografia';
import { Colors } from '../style/colors';
import { Espacios } from '../style/espacios';
import { CalendarioStyles } from '../style/calendarioScreenStyle'; 

export default function AgregarAlumnoScreen() {
  const { modoOscuro } = useContext(DarkModeContext);
  const GlobalStyles = getGlobalStyles(modoOscuro);

  const [nombre, setNombre] = useState('');
  const [edad, setEdad] = useState('');
  const [dni, setDni] = useState('');
  const [email, setEmail] = useState('');
  const [ciudad, setCiudad] = useState('');
  const [mensaje, setMensaje] = useState('');

  const handleGuardar = async () => {
    const payload = {
      nombre,
      dni,
      email,
      ciudad: ciudad || null,
      edad: edad ? parseInt(edad) : null,
    };

    console.log('📤 Enviando alumno:', payload);

    try {
      const token = await SecureStore.getItemAsync('token'); // ✅ recuperar token

      const response = await fetch('https://app-danza-sv9i.onrender.com/alumnos', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`, // ✅ enviar token en el header
        },
        body: JSON.stringify(payload),
      });

      const responseData = await response.json();
      console.log('📨 Respuesta del servidor:', responseData);

      if (response.ok) {
        setMensaje('✅ Alumno agregado exitosamente');
        setNombre('');
        setEdad('');
        setDni('');
        setEmail('');
        setCiudad('');
      } else {
        const errores = Array.isArray(responseData.detail)
          ? responseData.detail.map(e => e.msg).join('\n')
          : responseData.detail || 'Error desconocido';
        setMensaje(`❌ Error: ${errores}`);
      }
    } catch (error) {
      console.error('❌ Error al agregar alumno:', error);
      setMensaje('❌ Error de conexión con el servidor');
    }
  };

  return (
    <View style={GlobalStyles.screenContainer}>
      <Text style={[Tipografia.H1, { color: modoOscuro ? '#fff' : '#333', marginBottom: 20 }]}>
        ➕ Agregar Alumno
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
          placeholder="DNI"
          value={dni}
          onChangeText={setDni}
          keyboardType="numeric"
          placeholderTextColor={modoOscuro ? '#aaa' : '#666'}
        />
      </View>

      <View style={GlobalStyles.inputContainer}>
        <TextInput
          style={GlobalStyles.textInput}
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          placeholderTextColor={modoOscuro ? '#aaa' : '#666'}
        />
      </View>

      <View style={GlobalStyles.inputContainer}>
        <TextInput
          style={GlobalStyles.textInput}
          placeholder="Ciudad (opcional)"
          value={ciudad}
          onChangeText={setCiudad}
          placeholderTextColor={modoOscuro ? '#aaa' : '#666'}
        />
      </View>

      <View style={GlobalStyles.inputContainer}>
        <TextInput
          style={GlobalStyles.textInput}
          placeholder="Edad (opcional)"
          value={edad}
          onChangeText={setEdad}
          keyboardType="numeric"
          placeholderTextColor={modoOscuro ? '#aaa' : '#666'}
        />
      </View>

      <TouchableOpacity style={GlobalStyles.primaryButton} onPress={handleGuardar}>
        <Text style={GlobalStyles.primaryButtonText}>Guardar</Text>
      </TouchableOpacity>

      {mensaje !== '' && (
        <Text style={{ textAlign: 'center', fontSize: 16, color: modoOscuro ? '#fff' : '#333', marginBottom: 10 }}>
          {mensaje}
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, justifyContent: 'center' },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20, textAlign: 'center' },
  input: {
    height: 50,
    borderColor: '#ccc',
    borderWidth: 1,
    marginBottom: 15,
    paddingHorizontal: 15,
    borderRadius: 8,
  },
  button: {
    backgroundColor: '#007AFF',
    paddingVertical: 15,
    borderRadius: 8,
    marginBottom: 20,
  },
  buttonText: { color: '#fff', textAlign: 'center', fontSize: 16, fontWeight: 'bold' },
  mensaje: { textAlign: 'center', fontSize: 16, color: '#333' },
});
