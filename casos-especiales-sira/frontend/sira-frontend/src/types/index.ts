export interface Usuario {
    id: number;
    codigoUsuario: string;
    nombreCompleto: string;
    email: string;
    rol: 'ADMIN' | 'DIRECTOR_PROGRAMA' | 'COORDINADOR' | 'ESTUDIANTE';
  }
  
  export interface LoginRequest {
    codigoUsuario: string;
    password: string;
  }
  
  export interface LoginResponse {
    token: string;
    type: string;
    id: number;
    codigoUsuario: string;
    nombreCompleto: string;
    email: string;
    rol: string;
  }
  
  export interface Solicitud {
    id: number;
    codigoSolicitud: string;
    estudiante: {
      id: number;
      codigoEstudiante: string;
      nombreCompleto: string;
      email: string;
    };
    tipoNombre: string;
    periodoAcademico: string;
    justificacion: string;
    estado: string;
    prioridad: number;
    validacionAutomatica?: boolean; 
    observacionesValidacion?: string; 
    fechaCreacion: string;
    fechaActualizacion: string;
    materias: Materia[];
    historialAprobaciones: Aprobacion[];
  }
  
  
  export interface Materia {
    id?: number;
    codigoMateria: string;
    nombreMateria: string;
    grupo: string;
    creditos: number;
    programaOrigenId?: number;
  }
  
  export interface Aprobacion {
    id: number;
    rolAprobador: string;
    nombreAprobador: string;
    accion: string;
    comentarios: string;
    fechaAccion: string;
  }
  
  export interface TipoCaso {
    id: number;
    nombre: string;
    descripcion: string;
    requiereAprobacionDirector: boolean;
    activo: boolean;
  }
  
  export interface CrearSolicitudRequest {
    idEstudiante: number;
    idTipo: number;
    periodoAcademico: string;
    justificacion: string;
    materias: Materia[];
  }
  
  export interface ApiResponse<T> {
    success: boolean;
    message: string | null;
    data: T;
  }
  