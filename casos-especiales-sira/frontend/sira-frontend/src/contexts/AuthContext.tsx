import { jwtDecode } from 'jwt-decode';
import React, { createContext, useContext, useEffect, useState } from 'react';
import type { Usuario } from '../types';

interface AuthContextType {
  user: Usuario | null;
  token: string | null;
  login: (token: string) => void;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<Usuario | null>(null);
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    if (storedToken) {
      try {
        const decoded: any = jwtDecode(storedToken);
        setToken(storedToken);
        setUser({
          id: decoded.id,
          codigoUsuario: decoded.sub,
          nombreCompleto: decoded.nombre,
          email: decoded.email || '',
          rol: decoded.rol,
        });
      } catch (error) {
        localStorage.removeItem('token');
      }
    }
  }, []);

  const login = (newToken: string) => {
    localStorage.setItem('token', newToken);
    const decoded: any = jwtDecode(newToken);
    setToken(newToken);
    setUser({
      id: decoded.id,
      codigoUsuario: decoded.sub,
      nombreCompleto: decoded.nombre,
      email: decoded.email || '',
      rol: decoded.rol,
    });
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        login,
        logout,
        isAuthenticated: !!token,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
