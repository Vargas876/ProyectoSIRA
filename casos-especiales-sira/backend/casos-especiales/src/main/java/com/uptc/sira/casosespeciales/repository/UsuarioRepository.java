package com.uptc.sira.casosespeciales.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.uptc.sira.casosespeciales.entity.Usuario;

@Repository
public interface UsuarioRepository extends JpaRepository<Usuario, Integer> {
    
    Optional<Usuario> findByCodigoUsuario(String codigoUsuario);
    
    Optional<Usuario> findByEmail(String email);
    
    boolean existsByCodigoUsuario(String codigoUsuario);
    
    boolean existsByEmail(String email);
}
