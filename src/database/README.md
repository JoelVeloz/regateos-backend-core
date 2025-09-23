# 🌱 Inicializador de Base de Datos (Seeder)

Este archivo contiene el script de inicialización que genera datos aleatorios para el proyecto Regateos.

## 📋 ¿Qué hace el seeder?

El script `seeder.ts` crea automáticamente:

### 👥 Usuarios (5 usuarios)
- **Datos personales**: Nombres, emails únicos, teléfonos
- **Información de negocio**: Nombre del negocio, dirección, ciudad
- **Documentación**: Cédula nacional, imágenes del local
- **Verificación**: 70% de usuarios verificados aleatoriamente

### 🏷️ Categorías (2-4 por usuario)
- Nombres aleatorios de categorías de productos
- Iconos emoji representativos
- Cada categoría pertenece a un usuario específico

### 🛍️ Productos (5-10 por usuario)
- Nombres y descripciones realistas
- Precios aleatorios entre $10 y $500
- **Descuentos**: 40% de productos tienen descuentos (porcentual o fijo)
- Estados: 90% activos, 10% inactivos

### 📁 Archivos
- **Imágenes de usuarios**: Avatar, logo del negocio, cédula, fachada del local
- **Imágenes de productos**: 1-3 imágenes por producto
- URLs de Picsum Photos como placeholders

## 🚀 Cómo usar

### 1. Instalar dependencias
```bash
npm install
```

### 2. Configurar base de datos
Asegúrate de que tu archivo `.env` tenga la variable `DATABASE_URL` configurada correctamente.

### 3. Ejecutar migraciones (si es necesario)
```bash
npx prisma migrate dev
```

### 4. Ejecutar el seeder
```bash
npm run seed
```

## ⚠️ Importante

- **El seeder elimina TODOS los datos existentes** antes de crear los nuevos datos
- Solo ejecuta este comando en desarrollo o cuando quieras resetear completamente la base de datos
- Los datos generados son completamente aleatorios y de prueba

## 📊 Datos generados

Después de ejecutar el seeder, tendrás aproximadamente:

- **5 usuarios** con información completa
- **15-20 categorías** distribuidas entre los usuarios
- **25-50 productos** con precios y descuentos realistas
- **80-150 archivos** (imágenes de usuarios y productos)

## 🎯 Ejemplo de datos generados

### Usuario
```json
{
  "name": "María García",
  "email": "mariagarcia123@gmail.com",
  "businessName": "Supermercado El Ahorro",
  "city": "Madrid",
  "phone": "+34 123456789",
  "verified": true
}
```

### Producto
```json
{
  "name": "Smartphone Samsung Galaxy - Supermercado El Ahorro",
  "price": 299.99,
  "description": "Teléfono inteligente de última generación...",
  "discountPercent": 15,
  "status": "active"
}
```

## 🔧 Personalización

Puedes modificar el archivo `seeder.ts` para:

- Cambiar el número de usuarios (línea con `for (let i = 0; i < 5; i++)`)
- Agregar más nombres, ciudades o categorías a los arrays
- Modificar los rangos de precios
- Cambiar las probabilidades de descuentos y verificaciones

## 🐛 Solución de problemas

Si encuentras errores:

1. Verifica que la base de datos esté corriendo
2. Confirma que `DATABASE_URL` esté configurada correctamente
3. Asegúrate de haber ejecutado las migraciones de Prisma
4. Revisa que todas las dependencias estén instaladas

## 📝 Logs

El seeder muestra logs detallados durante la ejecución:
- Progreso de creación de usuarios
- Número de categorías y productos por usuario
- Estadísticas finales al completar
