package com.uptc.sira.casosespeciales.service;

import java.util.stream.Collectors;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.uptc.sira.casosespeciales.dto.SolicitudRequestDTO;
import com.uptc.sira.casosespeciales.dto.SolicitudResponseDTO;
import com.uptc.sira.casosespeciales.entity.Estudiante;
import com.uptc.sira.casosespeciales.entity.Solicitud;
import com.uptc.sira.casosespeciales.entity.Solicitud.EstadoSolicitud;
import com.uptc.sira.casosespeciales.entity.SolicitudMateria;
import com.uptc.sira.casosespeciales.entity.TipoCasoEspecial;
import com.uptc.sira.casosespeciales.exception.ResourceNotFoundException;
import com.uptc.sira.casosespeciales.repository.EstudianteRepository;
import com.uptc.sira.casosespeciales.repository.SolicitudRepository;
import com.uptc.sira.casosespeciales.repository.TipoCasoRepository;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@RequiredArgsConstructor
@Slf4j
public class SolicitudService {
    
    private final SolicitudRepository solicitudRepository;
    private final EstudianteRepository estudianteRepository;
    private final TipoCasoRepository tipoRepository;
    private final ValidacionService validacionService;
    
    @Transactional
    public SolicitudResponseDTO crearSolicitud(SolicitudRequestDTO request) {
        log.info("Creando nueva solicitud para estudiante: {}", request.getIdEstudiante());
        
        // Validar estudiante
        Estudiante estudiante = estudianteRepository.findById(request.getIdEstudiante())
            .orElseThrow(() -> new ResourceNotFoundException(
                "Estudiante no encontrado con ID: " + request.getIdEstudiante()));
        
        // Validar tipo de caso
        TipoCasoEspecial tipo = tipoRepository.findById(request.getIdTipo())
            .orElseThrow(() -> new ResourceNotFoundException(
                "Tipo de caso especial no válido con ID: " + request.getIdTipo()));
        
        // Crear solicitud
        Solicitud solicitud = new Solicitud();
        solicitud.setEstudiante(estudiante);
        solicitud.setTipo(tipo);
        solicitud.setPeriodoAcademico(request.getPeriodoAcademico());
        solicitud.setJustificacion(request.getJustificacion());
        solicitud.setPrioridad(tipo.getPrioridad());
        
        // Agregar materias
        for (SolicitudRequestDTO.MateriaDTO materiaDTO : request.getMaterias()) {
            SolicitudMateria materia = new SolicitudMateria();
            materia.setCodigoMateria(materiaDTO.getCodigoMateria());
            materia.setNombreMateria(materiaDTO.getNombreMateria());
            materia.setGrupo(materiaDTO.getGrupo());
            materia.setCreditos(materiaDTO.getCreditos());
            materia.setProgramaOrigenId(materiaDTO.getProgramaOrigenId());
            solicitud.addMateria(materia);
        }
        
        // Ejecutar validación automática
        try {
            boolean validacionPasada = validacionService.validarSolicitud(solicitud);
            solicitud.setValidacionAutomatica(validacionPasada);
            
            if (validacionPasada) {
                solicitud.setEstado(EstadoSolicitud.PRE_APROBADA);
                log.info("Solicitud pre-aprobada por validación automática");
            } else {
                solicitud.setEstado(EstadoSolicitud.EN_REVISION);
                log.info("Solicitud requiere revisión manual");
            }
        } catch (Exception e) {
            log.error("Error en validación automática", e);
            solicitud.setEstado(EstadoSolicitud.EN_REVISION);
            solicitud.setObservacionesValidacion("Error en validación automática: " + e.getMessage());
        }
        
        // Guardar
        solicitud = solicitudRepository.save(solicitud);
        
        log.info("Solicitud creada exitosamente con código: {}", solicitud.getCodigoSolicitud());
        
        return mapearASolicitudResponseDTO(solicitud);
    }
    
    @Transactional(readOnly = true)
    public SolicitudResponseDTO obtenerPorId(Integer id) {
        Solicitud solicitud = solicitudRepository.findByIdWithDetails(id)
            .orElseThrow(() -> new ResourceNotFoundException(
                "Solicitud no encontrada con ID: " + id));
        return mapearASolicitudResponseDTO(solicitud);
    }
    
    @Transactional(readOnly = true)
    public Page<SolicitudResponseDTO> listarSolicitudes(
            EstadoSolicitud estado,
            String periodo,
            Integer estudianteId,
            Pageable pageable) {
        
        Page<Solicitud> solicitudes;
        
        if (estado != null) {
            solicitudes = solicitudRepository.findByEstado(estado, pageable);
        } else if (periodo != null) {
            solicitudes = solicitudRepository.findByPeriodoAcademico(periodo, pageable);
        } else if (estudianteId != null) {
            solicitudes = solicitudRepository.findByEstudianteId(estudianteId, pageable);
        } else {
            solicitudes = solicitudRepository.findAll(pageable);
        }
        
        return solicitudes.map(this::mapearASolicitudResponseDTO);
    }
    
    private SolicitudResponseDTO mapearASolicitudResponseDTO(Solicitud solicitud) {
        return SolicitudResponseDTO.builder()
            .id(solicitud.getId())
            .codigoSolicitud(solicitud.getCodigoSolicitud())
            .estudiante(SolicitudResponseDTO.EstudianteDTO.builder()
                .id(solicitud.getEstudiante().getId())
                .codigoEstudiante(solicitud.getEstudiante().getCodigoEstudiante())
                .nombreCompleto(solicitud.getEstudiante().getNombreCompleto())
                .email(solicitud.getEstudiante().getEmailInstitucional())
                .build())
            .tipoNombre(solicitud.getTipo().getNombre())
            .periodoAcademico(solicitud.getPeriodoAcademico())
            .justificacion(solicitud.getJustificacion())
            .estado(solicitud.getEstado().name())
            .prioridad(solicitud.getPrioridad())
            .validacionAutomatica(solicitud.getValidacionAutomatica())
            .observacionesValidacion(solicitud.getObservacionesValidacion())
            .fechaCreacion(solicitud.getFechaCreacion())
            .fechaActualizacion(solicitud.getFechaActualizacion())
            .materias(solicitud.getMaterias().stream()
                .map(m -> SolicitudResponseDTO.MateriaDTO.builder()
                    .id(m.getId())
                    .codigoMateria(m.getCodigoMateria())
                    .nombreMateria(m.getNombreMateria())
                    .grupo(m.getGrupo())
                    .creditos(m.getCreditos())
                    .conflictoHorario(m.getConflictoHorario())
                    .cuposDisponibles(m.getCuposDisponibles())
                    .build())
                .collect(Collectors.toList()))
            .historialAprobaciones(solicitud.getAprobaciones().stream()
                .map(a -> SolicitudResponseDTO.AprobacionDTO.builder()
                    .id(a.getId())
                    .rolAprobador(a.getRolAprobador().name())
                    .nombreAprobador(a.getNombreAprobador())
                    .accion(a.getAccion().name())
                    .comentarios(a.getComentarios())
                    .fechaAccion(a.getFechaAccion())
                    .build())
                .collect(Collectors.toList()))
            .build();
    }
}
