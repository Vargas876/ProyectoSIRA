import { ArcElement, BarElement, CategoryScale, Chart as ChartJS, Legend, LinearScale, LineElement, PointElement, Title, Tooltip } from 'chart.js';
import { Calendar, CheckCircle, Clock, FileText, TrendingUp, XCircle } from 'lucide-react';
import { useState } from 'react';
import { Bar, Doughnut, Line } from 'react-chartjs-2';
import { Link } from 'react-router-dom';
import MainLayout from '../../components/layout/MainLayout';

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title, LineElement, PointElement);

const DashboardPage: React.FC = () => {
  const [stats, setStats] = useState({
    total: 10,
    pendientes: 3,
    aprobadas: 5,
    rechazadas: 2,
  });

  const [loading, setLoading] = useState(false);

  // Datos para el gráfico de dona (estados)
  const estadosData = {
    labels: ['Pendientes', 'Aprobadas', 'Rechazadas'],
    datasets: [
      {
        data: [stats.pendientes, stats.aprobadas, stats.rechazadas],
        backgroundColor: [
          'rgba(251, 146, 60, 0.8)',
          'rgba(34, 197, 94, 0.8)',
          'rgba(239, 68, 68, 0.8)',
        ],
        borderColor: [
          'rgba(251, 146, 60, 1)',
          'rgba(34, 197, 94, 1)',
          'rgba(239, 68, 68, 1)',
        ],
        borderWidth: 2,
      },
    ],
  };

  // Datos para gráfico de barras (por mes)
  const solicitudesPorMes = {
    labels: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'],
    datasets: [
      {
        label: 'Solicitudes',
        data: [5, 8, 12, 7, 15, 10, 14, 9, 11, 16, 10, 0],
        backgroundColor: 'rgba(59, 130, 246, 0.8)',
        borderColor: 'rgba(59, 130, 246, 1)',
        borderWidth: 2,
        borderRadius: 8,
      },
    ],
  };

  // Datos para gráfico de línea (tendencia)
  const tendenciaData = {
    labels: ['Sem 1', 'Sem 2', 'Sem 3', 'Sem 4'],
    datasets: [
      {
        label: 'Aprobadas',
        data: [12, 19, 15, 25],
        borderColor: 'rgba(34, 197, 94, 1)',
        backgroundColor: 'rgba(34, 197, 94, 0.1)',
        tension: 0.4,
        fill: true,
        borderWidth: 3,
      },
      {
        label: 'Rechazadas',
        data: [3, 5, 4, 6],
        borderColor: 'rgba(239, 68, 68, 1)',
        backgroundColor: 'rgba(239, 68, 68, 0.1)',
        tension: 0.4,
        fill: true,
        borderWidth: 3,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom' as const,
        labels: {
          padding: 15,
          font: {
            size: 12,
            weight: 'bold' as const,
          },
        },
      },
    },
  };

  const statCards = [
    {
      title: 'Total Solicitudes',
      value: stats.total,
      icon: FileText,
      color: 'from-blue-500 to-blue-600',
      bgColor: 'bg-blue-50',
      textColor: 'text-blue-600',
      change: '+12%',
    },
    {
      title: 'Pendientes',
      value: stats.pendientes,
      icon: Clock,
      color: 'from-orange-500 to-orange-600',
      bgColor: 'bg-orange-50',
      textColor: 'text-orange-600',
      change: '-5%',
    },
    {
      title: 'Aprobadas',
      value: stats.aprobadas,
      icon: CheckCircle,
      color: 'from-green-500 to-green-600',
      bgColor: 'bg-green-50',
      textColor: 'text-green-600',
      change: '+18%',
    },
    {
      title: 'Rechazadas',
      value: stats.rechazadas,
      icon: XCircle,
      color: 'from-red-500 to-red-600',
      bgColor: 'bg-red-50',
      textColor: 'text-red-600',
      change: '-8%',
    },
  ];

  return (
    <MainLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Dashboard
            </h1>
            <p className="text-gray-600 mt-2 flex items-center gap-2">
              <Calendar size={18} />
              Bienvenido al Sistema de Casos Especiales
            </p>
          </div>
          <Link
            to="/solicitudes/crear"
            className="btn-primary"
          >
            <FileText size={20} />
            Nueva Solicitud
          </Link>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {statCards.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div
                key={index}
                className="card-hover p-6 animate-fadeIn"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="flex items-center justify-between mb-4">
                  <div className={`w-14 h-14 ${stat.bgColor} rounded-2xl flex items-center justify-center`}>
                    <Icon className={stat.textColor} size={28} />
                  </div>
                  <span className={`text-sm font-semibold ${stat.textColor}`}>
                    {stat.change}
                  </span>
                </div>
                <p className="text-sm text-gray-600 mb-1">{stat.title}</p>
                <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
              </div>
            );
          })}
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Gráfico de Dona - Estados */}
          <div className="card p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <TrendingUp className="text-blue-600" size={24} />
              Distribución por Estado
            </h2>
            <div className="h-64">
              <Doughnut data={estadosData} options={chartOptions} />
            </div>
          </div>

          {/* Gráfico de Barras - Por Mes */}
          <div className="card p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <Calendar className="text-purple-600" size={24} />
              Solicitudes por Mes
            </h2>
            <div className="h-64">
              <Bar data={solicitudesPorMes} options={chartOptions} />
            </div>
          </div>
        </div>

        {/* Gráfico de Línea - Tendencia */}
        <div className="card p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
            <TrendingUp className="text-green-600" size={24} />
            Tendencia de Aprobaciones
          </h2>
          <div className="h-80">
            <Line data={tendenciaData} options={chartOptions} />
          </div>
        </div>

        {/* Quick Actions */}
        <div className="card p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Acciones Rápidas</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Link
              to="/solicitudes/crear"
              className="group p-6 border-2 border-dashed border-gray-300 rounded-2xl hover:border-blue-500 hover:bg-blue-50 transition-all duration-300 text-center"
            >
              <FileText className="mx-auto mb-3 text-gray-400 group-hover:text-blue-600 transition-colors" size={32} />
              <p className="font-semibold text-gray-700 group-hover:text-blue-600">Crear Nueva Solicitud</p>
            </Link>
            
            <Link
              to="/solicitudes"
              className="group p-6 border-2 border-dashed border-gray-300 rounded-2xl hover:border-purple-500 hover:bg-purple-50 transition-all duration-300 text-center"
            >
              <FileText className="mx-auto mb-3 text-gray-400 group-hover:text-purple-600 transition-colors" size={32} />
              <p className="font-semibold text-gray-700 group-hover:text-purple-600">Ver Todas las Solicitudes</p>
            </Link>
            
            <Link
              to="/solicitudes?estado=PRE_APROBADA"
              className="group p-6 border-2 border-dashed border-gray-300 rounded-2xl hover:border-orange-500 hover:bg-orange-50 transition-all duration-300 text-center"
            >
              <Clock className="mx-auto mb-3 text-gray-400 group-hover:text-orange-600 transition-colors" size={32} />
              <p className="font-semibold text-gray-700 group-hover:text-orange-600">Solicitudes Pendientes</p>
            </Link>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default DashboardPage;
