# Configuración de Correos - Regateos

## Configuración Rápida

1. **Copia el archivo de ejemplo:**
   ```bash
   cp env.example .env
   ```

2. **Configura solo las variables obligatorias en `.env`:**
   ```
   DATABASE_URL="postgresql://postgres:password@localhost:5432/regateos?schema=public"
   EMAIL_USER=tu_correo@gmail.com
   EMAIL_PASS=tu_contraseña_de_aplicacion
   ```

3. **Para Gmail, usa contraseñas de aplicación:**
   - Ve a tu cuenta de Google
   - Seguridad → Verificación en 2 pasos → Contraseñas de aplicación
   - Genera una contraseña para "Regateos"

## Uso del Servicio

### Envío de correos simples:
```typescript
// Inyectar el servicio
constructor(private mailService: MailService) {}

// Enviar correo
await this.mailService.sendMail('usuario@email.com', 'Asunto', 'Mensaje');
```

### Correos predefinidos:
```typescript
// Correo de restablecimiento de contraseña
await this.mailService.sendResetPasswordEmail('usuario@email.com', 'https://link-reset');

// Correo de bienvenida
await this.mailService.sendWelcomeEmail('usuario@email.com', 'Juan');
```

## Endpoints de Prueba

- `POST /mail/send` - Enviar correo personalizado
- `POST /mail/reset-password` - Enviar correo de restablecimiento
- `POST /mail/welcome` - Enviar correo de bienvenida

## Características

- ✅ Solo 3 variables obligatorias
- ✅ Valores por defecto para todo lo demás
- ✅ Sin ConfigModule (más simple)
- ✅ Variables de entorno directas
- ✅ Correos de texto plano (más rápido)
- ✅ Manejo de errores interno
- ✅ Integración con better-auth
