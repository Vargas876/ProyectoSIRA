package com.uptc.sira.casosespeciales.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "solicitudes_materias")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class SolicitudMateria {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_solicitud_materia")
    private Integer id;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_solicitud", nullable = false)
    private Solicitud solicitud;
    
    @Column(name = "codigo_materia", nullable = false, length = 20)
    private String codigoMateria;
    
    @Column(name = "nombre_materia", nullable = false, length = 200)
    private String nombreMateria;
    
    @Column(name = "grupo", length = 10)
    private String grupo;
    
    @Column(name = "creditos", nullable = false)
    private Integer creditos;
    
    @Column(name = "programa_origen_id")
    private Integer programaOrigenId;
    
    @Column(name = "cupos_disponibles")
    private Integer cuposDisponibles;
    
    @Column(name = "conflicto_horario")
    private Boolean conflictoHorario = false;
}
