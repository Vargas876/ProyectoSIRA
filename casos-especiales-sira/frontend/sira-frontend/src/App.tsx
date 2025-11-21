import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import ProtectedRoute from './components/common/ProtectedRoute';
import { AuthProvider } from './contexts/AuthContext';
import LoginPage from './pages/auth/LoginPage';
import DashboardPage from './pages/dashboard/DashboardPage';
import PerfilPage from './pages/perfil/PerfilPage';
import CrearSolicitudPage from './pages/solicitudes/CrearSolicitudPage';
import SolicitudDetallePage from './pages/solicitudes/SolicitudDetallePage';
import SolicitudesListPage from './pages/solicitudes/SolicitudesListPage';
function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <DashboardPage />
              </ProtectedRoute>
            }
          />
          
          <Route
            path="/solicitudes"
            element={
              <ProtectedRoute>
                <SolicitudesListPage />
              </ProtectedRoute>
            }
          />
          
          <Route
            path="/solicitudes/crear"
            element={
              <ProtectedRoute>
                <CrearSolicitudPage />
              </ProtectedRoute>
            }
          />
          
          <Route
            path="/solicitudes/:id"
            element={
              <ProtectedRoute>
                <SolicitudDetallePage />
              </ProtectedRoute>
            }
          />
          <Route
          path="/perfil"
          element={
            <ProtectedRoute>
              <PerfilPage />
            </ProtectedRoute>
          }
        />
          
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
