import React, { useContext } from 'react';
import { View, Text, Button, FlatList, StyleSheet } from 'react-native';
import { AuthContext } from '../context/AuthContext';

export default function DashboardScreen() {
  const { usuario, sucursales, logout } = useContext(AuthContext);

  return (
    <View style={styles.container}>
      <Text style={styles.welcome}>
        Bienvenido {usuario?.nombre} ({usuario?.perfil})
      </Text>
      <FlatList
        data={sucursales}
        keyExtractor={(item) => item.id_sucursal}
        renderItem={({ item }) => (
          <Text style={styles.sucursal}>{item.sucursal} - {item.region}</Text>
        )}
      />
      <Button title="Cerrar sesión" onPress={logout} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#fff' },
  welcome: { fontSize: 20, marginBottom: 10 },
  sucursal: { fontSize: 16, paddingVertical: 4 },
});
