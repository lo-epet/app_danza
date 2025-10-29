import React, { useState, useContext } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  StyleSheet,
} from 'react-native';
import * as SecureStore from 'expo-secure-store';

import { getGlobalStyles } from '../style/globalStyles';
import { Tipografia } from '../style/tipografia';
import { Espacios } from '../style/espacios';
import { Colors } from '../style/colors';
import { DarkModeContext } from '../context/DarkModeContext';

export default function LoginScreen({ navigation }) {
  const { modoOscuro } = useContext(DarkModeContext);
  const GlobalStyles = getGlobalStyles(modoOscuro);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isEmailFocused, setIsEmailFocused] = useState(false);
  const [isPasswordFocused, setIsPasswordFocused] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('⚠️ Campos requeridos', 'Por favor ingresá tu email y contraseña');
      return;
    }
    


    try {
      const response = await fetch('https://app-danza-sv9i.onrender.com/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: `email=${encodeURIComponent(email)}&password=${encodeURIComponent(password)}`,
      });

      let text = await response.text();
      let data;
      try {
        data = JSON.parse(text);
      } catch (jsonError) {
        console.error('❌ Respuesta no es JSON:', text);
        Alert.alert('❌ Error inesperado', text);
        return;
      }


      if (response.ok && data.access_token) {
        const token = data.access_token;
        console.log('✅ Token recibido:', token);
        await SecureStore.setItemAsync('token', token);
        navigation.replace('Calendario');
      } else {
        console.error('Error de login:', data.detail || data);
        Alert.alert('❌ Credenciales inválidas', data.detail || 'Revisá tus datos e intentá de nuevo');
      }
    } catch (error) {
      console.error('❌ Error de red:', error);
      Alert.alert('❌ No se pudo conectar al servidor');
    }
  };

  return (
    <View style={[GlobalStyles.screenContainer, localStyles.centeredContainer]}>
      <Text style={[Tipografia.H1, GlobalStyles.textDefault, { marginBottom: Espacios.L * 2, textAlign: 'center' }]}>
        ¡Bienvenido/a!
      </Text>

      <View style={GlobalStyles.inputContainer}>
        <Text style={GlobalStyles.inputLabel}>Email</Text>
        <TextInput
          style={[
            GlobalStyles.textInput,
            isEmailFocused && GlobalStyles.inputFocused,
          ]}
          onFocus={() => setIsEmailFocused(true)}
          onBlur={() => setIsEmailFocused(false)}
          placeholder="email@institucion.com.ar"
          placeholderTextColor={modoOscuro ? '#aaa' : '#666'}
          autoCapitalize="none"
          keyboardType="email-address"
          value={email}
          onChangeText={setEmail}
        />
      </View>

      <View style={GlobalStyles.inputContainer}>
        <Text style={GlobalStyles.inputLabel}>Contraseña</Text>
        <TextInput
          style={[
            GlobalStyles.textInput,
            isPasswordFocused && GlobalStyles.inputFocused,
          ]}
          onFocus={() => setIsPasswordFocused(true)}
          onBlur={() => setIsPasswordFocused(false)}
          placeholder="Ingresá tu clave"
          placeholderTextColor={modoOscuro ? '#aaa' : '#666'}
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />
      </View>

      <TouchableOpacity style={GlobalStyles.primaryButton} onPress={handleLogin}>
        <Text style={GlobalStyles.primaryButtonText}>Ingresar</Text>
      </TouchableOpacity>

      <TouchableOpacity style={localStyles.linkButton} onPress={() => navigation.navigate('Registro')}>
        <Text style={[Tipografia.SMALL, GlobalStyles.textDefault, localStyles.linkText]}>
            ¿No tenés cuenta?{' '}
            <Text style={[Tipografia.SMALL, { color: Colors.PRIMARY, fontWeight: '600' }]}>
                Registrate aquí
            </Text>
</Text>

      </TouchableOpacity>
    </View>
  );
}

const localStyles = StyleSheet.create({
  centeredContainer: {
    justifyContent: 'center',
  },
  linkButton: {
    marginTop: Espacios.M,
    paddingVertical: Espacios.S,
  },
  linkText: {
    textAlign: 'center',
  },
});
