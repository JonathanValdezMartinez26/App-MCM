import AsyncStorage from '@react-native-async-storage/async-storage';

const TOKEN_KEY = 'auth_token';
const USER_KEY = 'auth_user';

export async function saveSession(token: string, user: any) {
  try {
    await AsyncStorage.setItem(TOKEN_KEY, token);
    await AsyncStorage.setItem(USER_KEY, JSON.stringify(user));
  } catch (error) {
    console.error('Error al guardar sesión', error);
  }
}

export async function getSession() {
  try {
    const token = await AsyncStorage.getItem(TOKEN_KEY);
    const user = await AsyncStorage.getItem(USER_KEY);
    return {
      token,
      user: user ? JSON.parse(user) : null,
    };
  } catch (error) {
    console.error('Error al leer sesión', error);
    return { token: null, user: null };
  }
}

export async function clearSession() {
  try {
    await AsyncStorage.removeItem(TOKEN_KEY);
    await AsyncStorage.removeItem(USER_KEY);
  } catch (error) {
    console.error('Error al borrar sesión', error);
  }
}
