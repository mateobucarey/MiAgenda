# Planificacion Docente

Aplicacion web para la planificacion y gestion docente.

- Next.js, React y App Router en la raiz del proyecto.
- CoreUI para los componentes y estilos de la interfaz.
- KeystoneJS como CMS, API GraphQL y autenticacion.
- SQLite para desarrollo local.

## Desarrollo

Instalar dependencias:

```powershell
npm install
```

Iniciar Next.js:

```powershell
npm run dev
```

Disponible en http://localhost:3000.

Iniciar KeystoneJS en otra terminal:

```powershell
npm run keystone:dev
```

El Admin UI de KeystoneJS esta disponible en http://localhost:3001.
La API GraphQL esta disponible en http://localhost:3001/api/graphql.

La base de datos SQLite local se configura mediante `DATABASE_URL` en `.env`.
En produccion tambien es obligatorio definir `SESSION_SECRET` con un valor aleatorio de al menos 32 caracteres. En desarrollo local Keystone usa una clave fija solo para desarrollo si no se define esa variable.
Los archivos `.env`, la base de datos local y los artefactos generados no se versionan.

## Primer docente y prueba de acceso

1. Iniciar Keystone con `npm run keystone:dev`.
2. Mientras no haya usuarios, el Admin UI permite el acceso inicial. Abrir http://localhost:3001 y crear el primer registro de `User` con nombre, apellido, email y contraseña.
3. Cerrar la sesion y volver a ingresar con el email y la contraseña creados. Tambien se puede probar desde una ventana privada del navegador.
4. Una vez creado el primer usuario, el Admin UI exige iniciar sesion. La API GraphQL permite autenticar mediante `authenticateUserWithPassword` en http://localhost:3001/api/graphql.

Como alternativa para no crear el primer usuario a mano, se puede usar el seed de datos de prueba descripto abajo.

## Datos de prueba (seed)

El proyecto incluye un script de seed reproducible ([scripts/seed.mjs](scripts/seed.mjs)) para poder probar la aplicacion apenas se clona el repositorio, sin depender de cargar datos manualmente. El seed es idempotente: se puede ejecutar mas de una vez sin crear duplicados, y nunca borra ni modifica datos existentes.

### 1. Como ejecutar el seed

```powershell
npm install
copy .env.example .env
npm run keystone:dev
```

Esperar a que la terminal muestre `Admin UI ready` (esto sincroniza la base SQLite local y genera el cliente de Prisma). Dejar esa terminal abierta y, en otra terminal, ejecutar:

```powershell
npm run seed
```

El script se conecta directamente a la base local mediante el contexto de Keystone (no necesita que Next.js este corriendo). Al finalizar imprime un resumen de lo creado y lo que ya existia.

### 2. Usuario de prueba que se crea

- Nombre: Juan Perez
- Email: `docente.prueba@demo.com`
- Perfil docente completo (DNI, telefono, fecha de nacimiento, direccion, institucion, cargo, localidad y provincia).

### 3. Contraseña de prueba

`Demo12345!`

Es una contraseña de demostracion, no un secreto real. Se puede reemplazar definiendo `SEED_TEACHER_PASSWORD` en `.env` antes de ejecutar el seed por primera vez (ver [.env.example](.env.example)). Cambiar la contraseña luego de ejecutar el seed no la modifica retroactivamente: hay que actualizarla desde el Admin UI o eliminando el usuario de la base local.

### 4. Cursos y datos que se crean

Para el docente de prueba se crean 2 cursos, cada uno con 5 alumnos ficticios (apellido `Demo` y DNI con prefijo `DEMO...`), asistencias en 3 fechas distintas con los 4 estados (presente, ausente, tarde, justificado), 2 evaluaciones calificadas por alumno, y un mural publico con 3 temas, 2 fechas de examen y 2 avisos (uno publicado y uno sin publicar, para poder verificar que el mural publico solo muestra el publicado):

- **1° A - Matemática** — mural: `demo-1a-matematica`
- **2° B - Matemática** — mural: `demo-2b-matematica`

### 5. Como acceder al mural publico de los cursos de prueba

Sin iniciar sesion, abrir:

- http://localhost:3000/mural/demo-1a-matematica
- http://localhost:3000/mural/demo-2b-matematica

### 6. Como verificar el QR

Iniciar sesion en http://localhost:3000/login con las credenciales de prueba, entrar a **Mis cursos**, abrir uno de los cursos de prueba y revisar la seccion **Acceso al mural**: debe mostrar el codigo QR, la URL publica del mural (la misma que en el punto anterior) y un boton para copiarla.

La cookie de sesion se llama `mi-agenda-session`, tiene alcance `/` y dura ocho horas. Next.js puede reutilizarla en solicitudes al backend Keystone reenviando la cookie desde el servidor; ambos servicios deben usar el mismo hostname. La integracion de autenticacion en las paginas de Next.js queda para una etapa posterior.