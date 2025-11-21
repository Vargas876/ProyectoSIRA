package com.uptc.sira.casosespeciales.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.uptc.sira.casosespeciales.entity.Estudiante;

@Repository
public interface EstudianteRepository extends JpaRepository<Estudiante, Integer> {
    
    Optional<Estudiante> findByCodigoEstudiante(String codigoEstudiante);
    
    boolean existsByCodigoEstudiante(String codigoEstudiante);
}
    