# API de Usuarios - Versión Simplificada

Módulo de usuarios optimizado con solo las 3 funciones esenciales.

## Funciones Disponibles

### 1. CREAR Usuario (Sign Up) - POST /users

Registra un nuevo usuario en el sistema usando Prisma (compatible con Better Auth).

```http
POST /users
Content-Type: application/json

{
  "email": "usuario@ejemplo.com",
  "password": "contraseñaSegura123",
  "name": "Juan Pérez"
}
```

**Campos requeridos:**
- `email`: Email del usuario
- `password`: Contraseña del usuario
- `name`: Nombre del usuario

**Respuesta:**
```json
{
  "id": "uuid-generado",
  "email": "usuario@ejemplo.com",
  "name": "Juan Pérez",
  "emailVerified": false,
  "image": null,
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-01T00:00:00.000Z"
}
```

### 2. VER Todos los Usuarios - GET /users

Lista todos los usuarios con filtros básicos.

```http
GET /users?search=juan@example.com&limit=10&offset=0
```

**Parámetros de consulta:**
- `search`: Email a buscar (opcional)
- `limit`: Número de usuarios a retornar (default: 100)
- `offset`: Desplazamiento para paginación (default: 0)

**Respuesta:**
```json
[
  {
    "id": "uuid-1",
    "name": "Juan Pérez",
    "email": "juan@ejemplo.com",
    "role": "user",
    "emailVerified": false,
    "image": null,
    "banned": false,
    "banReason": null,
    "banExpires": null,
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
]
```

### 3. VER Usuario por ID - GET /users/:id

Obtiene un usuario específico por su ID.

```http
GET /users/user-id-123
```

**Respuesta:**
```json
{
  "id": "user-id-123",
  "name": "Juan Pérez",
  "email": "juan@ejemplo.com",
  "role": "user",
  "emailVerified": false,
  "image": null,
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-01T00:00:00.000Z"
}
```

## Estructura del Módulo

```
src/users/
├── dto/
│   └── user.dto.ts
├── users.controller.ts (3 endpoints)
├── users.service.ts (3 funciones)
└── users.module.ts
```

## Ejemplos de Uso

### Crear un nuevo usuario
```bash
curl -X POST "http://localhost:3000/users" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "nuevo@ejemplo.com",
    "password": "contraseñaSegura123",
    "name": "Usuario Nuevo",
    "role": "user"
  }'
```

### Listar usuarios con búsqueda por email
```bash
curl -X GET "http://localhost:3000/users?search=admin@example.com&limit=5"
```

### Obtener usuario por ID
```bash
curl -X GET "http://localhost:3000/users/user-id-123"
```

## Características

- **Mínimo código**: Solo 3 funciones esenciales
- **DTO unificado**: Un solo DTO para todas las operaciones
- **Integración con Prisma**: Usuarios reales de la base de datos
- **Compatible con Better Auth**: Esquema preparado para Better Auth
- **Validaciones básicas**: Verificación de email único
- **Respuestas consistentes**: Formato uniforme en todas las respuestas
- **Sin autenticación**: Endpoints públicos (se puede agregar después)

## Notas de Implementación

1. **Optimización**: Eliminadas funciones redundantes y DTOs innecesarios
2. **Simplicidad**: Solo las operaciones básicas de CRUD
3. **Integración con Prisma**: Usuarios almacenados en PostgreSQL
4. **Esquema Better Auth**: Campos `role`, `banned`, `banReason`, `banExpires` agregados
5. **Flexibilidad**: DTO unificado permite agregar campos fácilmente
6. **Escalabilidad**: Fácil de extender cuando se necesiten más funciones

## Integración con Better Auth

El módulo está preparado para trabajar con Better Auth:

- **Esquema actualizado**: Campos de administración agregados al modelo User
- **Registro compatible**: La función create está preparada para Better Auth
- **Recomendación**: Para registro completo, usar `authClient.signUp()` en el frontend
- **Base de datos**: PostgreSQL con esquema compatible con Better Auth

## Próximos Pasos

Cuando necesites más funcionalidades, puedes agregar:
- Actualizar usuario (PATCH)
- Eliminar usuario (DELETE)
- Validaciones de autenticación
- Filtros más avanzados
- Paginación mejorada
