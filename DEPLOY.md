# Guía de Despliegue en Vercel (Production)

Para obtener un enlace permanente (ej: `nomina-app.vercel.app`), sigue estos pasos.

> [!WARNING]
> **Base de Datos**: Vercel no soporta SQLite (tu base de datos actual) en modo Serverless. Perderás los datos cada vez que la app se "duerma" si no cambiamos a Postgres.
> Esta guía incluye el paso para conectar una base de datos real (Vercel Postgres o Neon).

## Paso 1: Preparar Repositorio (Ya realizado localmente)
El código ya está listo con Git inicializado.

## Paso 2: Crear Repositorio en GitHub
1. Ve a [GitHub.com](https://github.com/new) y crea un nuevo repositorio llamado `nomina-app`.
2. Ejecuta estos comandos en tu terminal (copia y pega):

```bash
git remote add origin https://github.com/TU_USUARIO/nomina-app.git
git branch -M main
git push -u origin main
```
*(Reemplaza `TU_USUARIO` con tu usuario de GitHub)*

## Paso 3: Importar en Vercel
1. Ve a [Vercel.com](https://vercel.com) e inicia sesión.
2. Click en **"Add New..."** -> **"Project"**.
3. Selecciona el repositorio `nomina-app` que acabas de subir.

## Paso 4: Configurar Base de Datos (Postgres)
Antes de darle "Deploy":
1. En la configuración del proyecto en Vercel, ve a la pestaña **Storage**.
2. Click en **"Create"** -> **"Postgres"**.
3. Acepta los términos y crea la base de datos "NominaDB".
4. Una vez creada, ve a **Settings** -> **Environment Variables** y asegúrate que `POSTGRES_PRISMA_URL` y `POSTGRES_URL_NON_POOLING` se hayan agregado automáticamente.

## Paso 5: Ajustar Código para Postgres
Para que Vercel funcione, debemos cambiar `sqlite` por `postgresql` en el archivo `prisma/schema.prisma`.

**Cambio en `prisma/schema.prisma`:**
```prisma
datasource db {
  provider = "postgresql"  // Antes "sqlite"
  url      = env("POSTGRES_PRISMA_URL")
  directUrl = env("POSTGRES_URL_NON_POOLING")
}
```

Después de hacer este cambio:
1. Sube el cambio a GitHub:
   ```bash
   git add .
   git commit -m "Switch to Postgres"
   git push
   ```
2. Vercel detectará el cambio y volverá a desplegar automáticamente.

## Paso 6: Ver tu App
Una vez finalizado, Vercel te dará un dominio (ej: `nomina-app.vercel.app`).
¡Ese es tu enlace permanente!
