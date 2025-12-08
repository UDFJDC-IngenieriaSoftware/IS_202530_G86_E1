# Backend Node.js - Sistema de Gestión de Grupos de Investigación

Backend desarrollado en Node.js con Express para el sistema de gestión de grupos de investigación.

## Requisitos

- Node.js (v16 o superior)
- PostgreSQL
- npm o yarn

## Instalación

1. Instalar dependencias:
```bash
npm install
```

2. Configurar variables de entorno:
```bash
cp .env.example .env
```

Editar el archivo `.env` con tus credenciales de base de datos:
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

3. Asegúrate de que la base de datos PostgreSQL esté corriendo y que el esquema esté creado (ver `DB.sql` en la raíz del proyecto).

## Ejecución

### Modo desarrollo (con nodemon):
```bash
npm run dev
```

### Modo producción:
```bash
npm start
```

El servidor estará disponible en `http://localhost:8081`

## Endpoints

### Públicos
- `GET /api/public/project-areas` - Obtener todas las áreas de proyecto
- `GET /api/public/investigation-areas` - Obtener todas las áreas de investigación
- `GET /api/public/product-types` - Obtener todos los tipos de producto

### Autenticación
- `POST /api/auth/register` - Registrar nuevo usuario
- `POST /api/auth/login` - Iniciar sesión

### Usuarios (requiere autenticación)
- `GET /api/users/me` - Obtener usuario actual
- `GET /api/users` - Obtener todos los usuarios (solo ADMINISTRADOR)
- `GET /api/users/:id` - Obtener usuario por ID
- `PUT /api/users/:id` - Actualizar usuario (solo ADMINISTRADOR)
- `DELETE /api/users/:id` - Eliminar usuario (solo ADMINISTRADOR)

### Equipos
- `GET /api/teams/public` - Obtener todos los equipos (público)
- `GET /api/teams/public/:id` - Obtener equipo por ID (público)
- `GET /api/teams/public/area/:areaId` - Obtener equipos por área (público)
- `POST /api/teams` - Crear equipo (COORDINADOR o ADMINISTRADOR)
- `PUT /api/teams/:id` - Actualizar equipo (COORDINADOR o ADMINISTRADOR)
- `DELETE /api/teams/:id` - Eliminar equipo (solo ADMINISTRADOR)

### Proyectos
- `GET /api/projects/public` - Obtener todos los proyectos (público)
- `GET /api/projects/public/:id` - Obtener proyecto por ID (público)
- `GET /api/projects/public/team/:teamId` - Obtener proyectos por equipo (público)
- `POST /api/projects` - Crear proyecto (COORDINADOR o ADMINISTRADOR)
- `PUT /api/projects/:id` - Actualizar proyecto (COORDINADOR o ADMINISTRADOR)
- `DELETE /api/projects/:id` - Eliminar proyecto (COORDINADOR o ADMINISTRADOR)

### Aplicaciones
- `POST /api/applications` - Crear aplicación (ESTUDIANTE)
- `GET /api/applications/my-applications` - Obtener mis aplicaciones (ESTUDIANTE)
- `GET /api/applications/team/:teamId` - Obtener aplicaciones por equipo (COORDINADOR o ADMINISTRADOR)
- `PUT /api/applications/:id/status` - Actualizar estado de aplicación (COORDINADOR o ADMINISTRADOR)

## Autenticación

El backend usa JWT (JSON Web Tokens) para autenticación. Después de hacer login o registro, recibirás un token que debes incluir en el header de las peticiones:

```
Authorization: Bearer <token>
```

## Estructura del Proyecto

```
backend-node/
├── config/          # Configuración (base de datos, JWT)
├── controllers/     # Controladores de las rutas
├── middleware/      # Middleware (autenticación, manejo de errores)
├── routes/          # Definición de rutas
├── services/        # Lógica de negocio
├── server.js        # Punto de entrada
└── package.json     # Dependencias
```

