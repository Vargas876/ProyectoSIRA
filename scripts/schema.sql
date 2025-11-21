-- ============================================================================
-- MÓDULO DE CASOS ESPECIALES DE INSCRIPCIÓN - SISTEMA SIRA
-- Base de Datos MySQL 8.0+
-- Versión: 1.0
-- Fecha: Noviembre 2025
-- ============================================================================

-- Crear base de datos
DROP DATABASE IF EXISTS sira_casos_especiales;
CREATE DATABASE sira_casos_especiales 
    CHARACTER SET utf8mb4 
    COLLATE utf8mb4_unicode_ci;

USE sira_casos_especiales;

-- ============================================================================
-- TABLA 1: ESTUDIANTES
-- ============================================================================
CREATE TABLE estudiantes (
    id_estudiante INT PRIMARY KEY AUTO_INCREMENT,
    codigo_estudiante VARCHAR(20) UNIQUE NOT NULL COMMENT 'Código único del estudiante',
    nombre VARCHAR(100) NOT NULL,
    apellido VARCHAR(100) NOT NULL,
    email_institucional VARCHAR(100) NOT NULL,
    programa_id INT NOT NULL COMMENT 'ID del programa académico',
    promedio_acumulado DECIMAL(3,2) COMMENT 'Promedio acumulado (0.00 - 5.00)',
    creditos_aprobados INT DEFAULT 0,
    estado_academico ENUM('regular', 'terminacion', 'condicional') DEFAULT 'regular',
    fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    -- Índices
    INDEX idx_codigo (codigo_estudiante),
    INDEX idx_programa (programa_id),
    INDEX idx_estado_academico (estado_academico)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='Información de estudiantes';

-- ============================================================================
-- TABLA 2: TIPOS DE CASOS ESPECIALES
-- ============================================================================
CREATE TABLE tipos_caso_especial (
    id_tipo INT PRIMARY KEY AUTO_INCREMENT,
    nombre VARCHAR(100) NOT NULL,
    descripcion TEXT,
    requiere_aprobacion_director BOOLEAN DEFAULT TRUE,
    requiere_aprobacion_coordinador BOOLEAN DEFAULT FALSE,
    prioridad INT DEFAULT 5 COMMENT 'Prioridad 1-10 (1 = más urgente)',
    activo BOOLEAN DEFAULT TRUE,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    INDEX idx_activo (activo)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='Catálogo de tipos de casos especiales';

-- ============================================================================
-- TABLA 3: SOLICITUDES DE CASOS ESPECIALES (PRINCIPAL)
-- ============================================================================
CREATE TABLE solicitudes_caso_especial (
    id_solicitud INT PRIMARY KEY AUTO_INCREMENT,
    codigo_solicitud VARCHAR(50) UNIQUE NOT NULL COMMENT 'Código único: CE-2025-1-00001',
    id_estudiante INT NOT NULL,
    id_tipo INT NOT NULL,
    periodo_academico VARCHAR(10) NOT NULL COMMENT 'Formato: 2025-1',
    justificacion TEXT NOT NULL,
    
    -- Estados del flujo
    estado ENUM(
        'pendiente',
        'en_revision',
        'pre_aprobada',
        'aprobada',
        'rechazada',
        'informacion_requerida'
    ) DEFAULT 'pendiente',
    
    prioridad INT DEFAULT 5,
    validacion_automatica BOOLEAN DEFAULT FALSE,
    observaciones_validacion TEXT,
    
    -- Metadatos
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_actualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    -- Relaciones
    FOREIGN KEY (id_estudiante) REFERENCES estudiantes(id_estudiante) ON DELETE RESTRICT,
    FOREIGN KEY (id_tipo) REFERENCES tipos_caso_especial(id_tipo) ON DELETE RESTRICT,
    
    -- Índices para búsquedas frecuentes
    INDEX idx_codigo (codigo_solicitud),
    INDEX idx_estudiante (id_estudiante),
    INDEX idx_estado (estado),
    INDEX idx_periodo (periodo_academico),
    INDEX idx_fecha_creacion (fecha_creacion),
    INDEX idx_prioridad_fecha (prioridad, fecha_creacion)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='Solicitudes de casos especiales';

-- ============================================================================
-- TABLA 4: MATERIAS SOLICITADAS
-- ============================================================================
CREATE TABLE solicitud_materias (
    id_solicitud_materia INT PRIMARY KEY AUTO_INCREMENT,
    id_solicitud INT NOT NULL,
    codigo_materia VARCHAR(20) NOT NULL,
    nombre_materia VARCHAR(200) NOT NULL,
    grupo VARCHAR(10),
    creditos INT NOT NULL,
    programa_origen_id INT COMMENT 'ID del programa al que pertenece la materia',
    cupos_disponibles INT,
    conflicto_horario BOOLEAN DEFAULT FALSE,
    
    FOREIGN KEY (id_solicitud) REFERENCES solicitudes_caso_especial(id_solicitud) ON DELETE CASCADE,
    
    INDEX idx_solicitud (id_solicitud),
    INDEX idx_materia (codigo_materia),
    INDEX idx_conflicto (conflicto_horario)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='Materias incluidas en cada solicitud';

-- ============================================================================
-- TABLA 5: APROBACIONES (FLUJO MULTI-NIVEL)
-- ============================================================================
CREATE TABLE aprobaciones (
    id_aprobacion INT PRIMARY KEY AUTO_INCREMENT,
    id_solicitud INT NOT NULL,
    rol_aprobador ENUM(
        'director_programa',
        'coordinador_academico',
        'registro_control'
    ) NOT NULL,
    id_usuario_aprobador INT NOT NULL COMMENT 'ID del usuario que aprueba/rechaza',
    nombre_aprobador VARCHAR(200),
    accion ENUM('aprobar', 'rechazar', 'solicitar_informacion') NOT NULL,
    comentarios TEXT,
    fecha_accion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (id_solicitud) REFERENCES solicitudes_caso_especial(id_solicitud) ON DELETE CASCADE,
    
    INDEX idx_solicitud (id_solicitud),
    INDEX idx_rol (rol_aprobador),
    INDEX idx_fecha (fecha_accion)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='Historial de aprobaciones y rechazos';

-- ============================================================================
-- TABLA 6: DOCUMENTOS ADJUNTOS
-- ============================================================================
CREATE TABLE documentos_adjuntos (
    id_documento INT PRIMARY KEY AUTO_INCREMENT,
    id_solicitud INT NOT NULL,
    nombre_archivo VARCHAR(255) NOT NULL,
    ruta_archivo VARCHAR(500) NOT NULL,
    tipo_mime VARCHAR(100),
    tamano_bytes BIGINT,
    fecha_subida TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (id_solicitud) REFERENCES solicitudes_caso_especial(id_solicitud) ON DELETE CASCADE,
    
    INDEX idx_solicitud (id_solicitud)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='Documentos adjuntos a solicitudes';

-- ============================================================================
-- TABLA 7: NOTIFICACIONES
-- ============================================================================
CREATE TABLE notificaciones (
    id_notificacion INT PRIMARY KEY AUTO_INCREMENT,
    id_solicitud INT NOT NULL,
    id_destinatario INT NOT NULL COMMENT 'ID del usuario destinatario',
    tipo_notificacion ENUM(
        'creacion',
        'actualizacion',
        'aprobacion',
        'rechazo',
        'informacion_requerida'
    ) NOT NULL,
    mensaje TEXT NOT NULL,
    leida BOOLEAN DEFAULT FALSE,
    enviada_email BOOLEAN DEFAULT FALSE,
    fecha_envio TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (id_solicitud) REFERENCES solicitudes_caso_especial(id_solicitud) ON DELETE CASCADE,
    
    INDEX idx_destinatario (id_destinatario),
    INDEX idx_leida (leida),
    INDEX idx_fecha (fecha_envio)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='Notificaciones a usuarios';

-- ============================================================================
-- TABLA 8: AUDITORÍA
-- ============================================================================
CREATE TABLE auditoria_solicitudes (
    id_auditoria INT PRIMARY KEY AUTO_INCREMENT,
    id_solicitud INT NOT NULL,
    id_usuario INT NOT NULL,
    accion VARCHAR(100) NOT NULL COMMENT 'Acción realizada (crear, actualizar, aprobar, etc.)',
    estado_anterior VARCHAR(50),
    estado_nuevo VARCHAR(50),
    detalles TEXT COMMENT 'Detalles JSON de los cambios',
    ip_address VARCHAR(45),
    user_agent VARCHAR(255),
    fecha_accion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (id_solicitud) REFERENCES solicitudes_caso_especial(id_solicitud) ON DELETE CASCADE,
    
    INDEX idx_solicitud (id_solicitud),
    INDEX idx_usuario (id_usuario),
    INDEX idx_fecha (fecha_accion),
    INDEX idx_accion (accion)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='Registro de auditoría completo';

-- ============================================================================
-- TABLA 9: USUARIOS (simplificada para el módulo)
-- ============================================================================
CREATE TABLE usuarios (
    id_usuario INT PRIMARY KEY AUTO_INCREMENT,
    codigo_usuario VARCHAR(20) UNIQUE NOT NULL,
    nombre_completo VARCHAR(200) NOT NULL,
    email VARCHAR(100) NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    rol ENUM(
        'estudiante',
        'director_programa',
        'coordinador_academico',
        'registro_control',
        'admin'
    ) NOT NULL,
    programa_id INT COMMENT 'Para directores de programa',
    activo BOOLEAN DEFAULT TRUE,
    ultimo_acceso TIMESTAMP NULL,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    INDEX idx_codigo (codigo_usuario),
    INDEX idx_rol (rol),
    INDEX idx_activo (activo)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='Usuarios del sistema';

-- ============================================================================
-- TRIGGERS PARA AUDITORÍA AUTOMÁTICA
-- ============================================================================

DELIMITER $$

-- Trigger: Auditar cambios de estado en solicitudes
CREATE TRIGGER trg_auditoria_solicitud_update
AFTER UPDATE ON solicitudes_caso_especial
FOR EACH ROW
BEGIN
    IF OLD.estado != NEW.estado THEN
        INSERT INTO auditoria_solicitudes (
            id_solicitud,
            id_usuario,
            accion,
            estado_anterior,
            estado_nuevo,
            detalles
        ) VALUES (
            NEW.id_solicitud,
            0, -- Se actualizará desde la aplicación
            'CAMBIO_ESTADO',
            OLD.estado,
            NEW.estado,
            CONCAT('Estado cambiado de ', OLD.estado, ' a ', NEW.estado)
        );
    END IF;
END$$

-- Trigger: Generar código de solicitud automáticamente
CREATE TRIGGER trg_generar_codigo_solicitud
BEFORE INSERT ON solicitudes_caso_especial
FOR EACH ROW
BEGIN
    DECLARE siguiente_numero INT;
    DECLARE periodo VARCHAR(10);
    
    SET periodo = NEW.periodo_academico;
    
    -- Obtener el siguiente número secuencial para el periodo
    SELECT COALESCE(MAX(CAST(SUBSTRING(codigo_solicitud, -5) AS UNSIGNED)), 0) + 1
    INTO siguiente_numero
    FROM solicitudes_caso_especial
    WHERE periodo_academico = periodo;
    
    -- Generar código: CE-PERIODO-NUMERO (ej: CE-2025-1-00001)
    SET NEW.codigo_solicitud = CONCAT('CE-', periodo, '-', LPAD(siguiente_numero, 5, '0'));
END$$

-- Trigger: Actualizar timestamp de último acceso en usuarios
CREATE TRIGGER trg_actualizar_ultimo_acceso
BEFORE UPDATE ON usuarios
FOR EACH ROW
BEGIN
    IF NEW.activo = TRUE AND OLD.activo = TRUE THEN
        SET NEW.ultimo_acceso = CURRENT_TIMESTAMP;
    END IF;
END$$

DELIMITER ;

-- ============================================================================
-- PROCEDIMIENTOS ALMACENADOS
-- ============================================================================

DELIMITER $$

-- Procedimiento: Obtener estadísticas por periodo
CREATE PROCEDURE sp_estadisticas_periodo(IN p_periodo VARCHAR(10))
BEGIN
    SELECT 
        COUNT(*) AS total_solicitudes,
        SUM(CASE WHEN estado = 'pendiente' THEN 1 ELSE 0 END) AS pendientes,
        SUM(CASE WHEN estado = 'en_revision' THEN 1 ELSE 0 END) AS en_revision,
        SUM(CASE WHEN estado = 'aprobada' THEN 1 ELSE 0 END) AS aprobadas,
        SUM(CASE WHEN estado = 'rechazada' THEN 1 ELSE 0 END) AS rechazadas,
        SUM(CASE WHEN validacion_automatica = TRUE THEN 1 ELSE 0 END) AS validadas_automaticamente,
        AVG(TIMESTAMPDIFF(DAY, fecha_creacion, fecha_actualizacion)) AS dias_promedio_resolucion
    FROM solicitudes_caso_especial
    WHERE periodo_academico = p_periodo;
END$$

-- Procedimiento: Obtener solicitudes pendientes por programa
CREATE PROCEDURE sp_solicitudes_pendientes_programa(IN p_programa_id INT)
BEGIN
    SELECT 
        s.id_solicitud,
        s.codigo_solicitud,
        CONCAT(e.nombre, ' ', e.apellido) AS estudiante,
        e.codigo_estudiante,
        t.nombre AS tipo_caso,
        s.estado,
        s.prioridad,
        s.fecha_creacion,
        GROUP_CONCAT(sm.codigo_materia SEPARATOR ', ') AS materias
    FROM solicitudes_caso_especial s
    INNER JOIN estudiantes e ON s.id_estudiante = e.id_estudiante
    INNER JOIN tipos_caso_especial t ON s.id_tipo = t.id_tipo
    LEFT JOIN solicitud_materias sm ON s.id_solicitud = sm.id_solicitud
    WHERE e.programa_id = p_programa_id
        AND s.estado IN ('pendiente', 'en_revision')
    GROUP BY s.id_solicitud
    ORDER BY s.prioridad ASC, s.fecha_creacion ASC;
END$$

-- Procedimiento: Aprobar solicitud
CREATE PROCEDURE sp_aprobar_solicitud(
    IN p_id_solicitud INT,
    IN p_id_usuario_aprobador INT,
    IN p_rol_aprobador VARCHAR(50),
    IN p_comentarios TEXT
)
BEGIN
    DECLARE v_nombre_aprobador VARCHAR(200);
    
    -- Obtener nombre del aprobador
    SELECT nombre_completo INTO v_nombre_aprobador
    FROM usuarios
    WHERE id_usuario = p_id_usuario_aprobador;
    
    -- Insertar registro de aprobación
    INSERT INTO aprobaciones (
        id_solicitud,
        rol_aprobador,
        id_usuario_aprobador,
        nombre_aprobador,
        accion,
        comentarios
    ) VALUES (
        p_id_solicitud,
        p_rol_aprobador,
        p_id_usuario_aprobador,
        v_nombre_aprobador,
        'aprobar',
        p_comentarios
    );
    
    -- Actualizar estado de la solicitud
    UPDATE solicitudes_caso_especial
    SET estado = 'aprobada'
    WHERE id_solicitud = p_id_solicitud;
    
    -- Crear notificación
    INSERT INTO notificaciones (
        id_solicitud,
        id_destinatario,
        tipo_notificacion,
        mensaje
    )
    SELECT 
        p_id_solicitud,
        s.id_estudiante,
        'aprobacion',
        CONCAT('Tu solicitud ', s.codigo_solicitud, ' ha sido aprobada por ', v_nombre_aprobador)
    FROM solicitudes_caso_especial s
    WHERE s.id_solicitud = p_id_solicitud;
END$$

-- Procedimiento: Rechazar solicitud
CREATE PROCEDURE sp_rechazar_solicitud(
    IN p_id_solicitud INT,
    IN p_id_usuario_aprobador INT,
    IN p_rol_aprobador VARCHAR(50),
    IN p_comentarios TEXT
)
BEGIN
    DECLARE v_nombre_aprobador VARCHAR(200);
    
    SELECT nombre_completo INTO v_nombre_aprobador
    FROM usuarios
    WHERE id_usuario = p_id_usuario_aprobador;
    
    INSERT INTO aprobaciones (
        id_solicitud,
        rol_aprobador,
        id_usuario_aprobador,
        nombre_aprobador,
        accion,
        comentarios
    ) VALUES (
        p_id_solicitud,
        p_rol_aprobador,
        p_id_usuario_aprobador,
        v_nombre_aprobador,
        'rechazar',
        p_comentarios
    );
    
    UPDATE solicitudes_caso_especial
    SET estado = 'rechazada'
    WHERE id_solicitud = p_id_solicitud;
    
    INSERT INTO notificaciones (
        id_solicitud,
        id_destinatario,
        tipo_notificacion,
        mensaje
    )
    SELECT 
        p_id_solicitud,
        s.id_estudiante,
        'rechazo',
        CONCAT('Tu solicitud ', s.codigo_solicitud, ' ha sido rechazada. Motivo: ', p_comentarios)
    FROM solicitudes_caso_especial s
    WHERE s.id_solicitud = p_id_solicitud;
END$$

DELIMITER ;

-- ============================================================================
-- DATOS INICIALES (SEED DATA)
-- ============================================================================

-- Insertar tipos de casos especiales
INSERT INTO tipos_caso_especial (
    nombre, 
    descripcion, 
    requiere_aprobacion_director, 
    requiere_aprobacion_coordinador, 
    prioridad
) VALUES
    ('Terminación Académica', 
     'Estudiante en terminación académica que no alcanzó cupos en inscripción regular', 
     TRUE, FALSE, 1),
    ('Inscripción Entre Programas', 
     'Estudiante requiere inscribir materia de otro programa académico', 
     TRUE, TRUE, 3),
    ('Corrección Administrativa', 
     'Corrección por error del sistema o problema administrativo', 
     FALSE, FALSE, 2),
    ('Excepción de Prerequisito', 
     'Solicitud para inscribir materia sin cumplir prerequisito completo', 
     TRUE, TRUE, 4),
    ('Cupo Adicional', 
     'Solicitud de cupo en materia que alcanzó capacidad máxima', 
     TRUE, FALSE, 5);

-- Insertar usuarios de prueba
INSERT INTO usuarios (
    codigo_usuario, 
    nombre_completo, 
    email, 
    password_hash, 
    rol, 
    programa_id
) VALUES
    ('admin001', 'Administrador Sistema', 'admin@uptc.edu.co', 
     '$2a$10$example_hash', 'admin', NULL),
    ('dir001', 'Dr. Juan Pérez', 'juan.perez@uptc.edu.co', 
     '$2a$10$example_hash', 'director_programa', 1),
    ('coord001', 'Dra. María González', 'maria.gonzalez@uptc.edu.co', 
     '$2a$10$example_hash', 'coordinador_academico', NULL),
    ('reg001', 'Carlos Rodríguez', 'carlos.rodriguez@uptc.edu.co', 
     '$2a$10$example_hash', 'registro_control', NULL);

-- Insertar estudiantes de prueba
INSERT INTO estudiantes (
    codigo_estudiante, 
    nombre, 
    apellido, 
    email_institucional, 
    programa_id, 
    promedio_acumulado, 
    creditos_aprobados, 
    estado_academico
) VALUES
    ('201810001', 'Ana', 'López', 'ana.lopez@uptc.edu.co', 1, 4.2, 120, 'regular'),
    ('201910002', 'Pedro', 'Martínez', 'pedro.martinez@uptc.edu.co', 1, 2.8, 80, 'terminacion'),
    ('202010003', 'Laura', 'Ramírez', 'laura.ramirez@uptc.edu.co', 2, 3.9, 95, 'regular'),
    ('202110004', 'Diego', 'Torres', 'diego.torres@uptc.edu.co', 1, 3.5, 110, 'condicional');

-- ============================================================================
-- VISTAS ÚTILES
-- ============================================================================

-- Vista: Resumen de solicitudes con información completa
CREATE VIEW v_solicitudes_completas AS
SELECT 
    s.id_solicitud,
    s.codigo_solicitud,
    s.periodo_academico,
    s.estado,
    s.prioridad,
    s.fecha_creacion,
    s.fecha_actualizacion,
    -- Información del estudiante
    e.codigo_estudiante,
    CONCAT(e.nombre, ' ', e.apellido) AS nombre_estudiante,
    e.email_institucional,
    e.programa_id,
    e.estado_academico,
    -- Información del tipo de caso
    t.nombre AS tipo_caso,
    t.descripcion AS tipo_descripcion,
    -- Contadores
    (SELECT COUNT(*) FROM solicitud_materias sm WHERE sm.id_solicitud = s.id_solicitud) AS total_materias,
    (SELECT COUNT(*) FROM aprobaciones a WHERE a.id_solicitud = s.id_solicitud) AS total_aprobaciones
FROM solicitudes_caso_especial s
INNER JOIN estudiantes e ON s.id_estudiante = e.id_estudiante
INNER JOIN tipos_caso_especial t ON s.id_tipo = t.id_tipo;

-- Vista: Notificaciones no leídas
CREATE VIEW v_notificaciones_pendientes AS
SELECT 
    n.id_notificacion,
    n.id_destinatario,
    n.tipo_notificacion,
    n.mensaje,
    n.fecha_envio,
    s.codigo_solicitud,
    s.estado AS estado_solicitud
FROM notificaciones n
INNER JOIN solicitudes_caso_especial s ON n.id_solicitud = s.id_solicitud
WHERE n.leida = FALSE
ORDER BY n.fecha_envio DESC;

-- ============================================================================
-- ÍNDICES ADICIONALES PARA OPTIMIZACIÓN
-- ============================================================================

-- Índice compuesto para búsquedas frecuentes
CREATE INDEX idx_solicitud_estado_periodo 
ON solicitudes_caso_especial(estado, periodo_academico, fecha_creacion);

-- Índice para búsquedas de estudiantes por programa y estado
CREATE INDEX idx_estudiante_programa_estado 
ON estudiantes(programa_id, estado_academico);

-- ============================================================================
-- VERIFICACIÓN DE LA INSTALACIÓN
-- ============================================================================

-- Verificar tablas creadas
SELECT 
    TABLE_NAME,
    TABLE_ROWS,
    ROUND(((DATA_LENGTH + INDEX_LENGTH) / 1024 / 1024), 2) AS 'Tamaño MB'
FROM information_schema.TABLES
WHERE TABLE_SCHEMA = 'sira_casos_especiales'
ORDER BY TABLE_NAME;

-- ============================================================================
-- FIN DEL SCRIPT
-- ============================================================================
