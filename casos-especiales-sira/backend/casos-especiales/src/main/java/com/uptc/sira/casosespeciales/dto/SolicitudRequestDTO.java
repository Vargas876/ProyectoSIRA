package com.uptc.sira.casosespeciales.dto;

import java.util.List;

import jakarta.validation.Valid;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class SolicitudRequestDTO {
    
    @NotNull(message = "El ID del estudiante es obligatorio")
    private Integer idEstudiante;
    
    @NotNull(message = "El tipo de caso especial es obligatorio")
    private Integer idTipo;
    
    @NotBlank(message = "El periodo académico es obligatorio")
    @Pattern(regexp = "\\d{4}-[12]", message = "Formato de periodo inválido (ej: 2025-1)")
    private String periodoAcademico;
    
    @NotBlank(message = "La justificación es obligatoria")
    @Size(min = 50, max = 2000, message = "La justificación debe tener entre 50 y 2000 caracteres")
    private String justificacion;
    
    @NotEmpty(message = "Debe incluir al menos una materia")
    @Valid
    private List<MateriaDTO> materias;
    
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class MateriaDTO {
        
        @NotBlank(message = "El código de materia es obligatorio")
        private String codigoMateria;
        
        @NotBlank(message = "El nombre de materia es obligatorio")
        private String nombreMateria;
        
        private String grupo;
        
        @NotNull(message = "Los créditos son obligatorios")
        @Min(value = 1, message = "Los créditos deben ser al menos 1")
        private Integer creditos;
        
        private Integer programaOrigenId;
    }
}
