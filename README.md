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

La cookie de sesion se llama `mi-agenda-session`, tiene alcance `/` y dura ocho horas. Next.js puede reutilizarla en solicitudes al backend Keystone reenviando la cookie desde el servidor; ambos servicios deben usar el mismo hostname. La integracion de autenticacion en las paginas de Next.js queda para una etapa posterior.