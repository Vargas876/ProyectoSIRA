package com.uptc.sira.casosespeciales.entity;

import jakarta.persistence.AttributeConverter;
import jakarta.persistence.Converter;

@Converter(autoApply = false)
public class AccionAprobacionConverter implements AttributeConverter<Aprobacion.AccionAprobacion, String> {
    
    @Override
    public String convertToDatabaseColumn(Aprobacion.AccionAprobacion accion) {
        if (accion == null) {
            return null;
        }
        return accion.getValue();
    }
    
    @Override
    public Aprobacion.AccionAprobacion convertToEntityAttribute(String dbData) {
        if (dbData == null) {
            return null;
        }
        
        for (Aprobacion.AccionAprobacion accion : Aprobacion.AccionAprobacion.values()) {
            if (accion.getValue().equals(dbData)) {
                return accion;
            }
        }
        
        throw new IllegalArgumentException("Valor de acción de aprobación desconocido: " + dbData);
    }
}
