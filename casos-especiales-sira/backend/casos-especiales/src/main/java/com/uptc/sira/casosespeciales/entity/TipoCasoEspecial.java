package com.uptc.sira.casosespeciales.entity;

import java.time.LocalDateTime;

import jakarta.persistence.Column;
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
@Table(name = "tipos_caso_especial")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class TipoCasoEspecial {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_tipo")
    private Integer id;
    
    @Column(name = "nombre", nullable = false, length = 100)
    private String nombre;
    
    @Column(name = "descripcion", columnDefinition = "TEXT")
    private String descripcion;
    
    @Column(name = "requiere_aprobacion_director")
    private Boolean requiereAprobacionDirector = true;
    
    @Column(name = "requiere_aprobacion_coordinador")
    private Boolean requiereAprobacionCoordinador = false;
    
    @Column(name = "prioridad")
    private Integer prioridad = 5;
    
    @Column(name = "activo")
    private Boolean activo = true;
    
    @Column(name = "fecha_creacion")
    private LocalDateTime fechaCreacion;
    
    @PrePersist
    protected void onCreate() {
        fechaCreacion = LocalDateTime.now();
    }
}
