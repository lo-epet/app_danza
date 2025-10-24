import React, { createContext, useState, useEffect } from 'react';
import * as SecureStore from 'expo-secure-store';

export const DarkModeContext = createContext();

export const DarkModeProvider = ({ children }) => {
  const [modoOscuro, setModoOscuro] = useState(false);

  useEffect(() => {
    const cargarPreferencia = async () => {
      const valor = await SecureStore.getItemAsync('modoOscuro');
      if (valor === 'true') setModoOscuro(true);
    };
    cargarPreferencia();
  }, []);

  const toggleModoOscuro = async () => {
    const nuevoEstado = !modoOscuro;
    setModoOscuro(nuevoEstado);
    await SecureStore.setItemAsync('modoOscuro', nuevoEstado.toString());
  };

  return (
    <DarkModeContext.Provider value={{ modoOscuro, toggleModoOscuro }}>
      {children}
    </DarkModeContext.Provider>
  );
};
