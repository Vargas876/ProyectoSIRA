import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import {
    ArrowLeft,
    BookOpen,
    CheckCircle,
    Clock,
    FileText,
    MessageSquare,
    User,
    XCircle
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import MainLayout from '../../components/layout/MainLayout';
import { useAuth } from '../../contexts/AuthContext';
import { solicitudService } from '../../services/solicitudService';
import type { Solicitud } from '../../types';

const SolicitudDetallePage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [solicitud, setSolicitud] = useState<Solicitud | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showApprovalModal, setShowApprovalModal] = useState<'aprobar' | 'rechazar' | 'info' | null>(null);
  const [comentarios, setComentarios] = useState('');
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    if (id) {
      cargarSolicitud(parseInt(id));
    }
  }, [id]);

  const cargarSolicitud = async (solicitudId: number) => {
    try {
      setLoading(true);
      const data = await solicitudService.obtenerSolicitud(solicitudId);
      setSolicitud(data);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error al cargar la solicitud');
    } finally {
      setLoading(false);
    }
  };

  const handleAprobacion = async (accion: 'aprobar' | 'rechazar' | 'info') => {
    if (!solicitud || !comentarios.trim()) {
      alert('Por favor ingresa comentarios');
      return;
    }

    try {
      setProcessing(true);
      const data = {
        rolAprobador: user?.rol || 'ADMIN',
        comentarios,
      };

      if (accion === 'aprobar') {
        await solicitudService.aprobarSolicitud(solicitud.id, data);
      } else if (accion === 'rechazar') {
        await solicitudService.rechazarSolicitud(solicitud.id, data);
      } else {
        await solicitudService.solicitarInformacion(solicitud.id, data);
      }

      setShowApprovalModal(null);
      setComentarios('');
      cargarSolicitud(solicitud.id);
      alert('Acción realizada exitosamente');
    } catch (err: any) {
      alert(err.response?.data?.message || 'Error al procesar la solicitud');
    } finally {
      setProcessing(false);
    }
  };

  const getEstadoBadge = (estado: string) => {
    const badges: Record<string, { color: string; icon: any; text: string }> = {
      PRE_APROBADA: { color: 'bg-yellow-100 text-yellow-800', icon: Clock, text: 'Pre-Aprobada' },
      EN_REVISION: { color: 'bg-blue-100 text-blue-800', icon: Clock, text: 'En Revisión' },
      APROBADA_FINAL: { color: 'bg-green-100 text-green-800', icon: CheckCircle, text: 'Aprobada Final' },
      RECHAZADA: { color: 'bg-red-100 text-red-800', icon: XCircle, text: 'Rechazada' },
      REQUIERE_INFORMACION: { color: 'bg-orange-100 text-orange-800', icon: MessageSquare, text: 'Requiere Información' },
    };

    const badge = badges[estado] || { color: 'bg-gray-100 text-gray-800', icon: FileText, text: estado };
    const Icon = badge.icon;

    return (
      <span className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium ${badge.color}`}>
        <Icon size={18} />
        {badge.text}
      </span>
    );
  };

  if (loading) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Cargando solicitud...</p>
          </div>
        </div>
      </MainLayout>
    );
  }

  if (error || !solicitud) {
    return (
      <MainLayout>
        <div className="bg-red-50 text-red-600 p-6 rounded-lg">
          <h2 className="text-xl font-bold mb-2">Error</h2>
          <p>{error || 'Solicitud no encontrada'}</p>
          <Link to="/solicitudes" className="text-blue-600 underline mt-4 inline-block">
            Volver a la lista
          </Link>
        </div>
      </MainLayout>
    );
  }

  const puedeAprobar = user?.rol === 'ADMIN' || user?.rol === 'DIRECTOR_PROGRAMA' || user?.rol === 'COORDINADOR';

  return (
    <MainLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate('/solicitudes')}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ArrowLeft size={24} />
            </button>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{solicitud.codigoSolicitud}</h1>
              <p className="text-gray-600 mt-1">{solicitud.tipoNombre}</p>
            </div>
          </div>
          {getEstadoBadge(solicitud.estado)}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Información del Estudiante */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center gap-2 mb-4">
                <User className="text-blue-600" size={24} />
                <h2 className="text-xl font-bold">Información del Estudiante</h2>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Nombre Completo</p>
                  <p className="font-medium">{solicitud.estudiante.nombreCompleto}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Código Estudiante</p>
                  <p className="font-medium">{solicitud.estudiante.codigoEstudiante}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Email</p>
                  <p className="font-medium">{solicitud.estudiante.email}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Periodo Académico</p>
                  <p className="font-medium">{solicitud.periodoAcademico}</p>
                </div>
              </div>
            </div>

            {/* Justificación */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center gap-2 mb-4">
                <MessageSquare className="text-blue-600" size={24} />
                <h2 className="text-xl font-bold">Justificación</h2>
              </div>
              <p className="text-gray-700 leading-relaxed">{solicitud.justificacion}</p>
            </div>

            {/* Materias */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center gap-2 mb-4">
                <BookOpen className="text-blue-600" size={24} />
                <h2 className="text-xl font-bold">Materias Solicitadas</h2>
              </div>
              <div className="space-y-3">
                {solicitud.materias.map((materia) => (
                  <div key={materia.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-semibold text-gray-900">{materia.nombreMateria}</p>
                        <p className="text-sm text-gray-600">
                          Código: {materia.codigoMateria} | Grupo: {materia.grupo}
                        </p>
                      </div>
                      <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                        {materia.creditos} créditos
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Historial de Aprobaciones */}
            {solicitud.historialAprobaciones && solicitud.historialAprobaciones.length > 0 && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h2 className="text-xl font-bold mb-4">Historial de Aprobaciones</h2>
                <div className="space-y-4">
                  {solicitud.historialAprobaciones.map((aprobacion) => (
                    <div key={aprobacion.id} className="border-l-4 border-blue-500 pl-4 py-2">
                      <div className="flex items-center justify-between mb-2">
                        <p className="font-semibold">{aprobacion.nombreAprobador}</p>
                        <span className="text-sm text-gray-500">
                          {format(new Date(aprobacion.fechaAccion), "dd MMM yyyy HH:mm", { locale: es })}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mb-1">Rol: {aprobacion.rolAprobador}</p>
                      <p className="text-sm text-gray-600 mb-2">Acción: {aprobacion.accion}</p>
                      <p className="text-gray-700">{aprobacion.comentarios}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Detalles */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-bold mb-4">Detalles</h2>
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-gray-500">Fecha de Creación</p>
                  <p className="font-medium">
                    {format(new Date(solicitud.fechaCreacion), "dd MMM yyyy HH:mm", { locale: es })}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Última Actualización</p>
                  <p className="font-medium">
                    {format(new Date(solicitud.fechaActualizacion), "dd MMM yyyy HH:mm", { locale: es })}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Prioridad</p>
                  <p className="font-medium">{solicitud.prioridad}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Validación Automática</p>
                  <p className="font-medium">{solicitud.validacionAutomatica ? 'Sí' : 'No'}</p>
                </div>
              </div>
            </div>

            {/* Acciones */}
            {puedeAprobar && solicitud.estado !== 'APROBADA_FINAL' && solicitud.estado !== 'RECHAZADA' && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h2 className="text-lg font-bold mb-4">Acciones</h2>
                <div className="space-y-3">
                  <button
                    onClick={() => setShowApprovalModal('aprobar')}
                    className="w-full bg-green-600 text-white px-4 py-3 rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center gap-2"
                  >
                    <CheckCircle size={20} />
                    Aprobar
                  </button>
                  <button
                    onClick={() => setShowApprovalModal('rechazar')}
                    className="w-full bg-red-600 text-white px-4 py-3 rounded-lg hover:bg-red-700 transition-colors flex items-center justify-center gap-2"
                  >
                    <XCircle size={20} />
                    Rechazar
                  </button>
                  <button
                    onClick={() => setShowApprovalModal('info')}
                    className="w-full bg-orange-600 text-white px-4 py-3 rounded-lg hover:bg-orange-700 transition-colors flex items-center justify-center gap-2"
                  >
                    <MessageSquare size={20} />
                    Solicitar Información
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Modal de Aprobación */}
        {showApprovalModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6">
              <h3 className="text-xl font-bold mb-4">
                {showApprovalModal === 'aprobar' && 'Aprobar Solicitud'}
                {showApprovalModal === 'rechazar' && 'Rechazar Solicitud'}
                {showApprovalModal === 'info' && 'Solicitar Información'}
              </h3>
              <textarea
                value={comentarios}
                onChange={(e) => setComentarios(e.target.value)}
                placeholder="Ingresa tus comentarios..."
                className="w-full border border-gray-300 rounded-lg p-3 mb-4 h-32 resize-none"
              />
              <div className="flex gap-3">
                <button
                  onClick={() => {
                    setShowApprovalModal(null);
                    setComentarios('');
                  }}
                  className="flex-1 bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300 transition-colors"
                  disabled={processing}
                >
                  Cancelar
                </button>
                <button
                  onClick={() => handleAprobacion(showApprovalModal)}
                  disabled={processing || !comentarios.trim()}
                  className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                >
                  {processing ? 'Procesando...' : 'Confirmar'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </MainLayout>
  );
};

export default SolicitudDetallePage;
