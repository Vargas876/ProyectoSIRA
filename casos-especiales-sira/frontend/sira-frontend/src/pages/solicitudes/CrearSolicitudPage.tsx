import { ArrowLeft, Plus, Save, Trash2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import MainLayout from '../../components/layout/MainLayout';
import { useAuth } from '../../contexts/AuthContext';
import { solicitudService } from '../../services/solicitudService';
import type { Materia, TipoCaso } from '../../types';

const CrearSolicitudPage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [tiposCaso, setTiposCaso] = useState<TipoCaso[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const [formData, setFormData] = useState({
    idEstudiante: user?.id || 1, // Por defecto el usuario logueado
    idTipo: 0,
    periodoAcademico: '2025-1',
    justificacion: '',
  });
  
  const [materias, setMaterias] = useState<Materia[]>([
    { codigoMateria: '', nombreMateria: '', grupo: '', creditos: 0 }
  ]);

  useEffect(() => {
    cargarTiposCaso();
  }, []);

  const cargarTiposCaso = async () => {
    try {
      const data = await solicitudService.listarTiposCaso();
      setTiposCaso(data);
      if (data.length > 0) {
        setFormData(prev => ({ ...prev, idTipo: data[0].id }));
      }
    } catch (err) {
      setError('Error al cargar tipos de caso');
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleMateriaChange = (index: number, field: keyof Materia, value: string | number) => {
    const nuevasMaterias = [...materias];
    nuevasMaterias[index] = { ...nuevasMaterias[index], [field]: value };
    setMaterias(nuevasMaterias);
  };

  const agregarMateria = () => {
    setMaterias([...materias, { codigoMateria: '', nombreMateria: '', grupo: '', creditos: 0 }]);
  };

  const eliminarMateria = (index: number) => {
    if (materias.length > 1) {
      setMaterias(materias.filter((_, i) => i !== index));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validaciones
    if (!formData.justificacion.trim()) {
      setError('La justificación es obligatoria');
      return;
    }

    if (materias.some(m => !m.codigoMateria || !m.nombreMateria || !m.grupo || m.creditos <= 0)) {
      setError('Completa todos los campos de las materias');
      return;
    }

    try {
      setLoading(true);
      
      const solicitud = {
        idEstudiante: formData.idEstudiante,
        idTipo: parseInt(formData.idTipo.toString()),
        periodoAcademico: formData.periodoAcademico,
        justificacion: formData.justificacion,
        materias: materias,
      };

      const response = await solicitudService.crearSolicitud(solicitud);
      alert('Solicitud creada exitosamente');
      navigate('/solicitudes');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error al crear la solicitud');
    } finally {
      setLoading(false);
    }
  };

  return (
    <MainLayout>
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate('/solicitudes')}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft size={24} />
          </button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Nueva Solicitud</h1>
            <p className="text-gray-600 mt-1">Completa el formulario para crear una solicitud de caso especial</p>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 text-red-600 p-4 rounded-lg">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Información General */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-bold mb-4">Información General</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tipo de Caso Especial *
                </label>
                <select
                  name="idTipo"
                  value={formData.idTipo}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                >
                  {tiposCaso.map(tipo => (
                    <option key={tipo.id} value={tipo.id}>
                      {tipo.nombre}
                    </option>
                  ))}
                </select>
                {tiposCaso.find(t => t.id === formData.idTipo) && (
                  <p className="text-sm text-gray-500 mt-1">
                    {tiposCaso.find(t => t.id === formData.idTipo)?.descripcion}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Periodo Académico *
                </label>
                <input
                  type="text"
                  name="periodoAcademico"
                  value={formData.periodoAcademico}
                  onChange={handleInputChange}
                  placeholder="2025-1"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>
            </div>

            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Justificación *
              </label>
              <textarea
                name="justificacion"
                value={formData.justificacion}
                onChange={handleInputChange}
                placeholder="Explica detalladamente el motivo de tu solicitud..."
                rows={6}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                required
              />
              <p className="text-sm text-gray-500 mt-1">
                {formData.justificacion.length} caracteres
              </p>
            </div>
          </div>

          {/* Materias */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold">Materias Solicitadas</h2>
              <button
                type="button"
                onClick={agregarMateria}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Plus size={20} />
                Agregar Materia
              </button>
            </div>

            <div className="space-y-4">
              {materias.map((materia, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-4 relative">
                  {materias.length > 1 && (
                    <button
                      type="button"
                      onClick={() => eliminarMateria(index)}
                      className="absolute top-2 right-2 p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <Trash2 size={20} />
                    </button>
                  )}
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Código de Materia *
                      </label>
                      <input
                        type="text"
                        value={materia.codigoMateria}
                        onChange={(e) => handleMateriaChange(index, 'codigoMateria', e.target.value)}
                        placeholder="MAT301"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Nombre de Materia *
                      </label>
                      <input
                        type="text"
                        value={materia.nombreMateria}
                        onChange={(e) => handleMateriaChange(index, 'nombreMateria', e.target.value)}
                        placeholder="Cálculo III"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Grupo *
                      </label>
                      <input
                        type="text"
                        value={materia.grupo}
                        onChange={(e) => handleMateriaChange(index, 'grupo', e.target.value)}
                        placeholder="01"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Créditos *
                      </label>
                      <input
                        type="number"
                        value={materia.creditos || ''}
                        onChange={(e) => handleMateriaChange(index, 'creditos', parseInt(e.target.value) || 0)}
                        placeholder="3"
                        min="1"
                        max="10"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        required
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Botones */}
          <div className="flex gap-4">
            <button
              type="button"
              onClick={() => navigate('/solicitudes')}
              className="flex-1 bg-gray-200 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-300 transition-colors"
              disabled={loading}
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <Save size={20} />
              {loading ? 'Creando...' : 'Crear Solicitud'}
            </button>
          </div>
        </form>
      </div>
    </MainLayout>
  );
};

export default CrearSolicitudPage;
