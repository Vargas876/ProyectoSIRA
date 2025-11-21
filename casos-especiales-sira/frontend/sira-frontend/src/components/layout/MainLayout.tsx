import {
    FileText,
    LayoutDashboard,
    LogOut,
    Menu,
    PlusCircle,
    X
} from 'lucide-react';
import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import NotificationBell from '../common/NotificationBell';
interface MainLayoutProps {
  children: React.ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isActive = (path: string) => location.pathname === path;

  const navItems = [
    { path: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { path: '/solicitudes', icon: FileText, label: 'Solicitudes' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50">
      {/* Navbar */}
      <nav className="glass sticky top-0 z-50 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            {/* Logo */}
            <Link 
              to="/dashboard" 
              className="flex items-center gap-3 group"
            >
              <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-110">
                <span className="text-white font-bold text-xl">S</span>
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  SIRA
                </h1>
                <p className="text-xs text-gray-500">Sistema de Casos Especiales</p>
              </div>
            </Link>
            
            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-2">
              {navItems.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`flex items-center gap-2 px-4 py-2 rounded-xl font-medium transition-all duration-200 ${
                      isActive(item.path)
                        ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <Icon size={20} />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
              
              <Link
                to="/solicitudes/crear"
                className="btn-primary ml-2"
              >
                <PlusCircle size={20} />
                <span>Nueva Solicitud</span>
              </Link>
            </div>

            {/* User Menu */}
            <div className="hidden md:flex items-center gap-4">
              {/* Notifications */}
              <NotificationBell />

              {/* Profile */}
              <Link
                to="/perfil"
                className="flex items-center gap-3 px-4 py-2 hover:bg-gray-100 rounded-xl transition-all duration-200"
              >
                <div className="text-right">
                  <p className="text-sm font-semibold text-gray-800">{user?.nombreCompleto}</p>
                  <p className="text-xs text-gray-500">{user?.rol}</p>
                </div>
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-xl flex items-center justify-center text-white font-bold shadow-md">
                  {user?.nombreCompleto.charAt(0)}
                </div>
              </Link>
              
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded-xl transition-all duration-200 font-medium"
              >
                <LogOut size={20} />
                <span>Salir</span>
              </button>
            </div>

            {/* Mobile menu button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-gray-600 hover:bg-gray-100 rounded-xl"
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-white border-t border-gray-200 animate-slideIn">
            <div className="px-4 py-4 space-y-2">
              {navItems.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all duration-200 ${
                      isActive(item.path)
                        ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <Icon size={20} />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
              <Link
                to="/solicitudes/crear"
                onClick={() => setMobileMenuOpen(false)}
                className="btn-primary w-full justify-center"
              >
                <PlusCircle size={20} />
                <span>Nueva Solicitud</span>
              </Link>
              <button
                onClick={handleLogout}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 text-red-600 hover:bg-red-50 rounded-xl transition-all duration-200 font-medium"
              >
                <LogOut size={20} />
                <span>Cerrar Sesión</span>
              </button>
            </div>
          </div>
        )}
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="animate-fadeIn">
          {children}
        </div>
      </main>

      {/* Footer */}
      <footer className="mt-auto py-6 text-center text-sm text-gray-500">
        <p>© 2025 SIRA - Universidad Pedagógica y Tecnológica de Colombia</p>
      </footer>
    </div>
  );
};

export default MainLayout;
