import React, { useState, useContext } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, Platform } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import * as Notifications from 'expo-notifications';
import { Picker } from '@react-native-picker/picker';
import * as SecureStore from 'expo-secure-store';
import { DarkModeContext } from '../context/DarkModeContext';
import { getGlobalStyles } from '../style/globalStyles';

export default function AgregarEventoScreen({ route }) {
  const { modoOscuro } = useContext(DarkModeContext);
  const GlobalStyles = getGlobalStyles(modoOscuro);
  const { fecha } = route.params;
  const navigation = useNavigation();

  const [titulo, setTitulo] = useState('');
  const [horaSeleccionada, setHoraSeleccionada] = useState('');
  const [minutoSeleccionado, setMinutoSeleccionado] = useState('');

  const registrarEvento = async () => {
    if (!titulo || !horaSeleccionada || minutoSeleccionado === '') {
      Alert.alert('❌ Faltan datos', 'Completá título, hora y minutos del evento');
      return;
    }

    const horaValida = `${horaSeleccionada}:${minutoSeleccionado.padStart(2, '0')}`;
    const fechaCompleta = new Date(`${fecha}T${horaValida}`);

    if (fechaCompleta <= new Date()) {
      Alert.alert('⚠️ Fecha inválida', 'La hora debe ser futura');
      return;
    }

    try {
      const token = await SecureStore.getItemAsync('token');

      const perfilRes = await fetch('https://app-danza-sv9i.onrender.com/auth/me', {
        headers: { Authorization: `Bearer ${token}` }
      });
      const perfil = await perfilRes.json();
      const usuarioId = perfil.id;

      const response = await fetch('https://app-danza-sv9i.onrender.com/eventos/crear', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          fecha,
          titulo,
          hora: `${horaValida}:00`,
          usuario_id: usuarioId
        }),
      });

      const text = await response.text();
      let data;
      try {
        data = JSON.parse(text);
      } catch (e) {
        console.error('❌ No se pudo parsear JSON:', e);
        Alert.alert('❌ Error inesperado', text);
        return;
      }

      if (response.ok) {
        if (Platform.OS === 'android') {
          await Notifications.setNotificationChannelAsync('eventos', {
            name: 'Eventos',
            importance: Notifications.AndroidImportance.HIGH,
            sound: 'default',
          });
        }

        await Notifications.scheduleNotificationAsync({
          content: {
            title: '📌 Recordatorio',
            body: `Tenés "${titulo}" a las ${horaValida}`,
            sound: 'default',
          },
          trigger: fechaCompleta,
        });

        Alert.alert('✅ Evento registrado', 'Se guardó correctamente');
        navigation.goBack();
      } else {
        const mensaje = Array.isArray(data.detail)
          ? data.detail.map(e => `• ${e.msg}`).join('\n')
          : data.detail || 'No se pudo registrar el evento';

        Alert.alert('❌ Error', mensaje);
      }
    } catch (error) {
      console.error('❌ Error al registrar evento:', error);
      Alert.alert('❌ Error de conexión', 'No se pudo conectar al servidor');
    }
  };

  return (
    <View style={GlobalStyles.screenContainer}>
      <Text style={[GlobalStyles.inputLabel, { textAlign: 'center', fontSize: 22, marginBottom: 20 }]}>
        📝 Agregar Evento
      </Text>

      <Text style={[GlobalStyles.inputLabel, { textAlign: 'center' }]}>
        Fecha seleccionada: {fecha}
      </Text>

      <TextInput
        style={GlobalStyles.textInput}
        placeholder="Título del evento"
        value={titulo}
        onChangeText={setTitulo}
        placeholderTextColor={modoOscuro ? '#888' : '#aaa'}
      />

      <Text style={GlobalStyles.inputLabel}>Seleccioná la hora:</Text>
<Picker
  selectedValue={horaSeleccionada}
  onValueChange={(itemValue) => setHoraSeleccionada(itemValue)}
  style={{
    height: Platform.OS === 'ios' ? 150 : 50,
    color: modoOscuro ? '#fff' : '#000',
  }}
  itemStyle={{
    fontSize: 20,
    height: 150,
  }}
  mode="dropdown"
>
  <Picker.Item label="Hora..." value="" />
  {Array.from({ length: 24 }, (_, i) => {
    const horaStr = String(i).padStart(2, '0'); // 🔁 de 00 a 23
    return <Picker.Item key={horaStr} label={horaStr} value={horaStr} />;
  })}
</Picker>


<Text style={GlobalStyles.inputLabel}>Seleccioná los minutos:</Text>
<Picker
  selectedValue={minutoSeleccionado}
  onValueChange={(itemValue) => setMinutoSeleccionado(itemValue)}
  style={{
    height: Platform.OS === 'ios' ? 150 : 50,
    color: modoOscuro ? '#fff' : '#000',
  }}
  itemStyle={{
    fontSize: 20,
    height: 150,
  }}
  mode="dropdown"
>
  <Picker.Item label="Minutos..." value="" />
  {Array.from({ length: 60 }, (_, i) => {
    const minStr = String(i).padStart(2, '0');
    return <Picker.Item key={minStr} label={minStr} value={minStr} />;
  })}
</Picker>


      <TouchableOpacity style={GlobalStyles.primaryButton} onPress={registrarEvento}>
        <Text style={GlobalStyles.primaryButtonText}>Guardar Evento</Text>
      </TouchableOpacity>
    </View>
  );
}
