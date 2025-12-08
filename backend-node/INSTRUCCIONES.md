# Instrucciones de Instalación y Uso

## Pasos Rápidos

### 1. Instalar dependencias
```bash
cd backend-node
npm install
```

### 2. Configurar variables de entorno
Crea un archivo `.env` en la carpeta `backend-node` con el siguiente contenido:

```
PORT=8081
DB_HOST=localhost
DB_PORT=5432
DB_NAME=investigacion_ud
DB_USER=postgres
DB_PASSWORD=postgres
JWT_SECRET=InvestigacionUDSecretKey2024ForJWTTokenGenerationAndValidation
JWT_EXPIRATION=86400000
CORS_ORIGIN=http://localhost:4200
```

**Importante:** Ajusta los valores de `DB_USER` y `DB_PASSWORD` según tu configuración de PostgreSQL.

### 3. Verificar que la base de datos esté creada
Asegúrate de que:
- PostgreSQL esté corriendo
- La base de datos `investigacion_ud` exista
- El esquema de la base de datos esté creado (ejecuta el archivo `DB.sql` que está en la raíz del proyecto)

### 4. Iniciar el servidor

**Modo desarrollo (con auto-reload):**
```bash
npm run dev
```

**Modo producción:**
```bash
npm start
```

El servidor estará disponible en `http://localhost:8081`

### 5. Verificar que funciona
Abre tu navegador y visita:
```
http://localhost:8081/health
```

Deberías ver:
```json
{
  "status": "OK",
  "message": "Servidor funcionando correctamente"
}
```

## Solución de Problemas

### Error de conexión a la base de datos
- Verifica que PostgreSQL esté corriendo
- Verifica las credenciales en el archivo `.env`
- Asegúrate de que la base de datos `investigacion_ud` exista

### Error "Cannot find module"
Ejecuta `npm install` nuevamente para instalar todas las dependencias.

### Error de puerto en uso
Si el puerto 8081 está ocupado, cambia el valor de `PORT` en el archivo `.env`.

## Notas

- El frontend ya está configurado para usar el puerto 8081
- El backend usa JWT para autenticación
- Todas las rutas protegidas requieren el header: `Authorization: Bearer <token>`

