import { Edit2, Key, Lock, Mail, Save, User } from 'lucide-react';
import { useState } from 'react';
import MainLayout from '../../components/layout/MainLayout';
import { useAuth } from '../../contexts/AuthContext';

const PerfilPage: React.FC = () => {
  const { user } = useAuth();
  const [editMode, setEditMode] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  
  const [formData, setFormData] = useState({
    nombreCompleto: user?.nombreCompleto || '',
    email: user?.email || '',
    codigoUsuario: user?.codigoUsuario || '',
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPasswordData({ ...passwordData, [e.target.name]: e.target.value });
  };

  const handleSaveProfile = async () => {
    setLoading(true);
    // Aquí iría la llamada al backend para actualizar el perfil
    setTimeout(() => {
      setMessage({ type: 'success', text: 'Perfil actualizado exitosamente' });
      setEditMode(false);
      setLoading(false);
      setTimeout(() => setMessage({ type: '', text: '' }), 3000);
    }, 1000);
  };

  const handleChangePassword = async () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setMessage({ type: 'error', text: 'Las contraseñas no coinciden' });
      return;
    }

    setLoading(true);
    // Aquí iría la llamada al backend para cambiar la contraseña
    setTimeout(() => {
      setMessage({ type: 'success', text: 'Contraseña cambiada exitosamente' });
      setShowPasswordModal(false);
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
      setLoading(false);
      setTimeout(() => setMessage({ type: '', text: '' }), 3000);
    }, 1000);
  };

  return (
    <MainLayout>
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Mi Perfil
            </h1>
            <p className="text-gray-600 mt-2">Gestiona tu información personal</p>
          </div>
          {!editMode && (
            <button onClick={() => setEditMode(true)} className="btn-primary">
              <Edit2 size={20} />
              Editar Perfil
            </button>
          )}
        </div>

        {/* Messages */}
        {message.text && (
          <div
            className={`p-4 rounded-xl animate-fadeIn ${
              message.type === 'success'
                ? 'bg-green-50 text-green-700 border border-green-200'
                : 'bg-red-50 text-red-700 border border-red-200'
            }`}
          >
            {message.text}
          </div>
        )}

        {/* Avatar Section */}
        <div className="card p-8">
          <div className="flex flex-col md:flex-row items-center gap-8">
            <div className="relative">
              <div className="w-32 h-32 bg-gradient-to-br from-blue-500 to-purple-500 rounded-3xl flex items-center justify-center text-white text-5xl font-bold shadow-2xl">
                {user?.nombreCompleto.charAt(0)}
              </div>
              <button className="absolute bottom-2 right-2 bg-white p-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-200">
                <Edit2 size={18} className="text-blue-600" />
              </button>
            </div>
            
            <div className="flex-1 text-center md:text-left">
              <h2 className="text-3xl font-bold text-gray-900">{user?.nombreCompleto}</h2>
              <p className="text-gray-600 text-lg mt-1">{user?.rol}</p>
              <div className="flex flex-wrap gap-2 mt-4 justify-center md:justify-start">
                <span className="badge badge-blue">
                  <User size={16} />
                  {user?.codigoUsuario}
                </span>
                <span className="badge badge-green">
                  Activo
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Information Form */}
        <div className="card p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
            <User size={24} className="text-blue-600" />
            Información Personal
          </h2>

          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Nombre Completo
                </label>
                <input
                  type="text"
                  name="nombreCompleto"
                  value={formData.nombreCompleto}
                  onChange={handleInputChange}
                  disabled={!editMode}
                  className="input disabled:bg-gray-50 disabled:text-gray-500"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Código de Usuario
                </label>
                <input
                  type="text"
                  name="codigoUsuario"
                  value={formData.codigoUsuario}
                  disabled
                  className="input disabled:bg-gray-50 disabled:text-gray-500"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  <Mail size={16} className="inline mr-2" />
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  disabled={!editMode}
                  className="input disabled:bg-gray-50 disabled:text-gray-500"
                />
              </div>
            </div>

            {editMode && (
              <div className="flex gap-4 pt-4 border-t border-gray-200">
                <button
                  onClick={handleSaveProfile}
                  disabled={loading}
                  className="btn-success flex-1"
                >
                  <Save size={20} />
                  {loading ? 'Guardando...' : 'Guardar Cambios'}
                </button>
                <button
                  onClick={() => {
                    setEditMode(false);
                    setFormData({
                      nombreCompleto: user?.nombreCompleto || '',
                      email: user?.email || '',
                      codigoUsuario: user?.codigoUsuario || '',
                    });
                  }}
                  className="btn-secondary flex-1"
                >
                  Cancelar
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Security Section */}
        <div className="card p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
            <Lock size={24} className="text-blue-600" />
            Seguridad
          </h2>

          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
              <div>
                <p className="font-semibold text-gray-900">Contraseña</p>
                <p className="text-sm text-gray-600">Última actualización hace 30 días</p>
              </div>
              <button
                onClick={() => setShowPasswordModal(true)}
                className="btn-primary"
              >
                <Key size={20} />
                Cambiar Contraseña
              </button>
            </div>
          </div>
        </div>

        {/* Role and Permissions */}
        <div className="card p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Rol y Permisos</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-blue-50 rounded-xl">
              <div>
                <p className="font-semibold text-blue-900">Rol Actual</p>
                <p className="text-sm text-blue-700">{user?.rol}</p>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 bg-green-50 rounded-xl">
                <p className="font-semibold text-green-900 mb-2">Permisos</p>
                <ul className="space-y-1 text-sm text-green-700">
                  <li>✓ Crear solicitudes</li>
                  <li>✓ Ver solicitudes</li>
                  <li>✓ Aprobar solicitudes</li>
                  <li>✓ Gestionar usuarios</li>
                </ul>
              </div>
              
              <div className="p-4 bg-purple-50 rounded-xl">
                <p className="font-semibold text-purple-900 mb-2">Estadísticas</p>
                <ul className="space-y-1 text-sm text-purple-700">
                  <li>Solicitudes creadas: 15</li>
                  <li>Solicitudes aprobadas: 12</li>
                  <li>Miembro desde: 2024</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Password Change Modal */}
      {showPasswordModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 animate-fadeIn">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8">
            <h3 className="text-2xl font-bold mb-6 flex items-center gap-2">
              <Lock className="text-blue-600" size={28} />
              Cambiar Contraseña
            </h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Contraseña Actual
                </label>
                <input
                  type="password"
                  name="currentPassword"
                  value={passwordData.currentPassword}
                  onChange={handlePasswordChange}
                  className="input"
                  placeholder="••••••••"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Nueva Contraseña
                </label>
                <input
                  type="password"
                  name="newPassword"
                  value={passwordData.newPassword}
                  onChange={handlePasswordChange}
                  className="input"
                  placeholder="••••••••"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Confirmar Nueva Contraseña
                </label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={passwordData.confirmPassword}
                  onChange={handlePasswordChange}
                  className="input"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <div className="flex gap-4 mt-6">
              <button
                onClick={() => {
                  setShowPasswordModal(false);
                  setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
                }}
                className="btn-secondary flex-1"
                disabled={loading}
              >
                Cancelar
              </button>
              <button
                onClick={handleChangePassword}
                disabled={loading}
                className="btn-success flex-1"
              >
                <Save size={20} />
                {loading ? 'Guardando...' : 'Guardar'}
              </button>
            </div>
          </div>
        </div>
      )}
    </MainLayout>
  );
};

export default PerfilPage;
