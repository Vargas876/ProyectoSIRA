import { Lock, LogIn, User } from 'lucide-react';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { authService } from '../../services/authService';

const LoginPage: React.FC = () => {
  const [codigoUsuario, setCodigoUsuario] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await authService.login({ codigoUsuario, password });
      login(response.token);
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error al iniciar sesión');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-600 via-purple-600 to-pink-500 p-4">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute w-96 h-96 bg-white opacity-10 rounded-full -top-48 -left-48 animate-pulse"></div>
        <div className="absolute w-96 h-96 bg-white opacity-10 rounded-full -bottom-48 -right-48 animate-pulse" style={{ animationDelay: '1s' }}></div>
      </div>

      <div className="relative glass rounded-3xl shadow-2xl w-full max-w-md p-8 md:p-12 animate-fadeIn">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-gradient-to-br from-blue-600 to-purple-600 rounded-3xl flex items-center justify-center mx-auto mb-4 shadow-2xl">
            <span className="text-white font-bold text-3xl">S</span>
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            SIRA
          </h1>
          <p className="text-gray-600 mt-2 font-medium">Sistema de Casos Especiales</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              <User size={16} className="inline mr-2" />
              Código de Usuario
            </label>
            <input
              type="text"
              value={codigoUsuario}
              onChange={(e) => setCodigoUsuario(e.target.value)}
              className="input"
              placeholder="admin001"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              <Lock size={16} className="inline mr-2" />
              Contraseña
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="input"
              placeholder="••••••••"
              required
            />
          </div>

          {error && (
            <div className="bg-red-50 text-red-600 p-4 rounded-xl text-sm border border-red-200 animate-fadeIn">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="btn-primary w-full justify-center text-lg py-4"
          >
            <LogIn size={22} />
            {loading ? 'Ingresando...' : 'Iniciar Sesión'}
          </button>
        </form>

        <div className="mt-8 text-center">
          <p className="text-sm text-gray-500">
            © 2025 Universidad Pedagógica y Tecnológica de Colombia
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
