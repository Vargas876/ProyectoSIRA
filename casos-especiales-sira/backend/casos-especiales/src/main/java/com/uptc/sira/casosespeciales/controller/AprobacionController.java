package com.uptc.sira.casosespeciales.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.uptc.sira.casosespeciales.dto.ApiResponseDTO;
import com.uptc.sira.casosespeciales.dto.AprobacionRequestDTO;
import com.uptc.sira.casosespeciales.service.AprobacionService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@RestController
@RequestMapping("/api/v1/solicitudes")
@RequiredArgsConstructor
@Slf4j
@CrossOrigin(origins = "*")
public class AprobacionController {
    
    private final AprobacionService aprobacionService;
    
    @PostMapping("/{id}/aprobar")
    @PreAuthorize("hasAnyRole('DIRECTOR_PROGRAMA', 'COORDINADOR_ACADEMICO', 'REGISTRO_CONTROL', 'ADMIN')")
    public ResponseEntity<ApiResponseDTO<Void>> aprobarSolicitud(
            @PathVariable Integer id,
            @Valid @RequestBody AprobacionRequestDTO request) {
        
        log.info("Aprobando solicitud ID: {}", id);
        
        // Por ahora usamos un ID fijo (1) para el usuario
        // En producción, deberías obtener el ID del usuario autenticado
        Integer usuarioId = obtenerUsuarioIdDelContexto();
        
        aprobacionService.aprobarSolicitud(id, usuarioId, request);
        
        return ResponseEntity.ok(
                ApiResponseDTO.success("Solicitud aprobada exitosamente", null));
    }
    
    @PostMapping("/{id}/rechazar")
    @PreAuthorize("hasAnyRole('DIRECTOR_PROGRAMA', 'COORDINADOR_ACADEMICO', 'REGISTRO_CONTROL', 'ADMIN')")
    public ResponseEntity<ApiResponseDTO<Void>> rechazarSolicitud(
            @PathVariable Integer id,
            @Valid @RequestBody AprobacionRequestDTO request) {
        
        log.info("Rechazando solicitud ID: {}", id);
        
        Integer usuarioId = obtenerUsuarioIdDelContexto();
        
        aprobacionService.rechazarSolicitud(id, usuarioId, request);
        
        return ResponseEntity.ok(
                ApiResponseDTO.success("Solicitud rechazada", null));
    }
    
    @PostMapping("/{id}/solicitar-informacion")
    @PreAuthorize("hasAnyRole('DIRECTOR_PROGRAMA', 'COORDINADOR_ACADEMICO', 'REGISTRO_CONTROL', 'ADMIN')")
    public ResponseEntity<ApiResponseDTO<Void>> solicitarInformacion(
            @PathVariable Integer id,
            @Valid @RequestBody AprobacionRequestDTO request) {
        
        log.info("Solicitando información para solicitud ID: {}", id);
        
        Integer usuarioId = obtenerUsuarioIdDelContexto();
        
        aprobacionService.solicitarInformacion(id, usuarioId, request);
        
        return ResponseEntity.ok(
                ApiResponseDTO.success("Información solicitada al estudiante", null));
    }
    
    // Método auxiliar para obtener el ID del usuario autenticado
    private Integer obtenerUsuarioIdDelContexto() {
        // TODO: Implementar extracción del ID desde el JWT
        // Por ahora retorna un ID de prueba
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication != null && authentication.isAuthenticated()) {
            // Aquí deberías extraer el ID del token JWT
            log.debug("Usuario autenticado: {}", authentication.getName());
        }
        return 1; // ID de prueba (admin001)
    }
}
