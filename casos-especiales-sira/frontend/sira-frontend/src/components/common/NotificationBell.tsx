import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { Bell, Check, X } from 'lucide-react';
import { useState } from 'react';

interface Notification {
  id: number;
  titulo: string;
  mensaje: string;
  tipo: 'info' | 'success' | 'warning' | 'error';
  leida: boolean;
  fecha: Date;
}

const NotificationBell: React.FC = () => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: 1,
      titulo: 'Solicitud Aprobada',
      mensaje: 'Tu solicitud CE-2025-1-00001 ha sido aprobada',
      tipo: 'success',
      leida: false,
      fecha: new Date(Date.now() - 3600000),
    },
    {
      id: 2,
      titulo: 'Información Requerida',
      mensaje: 'Se requiere información adicional para la solicitud CE-2025-1-00003',
      tipo: 'warning',
      leida: false,
      fecha: new Date(Date.now() - 7200000),
    },
    {
      id: 3,
      titulo: 'Nueva Solicitud',
      mensaje: 'Ana López ha creado una nueva solicitud',
      tipo: 'info',
      leida: true,
      fecha: new Date(Date.now() - 86400000),
    },
  ]);

  const unreadCount = notifications.filter((n) => !n.leida).length;

  const marcarComoLeida = (id: number) => {
    setNotifications(
      notifications.map((n) => (n.id === id ? { ...n, leida: true } : n))
    );
  };

  const marcarTodasLeidas = () => {
    setNotifications(notifications.map((n) => ({ ...n, leida: true })));
  };

  const eliminarNotificacion = (id: number) => {
    setNotifications(notifications.filter((n) => n.id !== id));
  };

  const getNotificationColor = (tipo: string) => {
    switch (tipo) {
      case 'success':
        return 'bg-green-50 border-green-200';
      case 'warning':
        return 'bg-orange-50 border-orange-200';
      case 'error':
        return 'bg-red-50 border-red-200';
      default:
        return 'bg-blue-50 border-blue-200';
    }
  };

  return (
    <div className="relative">
      <button
        onClick={() => setShowNotifications(!showNotifications)}
        className="relative p-3 text-gray-600 hover:bg-gray-100 rounded-xl transition-all duration-200"
      >
        <Bell size={22} />
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 w-5 h-5 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center animate-pulse">
            {unreadCount}
          </span>
        )}
      </button>

      {showNotifications && (
        <div className="absolute right-0 mt-2 w-96 bg-white rounded-2xl shadow-2xl border border-gray-200 z-50 animate-fadeIn">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200">
            <h3 className="text-lg font-bold text-gray-900">Notificaciones</h3>
            {unreadCount > 0 && (
              <button
                onClick={marcarTodasLeidas}
                className="text-sm text-blue-600 hover:text-blue-800 font-medium"
              >
                Marcar todas como leídas
              </button>
            )}
          </div>

          {/* Notifications List */}
          <div className="max-h-96 overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="p-8 text-center text-gray-500">
                <Bell size={48} className="mx-auto mb-3 text-gray-300" />
                <p>No tienes notificaciones</p>
              </div>
            ) : (
              <div className="divide-y divide-gray-100">
                {notifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={`p-4 hover:bg-gray-50 transition-colors ${
                      !notification.leida ? 'bg-blue-50' : ''
                    }`}
                  >
                    <div className="flex gap-3">
                      <div
                        className={`flex-shrink-0 w-2 h-2 rounded-full mt-2 ${
                          !notification.leida ? 'bg-blue-600' : 'bg-gray-300'
                        }`}
                      ></div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-gray-900 mb-1">
                          {notification.titulo}
                        </p>
                        <p className="text-sm text-gray-600 mb-2">
                          {notification.mensaje}
                        </p>
                        <p className="text-xs text-gray-400">
                          {format(notification.fecha, 'dd MMM yyyy, HH:mm', { locale: es })}
                        </p>
                      </div>
                      <div className="flex flex-col gap-2">
                        {!notification.leida && (
                          <button
                            onClick={() => marcarComoLeida(notification.id)}
                            className="p-1 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors"
                            title="Marcar como leída"
                          >
                            <Check size={16} />
                          </button>
                        )}
                        <button
                          onClick={() => eliminarNotificacion(notification.id)}
                          className="p-1 text-red-600 hover:bg-red-100 rounded-lg transition-colors"
                          title="Eliminar"
                        >
                          <X size={16} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="p-3 border-t border-gray-200 text-center">
            <button className="text-sm text-blue-600 hover:text-blue-800 font-medium">
              Ver todas las notificaciones
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationBell;
