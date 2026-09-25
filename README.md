# MiAgenda

Aplicacion web para la gestion de un centro educativo.

- Next.js, React y App Router en la raiz del proyecto.
- CoreUI para los componentes y estilos de la interfaz.
- KeystoneJS como CMS y API GraphQL.
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
Los archivos `.env`, la base de datos local y los artefactos generados no se versionan.