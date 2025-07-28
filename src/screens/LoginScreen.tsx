import React, { useState, useContext } from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';
import { login as loginService } from '../api/auth';
import { AuthContext } from '../context/AuthContext';

export default function LoginScreen() {
  const { login } = useContext(AuthContext);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async () => {
    setError('');
    try {
      const result = await loginService(username, password);
      login(result.token, result.usuario, result.sucursales);
    } catch (e) {
      setError('Usuario o contraseña incorrectos');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Iniciar Sesión</Text>
      <TextInput
        style={styles.input}
        placeholder="Usuario"
        onChangeText={setUsername}
        value={username}
        autoCapitalize="none"
      />
      <TextInput
        style={styles.input}
        placeholder="Contraseña"
        secureTextEntry
        onChangeText={setPassword}
        value={password}
      />
      {error ? <Text style={styles.error}>{error}</Text> : null}
      <Button title="Ingresar" onPress={handleLogin} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 20, backgroundColor: '#000' },
  title: { fontSize: 24, textAlign: 'center', marginBottom: 20, color: '#FFD700' },
  input: {
    borderWidth: 1,
    marginBottom: 10,
    padding: 10,
    borderRadius: 5,
    backgroundColor: '#fff',
  },
  error: { color: 'red', textAlign: 'center', marginBottom: 10 },
});
