# MiAgenda

Arquitectura full-stack separada:

- `frontend/`: Next.js, React y TypeScript con App Router.
- `backend/`: Strapi 5 con SQLite para desarrollo local.

## Desarrollo

Frontend:

```powershell
cd frontend
npm run dev
```

Disponible en http://localhost:3000.

Backend:

```powershell
cd backend
npm run develop
```

Disponible en http://localhost:1337.

Para configurar la URL de Strapi en el frontend, copia `frontend/.env.example` como
`frontend/.env.local`. Los archivos `.env` y las credenciales locales no se versionan.
hola mundo 