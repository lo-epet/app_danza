import React, { useEffect, useState, useContext } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import * as SecureStore from 'expo-secure-store'; // ✅ para recuperar el token
import { DarkModeContext } from '../context/DarkModeContext';
import { getGlobalStyles } from '../style/globalStyles';
import { Tipografia } from '../style/tipografia';
import { Colors } from '../style/colors';
import { Espacios } from '../style/espacios';
import { CalendarioStyles } from '../style/calendarioScreenStyle'; 

export default function EliminarAlumnoScreen() {
  const { modoOscuro } = useContext(DarkModeContext);
  const GlobalStyles = getGlobalStyles(modoOscuro);
  const [alumnos, setAlumnos] = useState([]);
  const [mensaje, setMensaje] = useState('');

  const fetchAlumnos = async () => {
    try {
      const token = await SecureStore.getItemAsync('token'); // 🔐 recuperar token

      const response = await fetch('https://app-danza-sv9i.onrender.com/alumnos/', {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`, // ✅ enviar token
        },
      });

      const data = await response.json();
      console.log('📨 Alumnos recibidos:', data);

      if (response.ok) {
        setAlumnos(data);
        setMensaje('');
      } else {
        setMensaje(`❌ Error: ${data.detail || 'No se pudo cargar la lista'}`);
      }
    } catch (error) {
      console.error('❌ Error al cargar alumnos:', error);
      setMensaje('❌ Error de conexión con el servidor');
    }
  };

  useEffect(() => {
    fetchAlumnos();
  }, []);

  const handleEliminar = async (id) => {
    try {
      const token = await SecureStore.getItemAsync('token');

      const response = await fetch(`https://app-danza-sv9i.onrender.com/alumnos/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`, // ✅ enviar token
        },
      });

      const result = await response.json();
      console.log('🗑️ Eliminación:', result);

      if (response.ok) {
        setMensaje('✅ Alumno eliminado');
        fetchAlumnos(); // 🔁 actualizar lista
      } else {
        setMensaje(`❌ Error: ${result.detail || 'No se pudo eliminar'}`);
      }
    } catch (error) {
      console.error('❌ Error al eliminar alumno:', error);
      setMensaje('❌ Error de conexión con el servidor');
    }
  };

  return (
    <View style={GlobalStyles.screenContainer}>
      <Text style={[Tipografia.H1, { color: modoOscuro ? '#fff' : '#333', marginBottom: 20 }]}>
        🗑️ Eliminar Alumno
      </Text>

      {mensaje !== '' && (
        <Text style={{ textAlign: 'center', fontSize: 16, color: modoOscuro ? '#fff' : '#333', marginBottom: 10 }}>
          {mensaje}
        </Text>
      )}

      <FlatList
        data={alumnos}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={[GlobalStyles.card, { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }]}>
            <Text style={{ color: modoOscuro ? '#fff' : '#333' }}>{item.nombre}</Text>
            <TouchableOpacity onPress={() => handleEliminar(item.id)}>
              <Text style={{ color: 'red', fontWeight: 'bold' }}>Eliminar</Text>
            </TouchableOpacity>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  mensaje: { textAlign: 'center', fontSize: 16, color: '#333', marginBottom: 10 },
});
