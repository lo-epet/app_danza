import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';

export default function CalendarioScreen() {
  const navigation = useNavigation();
  const [alumnos, setAlumnos] = useState([]);

  useEffect(() => {
    fetchAlumnos();
  }, []);

  const fetchAlumnos = async () => {
    try {
      const token = await SecureStore.getItemAsync('token');
      const response = await fetch('http://128.3.254.138:8000/alumnos', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      setAlumnos(data);
    } catch (error) {
      console.error('Error al cargar alumnos:', error);
    }
  };

  const handleAgregarAlumno = () => {
    navigation.navigate('AgregarAlumno'); // ✅ pantalla para registrar alumno
  };

  const handleBorrarAlumno = async (id) => {
    try {
      const token = await SecureStore.getItemAsync('token');
      await fetch(`http://128.3.254.138:8000/alumnos/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      fetchAlumnos(); // refrescar lista
    } catch (error) {
      console.error('Error al borrar alumno:', error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>📅 Calendario 2025</Text>
      <Text style={styles.subtitle}>👥 Participantes</Text>

      <FlatList
        data={alumnos}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.alumnoItem}>
            <Text>{item.nombre}</Text>
            <TouchableOpacity onPress={() => handleBorrarAlumno(item.id)}>
              <Text style={styles.borrar}>🗑️</Text>
            </TouchableOpacity>
          </View>
        )}
      />

      <TouchableOpacity style={styles.agregarButton} onPress={handleAgregarAlumno}>
        <Text style={styles.agregarText}>➕ Agregar Alumno</Text>
      </TouchableOpacity>
    </View>
  );
}


const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20 },
  subtitle: { fontSize: 18, marginBottom: 10 },
  alumnoItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderColor: '#ccc',
  },
  borrar: { color: 'red', fontSize: 18 },
  agregarButton: {
    marginTop: 20,
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 8,
  },
  agregarText: { color: '#fff', textAlign: 'center', fontWeight: 'bold' },
});
