package com.uptc.sira.casosespeciales.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.uptc.sira.casosespeciales.entity.Aprobacion;

@Repository
public interface AprobacionRepository extends JpaRepository<Aprobacion, Integer> {
    
    List<Aprobacion> findBySolicitudIdOrderByFechaAccionDesc(Integer solicitudId);
    
    List<Aprobacion> findByIdUsuarioAprobadorOrderByFechaAccionDesc(Integer usuarioId);
}
