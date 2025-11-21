import type { ApiResponse, CrearSolicitudRequest, Solicitud, TipoCaso } from '../types';
import api from './api';

export const solicitudService = {
  listarSolicitudes: async (page: number = 1, size: number = 10) => {
    const response = await api.get<ApiResponse<any>>('/solicitudes', {
      params: { page, size }
    });
    return response.data.data;
  },

  obtenerSolicitud: async (id: number) => {
    const response = await api.get<ApiResponse<Solicitud>>(`/solicitudes/${id}`);
    return response.data.data;
  },

  crearSolicitud: async (solicitud: CrearSolicitudRequest) => {
    const response = await api.post<ApiResponse<any>>('/solicitudes', solicitud);
    return response.data.data;
  },

  aprobarSolicitud: async (id: number, data: { rolAprobador: string; comentarios: string }) => {
    const response = await api.post<ApiResponse<null>>(`/solicitudes/${id}/aprobar`, data);
    return response.data;
  },

  rechazarSolicitud: async (id: number, data: { rolAprobador: string; comentarios: string }) => {
    const response = await api.post<ApiResponse<null>>(`/solicitudes/${id}/rechazar`, data);
    return response.data;
  },

  solicitarInformacion: async (id: number, data: { rolAprobador: string; comentarios: string }) => {
    const response = await api.post<ApiResponse<null>>(`/solicitudes/${id}/solicitar-informacion`, data);
    return response.data;
  },

  listarTiposCaso: async () => {
    const response = await api.get<ApiResponse<TipoCaso[]>>('/tipos-caso');
    return response.data.data;
  },
};
