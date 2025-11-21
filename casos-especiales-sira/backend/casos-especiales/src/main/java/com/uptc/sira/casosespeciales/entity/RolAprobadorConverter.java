package com.uptc.sira.casosespeciales.entity;

import jakarta.persistence.AttributeConverter;
import jakarta.persistence.Converter;

@Converter(autoApply = false)
public class RolAprobadorConverter implements AttributeConverter<Aprobacion.RolAprobador, String> {
    
    @Override
    public String convertToDatabaseColumn(Aprobacion.RolAprobador rol) {
        if (rol == null) {
            return null;
        }
        return rol.getValue();
    }
    
    @Override
    public Aprobacion.RolAprobador convertToEntityAttribute(String dbData) {
        if (dbData == null) {
            return null;
        }
        
        for (Aprobacion.RolAprobador rol : Aprobacion.RolAprobador.values()) {
            if (rol.getValue().equals(dbData)) {
                return rol;
            }
        }
        
        throw new IllegalArgumentException("Valor de rol aprobador desconocido: " + dbData);
    }
}
