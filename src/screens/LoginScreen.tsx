import React, { useState, useEffect } from 'react';
import { View, TextInput, Button, Alert, StyleSheet, Text } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { login } from '../api/auth';

const LoginScreen = ({ navigation }: any) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  // Verificamos si ya hay sesión activa
  useEffect(() => {
    const checkSession = async () => {
      const token = await AsyncStorage.getItem('token');
      if (token) {
        navigation.replace('Home'); // Redirige directamente si hay token
      }
    };
    checkSession();
  }, [navigation]);

  const handleLogin = async () => {
    if (!username || !password) {
      Alert.alert('Error', 'Por favor, ingrese usuario y contraseña');
      return;
    }

    try {
      setLoading(true);
      const response = await login(username, password);

      await AsyncStorage.setItem('token', response.token);
      await AsyncStorage.setItem('usuario', JSON.stringify(response.usuario));
      await AsyncStorage.setItem('sucursales', JSON.stringify(response.sucursales));

      if (!response.sucursales || response.sucursales.length === 0) {
        Alert.alert('Aviso', 'No tiene cartera asignada');
      }

      navigation.replace('Home');
    } catch (error: any) {
      Alert.alert('Error login', error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Iniciar Sesión</Text>
      <TextInput
        placeholder="Usuario"
        placeholderTextColor="#aaa"
        value={username}
        onChangeText={setUsername}
        style={styles.input}
      />
      <TextInput
        placeholder="Contraseña"
        placeholderTextColor="#aaa"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        style={styles.input}
      />
      <Button title={loading ? 'Ingresando...' : 'Ingresar'} onPress={handleLogin} disabled={loading} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    height: 50,
    borderColor: '#ccc',
    borderWidth: 1,
    marginBottom: 15,
    paddingHorizontal: 10,
    borderRadius: 5,
    backgroundColor: '#fff',
  },
});

export default LoginScreen;
