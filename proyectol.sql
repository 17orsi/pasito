-- ===================================================================================
-- PROYECTO LIBRITOS - SCRIPT SQL COMPLETO (BETA V1.0)
-- Descripción: Estructura de base de datos relacional para gestión de puntos, 
--              recompensas, validación de materias y comunidad de ayuda escolar.
-- ===================================================================================

-- 1. CONFIGURACIÓN INICIAL
DROP DATABASE IF EXISTS libritos_db;
CREATE DATABASE libritos_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE libritos_db;

-- 2. TABLA DE MATERIAS (Utilizada para filtros y validaciones académicas)
CREATE TABLE materias (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL UNIQUE,
    descripcion TEXT
);

-- 3. TABLA DE USUARIOS / ALUMNOS (Perfil, puntaje acumulado y roles)
CREATE TABLE usuarios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre_completo VARCHAR(150) NOT NULL,
    correo VARCHAR(150) NOT NULL UNIQUE,
    puntos_totales INT DEFAULT 0,
    rol ENUM('Estudiante', 'Ayudante', 'Administrador') DEFAULT 'Estudiante',
    fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 4. TABLA DE ACTIVIDADES / HISTORIAL DE PUNTOS (Registra cómo gana puntos el usuario)
CREATE TABLE historial_puntos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    usuario_id INT NOT NULL,
    descripcion_actividad VARCHAR(255) NOT NULL,
    puntos_ganados INT NOT NULL,
    fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE
);

-- 5. TABLA DE RECOMPENSAS (Premios disponibles para canjear)
CREATE TABLE recompensas (
    id INT AUTO_INCREMENT PRIMARY KEY,
    titulo VARCHAR(150) NOT NULL,
    descripcion TEXT NOT NULL,
    costo_puntos INT NOT NULL,
    stock INT NOT NULL,
    activo BOOLEAN DEFAULT TRUE
);

-- 6. TABLA DE CANJES (Generación de códigos aleatorios para los premios)
CREATE TABLE canjes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    usuario_id INT NOT NULL,
    recompensa_id INT NOT NULL,
    codigo_canje VARCHAR(30) NOT NULL UNIQUE,
    estado_canje ENUM('Pendiente', 'Entregado', 'Cancelado') DEFAULT 'Pendiente',
    fecha_canje TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE,
    FOREIGN KEY (recompensa_id) REFERENCES recompensas(id) ON DELETE CASCADE
);

-- 7. TABLA DE COMUNIDAD DE AYUDA (Foro de preguntas y respuestas entre alumnos)
CREATE TABLE comunidad_ayuda (
    id INT AUTO_INCREMENT PRIMARY KEY,
    usuario_id INT NOT NULL,
    materia_id INT NOT NULL,
    titulo_pregunta VARCHAR(200) NOT NULL,
    cuerpo_pregunta TEXT NOT NULL,
    estado_pregunta ENUM('Abierta', 'Resuelta') DEFAULT 'Abierta',
    fecha_publicacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE,
    FOREIGN KEY (materia_id) REFERENCES materias(id) ON DELETE CASCADE
);

-- ===================================================================================
-- DATOS DE PRUEBA (SEEDERS) - LLEGASTE Y EL SISTEMA YA TIENE VIDA
-- ===================================================================================

-- Insertar Materias
INSERT INTO materias (nombre, descripcion) VALUES 
('Programación', 'Algoritmos, estructuras de control y lógica en C y otros lenguajes.'),
('Matemática', 'Factorización, funciones y resolución analítica.'),
('Bases de Datos', 'Modelado relacional, consultas SQL y normalización.'),
('Algoritmos', 'Optimización de procesos lógicos y resolución de problemas.');

-- Insertar Usuarios
INSERT INTO usuarios (nombre_completo, correo, puntos_totales, rol) VALUES 
('Lucía Gómez', 'lucia.gomez@school.edu', 450, 'Estudiante'),
('Mateo Pérez', 'mateo.perez@school.edu', 820, 'Ayudante'),
('Sofía Benítez', 'sofia.benitez@school.edu', 310, 'Estudiante'),
('Lucas Rodríguez', 'lucas.rodriguez@school.edu', 150, 'Estudiante');

-- Insertar Historial de Puntos
INSERT INTO historial_puntos (usuario_id, descripcion_actividad, puntos_ganados) VALUES 
(1, 'Completar desafío diario de Programación', 100),
(1, 'Ayudar a un compañero en el foro', 350),
(2, 'Resolver ejercicio avanzado de Bases de Datos', 500),
(2, 'Entrega puntual de trabajo práctico', 320),
(3, 'Participación activa en clase de Matemática', 310);

-- Insertar Recompensas
INSERT INTO recompensas (titulo, descripcion, costo_puntos, stock) VALUES 
('Descuento 15% en Librería Escolar', 'Válido para fotocopias, carpetas y útiles generales.', 150, 25),
('Extensión de Plazo (+1 Día)', 'Un día extra de prórroga para la entrega de cualquier trabajo práctico.', 300, 10),
('Café o Té Gratis en el Buffet', 'Un ticket canjeable por una infusión en el kiosco de la escuela.', 100, 40),
('Exención de Lección Oral', 'Un pase libre para evitar una lección oral sorpresa.', 600, 5);

-- Insertar Canjes iniciales
INSERT INTO canjes (usuario_id, recompensa_id, codigo_canje, estado_canje) VALUES 
(1, 1, 'LIB-2026-X9A2', 'Entregado'),
(2, 2, 'LIB-2026-B7K4', 'Pendiente'),
(3, 3, 'LIB-2026-M3Q9', 'Entregado');

-- Insertar Preguntas en la Comunidad de Ayuda
INSERT INTO comunidad_ayuda (usuario_id, materia_id, titulo_pregunta, cuerpo_pregunta, estado_pregunta) VALUES 
(1, 1, '¿Cómo evito bucles infinitos en C?', 'Estoy usando un while pero se me queda tildada la PC, ¿alguna recomendación?', 'Abierta'),
(3, 3, 'Diferencia entre Clave Foránea y Primaria', 'No me queda claro cómo vincular dos tablas sin romper la integridad.', 'Resuelta');

-- ===================================================================================
-- CONSULTAS CLAVE (QUERIES ÚTILES PARA EL BACKEND / DASHBOARD)
-- ===================================================================================

-- 1. Ranking de alumnos ordenados por puntos (Leaderboard)
SELECT nombre_completo, puntos_totales, rol 
FROM usuarios 
ORDER BY puntos_totales DESC;

-- 2. Ver el historial detallado de puntos de un usuario específico
SELECT u.nombre_completo, h.descripcion_actividad, h.puntos_ganados, h.fecha 
FROM historial_puntos h
JOIN usuarios u ON h.usuario_id = u.id
WHERE u.id = 1;

-- 3. Consultar los canjes pendientes con el nombre del alumno y el premio
SELECT c.id AS id_canje, u.nombre_completo, r.titulo AS premio, c.codigo_canje, c.estado_canje
FROM canjes c
JOIN usuarios u ON c.usuario_id = u.id
JOIN recompensas r ON c.recompensa_id = r.id
WHERE c.estado_canje = 'Pendiente';

-- 4. Ver las preguntas abiertas en la comunidad con su respectiva materia
SELECT ca.id, u.nombre_completo AS autor, m.nombre AS materia, ca.titulo_pregunta, ca.estado_pregunta
FROM comunidad_ayuda ca
JOIN usuarios u ON ca.usuario_id = u.id
JOIN materias m ON ca.materia_id = m.id
WHERE ca.estado_pregunta = 'Abierta';

