package com.uptc.sira.casosespeciales.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.uptc.sira.casosespeciales.entity.TipoCasoEspecial;

@Repository
public interface TipoCasoRepository extends JpaRepository<TipoCasoEspecial, Integer> {
    
    List<TipoCasoEspecial> findByActivoTrue();
}
