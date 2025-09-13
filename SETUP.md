# 🚀 Configuración de Regateos Core

Este proyecto está configurado con NestJS, PostgreSQL, Prisma y Better Auth.

## 📋 Prerrequisitos

- Node.js 18+ 
- Docker y Docker Compose
- npm o yarn

## 🛠️ Instalación y Configuración

### 1. Instalar dependencias
```bash
npm install
```

### 2. Configurar la base de datos
```bash
# Ejecutar el script de configuración
./scripts/setup-db.sh
```

O manualmente:
```bash
# Levantar PostgreSQL con Docker
docker-compose up -d

# Generar cliente de Prisma
npx prisma generate

# Ejecutar migraciones
npx prisma migrate dev --name init
```

### 3. Iniciar la aplicación
```bash
npm run start:dev
```

## 🔗 URLs de Conexión

### Base de Datos PostgreSQL
```
URL: postgresql://regateos_user:regateos_password@localhost:5432/regateos_db?schema=regateos
Host: localhost
Puerto: 5432
Base de datos: regateos_db
Usuario: regateos_user
Contraseña: regateos_password
Esquema: regateos
```

### PgAdmin (Interfaz Web)
```
URL: http://localhost:8080
Email: admin@regateos.com
Contraseña: admin123
```

### Aplicación NestJS
```
URL: http://localhost:3000
```

## 🔐 Endpoints de Autenticación

Better Auth está configurado y disponible en:

- `POST /api/auth/sign-up` - Registro de usuario
- `POST /api/auth/sign-in` - Inicio de sesión
- `POST /api/auth/sign-out` - Cierre de sesión
- `GET /api/auth/session` - Obtener sesión actual
- `GET /auth/me` - Perfil del usuario (requiere autenticación)

## 📊 Modelos de Base de Datos

El esquema incluye:

- **User**: Usuarios del sistema
- **Account**: Cuentas vinculadas (Google, GitHub, etc.)
- **Session**: Sesiones de usuario
- **VerificationToken**: Tokens de verificación
- **Invoice**: Facturas (ejemplo de modelo de negocio)
- **InvoiceItem**: Items de factura

## 🛠️ Comandos Útiles

```bash
# Ver estado de la base de datos
npx prisma studio

# Resetear la base de datos
npx prisma migrate reset

# Generar cliente de Prisma
npx prisma generate

# Ver logs de Docker
docker-compose logs -f

# Detener servicios
docker-compose down
```

## 🔧 Variables de Entorno

El archivo `.env` incluye:

```env
DATABASE_URL="postgresql://regateos_user:regateos_password@localhost:5432/regateos_db?schema=regateos"
BETTER_AUTH_SECRET="tu-secreto-super-seguro-aqui-cambiar-en-produccion"
BETTER_AUTH_URL="http://localhost:3000"
PORT=3000
NODE_ENV=development
```

## 🚨 Notas Importantes

1. **Cambiar secretos**: Actualiza `BETTER_AUTH_SECRET` en producción
2. **Verificación de email**: Está deshabilitada en desarrollo, habilitar en producción
3. **CORS**: Configurado para desarrollo, ajustar para producción
4. **Campo sequential**: En el modelo Invoice se almacena como entero (int)

## 📝 Próximos Pasos

1. Configurar proveedores OAuth (Google, GitHub) en `.env`
2. Implementar lógica de negocio específica
3. Agregar validaciones y middleware
4. Configurar tests
5. Preparar para despliegue en producción
