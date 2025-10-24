import { StyleSheet } from 'react-native';
import { Colors } from './colors';
import { Espacios } from './espacios';
import { Tipografia } from './tipografia';

export const getGlobalStyles = (modoOscuro) =>
  StyleSheet.create({
    // --- LAYOUTS Y PANTALLA ---
    screenContainer: {
      flex: 1,
      backgroundColor: modoOscuro ? '#1c1c1e' : Colors.BACKGROUND,
      paddingHorizontal: Espacios.L,
      paddingTop: Espacios.L,
    },
    card: {
      backgroundColor: modoOscuro ? '#2c2c2e' : Colors.LIGHT,
      borderRadius: 12,
      padding: Espacios.M,
      marginBottom: Espacios.M,
      shadowColor: modoOscuro ? '#000' : Colors.TEXT_DARK,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 4,
    },

    // --- BOTONES ---
    primaryButton: {
      backgroundColor: Colors.ACCENT,
      borderRadius: 8,
      paddingVertical: Espacios.M,
      alignItems: 'center',
      justifyContent: 'center',
      height: 50,
      marginBottom: Espacios.M,
    },
    primaryButtonText: {
      ...Tipografia.BODY,
      fontWeight: '600',
      color: Colors.WHITE,
    },
    secondaryButton: {
      backgroundColor: 'transparent',
      borderColor: Colors.PRIMARY,
      borderWidth: 1,
      borderRadius: 8,
      paddingVertical: Espacios.M,
      alignItems: 'center',
      justifyContent: 'center',
      height: 50,
    },
    secondaryButtonText: {
      ...Tipografia.BODY,
      color: Colors.PRIMARY,
    },

    // --- INPUTS Y FORMULARIOS ---
    inputContainer: {
      marginBottom: Espacios.M,
    },
    inputLabel: {
      ...Tipografia.SMALL,
      marginBottom: Espacios.S,
      color: modoOscuro ? '#ccc' : Colors.PRIMARY,
      fontWeight: '500',
    },
    textInput: {
      backgroundColor: modoOscuro ? '#2c2c2e' : Colors.WHITE,
      borderWidth: 1,
      borderColor: modoOscuro ? '#555' : Colors.BORDER,
      borderRadius: 6,
      padding: Espacios.M - 2,
      ...Tipografia.BODY,
      color: modoOscuro ? '#fff' : Colors.TEXT_DARK,
    },
    inputFocused: {
      borderColor: Colors.PRIMARY,
      borderWidth: 2,
    },
  });
