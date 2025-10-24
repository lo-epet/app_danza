import React, { useState, useEffect, useContext } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from 'react-native';
import * as SecureStore from 'expo-secure-store';
import { FontAwesome } from '@expo/vector-icons';
import { DarkModeContext } from '../context/DarkModeContext';
import { getGlobalStyles } from '../style/globalStyles';

export default function PerfilScreen({ navigation }) {
  const [nombre, setNombre] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [modoEdicion, setModoEdicion] = useState(false);
  const [cargando, setCargando] = useState(true);

  const { modoOscuro, toggleModoOscuro } = useContext(DarkModeContext);

  useEffect(() => {
    const cargarDatos = async () => {
      try {
        const token = await SecureStore.getItemAsync('token');
        if (!token) {
          Alert.alert('❌ Sesión expirada', 'Volvé a iniciar sesión');
          navigation.replace('Login');
          return;
        }

        const response = await fetch('http://128.3.254.138:8000/usuarios/me', {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!response.ok) {
          const errorData = await response.json();
          console.error('Error backend:', errorData);
          Alert.alert('❌ Error', errorData.detail || 'No se pudo cargar el perfil');
          return;
        }

        const data = await response.json();
        setNombre(data.nombre || '');
        setEmail(data.email || '');

        if (!data.nombre && !data.email) {
          Alert.alert('⚠️ Perfil vacío', 'No se encontraron datos del usuario');
        }
      } catch (error) {
        console.error('Error al cargar perfil:', error);
        Alert.alert('❌ Error de conexión');
      } finally {
        setCargando(false);
      }
    };

    cargarDatos();
  }, []);

  const actualizarPerfil = async () => {
    if (!nombre || !email) {
      Alert.alert('⚠️ Campos obligatorios', 'Nombre y email no pueden estar vacíos');
      return;
    }

    const token = await SecureStore.getItemAsync('token');
    if (!token) {
      Alert.alert('❌ Sesión expirada', 'Volvé a iniciar sesión');
      navigation.replace('Login');
      return;
    }

    const cambios = {
      nombre: nombre.trim(),
      email: email.trim(),
      password: password.trim(),
    };

    try {
      const response = await fetch('http://128.3.254.138:8000/usuarios/actualizar', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(cambios),
      });

      const data = await response.json();
      if (response.ok) {
        Alert.alert('✅ Perfil actualizado');
        setModoEdicion(false);
        setPassword('');
      } else {
        console.error('Error backend:', data);
        Alert.alert('❌ Error', data.detail || 'No se pudo actualizar');
      }
    } catch (error) {
      console.error('Error al actualizar perfil:', error);
      Alert.alert('❌ Error de conexión');
    }
  };

  const cerrarSesion = async () => {
    await SecureStore.deleteItemAsync('token');
    navigation.replace('Login');
  };

  if (cargando) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={{ textAlign: 'center', marginTop: 20 }}>Cargando perfil...</Text>
      </View>
    );
  }

  const fondo = modoOscuro ? styles.darkContainer : styles.container;
  const texto = modoOscuro ? styles.textoOscuro : styles.textoClaro;

  return (
    <View style={fondo}>
      <Text style={[styles.title, texto]}>👤 Mi Perfil</Text>

      {modoEdicion ? (
        <>
          <TextInput
            style={[styles.input, texto]}
            value={nombre}
            onChangeText={setNombre}
            placeholder="Nombre"
            placeholderTextColor={modoOscuro ? '#aaa' : '#666'}
          />
          <TextInput
            style={[styles.input, texto]}
            value={email}
            onChangeText={setEmail}
            placeholder="Email"
            autoCapitalize="none"
            placeholderTextColor={modoOscuro ? '#aaa' : '#666'}
          />
          <TextInput
            style={[styles.input, texto]}
            value={password}
            onChangeText={setPassword}
            placeholder="Nueva contraseña"
            secureTextEntry
            placeholderTextColor={modoOscuro ? '#aaa' : '#666'}
          />
          <TouchableOpacity style={styles.button} onPress={actualizarPerfil}>
            <Text style={styles.buttonText}>
              <FontAwesome name="save" size={18} color="#fff" />{' '}Guardar Cambios
            </Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.cancelButton} onPress={() => setModoEdicion(false)}>
            <Text style={styles.cancelText}>❌ Cancelar</Text>
          </TouchableOpacity>
        </>
      ) : (
        <>
          <Text style={[styles.label, texto]}>Nombre:</Text>
          <Text style={[styles.value, texto]}>{nombre}</Text>
          <Text style={[styles.label, texto]}>Email:</Text>
          <Text style={[styles.value, texto]}>{email}</Text>
          <TouchableOpacity style={styles.button} onPress={() => setModoEdicion(true)}>
            <Text style={styles.buttonText}>✏️ Editar Perfil</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.button, { backgroundColor: '#FF3B30' }]}
            onPress={cerrarSesion}
          >
            <Text style={styles.buttonText}>
              <FontAwesome name="sign-out" size={18} color="#fff" />{' '}Cerrar sesión
            </Text>
          </TouchableOpacity>
        </>
      )}

      <TouchableOpacity
        style={[styles.button, { backgroundColor: modoOscuro ? '#555' : '#222' }]}
        onPress={toggleModoOscuro}
      >
        <Text style={styles.buttonText}>
          {modoOscuro ? '☀️ Modo Claro' : '🌙 Modo Oscuro'}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 30, backgroundColor: '#fff' },
  darkContainer: { flex: 1, padding: 30, backgroundColor: '#1c1c1e' },
  title: { fontSize: 28, marginBottom: 30, textAlign: 'center', fontWeight: 'bold' },
  label: { fontSize: 16, fontWeight: 'bold', marginTop: 10 },
  value: { fontSize: 16, marginBottom: 10 },
  input: {
    height: 50,
    borderColor: '#ccc',
    borderWidth: 1,
    marginBottom: 20,
    paddingHorizontal: 15,
    borderRadius: 8,
  },
  button: {
    backgroundColor: '#007AFF',
    paddingVertical: 15,
    borderRadius: 8,
    marginBottom: 10,
  },
  buttonText: { color: '#fff', textAlign: 'center', fontSize: 16, fontWeight: 'bold' },
  cancelButton: {
    backgroundColor: '#ccc',
    paddingVertical: 10,
    borderRadius: 8,
  },
  cancelText: { color: '#333', textAlign: 'center', fontSize: 14 },
  textoClaro: { color: '#333' },
  textoOscuro: { color: '#fff' },
});
