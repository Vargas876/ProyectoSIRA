package com.uptc.sira.casosespeciales.controller;

import java.util.HashMap;
import java.util.Map;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.uptc.sira.casosespeciales.dto.ApiResponseDTO;
import com.uptc.sira.casosespeciales.dto.SolicitudRequestDTO;
import com.uptc.sira.casosespeciales.dto.SolicitudResponseDTO;
import com.uptc.sira.casosespeciales.entity.Solicitud.EstadoSolicitud;
import com.uptc.sira.casosespeciales.service.SolicitudService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@RestController
@RequestMapping("/api/v1/solicitudes")
@RequiredArgsConstructor
@Slf4j
@CrossOrigin(origins = "*")
public class SolicitudController {
    
    private final SolicitudService solicitudService;
    
    @PostMapping
    @PreAuthorize("hasAnyRole('ESTUDIANTE', 'ADMIN')")
    public ResponseEntity<ApiResponseDTO<Map<String, Object>>> crearSolicitud(
            @Valid @RequestBody SolicitudRequestDTO request) {
        
        log.info("Creando nueva solicitud");
        
        SolicitudResponseDTO solicitud = solicitudService.crearSolicitud(request);
        
        Map<String, Object> data = new HashMap<>();
        data.put("id_solicitud", solicitud.getId());
        data.put("codigo_solicitud", solicitud.getCodigoSolicitud());
        data.put("estado", solicitud.getEstado());
        data.put("fecha_creacion", solicitud.getFechaCreacion());
        
        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(ApiResponseDTO.success("Solicitud creada exitosamente", data));
    }
    
    @GetMapping
    @PreAuthorize("hasAnyRole('ESTUDIANTE', 'DIRECTOR_PROGRAMA', 'COORDINADOR_ACADEMICO', 'REGISTRO_CONTROL', 'ADMIN')")
    public ResponseEntity<ApiResponseDTO<Map<String, Object>>> listarSolicitudes(
            @RequestParam(required = false) String estado,
            @RequestParam(required = false) String periodo,
            @RequestParam(required = false) Integer id_estudiante,
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "20") int limit) {
        
        log.info("Listando solicitudes - Estado: {}, Periodo: {}", estado, periodo);
        
        EstadoSolicitud estadoEnum = null;
        if (estado != null && !estado.isEmpty()) {
            try {
                estadoEnum = EstadoSolicitud.valueOf(estado.toUpperCase());
            } catch (IllegalArgumentException e) {
                log.warn("Estado inválido: {}", estado);
            }
        }
        
        Pageable pageable = PageRequest.of(
                page - 1, 
                limit, 
                Sort.by("fechaCreacion").descending()
        );
        
        Page<SolicitudResponseDTO> solicitudes = solicitudService.listarSolicitudes(
                estadoEnum, periodo, id_estudiante, pageable);
        
        Map<String, Object> response = new HashMap<>();
        response.put("solicitudes", solicitudes.getContent());
        response.put("total", solicitudes.getTotalElements());
        response.put("page", page);
        response.put("totalPages", solicitudes.getTotalPages());
        
        return ResponseEntity.ok(ApiResponseDTO.success(response));
    }
    
    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('ESTUDIANTE', 'DIRECTOR_PROGRAMA', 'COORDINADOR_ACADEMICO', 'REGISTRO_CONTROL', 'ADMIN')")
    public ResponseEntity<ApiResponseDTO<SolicitudResponseDTO>> obtenerSolicitud(
            @PathVariable Integer id) {
        
        log.info("Obteniendo solicitud con ID: {}", id);
        
        SolicitudResponseDTO solicitud = solicitudService.obtenerPorId(id);
        
        return ResponseEntity.ok(ApiResponseDTO.success(solicitud));
    }
}
