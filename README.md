# Planificación Docente

Aplicación web para la planificación y gestión docente.

- Next.js, React y App Router.
- CoreUI para los componentes y estilos de la interfaz.
- PostgreSQL como base de datos, con Prisma ORM.
- Autenticación propia: contraseñas con `scrypt` y sesiones con JWT firmado (`jose`) en cookie HttpOnly.

## Desarrollo

Requisitos: Node.js y PostgreSQL corriendo en local.

1. Crear la base de datos (una sola vez), por ejemplo con pgAdmin o con psql:

```powershell
& "C:\Program Files\PostgreSQL\17\bin\psql.exe" -U postgres -c "CREATE DATABASE mi_agenda;"
```

2. Copiar `.env.example` como `.env` y completar los valores:

```powershell
copy .env.example .env
```

- `DATABASE_URL`: conexión a la base local, por ejemplo `postgresql://postgres:TU_CLAVE@localhost:5432/mi_agenda`.
- `SESSION_SECRET`: valor aleatorio de al menos 32 caracteres (obligatorio en producción; en desarrollo se usa una clave fija solo para desarrollo si se omite).

3. Instalar dependencias y aplicar las migraciones del esquema:

```powershell
npm install
npm run db:migrate
```

4. (Opcional) Cargar datos de prueba:

```powershell
npm run seed
```

5. Iniciar la aplicación:

```powershell
npm run dev
```

Disponible en http://localhost:3000.

Los archivos `.env`, la base de datos y los artefactos generados no se versionan.

## Datos de prueba (seed)

El script de seed ([scripts/seed.mjs](scripts/seed.mjs)) es idempotente: se puede ejecutar más de una vez sin crear duplicados, y nunca borra ni modifica datos existentes.

### Usuario de prueba que se crea

- Nombre: Juan Pérez
- Email: `docente.prueba@demo.com`
- Contraseña: `Demo12345!`

Es una contraseña de demostración, no un secreto real. Se puede reemplazar definiendo `SEED_TEACHER_PASSWORD` en `.env` antes de ejecutar el seed por primera vez.

### Datos que se crean

Para el docente de prueba se crean 2 cursos, cada uno con 5 alumnos ficticios, asistencias en 3 fechas con los 4 estados, 2 evaluaciones calificadas por alumno, y un mural público con temas, exámenes y avisos (uno publicado y uno sin publicar, para verificar que el mural público solo muestra el publicado):

- **1° A - Matemática** — mural: `demo-1a-matematica`
- **2° B - Matemática** — mural: `demo-2b-matematica`

### Murales públicos

Sin iniciar sesión:

- http://localhost:3000/mural/demo-1a-matematica
- http://localhost:3000/mural/demo-2b-matematica

El código QR de cada mural se ve desde **Mis cursos** → curso → sección **Acceso al mural**.

## Sesiones

La cookie de sesión se llama `mi-agenda-session`, es HttpOnly, `SameSite=Lax`, `Secure` en producción, tiene alcance `/` y dura ocho horas.

## Servicios externos

- Feriados nacionales de Argentina: [ArgentinaDatos API](https://api.argentinadatos.com/v1/feriados).
- Clima: [Open-Meteo](https://open-meteo.com/) (geocodificación y pronóstico).

Ambas son públicas, no requieren API key y se consultan desde el servidor de Next.js.
