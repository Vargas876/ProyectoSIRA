package com.uptc.sira.casosespeciales.entity;

import jakarta.persistence.AttributeConverter;
import jakarta.persistence.Converter;

@Converter(autoApply = false)
public class RolConverter implements AttributeConverter<Usuario.Rol, String> {
    
    @Override
    public String convertToDatabaseColumn(Usuario.Rol rol) {
        if (rol == null) {
            return null;
        }
        return rol.getValue();
    }
    
    @Override
    public Usuario.Rol convertToEntityAttribute(String dbData) {
        if (dbData == null) {
            return null;
        }
        
        for (Usuario.Rol rol : Usuario.Rol.values()) {
            if (rol.getValue().equals(dbData)) {
                return rol;
            }
        }
        
        throw new IllegalArgumentException("Valor de rol desconocido: " + dbData);
    }
}
