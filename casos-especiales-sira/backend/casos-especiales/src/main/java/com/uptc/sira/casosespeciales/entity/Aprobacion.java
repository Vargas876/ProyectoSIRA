package com.uptc.sira.casosespeciales.entity;

import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Convert;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.PrePersist;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "aprobaciones")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Aprobacion {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_aprobacion")
    private Integer id;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_solicitud", nullable = false)
    private Solicitud solicitud;
    
    @Convert(converter = RolAprobadorConverter.class)
    @Column(name = "rol_aprobador", nullable = false)
    private RolAprobador rolAprobador;

    
    @Column(name = "id_usuario_aprobador", nullable = false)
    private Integer idUsuarioAprobador;
    
    @Column(name = "nombre_aprobador", length = 200)
    private String nombreAprobador;
    
    @Convert(converter = AccionAprobacionConverter.class)
    @Column(name = "accion")
    private AccionAprobacion accion;

    
    @Column(name = "comentarios", columnDefinition = "TEXT")
    private String comentarios;
    
    @Column(name = "fecha_accion")
    private LocalDateTime fechaAccion;
    
    @PrePersist
    protected void onCreate() {
        fechaAccion = LocalDateTime.now();
    }
    
    public enum RolAprobador {
        DIRECTOR_PROGRAMA("director_programa"),
        COORDINADOR_ACADEMICO("coordinador_academico"),
        REGISTRO_CONTROL("registro_control");
        
        private final String value;
        
        RolAprobador(String value) {
            this.value = value;
        }
        
        public String getValue() {
            return value;
        }
    }
    
    
    public enum AccionAprobacion {
        APROBAR("aprobar"),
        RECHAZAR("rechazar"),
        SOLICITAR_INFORMACION("solicitar_informacion");
        
        private final String value;
        
        AccionAprobacion(String value) {
            this.value = value;
        }
        
        public String getValue() {
            return value;
        }
    }
    
}
