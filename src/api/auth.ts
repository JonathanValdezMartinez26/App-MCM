import axios from 'axios';

const BASE_URL = "http://18.117.29.228:5000";

export async function login(username: string, password: string) {
  const response = await axios.post(`${BASE_URL}/login`, {
    usuario: username,
    password: password,
  });

  return {
    token: response.data.access_token,
    usuario: response.data.usuario,
    sucursales: response.data.sucursales,
  };
}
