import React, { createContext, useState, useEffect } from 'react';
import { getToken, saveToken, removeToken } from '../utils/storage';

type Usuario = {
  id_sucursal: string | null;
  id_usuario: string;
  nombre: string;
  perfil: string;
  puesto: string;
};

type Sucursal = {
  id_region: string;
  id_sucursal: string;
  region: string;
  sucursal: string;
};

type AuthContextType = {
  token: string | null;
  usuario: Usuario | null;
  sucursales: Sucursal[];
  login: (token: string, usuario: Usuario, sucursales: Sucursal[]) => void;
  logout: () => void;
};

export const AuthContext = createContext<AuthContextType>({
  token: null,
  usuario: null,
  sucursales: [],
  login: () => {},
  logout: () => {},
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [token, setToken] = useState<string | null>(null);
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [sucursales, setSucursales] = useState<Sucursal[]>([]);

  useEffect(() => {
    const checkToken = async () => {
      const storedToken = await getToken();
      if (storedToken) setToken(storedToken);
    };
    checkToken();
  }, []);

  const login = async (t: string, u: Usuario, s: Sucursal[]) => {
    await saveToken(t);
    setToken(t);
    setUsuario(u);
    setSucursales(s);
  };

  const logout = async () => {
    await removeToken();
    setToken(null);
    setUsuario(null);
    setSucursales([]);
  };

  return (
    <AuthContext.Provider value={{ token, usuario, sucursales, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
