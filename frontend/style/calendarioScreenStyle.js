import { StyleSheet } from 'react-native';
import { Espacios } from './espacios';

export const getCalendarioStyles = (modoOscuro) =>
  StyleSheet.create({
    scrollViewContent: {
      paddingBottom: Espacios.XL || 40,
    },
    actionButton: {
      backgroundColor: '#007AFF',
      paddingVertical: 10,
      paddingHorizontal: 15,
      borderRadius: 8,
    },
    actionButtonText: {
      color: '#fff',
      fontWeight: 'bold',
    },
    eventosContainer: {
      marginTop: 20,
    },
    eventosTitle: {
      fontSize: 18,
      fontWeight: 'bold',
      marginBottom: 10,
      color: modoOscuro ? '#fff' : '#333',
    },
    eventoItem: {
      padding: 10,
      borderBottomWidth: 1,
      borderColor: modoOscuro ? '#555' : '#ccc',
    },
    eventoTexto: {
      fontSize: 16,
      color: modoOscuro ? '#fff' : '#333',
    },
    eliminar: {
      color: 'red',
      marginTop: 5,
    },
    logoutButton: {
      backgroundColor: '#FF3B30',
      paddingVertical: 15,
      paddingHorizontal: 30,
      borderRadius: 8,
      marginTop: 20,
      alignSelf: 'center',
    },
    logoutText: {
      color: '#fff',
      fontSize: 16,
      fontWeight: 'bold',
    },
  });
