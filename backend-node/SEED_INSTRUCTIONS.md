# Instrucciones para Ejecutar el Seed

## Pasos para poblar la base de datos

### 1. Asegúrate de que la base de datos esté creada
Primero, ejecuta el script `DB.sql` para crear todas las tablas:
```bash
psql -U postgres -d investigacion_ud -f ../DB.sql
```

O desde pgAdmin o tu cliente de PostgreSQL preferido.

### 2. Verifica tu archivo .env
Asegúrate de que tu archivo `.env` tenga las credenciales correctas de PostgreSQL:
```
DB_HOST=localhost
DB_PORT=5432
DB_NAME=investigacion_ud
DB_USER=postgres
DB_PASSWORD=postgres
```

### 3. Ejecuta el seed
```bash
npm run seed
```

O directamente:
```bash
node seed.js
```

## ¿Qué hace el seed?

El script inserta datos de ejemplo en todas las tablas:

- **3 Project_area**: Áreas de proyecto (Ingeniería de Sistemas, Industrial, Matemáticas)
- **15 app_user**: 
  - 3 Administradores
  - 3 Coordinadores
  - 9 Estudiantes
- **3 Teacher**: Profesores coordinadores
- **9 Student**: Estudiantes distribuidos en las áreas
- **3 Cordinator**: Coordinadores de equipos
- **9 Investigation_area**: Áreas de investigación
- **3 Investigation_team**: Equipos de investigación
- **9 Investigation_project**: Proyectos de investigación
- **6 Product_type**: Tipos de productos (Artículo, Libro, Software, etc.)
- **12 Product**: Productos de investigación
- **24 Product_student**: Relaciones entre productos y estudiantes
- **12 Product_teacher**: Relaciones entre productos y profesores
- **6 Application**: Aplicaciones de estudiantes a equipos

## Credenciales de prueba

Todas las contraseñas son: `password123`

**Administradores:**
- admin1@udistrital.edu.co
- admin2@udistrital.edu.co
- admin3@udistrital.edu.co

**Coordinadores:**
- coord1@udistrital.edu.co
- coord2@udistrital.edu.co
- coord3@udistrital.edu.co

**Estudiantes:**
- estudiante1@udistrital.edu.co
- estudiante2@udistrital.edu.co
- estudiante3@udistrital.edu.co
- estudiante4@udistrital.edu.co
- estudiante5@udistrital.edu.co
- estudiante6@udistrital.edu.co
- estudiante7@udistrital.edu.co
- estudiante8@udistrital.edu.co
- estudiante9@udistrital.edu.co

## Notas

- El script usa `ON CONFLICT DO NOTHING` para evitar errores si ejecutas el seed múltiples veces
- Las contraseñas están hasheadas con bcrypt
- Los datos están relacionados correctamente respetando las foreign keys
- Puedes ejecutar el seed múltiples veces sin problemas

