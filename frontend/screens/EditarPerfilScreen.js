import React, { useState, useEffect, useContext } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import * as SecureStore from 'expo-secure-store';
import { DarkModeContext } from '../context/DarkModeContext';
import { getGlobalStyles } from '../style/globalStyles';

export default function EditarPerfilScreen({ navigation }) {
    const { modoOscuro } = useContext(DarkModeContext);
    const GlobalStyles = getGlobalStyles(modoOscuro);
  const [nombre, setNombre] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [originalNombre, setOriginalNombre] = useState('');
  const [originalEmail, setOriginalEmail] = useState('');

  useEffect(() => {
    const cargarDatos = async () => {
      const token = await SecureStore.getItemAsync('token');
      const response = await fetch('https://app-danza-sv9i.onrender.com/usuarios/me', {
        headers: { Authorization: `Bearer ${token}` },
      });

      try {
        const contentType = response.headers.get('Content-Type');
        if (contentType && contentType.includes('application/json')) {
          const data = await response.json();
          setNombre(data.nombre || '');
          setEmail(data.email || '');
          setOriginalNombre(data.nombre || '');
          setOriginalEmail(data.email || '');
        } else {
          const raw = await response.text();
          console.error('❌ Respuesta no JSON:', raw);
          Alert.alert('❌ Error al cargar datos', raw || 'Respuesta inválida del servidor');
        }
      } catch (error) {
        console.error('❌ Error al cargar perfil:', error);
        Alert.alert('❌ Error al cargar datos', 'No se pudo obtener tu perfil');
      }
    };
    cargarDatos();
  }, []);

  const actualizarPerfil = async () => {
    const token = await SecureStore.getItemAsync('token');

    const cambios = {};
    if (nombre !== originalNombre) cambios.nombre = nombre;
    if (email !== originalEmail) cambios.email = email;
    if (password.trim() !== '') cambios.password = password;

    if (Object.keys(cambios).length === 0) {
      Alert.alert('ℹ️ Sin cambios', 'No modificaste ningún dato');
      return;
    }

    try {
      const response = await fetch('https://app-danza-sv9i.onrender.com/usuarios/actualizar', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(cambios),
      });

      let data;
      const contentType = response.headers.get('Content-Type');

      if (contentType && contentType.includes('application/json')) {
        try {
          data = await response.json();
        } catch (jsonError) {
          const raw = await response.text();
          console.error('❌ Error al parsear JSON:', jsonError);
          console.log('Respuesta cruda:', raw);
          Alert.alert('❌ Error inesperado', 'Respuesta inválida del servidor');
          return;
        }
      } else {
        const raw = await response.text();
        console.error('❌ Respuesta no JSON:', raw);
        Alert.alert('❌ Error inesperado', raw || 'Respuesta inválida del servidor');
        return;
      }

      if (response.ok) {
        Alert.alert('✅ Perfil actualizado');
        navigation.goBack();
      } else {
        Alert.alert('❌ Error', data.detail || 'No se pudo actualizar');
      }
    } catch (error) {
      console.error('❌ Error al actualizar perfil:', error);
      Alert.alert('❌ Error de conexión', 'No se pudo conectar al servidor');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>👤 Editar Perfil</Text>

      <TextInput
        style={styles.input}
        placeholder="Nombre"
        value={nombre}
        onChangeText={setNombre}
      />
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
      />
      <TextInput
        style={styles.input}
        placeholder="Nueva contraseña (opcional)"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      <TouchableOpacity style={styles.button} onPress={actualizarPerfil}>
        <Text style={styles.buttonText}>Guardar Cambios</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 30, backgroundColor: '#fff', justifyContent: 'center' },
  title: { fontSize: 28, marginBottom: 30, textAlign: 'center', fontWeight: 'bold', color: '#333' },
  input: {
    height: 50,
    borderColor: '#ccc',
    borderWidth: 1,
    marginBottom: 20,
    paddingHorizontal: 15,
    borderRadius: 8,
  },
  button: { backgroundColor: '#007AFF', paddingVertical: 15, borderRadius: 8 },
  buttonText: { color: '#fff', textAlign: 'center', fontSize: 16, fontWeight: 'bold' },
});
