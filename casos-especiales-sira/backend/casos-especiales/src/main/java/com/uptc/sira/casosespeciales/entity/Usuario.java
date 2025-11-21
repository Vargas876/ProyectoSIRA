package com.uptc.sira.casosespeciales.entity;

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
@Table(name = "usuarios")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Usuario {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_usuario")
    private Integer id;
    
    @Column(name = "codigo_usuario", unique = true, nullable = false, length = 20)
    private String codigoUsuario;
    
    @Column(name = "nombre_completo", nullable = false, length = 200)
    private String nombreCompleto;
    
    @Column(name = "email", nullable = false, length = 100)
    private String email;
    
    @Column(name = "password_hash", nullable = false, length = 255)
    private String passwordHash;
    
    @Convert(converter = RolConverter.class)  // ✅ CAMBIO AQUÍ
    @Column(name = "rol", nullable = false)
    private Rol rol;
    
    @Column(name = "programa_id")
    private Integer programaId;
    
    @Column(name = "activo")
    private Boolean activo = true;
    
    @Column(name = "ultimo_acceso")
    private LocalDateTime ultimoAcceso;
    
    @Column(name = "fecha_creacion")
    private LocalDateTime fechaCreacion;
    
    @PrePersist
    protected void onCreate() {
        fechaCreacion = LocalDateTime.now();
    }
    
    public enum Rol {
        ESTUDIANTE("estudiante"),
        DIRECTOR_PROGRAMA("director_programa"),
        COORDINADOR_ACADEMICO("coordinador_academico"),
        REGISTRO_CONTROL("registro_control"),
        ADMIN("admin");
        
        private final String value;
        
        Rol(String value) {
            this.value = value;
        }
        
        public String getValue() {
            return value;
        }
    }
}
