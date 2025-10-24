import React, { useState, useContext, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Linking } from 'react-native';
import * as DocumentPicker from 'expo-document-picker';
import { DarkModeContext } from '../context/DarkModeContext';
import { getGlobalStyles } from '../style/globalStyles';

import { Tipografia } from '../style/tipografia';
import { Colors } from '../style/colors';
import { Espacios } from '../style/espacios';
import { CalendarioStyles } from '../style/calendarioScreenStyle'; 

export default function PagosAlumnoScreen({ route }) {
  const { modoOscuro } = useContext(DarkModeContext);
    const GlobalStyles = getGlobalStyles(modoOscuro);
  const { alumnoId } = route.params;
  const [pagos, setPagos] = useState([]);
  const [comprobante, setComprobante] = useState(null);
  const [mensaje, setMensaje] = useState('');

  useEffect(() => {
    fetchPagos();
  }, []);

  const fetchPagos = async () => {
    try {
      const response = await fetch(`http://128.3.254.138:8000/pagos/alumno/${alumnoId}`);
      const data = await response.json();
      setPagos(data);
    } catch (error) {
      console.error('Error al cargar pagos:', error);
    }
  };

  const seleccionarComprobante = async () => {
    const result = await DocumentPicker.getDocumentAsync({ copyToCacheDirectory: true });
    if (!result.canceled && result.assets?.length > 0) {
      setComprobante(result.assets[0]);
      setMensaje(`📄 Comprobante seleccionado: ${result.assets[0].name}`);
    } else {
      setMensaje('❌ No se seleccionó ningún comprobante');
    }
  };

  const registrarPago = async () => {
    if (!comprobante) {
      setMensaje('❌ Seleccioná un comprobante');
      return;
    }

    const formData = new FormData();
    formData.append('archivo', {
      uri: comprobante.uri,
      name: comprobante.name,
      type: comprobante.mimeType || 'application/pdf',
    });
    formData.append('alumno_id', alumnoId.toString());

    try {
      const response = await fetch(`http://128.3.254.138:8000/pagos/upload`, {
        method: 'POST',
        headers: { 'Content-Type': 'multipart/form-data' },
        body: formData,
      });

      const data = await response.json();
      console.log('📨 Respuesta del servidor:', data);

      if (response.ok) {
        setComprobante(null);
        setMensaje('✅ Pago registrado con comprobante');
        fetchPagos();
      } else {
        setMensaje(`❌ Error: ${Array.isArray(data.detail) ? data.detail.map(e => e.msg).join(', ') : data.detail || 'No se pudo registrar el pago'}`);
      }
    } catch (error) {
      console.error('Error al registrar pago:', error);
      setMensaje('❌ Error de conexión con el servidor');
    }
  };

  const eliminarPago = async (id) => {
    try {
      await fetch(`http://128.3.254.138:8000/pagos/${id}`, { method: 'DELETE' });
      fetchPagos();
    } catch (error) {
      console.error('Error al eliminar pago:', error);
    }
  };

  return (
    <View style={GlobalStyles.screenContainer}>
  <Text style={[Tipografia.H1, { color: modoOscuro ? '#fff' : '#333', marginBottom: 20 }]}>
    💳 Pagos del Alumno
  </Text>

  <TouchableOpacity style={GlobalStyles.primaryButton} onPress={seleccionarComprobante}>
    <Text style={GlobalStyles.primaryButtonText}>Seleccionar Comprobante</Text>
  </TouchableOpacity>

  <TouchableOpacity style={GlobalStyles.primaryButton} onPress={registrarPago}>
    <Text style={GlobalStyles.primaryButtonText}>Registrar Pago</Text>
  </TouchableOpacity>

  {mensaje !== '' && (
    <Text style={{ textAlign: 'center', fontSize: 16, color: modoOscuro ? '#fff' : '#333', marginBottom: 10 }}>
      {mensaje}
    </Text>
  )}

  <FlatList
    data={pagos}
    keyExtractor={(item) => item.id.toString()}
    renderItem={({ item }) => (
      <View style={[GlobalStyles.card, { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }]}>
        <View>
          <Text style={{ color: modoOscuro ? '#fff' : '#333' }}>
            {new Date(item.fecha).toLocaleDateString()}
          </Text>
          {item.comprobante_url && (
            <TouchableOpacity onPress={() => Linking.openURL(`http://128.3.254.138:8000/${item.comprobante_url}`)}>
              <Text style={{ color: Colors.PRIMARY, textDecorationLine: 'underline', fontWeight: '600' }}>
                {item.comprobante_url.split('/').pop()}
              </Text>
            </TouchableOpacity>
          )}
        </View>
        <TouchableOpacity onPress={() => eliminarPago(item.id)}>
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
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20 },
  button: {
    backgroundColor: '#007AFF',
    paddingVertical: 15,
    borderRadius: 8,
    marginBottom: 10,
  },
  buttonText: { color: '#fff', textAlign: 'center', fontWeight: 'bold' },
  mensaje: { textAlign: 'center', fontSize: 16, color: '#333', marginBottom: 10 },
  item: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderColor: '#ccc',
  },
  link: {
    color: '#007AFF',
    textDecorationLine: 'underline',
    fontWeight: 'bold',
  },
  borrar: { color: 'red', fontWeight: 'bold' },
});
