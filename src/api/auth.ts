import axios from 'axios';

const BASE_URL = "http://18.117.29.228:5000";

export async function login(username: string, password: string) {
  try {
    const response = await axios.post(`${BASE_URL}/login`, {
      usuario: username,
      password: password,
    });

    const data = response.data;

    // Validamos estructura mínima del backend
    if (!data || !data.access_token || !data.usuario || !data.usuario.id_usuario || !data.usuario.nombre || !data.usuario.perfil) {
      throw new Error("Datos incompletos del servidor");
    }

    return {
      token: data.access_token,
      usuario: {
        id_usuario: data.usuario.id_usuario,
        nombre: data.usuario.nombre,
        perfil: data.usuario.perfil,
      },
      sucursales: Array.isArray(data.sucursales) ? data.sucursales : [],
    };
  } catch (error: any) {
    console.error("Error en login API:", error.response?.data || error.message);

    // Captura exacta del mensaje del backend
    const backendMsg = error.response?.data?.error || error.response?.data?.message;
    throw new Error(backendMsg || "No se pudo conectar con el servidor");
  }
}
