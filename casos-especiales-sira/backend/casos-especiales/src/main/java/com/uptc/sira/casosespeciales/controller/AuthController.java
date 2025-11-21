package com.uptc.sira.casosespeciales.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.uptc.sira.casosespeciales.dto.ApiResponseDTO;
import com.uptc.sira.casosespeciales.dto.LoginRequestDTO;
import com.uptc.sira.casosespeciales.dto.LoginResponseDTO;
import com.uptc.sira.casosespeciales.service.AuthService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@RestController
@RequestMapping("/api/v1/auth")
@RequiredArgsConstructor
@Slf4j
@CrossOrigin(origins = "*")
public class AuthController {
    
    private final AuthService authService;
    
    @PostMapping("/login")
    public ResponseEntity<ApiResponseDTO<LoginResponseDTO>> login(
            @Valid @RequestBody LoginRequestDTO request) {
        log.info("Login request para usuario: {}", request.getCodigoUsuario());
        
        LoginResponseDTO response = authService.login(request);
        
        return ResponseEntity.ok(ApiResponseDTO.success("Login exitoso", response));
    }
    
    @GetMapping("/health")
    public ResponseEntity<ApiResponseDTO<String>> health() {
        return ResponseEntity.ok(ApiResponseDTO.success("Sistema de autenticación operativo"));
    }
}
