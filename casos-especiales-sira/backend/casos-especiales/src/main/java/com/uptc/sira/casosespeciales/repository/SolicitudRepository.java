package com.uptc.sira.casosespeciales.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.uptc.sira.casosespeciales.entity.Solicitud;
import com.uptc.sira.casosespeciales.entity.Solicitud.EstadoSolicitud;

@Repository
public interface SolicitudRepository extends JpaRepository<Solicitud, Integer> {
    
    Optional<Solicitud> findByCodigoSolicitud(String codigoSolicitud);
    
    Page<Solicitud> findByEstado(EstadoSolicitud estado, Pageable pageable);
    
    Page<Solicitud> findByEstudianteId(Integer estudianteId, Pageable pageable);
    
    Page<Solicitud> findByPeriodoAcademico(String periodo, Pageable pageable);
    
    @Query("SELECT s FROM Solicitud s WHERE s.estudiante.programaId = :programaId " +
           "AND s.estado = :estado ORDER BY s.prioridad ASC, s.fechaCreacion ASC")
    List<Solicitud> findByProgramaAndEstado(
        @Param("programaId") Integer programaId, 
        @Param("estado") EstadoSolicitud estado
    );
    
    @Query("SELECT COUNT(s) FROM Solicitud s WHERE s.periodoAcademico = :periodo " +
           "AND s.estado = :estado")
    Long countByPeriodoAndEstado(
        @Param("periodo") String periodo, 
        @Param("estado") EstadoSolicitud estado
    );
    
    @Query("SELECT s FROM Solicitud s " +
           "LEFT JOIN FETCH s.estudiante e " +
           "LEFT JOIN FETCH s.tipo t " +
           "WHERE s.id = :id")
    Optional<Solicitud> findByIdWithDetails(@Param("id") Integer id);
    
    @Query("SELECT s FROM Solicitud s " +
           "LEFT JOIN FETCH s.materias m " +
           "LEFT JOIN FETCH s.aprobaciones a " +
           "WHERE s.id = :id")
    Optional<Solicitud> findByIdWithMaterialsAndApprovals(@Param("id") Integer id);
}
