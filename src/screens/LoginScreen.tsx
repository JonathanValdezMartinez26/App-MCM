import React, { useState } from 'react';
import { View, TextInput, Button, Text, StyleSheet, Alert } from 'react-native';
import { login } from '../api/auth';
import { saveSession } from '../storage/authStorage';

export default function LoginScreen({ navigation }: any) {
  const [usuario, setUsuario] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!usuario || !password) {
      Alert.alert('Error', 'Debes ingresar usuario y contraseña');
      return;
    }

    try {
      setLoading(true);
      const response = await login(usuario, password);
      console.log('Respuesta completa del backend:', response.data);

      // Validación sin bloquear por id_sucursal nulo
      if (!response.data?.access_token || !response.data?.usuario) {
        throw new Error('Datos incompletos del servidor');
      }

      // Guardar token y usuario completo
      await saveSession(response.data.access_token, response.data.usuario);

      Alert.alert('Éxito', 'Sesión iniciada correctamente');
      navigation.navigate('Home');
    } catch (error: any) {
      console.error('Error login:', error);
      Alert.alert('Error al iniciar sesión', error.message || 'Ocurrió un error desconocido');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Iniciar Sesión</Text>
      <TextInput
        placeholder="Usuario"
        value={usuario}
        onChangeText={setUsuario}
        style={styles.input}
        autoCapitalize="none"
      />
      <TextInput
        placeholder="Contraseña"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        style={styles.input}
      />
      <Button title={loading ? 'Cargando...' : 'Iniciar Sesión'} onPress={handleLogin} />
    </View>
  );
}

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
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    marginBottom: 15,
    borderRadius: 5,
  },
});
