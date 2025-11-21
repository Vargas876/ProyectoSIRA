package com.uptc.sira.casosespeciales.service;

import java.time.LocalDateTime;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.uptc.sira.casosespeciales.dto.AprobacionRequestDTO;
import com.uptc.sira.casosespeciales.entity.Aprobacion;
import com.uptc.sira.casosespeciales.entity.Aprobacion.AccionAprobacion;
import com.uptc.sira.casosespeciales.entity.Aprobacion.RolAprobador;
import com.uptc.sira.casosespeciales.entity.Solicitud;
import com.uptc.sira.casosespeciales.entity.Solicitud.EstadoSolicitud;
import com.uptc.sira.casosespeciales.entity.Usuario;
import com.uptc.sira.casosespeciales.exception.ResourceNotFoundException;
import com.uptc.sira.casosespeciales.repository.AprobacionRepository;
import com.uptc.sira.casosespeciales.repository.SolicitudRepository;
import com.uptc.sira.casosespeciales.repository.UsuarioRepository;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@RequiredArgsConstructor
@Slf4j
public class AprobacionService {
    
    private final SolicitudRepository solicitudRepository;
    private final AprobacionRepository aprobacionRepository;
    private final UsuarioRepository usuarioRepository;
    
    @Transactional
    public void aprobarSolicitud(Integer solicitudId, Integer usuarioId, 
                                 AprobacionRequestDTO request) {
        log.info("Aprobando solicitud ID: {} por usuario ID: {}", solicitudId, usuarioId);
        
        Solicitud solicitud = solicitudRepository.findById(solicitudId)
            .orElseThrow(() -> new ResourceNotFoundException(
                "Solicitud no encontrada con ID: " + solicitudId));
        
        Usuario usuario = usuarioRepository.findById(usuarioId)
            .orElseThrow(() -> new ResourceNotFoundException(
                "Usuario no encontrado con ID: " + usuarioId));
        
        // Crear aprobación
        Aprobacion aprobacion = new Aprobacion();
        aprobacion.setRolAprobador(RolAprobador.valueOf(request.getRolAprobador().toUpperCase()));
        aprobacion.setIdUsuarioAprobador(usuarioId);
        aprobacion.setNombreAprobador(usuario.getNombreCompleto());
        aprobacion.setAccion(AccionAprobacion.APROBAR);
        aprobacion.setComentarios(request.getComentarios());
        
        solicitud.addAprobacion(aprobacion);
        solicitud.setEstado(EstadoSolicitud.APROBADA_FINAL);
        solicitud.setFechaActualizacion(LocalDateTime.now()); 

        solicitudRepository.save(solicitud);


        
        solicitudRepository.save(solicitud);
        
        log.info("Solicitud {} aprobada exitosamente", solicitud.getCodigoSolicitud());
    }
    
    @Transactional
    public void rechazarSolicitud(Integer solicitudId, Integer usuarioId, 
                                  AprobacionRequestDTO request) {
        log.info("Rechazando solicitud ID: {} por usuario ID: {}", solicitudId, usuarioId);
        
        Solicitud solicitud = solicitudRepository.findById(solicitudId)
            .orElseThrow(() -> new ResourceNotFoundException(
                "Solicitud no encontrada con ID: " + solicitudId));
        
        Usuario usuario = usuarioRepository.findById(usuarioId)
            .orElseThrow(() -> new ResourceNotFoundException(
                "Usuario no encontrado con ID: " + usuarioId));
        
        // Crear rechazo
        Aprobacion aprobacion = new Aprobacion();
        aprobacion.setRolAprobador(RolAprobador.valueOf(request.getRolAprobador().toUpperCase()));
        aprobacion.setIdUsuarioAprobador(usuarioId);
        aprobacion.setNombreAprobador(usuario.getNombreCompleto());
        aprobacion.setAccion(AccionAprobacion.RECHAZAR);
        aprobacion.setComentarios(request.getComentarios());
        
        solicitud.addAprobacion(aprobacion);
        solicitud.setEstado(EstadoSolicitud.RECHAZADA);
        
        solicitudRepository.save(solicitud);
        
        log.info("Solicitud {} rechazada", solicitud.getCodigoSolicitud());
    }
    
    @Transactional
    public void solicitarInformacion(Integer solicitudId, Integer usuarioId, 
                                     AprobacionRequestDTO request) {
        log.info("Solicitando información adicional para solicitud ID: {}", solicitudId);
        
        Solicitud solicitud = solicitudRepository.findById(solicitudId)
            .orElseThrow(() -> new ResourceNotFoundException(
                "Solicitud no encontrada con ID: " + solicitudId));
        
        Usuario usuario = usuarioRepository.findById(usuarioId)
            .orElseThrow(() -> new ResourceNotFoundException(
                "Usuario no encontrado con ID: " + usuarioId));
        
        Aprobacion aprobacion = new Aprobacion();
        aprobacion.setRolAprobador(RolAprobador.valueOf(request.getRolAprobador().toUpperCase()));
        aprobacion.setIdUsuarioAprobador(usuarioId);
        aprobacion.setNombreAprobador(usuario.getNombreCompleto());
        aprobacion.setAccion(AccionAprobacion.SOLICITAR_INFORMACION);
        aprobacion.setComentarios(request.getComentarios());
        
        solicitud.addAprobacion(aprobacion);
        solicitud.setEstado(EstadoSolicitud.REQUIERE_INFORMACION);

        
        solicitudRepository.save(solicitud);
        
        log.info("Información solicitada para solicitud {}", solicitud.getCodigoSolicitud());
    }
}
