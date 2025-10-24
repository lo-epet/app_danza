import AsyncStorage from '@react-native-async-storage/async-storage';

const API_URL = 'http://192.168.1.125:8000'; // Cambiá esto si tu IP cambia

export const login = async (email, password) => {
  const formData = new FormData();
  formData.append('email', email);
  formData.append('password', password);

  const response = await fetch(`${API_URL}/auth/login`, {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    throw new Error('Credenciales inválidas');
  }

  const data = await response.json();
  await AsyncStorage.setItem('token', data.access_token);
  return data;
};

export const getPerfil = async () => {
  const token = await AsyncStorage.getItem('token');
  const response = await fetch(`${API_URL}/auth/me`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error('No se pudo obtener el perfil');
  }

  return await response.json();
};