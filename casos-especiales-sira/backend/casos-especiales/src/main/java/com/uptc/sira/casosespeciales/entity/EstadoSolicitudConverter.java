package com.uptc.sira.casosespeciales.entity;

import jakarta.persistence.AttributeConverter;
import jakarta.persistence.Converter;

@Converter(autoApply = false)
public class EstadoSolicitudConverter implements AttributeConverter<Solicitud.EstadoSolicitud, String> {
    
    @Override
    public String convertToDatabaseColumn(Solicitud.EstadoSolicitud estado) {
        if (estado == null) {
            return null;
        }
        return estado.getValue();  
    }
    
    @Override
    public Solicitud.EstadoSolicitud convertToEntityAttribute(String dbData) {
        if (dbData == null) {
            return null;
        }
        
        for (Solicitud.EstadoSolicitud estado : Solicitud.EstadoSolicitud.values()) {
            if (estado.getValue().equals(dbData)) {
                return estado;
            }
        }
        
        throw new IllegalArgumentException("Valor de estado de solicitud desconocido: " + dbData);
    }
}
