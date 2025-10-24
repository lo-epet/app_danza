import React, { useEffect, useState, useContext } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import * as SecureStore from 'expo-secure-store'; // ✅ para recuperar el token
import { DarkModeContext } from '../context/DarkModeContext';
import { getGlobalStyles } from '../style/globalStyles';
import { Tipografia } from '../style/tipografia';
import { Colors } from '../style/colors';
import { Espacios } from '../style/espacios';
import { CalendarioStyles } from '../style/calendarioScreenStyle';

export default function ListaAlumnosScreen() {
  const { modoOscuro } = useContext(DarkModeContext);
  const GlobalStyles = getGlobalStyles(modoOscuro);
  const [alumnos, setAlumnos] = useState([]);
  const [mensaje, setMensaje] = useState('');
  const navigation = useNavigation();

  useEffect(() => {
    fetchAlumnos();
  }, []);

  const fetchAlumnos = async () => {
    try {
      const token = await SecureStore.getItemAsync('token'); // 🔐 recuperar token

      const response = await fetch('http://128.3.254.138:8000/alumnos/', {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`, // ✅ enviar token en el header
        },
      });

      const data = await response.json();
      console.log('📨 Alumnos recibidos:', data);

      if (response.ok) {
        setAlumnos(data);
      } else {
        setMensaje(`❌ Error: ${data.detail || 'No se pudo cargar la lista'}`);
      }
    } catch (error) {
      console.error('❌ Error al cargar alumnos:', error);
      setMensaje('❌ Error de conexión con el servidor');
    }
  };

  const verInfo = (alumno) => {
    navigation.navigate('InfoAlumno', { alumno }); // pasa el objeto completo
  };

  return (
    <View style={GlobalStyles.screenContainer}>
      <Text style={[Tipografia.H1, { color: modoOscuro ? '#fff' : '#333', marginBottom: 20 }]}>
        👁️ Ver Alumnos
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
          <TouchableOpacity
            style={[GlobalStyles.card, { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }]}
            onPress={() => verInfo(item)}
          >
            <Text style={{ color: modoOscuro ? '#fff' : '#333' }}>{item.nombre}</Text>
            <Text style={{ color: Colors.PRIMARY, fontWeight: '600' }}>Ver info</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  mensaje: { textAlign: 'center', fontSize: 16, color: '#333', marginBottom: 10 },
});
