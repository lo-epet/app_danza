import React, { useEffect, useState, useContext } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Linking } from 'react-native';
import * as DocumentPicker from 'expo-document-picker';
import * as SecureStore from 'expo-secure-store'; // ✅ para recuperar el token
import { DarkModeContext } from '../context/DarkModeContext';
import { getGlobalStyles } from '../style/globalStyles';
import { Tipografia } from '../style/tipografia';
import { Colors } from '../style/colors';
import { Espacios } from '../style/espacios';
import { CalendarioStyles } from '../style/calendarioScreenStyle'; 

export default function DocumentosAlumnoScreen({ route }) {
  const { modoOscuro } = useContext(DarkModeContext);
  const GlobalStyles = getGlobalStyles(modoOscuro);
  const { alumnoId } = route.params;
  const [documentos, setDocumentos] = useState([]);
  const [archivo, setArchivo] = useState(null);
  const [mensaje, setMensaje] = useState('');

  useEffect(() => {
    fetchDocumentos();
  }, []);

  const fetchDocumentos = async () => {
    try {
      const response = await fetch(`http://128.3.254.138:8000/documentos/alumno/${alumnoId}`);
      const data = await response.json();
      setDocumentos(data);
    } catch (error) {
      console.error('❌ Error al cargar documentos:', error);
    }
  };

  const seleccionarArchivo = async () => {
    const result = await DocumentPicker.getDocumentAsync({ copyToCacheDirectory: true });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      const file = result.assets[0];
      setArchivo(file);
      setMensaje(`📄 Archivo seleccionado: ${file.name}`);
      console.log('✅ Archivo seleccionado:', file);
    } else {
      setMensaje('❌ No se seleccionó ningún archivo');
      console.log('⚠️ Selección cancelada o fallida:', result);
    }
  };

  const subirDocumento = async () => {
    if (!archivo) {
      setMensaje('❌ Seleccioná un archivo primero');
      console.log('⚠️ No hay archivo para subir');
      return;
    }

    const formData = new FormData();
    formData.append('archivo', {
      uri: archivo.uri,
      name: archivo.name || 'archivo.pdf',
      type: archivo.mimeType || 'application/pdf',
    });
    formData.append('alumno_id', alumnoId.toString());
    formData.append('tipo', 'archivo');

    console.log('📦 FormData preparado:', {
      alumno_id: alumnoId,
      tipo: 'archivo',
      archivo: archivo,
    });

    try {
      const response = await fetch('http://128.3.254.138:8000/documentos/upload', {
        method: 'POST',
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        body: formData,
      });

      const data = await response.json();
      console.log('📨 Respuesta del servidor:', data);

      if (response.ok) {
        setArchivo(null);
        setMensaje('✅ Documento subido exitosamente');
        fetchDocumentos();
      } else {
        setMensaje(`❌ Error: ${data.detail || 'No se pudo subir el documento'}`);
        console.log('⚠️ Error en respuesta:', data);
      }
    } catch (error) {
      console.error('❌ Error al subir documento:', error);
      setMensaje('❌ Error de conexión con el servidor');
    }
  };

  const eliminarDocumento = async (id) => {
    try {
      const token = await SecureStore.getItemAsync('token'); // ✅ recuperar token

      const response = await fetch(`http://128.3.254.138:8000/documentos/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`, // ✅ enviar token en el header
        },
      });

      if (response.ok) {
        console.log('🗑️ Documento eliminado');
        fetchDocumentos();
      } else {
        const data = await response.json();
        console.log('⚠️ Error al eliminar:', data);
        setMensaje(`❌ No se pudo eliminar: ${data.detail || 'Error desconocido'}`);
      }
    } catch (error) {
      console.error('❌ Error al eliminar documento:', error);
      setMensaje('❌ Error de conexión con el servidor');
    }
  };

  return (
    <View style={GlobalStyles.screenContainer}>
      <Text style={[Tipografia.H1, { color: modoOscuro ? '#fff' : '#333', marginBottom: 20 }]}>
        📄 Documentos del Alumno
      </Text>

      <TouchableOpacity style={GlobalStyles.primaryButton} onPress={seleccionarArchivo}>
        <Text style={GlobalStyles.primaryButtonText}>Seleccionar Archivo</Text>
      </TouchableOpacity>

      <TouchableOpacity style={GlobalStyles.primaryButton} onPress={subirDocumento}>
        <Text style={GlobalStyles.primaryButtonText}>Subir Documento</Text>
      </TouchableOpacity>

      {mensaje !== '' && (
        <Text style={{ textAlign: 'center', fontSize: 16, color: modoOscuro ? '#fff' : '#333', marginBottom: 10 }}>
          {mensaje}
        </Text>
      )}

      <FlatList
        data={documentos}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={[GlobalStyles.card, { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }]}>
            <TouchableOpacity onPress={() => Linking.openURL(item.url)} style={{ flex: 1 }}>
              <Text
                style={{
                  color: Colors.PRIMARY,
                  textDecorationLine: 'underline',
                  fontWeight: '600',
                }}
                numberOfLines={1}
                ellipsizeMode="tail"
              >
                {item.nombre || item.filename}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => eliminarDocumento(item.id)}>
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
