import React from 'react';
import { View, Text, Button, StyleSheet, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const HomeScreen = ({ navigation }: any) => {
  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem('token');
      await AsyncStorage.removeItem('usuario');
      await AsyncStorage.removeItem('sucursales');

      // Regresar a pantalla Login, reemplazando el stack
      navigation.replace('Login');
    } catch (error) {
      Alert.alert('Error', 'No se pudo cerrar sesión correctamente.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Bienvenido a Home</Text>
      <Button title="Cerrar Sesión" onPress={handleLogout} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 22,
    marginBottom: 20,
    textAlign: 'center',
  },
});

export default HomeScreen;
