import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { CheckCircle, Clock, Eye, FileText, Filter, Search, X, XCircle } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import MainLayout from '../../components/layout/MainLayout';
import { solicitudService } from '../../services/solicitudService';

interface Solicitud {
  id: number;
  codigoSolicitud: string;
  estudiante: {
    codigoEstudiante: string;
    nombreCompleto: string;
  };
  tipoNombre: string;
  estado: string;
  fechaCreacion: string;
}

const SolicitudesListPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [solicitudes, setSolicitudes] = useState<Solicitud[]>([]);
  const [solicitudesFiltradas, setSolicitudesFiltradas] = useState<Solicitud[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Estados de filtros
  const [filtros, setFiltros] = useState({
    busqueda: '',
    estado: searchParams.get('estado') || '',
    periodo: '',
    tipo: '',
  });
  
  const [mostrarFiltros, setMostrarFiltros] = useState(false);

  useEffect(() => {
    cargarSolicitudes();
  }, []);

  useEffect(() => {
    aplicarFiltros();
  }, [solicitudes, filtros]);

  const cargarSolicitudes = async () => {
    try {
      setLoading(true);
      const data = await solicitudService.listarSolicitudes();
      setSolicitudes(data.solicitudes || []);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error al cargar solicitudes');
    } finally {
      setLoading(false);
    }
  };

  const aplicarFiltros = () => {
    let resultado = [...solicitudes];

    // Filtro de búsqueda
    if (filtros.busqueda) {
      resultado = resultado.filter(
        (s) =>
          s.codigoSolicitud.toLowerCase().includes(filtros.busqueda.toLowerCase()) ||
          s.estudiante.nombreCompleto.toLowerCase().includes(filtros.busqueda.toLowerCase()) ||
          s.estudiante.codigoEstudiante.includes(filtros.busqueda)
      );
    }

    // Filtro de estado
    if (filtros.estado) {
      resultado = resultado.filter((s) => s.estado === filtros.estado);
    }

    // Filtro de tipo
    if (filtros.tipo) {
      resultado = resultado.filter((s) => s.tipoNombre === filtros.tipo);
    }

    setSolicitudesFiltradas(resultado);
  };

  const limpiarFiltros = () => {
    setFiltros({
      busqueda: '',
      estado: '',
      periodo: '',
      tipo: '',
    });
    setSearchParams({});
  };

  const getEstadoBadge = (estado: string) => {
    const badges: Record<string, { color: string; icon: any }> = {
      PRE_APROBADA: { color: 'badge-yellow', icon: Clock },
      EN_REVISION: { color: 'badge-blue', icon: Clock },
      APROBADA_FINAL: { color: 'badge-green', icon: CheckCircle },
      RECHAZADA: { color: 'badge-red', icon: XCircle },
      REQUIERE_INFORMACION: { color: 'badge-orange', icon: Clock },
    };

    const badge = badges[estado] || { color: 'bg-gray-100 text-gray-800', icon: FileText };
    const Icon = badge.icon;

    return (
      <span className={`badge ${badge.color}`}>
        <Icon size={16} />
        {estado.replace(/_/g, ' ')}
      </span>
    );
  };

  const tiposUnicos = Array.from(new Set(solicitudes.map((s) => s.tipoNombre)));
  const estadosUnicos = Array.from(new Set(solicitudes.map((s) => s.estado)));

  if (loading) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600 font-medium">Cargando solicitudes...</p>
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Solicitudes
            </h1>
            <p className="text-gray-600 mt-2">
              Gestiona todas las solicitudes de casos especiales ({solicitudesFiltradas.length} encontradas)
            </p>
          </div>
          <Link to="/solicitudes/crear" className="btn-primary">
            <FileText size={20} />
            Nueva Solicitud
          </Link>
        </div>

        {/* Barra de búsqueda y filtros */}
        <div className="card p-6 space-y-4">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Búsqueda */}
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Buscar por código, estudiante..."
                value={filtros.busqueda}
                onChange={(e) => setFiltros({ ...filtros, busqueda: e.target.value })}
                className="input pl-12"
              />
            </div>

            {/* Botón de filtros */}
            <button
              onClick={() => setMostrarFiltros(!mostrarFiltros)}
              className="btn-secondary"
            >
              <Filter size={20} />
              Filtros
              {(filtros.estado || filtros.tipo) && (
                <span className="bg-blue-600 text-white px-2 py-1 rounded-full text-xs">
                  {[filtros.estado, filtros.tipo].filter(Boolean).length}
                </span>
              )}
            </button>

            {(filtros.busqueda || filtros.estado || filtros.tipo) && (
              <button onClick={limpiarFiltros} className="btn-secondary">
                <X size={20} />
                Limpiar
              </button>
            )}
          </div>

          {/* Panel de filtros expandible */}
          {mostrarFiltros && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-gray-200 animate-fadeIn">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Estado</label>
                <select
                  value={filtros.estado}
                  onChange={(e) => setFiltros({ ...filtros, estado: e.target.value })}
                  className="input"
                >
                  <option value="">Todos los estados</option>
                  {estadosUnicos.map((estado) => (
                    <option key={estado} value={estado}>
                      {estado.replace(/_/g, ' ')}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Tipo de Caso</label>
                <select
                  value={filtros.tipo}
                  onChange={(e) => setFiltros({ ...filtros, tipo: e.target.value })}
                  className="input"
                >
                  <option value="">Todos los tipos</option>
                  {tiposUnicos.map((tipo) => (
                    <option key={tipo} value={tipo}>
                      {tipo}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Periodo</label>
                <input
                  type="text"
                  placeholder="2025-1"
                  value={filtros.periodo}
                  onChange={(e) => setFiltros({ ...filtros, periodo: e.target.value })}
                  className="input"
                />
              </div>
            </div>
          )}
        </div>

        {error && (
          <div className="bg-red-50 text-red-600 p-4 rounded-xl border border-red-200">
            {error}
          </div>
        )}

        {/* Lista de solicitudes */}
        {solicitudesFiltradas.length === 0 ? (
          <div className="card p-12 text-center">
            <FileText size={64} className="mx-auto text-gray-300 mb-4" />
            <h3 className="text-xl font-semibold text-gray-700 mb-2">No hay solicitudes</h3>
            <p className="text-gray-500 mb-6">No se encontraron solicitudes con los filtros aplicados</p>
            <button onClick={limpiarFiltros} className="btn-primary mx-auto">
              Limpiar Filtros
            </button>
          </div>
        ) : (
          <div className="card overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gradient-to-r from-gray-50 to-gray-100 border-b-2 border-gray-200">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                      Código
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                      Estudiante
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                      Tipo
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                      Estado
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                      Fecha
                    </th>
                    <th className="px-6 py-4 text-right text-xs font-bold text-gray-600 uppercase tracking-wider">
                      Acciones
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {solicitudesFiltradas.map((solicitud) => (
                    <tr key={solicitud.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-semibold text-gray-900">{solicitud.codigoSolicitud}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm font-medium text-gray-900">{solicitud.estudiante.nombreCompleto}</div>
                        <div className="text-xs text-gray-500">{solicitud.estudiante.codigoEstudiante}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900">{solicitud.tipoNombre}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">{getEstadoBadge(solicitud.estado)}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {format(new Date(solicitud.fechaCreacion), 'dd MMM yyyy', { locale: es })}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        <Link
                          to={`/solicitudes/${solicitud.id}`}
                          className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 font-medium transition-colors"
                        >
                          <Eye size={18} />
                          Ver detalle
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </MainLayout>
  );
};

export default SolicitudesListPage;
