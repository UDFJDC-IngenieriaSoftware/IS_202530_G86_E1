# GitHub Actions Workflows

Este directorio contiene los workflows de GitHub Actions para automatizar tareas de CI/CD.

## Code Quality Check

El workflow `code-quality.yml` evalúa automáticamente la calidad del código en cada push o pull request.

### Características

#### Backend (Node.js)
- ✅ Verificación de sintaxis de archivos JavaScript
- ✅ Validación de `package.json`
- ✅ Auditoría de seguridad (`npm audit`)
- ✅ Verificación de que el servidor puede iniciarse
- ✅ Conteo de archivos JavaScript

#### Frontend (Angular)
- ✅ Linting de TypeScript con Angular CLI
- ✅ Verificación de tipos de TypeScript
- ✅ Compilación de TypeScript
- ✅ Validación de `angular.json`
- ✅ Detección de `console.log` en código de producción
- ✅ Verificación de imports no utilizados

### Parámetros Configurables

El workflow incluye variables de entorno configurables:

```yaml
BACKEND_STRICT_SYNTAX: true      # Verificación estricta de sintaxis
BACKEND_CHECK_SECURITY: true     # Verificación de seguridad
FRONTEND_STRICT_TYPES: true      # Verificación estricta de tipos
FRONTEND_CHECK_CONSOLE: true     # Verificación de console.log
```

### Ejecución Manual

Puedes ejecutar el workflow manualmente desde la pestaña "Actions" de GitHub con las siguientes opciones:

- **skip_backend**: Saltar verificación del backend
- **skip_frontend**: Saltar verificación del frontend
- **strict_mode**: Modo estricto (falla en warnings)

### Branches

El workflow se ejecuta automáticamente en:
- `main`
- `master`
- `develop`

### Reportes

Al finalizar, el workflow genera un reporte de calidad que incluye:
- Estado de cada verificación
- Resumen de errores encontrados
- Recomendaciones de mejora

### Personalización

Para personalizar el workflow:

1. **Cambiar versiones de Node.js/Angular**: Edita las variables `NODE_VERSION` y `ANGULAR_VERSION` en el archivo.

2. **Agregar más verificaciones**: Añade nuevos steps en los jobs correspondientes.

3. **Modificar umbrales**: Ajusta las condiciones de éxito/fallo según tus necesidades.

### Ejemplo de Uso

```bash
# El workflow se ejecuta automáticamente en cada push
git push origin main

# O ejecuta manualmente desde GitHub Actions
# Actions > Code Quality Check > Run workflow
```

### Troubleshooting

Si el workflow falla:

1. Revisa los logs en la pestaña "Actions" de GitHub
2. Verifica que todas las dependencias estén instaladas correctamente
3. Asegúrate de que los archivos de configuración (`package.json`, `angular.json`, `tsconfig.json`) sean válidos
4. En modo estricto, incluso los warnings pueden causar fallos

