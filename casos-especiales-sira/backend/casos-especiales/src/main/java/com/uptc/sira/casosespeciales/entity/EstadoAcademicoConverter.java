package com.uptc.sira.casosespeciales.entity;

import jakarta.persistence.AttributeConverter;
import jakarta.persistence.Converter;

@Converter(autoApply = false)
public class EstadoAcademicoConverter implements AttributeConverter<Estudiante.EstadoAcademico, String> {
    
    @Override
    public String convertToDatabaseColumn(Estudiante.EstadoAcademico estado) {
        if (estado == null) {
            return null;
        }
        return estado.getValue();
    }
    
    @Override
    public Estudiante.EstadoAcademico convertToEntityAttribute(String dbData) {
        if (dbData == null) {
            return null;
        }
        
        for (Estudiante.EstadoAcademico estado : Estudiante.EstadoAcademico.values()) {
            if (estado.getValue().equals(dbData)) {
                return estado;
            }
        }
        
        throw new IllegalArgumentException("Valor de estado académico desconocido: " + dbData);
    }
}
