import React, { useState, useCallback, useContext } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Alert } from 'react-native'; 
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { Calendar } from 'react-native-calendars';
import * as SecureStore from 'expo-secure-store';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'; 

// --- Estilos y contexto ---
import { getGlobalStyles } from '../style/globalStyles';
import { Tipografia } from '../style/tipografia';
import { Colors } from '../style/colors';
import { Espacios } from '../style/espacios';
import { getCalendarioStyles } from '../style/calendarioScreenStyle';
import { DarkModeContext } from '../context/DarkModeContext';

export default function CalendarioScreen() {
  const { modoOscuro } = useContext(DarkModeContext);
  const GlobalStyles = getGlobalStyles(modoOscuro);
  const CalendarioStyles = getCalendarioStyles(modoOscuro);


  const navigation = useNavigation();
  const [eventosMarcados, setEventosMarcados] = useState({});
  const [todosLosEventos, setTodosLosEventos] = useState([]);
  const [fechaSeleccionada, setFechaSeleccionada] = useState('');
  const [eventosDelDia, setEventosDelDia] = useState([]);

  useFocusEffect(
    useCallback(() => {
      fetchEventos();
    }, [])
  );

  const fetchEventos = async () => {
  try {
    const token = await SecureStore.getItemAsync('token');

    // 🔐 Obtener perfil del usuario actual
    const perfilRes = await fetch('http://128.3.254.138:8000/auth/me', {
      headers: { Authorization: `Bearer ${token}` }
    });
    const perfil = await perfilRes.json();
    const usuarioId = perfil.id;

    // 📅 Obtener todos los eventos
    const eventosRes = await fetch('http://128.3.254.138:8000/eventos/todos', {
      headers: { Authorization: `Bearer ${token}` }
    });
    const eventos = await eventosRes.json();

    // 🎯 Filtrar solo los eventos del usuario actual
    const eventosUsuario = eventos.filter(e => e.usuario_id === usuarioId);
    setTodosLosEventos(eventosUsuario);

    // 📍 Marcar fechas en el calendario
    const marcados = {};
    eventosUsuario.forEach((evento) => {
      const fecha = evento.fecha;
      marcados[fecha] = {
        dotColor: Colors.PRIMARY,
        marked: true
      };
    });

    if (fechaSeleccionada) {
      marcados[fechaSeleccionada] = {
        ...marcados[fechaSeleccionada],
        selected: true,
        selectedColor: Colors.ACCENT,
      };
    }

    setEventosMarcados(marcados);

    if (fechaSeleccionada) {
      const filtrados = eventosUsuario.filter(e => e.fecha === fechaSeleccionada);
      setEventosDelDia(filtrados);
    }
  } catch (error) {
    console.error('❌ Error al cargar eventos:', error);
  }
};


  const handleDiaSeleccionado = (day) => {
    const fecha = day.dateString;
    setFechaSeleccionada(fecha);

    const filtrados = todosLosEventos.filter(e => e.fecha === fecha);
    setEventosDelDia(filtrados);

    // 🔄 Recalcular todos los marcados desde cero
    const nuevosMarcados = {};
    todosLosEventos.forEach((evento) => {
      const fechaEvento = evento.fecha;
      nuevosMarcados[fechaEvento] = {
        dotColor: Colors.PRIMARY,
        marked: true,
      };
    });

    // ✅ Marcar la nueva fecha seleccionada
    nuevosMarcados[fecha] = {
      ...nuevosMarcados[fecha],
      selected: true,
      selectedColor: Colors.ACCENT,
    };

    setEventosMarcados(nuevosMarcados);
  };

  const handleAgregarEvento = () => {
    navigation.navigate('AgregarEvento', { fecha: fechaSeleccionada });
  };

  const handleEliminarEvento = async (id) => {
    Alert.alert(
      "Confirmar Eliminación",
      "¿Estás seguro de que quieres eliminar este evento?",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Eliminar",
          onPress: async () => {
            const token = await SecureStore.getItemAsync('token');
            try {
              const response = await fetch(`http://128.3.254.138:8000/eventos/eliminar/${id}`, {
                method: 'DELETE',
                headers: {
                  'Authorization': `Bearer ${token}`
                }
              });
              if (response.ok) {
                Alert.alert('✅ Éxito', 'Evento eliminado correctamente.');
                fetchEventos();
              } else {
                throw new Error("Fallo la eliminación");
              }
            } catch (error) {
              Alert.alert('❌ Error', 'No se pudo eliminar el evento');
            }
          },
          style: "destructive"
        }
      ]
    );
  };

  const handleVerParticipantes = () => {
    navigation.navigate('Participantes');
  };

  const handleVerPerfil = () => {
    navigation.navigate('Perfil');
  };

  const cerrarSesion = async () => {
    Alert.alert(
      "Cerrar Sesión",
      "¿Estás seguro de que quieres cerrar tu sesión?",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Sí, Cerrar",
          onPress: async () => {
            await SecureStore.deleteItemAsync('token');
            navigation.replace('LoginScreen');
          },
          style: "destructive"
        }
      ]
    );
  };

  return (
  <View style={GlobalStyles.screenContainer}>
    <ScrollView
      style={{ flex: 1 }}
      contentContainerStyle={CalendarioStyles.scrollViewContent}
    >
      {/* --- HEADER --- */}
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: Espacios.L }}>
        <Text style={[Tipografia.H1, GlobalStyles.textDefault]}>📅 Calendario</Text>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <TouchableOpacity style={CalendarioStyles.actionButton} onPress={handleVerPerfil}>
            <Text style={CalendarioStyles.actionButtonText}>👤 Perfil</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[CalendarioStyles.actionButton, { marginLeft: Espacios.S }]}
            onPress={handleVerParticipantes}
          >
            <Text style={CalendarioStyles.actionButtonText}>👥 Alumnos</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* --- CALENDARIO --- */}
      <View style={[GlobalStyles.card, { padding: Espacios.M }]}>
        <Calendar
          markedDates={eventosMarcados}
          onDayPress={handleDiaSeleccionado}
          theme={{
            backgroundColor: Colors.LIGHT,
            calendarBackground: Colors.LIGHT,
            textSectionTitleColor: Colors.TEXT_DARK,
            selectedDayBackgroundColor: Colors.ACCENT,
            selectedDayTextColor: Colors.WHITE,
            todayTextColor: Colors.PRIMARY,
            dotColor: Colors.PRIMARY,
            selectedDotColor: Colors.WHITE,
            arrowColor: Colors.ACCENT,
            textDayFontSize: Tipografia.BODY.fontSize,
            textMonthFontSize: Tipografia.H2.fontSize,
            textDayHeaderFontSize: Tipografia.SMALL.fontSize,
          }}
        />
      </View>

      {/* --- EVENTOS DEL DÍA --- */}
      {fechaSeleccionada !== '' && (
        <View style={CalendarioStyles.eventosContainer}>
          <Text style={[CalendarioStyles.eventosTitle, GlobalStyles.textDefault]}>
            📌 Eventos del {fechaSeleccionada}
          </Text>
          {eventosDelDia.length === 0 ? (
            <View style={CalendarioStyles.eventoItem}>
              <Text style={[GlobalStyles.textDefault, { textAlign: 'center' }]}>
                No hay eventos programados.
              </Text>
            </View>

          ) : (
            eventosDelDia.map((evento) => (
              <View key={evento.id} style={CalendarioStyles.eventoItem}>
                <Text style={[CalendarioStyles.eventoTexto, GlobalStyles.textDefault]}>
                  {evento.titulo} - {evento.hora || 'Sin hora'}
                </Text>
                <TouchableOpacity onPress={() => handleEliminarEvento(evento.id)}>
                  <Text style={CalendarioStyles.eliminar}>
                    <Icon name="delete" size={14} /> Eliminar
                  </Text>
                </TouchableOpacity>
              </View>
            ))
          )}
          <TouchableOpacity
            style={[GlobalStyles.primaryButton, { alignSelf: 'center', width: 'auto', paddingHorizontal: Espacios.L, marginTop: Espacios.M }]}
            onPress={handleAgregarEvento}
          >
            <Text style={GlobalStyles.primaryButtonText}>➕ Agregar evento</Text>
          </TouchableOpacity>
        </View>
      )}
    </ScrollView>

    {/* --- FAB --- */}
    <TouchableOpacity
      style={GlobalStyles.fab}
      onPress={handleAgregarEvento}
      activeOpacity={0.8}
    >
      <Icon name="plus" size={30} color={Colors.WHITE} />
    </TouchableOpacity>
  </View>
);
}