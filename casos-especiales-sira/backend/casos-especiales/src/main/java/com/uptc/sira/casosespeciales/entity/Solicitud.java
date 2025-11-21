package com.uptc.sira.casosespeciales.entity;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Convert;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.PrePersist;
import jakarta.persistence.PreUpdate;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "solicitudes_caso_especial")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Solicitud {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_solicitud")
    private Integer id;
    
    @Column(name = "codigo_solicitud", unique = true, nullable = false, length = 50)
    private String codigoSolicitud;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_estudiante", nullable = false)
    private Estudiante estudiante;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_tipo", nullable = false)
    private TipoCasoEspecial tipo;
    
    @Column(name = "periodo_academico", nullable = false, length = 10)
    private String periodoAcademico;
    
    @Column(name = "justificacion", nullable = false, columnDefinition = "TEXT")
    private String justificacion;
    
    @Convert(converter = EstadoSolicitudConverter.class)
    @Column(name = "estado", nullable = false)
    private EstadoSolicitud estado;

    
    @Column(name = "prioridad")
    private Integer prioridad = 5;
    
    @Column(name = "validacion_automatica")
    private Boolean validacionAutomatica = false;
    
    @Column(name = "observaciones_validacion", columnDefinition = "TEXT")
    private String observacionesValidacion;
    
    @Column(name = "fecha_creacion")
    private LocalDateTime fechaCreacion;
    
    @Column(name = "fecha_actualizacion")
    private LocalDateTime fechaActualizacion;
    
    @OneToMany(mappedBy = "solicitud", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<SolicitudMateria> materias = new ArrayList<>();
    
    @OneToMany(mappedBy = "solicitud", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Aprobacion> aprobaciones = new ArrayList<>();
    
    @PrePersist
    protected void onCreate() {
        fechaCreacion = LocalDateTime.now();
        fechaActualizacion = LocalDateTime.now();
        
        // Generar código de solicitud automáticamente
        if (codigoSolicitud == null) {
            generarCodigoSolicitud();
        }
    }
    
    private void generarCodigoSolicitud() {
        // Formato: SOL-YYYY-NNNNN
        int year = LocalDateTime.now().getYear();
        // Nota: Este número debe ser secuencial, pero por ahora usamos random
        // En producción deberías consultar el último número y sumar 1
        int numero = (int) (Math.random() * 99999);
        this.codigoSolicitud = String.format("SOL-%d-%05d", year, numero);
    }
    
    
    @PreUpdate
    protected void onUpdate() {
        fechaActualizacion = LocalDateTime.now();
    }
    
    public void addMateria(SolicitudMateria materia) {
        materias.add(materia);
        materia.setSolicitud(this);
    }
    
    public void addAprobacion(Aprobacion aprobacion) {
        aprobaciones.add(aprobacion);
        aprobacion.setSolicitud(this);
    }
    
    public enum EstadoSolicitud {
        PRE_APROBADA("pre_aprobada"),
        EN_REVISION("en_revision"),
        APROBADA_DIRECTOR("aprobada_director"),
        APROBADA_COORDINADOR("aprobada_coordinador"),
        APROBADA_FINAL("aprobada_final"),
        RECHAZADA("rechazada"),
        REQUIERE_INFORMACION("requiere_informacion"),
        CANCELADA("cancelada");
        
        private final String value;
        
        EstadoSolicitud(String value) {
            this.value = value;
        }
        
        public String getValue() {
            return value;
        }
    }
    
    
    
}
