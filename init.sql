-- Script de inicialización para la base de datos regateos
-- Este archivo se ejecuta automáticamente cuando se crea el contenedor

-- Crear extensiones necesarias
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Crear esquema para la aplicación
CREATE SCHEMA IF NOT EXISTS regateos;

-- Configurar permisos
GRANT ALL PRIVILEGES ON SCHEMA regateos TO regateos_user;

GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA regateos TO regateos_user;

GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA regateos TO regateos_user;

-- Configurar búsqueda de esquemas
ALTER DATABASE regateos_db SET search_path TO regateos, public;