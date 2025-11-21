package com.uptc.sira.casosespeciales.entity;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Convert;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.PrePersist;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "estudiantes")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Estudiante {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_estudiante")
    private Integer id;
    
    @Column(name = "codigo_estudiante", unique = true, nullable = false, length = 20)
    private String codigoEstudiante;
    
    @Column(name = "nombre", nullable = false, length = 100)
    private String nombre;
    
    @Column(name = "apellido", nullable = false, length = 100)
    private String apellido;
    
    @Column(name = "email_institucional", nullable = false, length = 100)
    private String emailInstitucional;
    
    @Column(name = "programa_id", nullable = false)
    private Integer programaId;
    
    @Column(name = "promedio_acumulado", precision = 3, scale = 2)
    private BigDecimal promedioAcumulado;
    
    @Column(name = "creditos_aprobados")
    private Integer creditosAprobados;
    
    @Convert(converter = EstadoAcademicoConverter.class)
    @Column(name = "estado_academico")
    private EstadoAcademico estadoAcademico;

    
    @Column(name = "fecha_registro")
    private LocalDateTime fechaRegistro;
    
    @PrePersist
    protected void onCreate() {
        fechaRegistro = LocalDateTime.now();
    }
    
    public String getNombreCompleto() {
        return nombre + " " + apellido;
    }
    
    public enum EstadoAcademico {
        REGULAR("regular"),
        TERMINACION_ACADEMICA("terminacion_academica"),
        REINGRESO("reingreso"),
        TRANSFERENCIA("transferencia");
        
        private final String value;
        
        EstadoAcademico(String value) {
            this.value = value;
        }
        
        public String getValue() {
            return value;
        }
    }
    

}
