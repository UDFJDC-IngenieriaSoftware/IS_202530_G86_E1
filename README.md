# Investigación UD - Sistema de Gestión de Grupos de Investigación

Sistema web para centralizar, consultar y gestionar la información de los grupos de investigación de la Facultad de Ingeniería de la Universidad Distrital Francisco José de Caldas.

## 🚀 Características

- **Registro y autenticación** con validación de dominio @udistrital.edu.co
- **Directorio unificado** de grupos de investigación clasificados por área
- **Visualización de proyectos** activos y producción científica
- **Solicitudes de vinculación** con seguimiento de estado
- **Gestión de grupos** para coordinadores
- **Panel de administración** para gestión de usuarios y roles

## 🛠️ Tecnologías

### Backend
- **Java 17**
- **Spring Boot 3.2.0**
- **Spring Security** con JWT
- **Spring Data JPA / Hibernate**
- **PostgreSQL**

### Frontend
- **Angular 17**
- **Angular Material**
- **TypeScript**
- **RxJS**

## 📋 Requisitos Previos

- Java 17 o superior
- Node.js 18 o superior
- PostgreSQL 12 o superior
- Maven 3.6 o superior
- Angular CLI 17

## 🔧 Instalación

### 1. Base de Datos

```sql
-- Crear la base de datos
CREATE DATABASE investigacion_ud;

-- Ejecutar el script DB.sql para crear las tablas
\i DB.sql
```

### 2. Backend

```bash
cd backend

# Configurar la conexión a la base de datos en application.properties
# Editar: src/main/resources/application.properties
# - spring.datasource.url
# - spring.datasource.username
# - spring.datasource.password

# Compilar y ejecutar
mvn clean install
mvn spring-boot:run
```

El backend estará disponible en `http://localhost:8080`

### 3. Frontend

```bash
cd frontend

# Instalar dependencias
npm install

# Ejecutar en modo desarrollo
ng serve
```

El frontend estará disponible en `http://localhost:4200`

## 📁 Estructura del Proyecto

```
InvestigaciónUD/
├── backend/                 # Aplicación Spring Boot
│   ├── src/
│   │   └── main/
│   │       ├── java/
│   │       │   └── co/edu/udistrital/investigacionud/
│   │       │       ├── config/         # Configuraciones
│   │       │       ├── controller/     # Controladores REST
│   │       │       ├── dto/            # Data Transfer Objects
│   │       │       ├── model/          # Entidades JPA
│   │       │       ├── repository/     # Repositorios JPA
│   │       │       ├── security/       # Seguridad y JWT
│   │       │       └── service/        # Lógica de negocio
│   │       └── resources/
│   │           └── application.properties
│   └── pom.xml
├── frontend/                # Aplicación Angular
│   ├── src/
│   │   ├── app/
│   │   │   ├── core/                   # Servicios, guards, interceptors
│   │   │   ├── features/                # Módulos de funcionalidades
│   │   │   │   ├── auth/                # Autenticación
│   │   │   │   ├── dashboard/           # Dashboard
│   │   │   │   ├── teams/               # Grupos de investigación
│   │   │   │   ├── admin/               # Administración
│   │   │   │   └── home/                # Página principal
│   │   │   └── shared/                  # Componentes compartidos
│   │   ├── styles.scss                  # Estilos globales
│   │   └── index.html
│   ├── package.json
│   └── angular.json
└── DB.sql                   # Script de base de datos
```

## 🎨 Paleta de Colores

- **Azul Principal**: `#1291C0`
- **Negro**: `#373435`
- **Blanco**: `#FFFFFF`
- **Dorado**: `#b49739` (accent)
- **Rojo**: `#ED3237` (accent)

## 👥 Roles de Usuario

- **ESTUDIANTE**: Puede consultar grupos, enviar solicitudes y ver estado de vinculación
- **COORDINADOR**: Puede gestionar grupos, proyectos y solicitudes de vinculación
- **ADMINISTRADOR**: Acceso completo al sistema, gestión de usuarios y roles

## 🔐 Autenticación

- Validación de dominio: Solo emails `@udistrital.edu.co`
- Autenticación mediante JWT (JSON Web Tokens)
- Tokens almacenados en localStorage
- Interceptor HTTP para agregar token a todas las peticiones

## 📡 API REST

### Endpoints Principales

- `POST /api/auth/register` - Registro de usuario
- `POST /api/auth/login` - Inicio de sesión
- `GET /api/teams/public` - Listar grupos (público)
- `GET /api/teams/public/{id}` - Detalle de grupo (público)
- `POST /api/applications` - Crear solicitud de vinculación
- `GET /api/applications/my-applications` - Mis solicitudes
- `GET /api/applications/team/{teamId}` - Solicitudes de un grupo
- `PUT /api/applications/{id}/status` - Actualizar estado de solicitud
- `GET /api/users` - Listar usuarios (admin)
- `GET /api/public/project-areas` - Áreas de proyecto (público)

## 🚦 Estado del Proyecto

✅ Backend completo con:
- Autenticación JWT
- CRUD de grupos de investigación
- CRUD de proyectos
- Gestión de solicitudes
- Administración de usuarios

✅ Frontend completo con:
- Autenticación y registro
- Directorio de grupos
- Dashboard por roles
- Gestión de solicitudes
- Panel de administración

## 📝 Notas de Desarrollo

- El backend usa `spring.jpa.hibernate.ddl-auto=update` para desarrollo
- En producción, cambiar a `validate` o `none` y usar migraciones
- El frontend usa interceptors para manejar tokens JWT automáticamente
- Los guards protegen las rutas según roles de usuario

## 🤝 Contribución

Este es un proyecto académico para la Universidad Distrital Francisco José de Caldas.

## 📄 Licencia

Proyecto académico - Universidad Distrital Francisco José de Caldas

