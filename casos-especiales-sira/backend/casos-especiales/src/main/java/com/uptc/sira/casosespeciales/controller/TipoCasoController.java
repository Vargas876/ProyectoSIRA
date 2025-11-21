package com.uptc.sira.casosespeciales.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.uptc.sira.casosespeciales.dto.ApiResponseDTO;
import com.uptc.sira.casosespeciales.entity.TipoCasoEspecial;
import com.uptc.sira.casosespeciales.repository.TipoCasoRepository;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@RestController
@RequestMapping("/api/v1/tipos-caso")
@RequiredArgsConstructor
@Slf4j
@CrossOrigin(origins = "*")
public class TipoCasoController {
    
    private final TipoCasoRepository tipoCasoRepository;
    
    @GetMapping
    public ResponseEntity<ApiResponseDTO<List<TipoCasoEspecial>>> listarTiposCaso() {
        log.info("Listando tipos de casos especiales");
        
        List<TipoCasoEspecial> tipos = tipoCasoRepository.findByActivoTrue();
        
        return ResponseEntity.ok(ApiResponseDTO.success(tipos));
    }
}
