// frontend/screens/LoginScreen.js
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import * as SecureStore from 'expo-secure-store';
import { useNavigation } from '@react-navigation/native';


export default function LoginScreen() {
const [username, setUsername] = useState('');
const [password, setPassword] = useState('');
const navigation = useNavigation();

const handleLogin = async () => {
    

    try {
        
        const response = await fetch('http://128.3.254.138:8000/auth/login', {
            
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: `username=${encodeURIComponent(username)}&password=${encodeURIComponent(password)}`,
        });
        
        const data = await response.json();

        if (response.ok) {
        console.log('Token recibido:', data.access_token);
        // Guardar token, navegar, etc.

        await SecureStore.setItemAsync('token', data.access_token);
        navigation.replace('Calendario');

        } else {
        console.error('Error de login:', data.detail);
        alert('Credenciales inválidas');
        }
    } catch (error) {
        console.error('Error de red:', error);
        alert('No se pudo conectar al servidor');
    }
    };

    return (
        <View style={styles.container}>
        <Text style={styles.title}>Iniciar Sesión</Text>

        <TextInput
            style={styles.input}
            placeholder="Usuario o Email"
            value={username}
            onChangeText={setUsername}
            autoCapitalize="none"
        />

        <TextInput
            style={styles.input}
            placeholder="Contraseña"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
        />

        <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Ingresar</Text>
        </TouchableOpacity>

        </View>
    );
    }

        const styles = StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: '#fff',
            justifyContent: 'center',
            paddingHorizontal: 30,
        },
        title: {
            fontSize: 28,
            marginBottom: 40,
            textAlign: 'center',
            fontWeight: 'bold',
            color: '#333',
        },
        input: {
            height: 50,
            borderColor: '#ccc',
            borderWidth: 1,
            marginBottom: 20,
            paddingHorizontal: 15,
            borderRadius: 8,
        },
        button: {
            backgroundColor: '#007AFF',
            paddingVertical: 15,
            borderRadius: 8,
        },
        buttonText: {
            color: '#fff',
            textAlign: 'center',
            fontSize: 16,
            fontWeight: 'bold',
        },
        });
