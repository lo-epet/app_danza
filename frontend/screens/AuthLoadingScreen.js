import React, { useEffect, useState } from 'react';
import { ActivityIndicator, View } from 'react-native';
import * as SecureStore from 'expo-secure-store';

export default function AuthLoadingScreen({ navigation }) {
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const verificarToken = async () => {
      const token = await SecureStore.getItemAsync('token');
      if (!token) {
        navigation.replace('Login');
        return;
      }

      try {
        const res = await fetch('http://128.3.254.138:8000/auth/me', {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (res.ok) {
          navigation.replace('Calendario');
        } else {
          await SecureStore.deleteItemAsync('token');
          navigation.replace('Login');
        }
      } catch (error) {
        console.error('❌ Error al verificar token:', error);
        navigation.replace('Login');
      } finally {
        setChecking(false);
      }
    };

    verificarToken();
  }, []);

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <ActivityIndicator size="large" />
    </View>
  );
}
