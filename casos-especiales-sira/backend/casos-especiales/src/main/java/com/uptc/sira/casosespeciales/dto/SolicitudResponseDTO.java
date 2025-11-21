package com.uptc.sira.casosespeciales.dto;

import java.time.LocalDateTime;
import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SolicitudResponseDTO {
    
    private Integer id;
    private String codigoSolicitud;
    private EstudianteDTO estudiante;
    private String tipoNombre;
    private String periodoAcademico;
    private String justificacion;
    private String estado;
    private Integer prioridad;
    private Boolean validacionAutomatica;
    private String observacionesValidacion;
    private LocalDateTime fechaCreacion;
    private LocalDateTime fechaActualizacion;
    private List<MateriaDTO> materias;
    private List<AprobacionDTO> historialAprobaciones;
    
    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class EstudianteDTO {
        private Integer id;
        private String codigoEstudiante;
        private String nombreCompleto;
        private String email;
    }
    
    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class MateriaDTO {
        private Integer id;
        private String codigoMateria;
        private String nombreMateria;
        private String grupo;
        private Integer creditos;
        private Boolean conflictoHorario;
        private Integer cuposDisponibles;
    }
    
    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class AprobacionDTO {
        private Integer id;
        private String rolAprobador;
        private String nombreAprobador;
        private String accion;
        private String comentarios;
        private LocalDateTime fechaAccion;
    }
}
