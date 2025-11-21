package com.uptc.sira.casosespeciales.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AprobacionRequestDTO {
    
    @NotBlank(message = "El rol del aprobador es obligatorio")
    private String rolAprobador;
    
    @NotBlank(message = "Los comentarios son obligatorios")
    private String comentarios;
}
