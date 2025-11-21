package com.uptc.sira.casosespeciales.service;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.uptc.sira.casosespeciales.dto.LoginRequestDTO;
import com.uptc.sira.casosespeciales.dto.LoginResponseDTO;
import com.uptc.sira.casosespeciales.entity.Usuario;
import com.uptc.sira.casosespeciales.repository.UsuarioRepository;
import com.uptc.sira.casosespeciales.security.JwtTokenProvider;

import jakarta.validation.ValidationException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@RequiredArgsConstructor
@Slf4j
public class AuthService {
    
    private final UsuarioRepository usuarioRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenProvider jwtTokenProvider;
    
    @Transactional
public LoginResponseDTO login(LoginRequestDTO request) {
    log.info("Intento de login para usuario: {}", request.getCodigoUsuario());
    
    Usuario usuario = usuarioRepository.findByCodigoUsuario(request.getCodigoUsuario())
        .orElseThrow(() -> new ValidationException("Credenciales inválidas"));
    
    // 🔍 LOGS DE DEPURACIÓN
    log.info("✅ Usuario encontrado: {}", usuario.getCodigoUsuario());
    log.info("📧 Email: {}", usuario.getEmail());
    log.info("🔐 Hash en BD: {}", usuario.getPasswordHash());

    log.info("🔑 Password ingresado: {}", request.getPassword());
    log.info("🔒 Usuario activo: {}", usuario.getActivo());
    
    if (!usuario.getActivo()) {
        log.error("❌ Usuario inactivo");
        throw new ValidationException("Usuario inactivo");
    }
    
    boolean passwordMatch = passwordEncoder.matches(request.getPassword(), usuario.getPasswordHash());
    log.info("🎯 Password coincide: {}", passwordMatch);
    
    if (!passwordMatch) {
        log.error("❌ Contraseña incorrecta");
        throw new ValidationException("Credenciales inválidas");
    }
    
    // Generar token JWT
    String token = jwtTokenProvider.generateToken(usuario);
    
    log.info("✅ Login exitoso para usuario: {}", usuario.getCodigoUsuario());
    
    return LoginResponseDTO.builder()
            .token(token)
            .type("Bearer")
            .id(usuario.getId())
            .codigoUsuario(usuario.getCodigoUsuario())
            .nombreCompleto(usuario.getNombreCompleto())
            .email(usuario.getEmail())
            .rol(usuario.getRol().name())
            .build();
}

}
