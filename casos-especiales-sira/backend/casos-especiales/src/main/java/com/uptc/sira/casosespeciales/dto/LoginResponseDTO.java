package com.uptc.sira.casosespeciales.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class LoginResponseDTO {
    
    private String token;
    
    @Builder.Default
    private String type = "Bearer";
    
    private Integer id;
    private String codigoUsuario;
    private String nombreCompleto;
    private String email;
    private String rol;
}
