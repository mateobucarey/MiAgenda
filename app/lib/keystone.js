import { cookies } from "next/headers";

export const KEYSTONE_SESSION_COOKIE = "mi-agenda-session";

export const authenticatedUserQuery = `
  query CurrentUser {
    authenticatedItem { id nombre apellido email }
  }
`;

export const authenticatedUserProfileQuery = `
  query CurrentUserProfile {
    authenticatedItem {
      id
      nombre
      apellido
      email
      dni
      telefono
      fechaNacimiento
      direccion
      institucionEducativa
      cargoDocente
      localidad
      provincia
    }
  }
`;

const getGraphqlEndpoint = () => process.env.KEYSTONE_GRAPHQL_URL
  || "http://localhost:3001/api/graphql";

export const getLoginPath = () => "/login";

export async function getKeystoneSessionToken() {
  return (await cookies()).get(KEYSTONE_SESSION_COOKIE)?.value;
}

export async function requestKeystone(query, sessionToken, variables = {}) {
  const response = await fetch(getGraphqlEndpoint(), {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(sessionToken && {
        Cookie: `${KEYSTONE_SESSION_COOKIE}=${encodeURIComponent(sessionToken)}`,
      }),
    },
    body: JSON.stringify({ query, variables }),
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error("Keystone no pudo procesar la solicitud.");
  }

  return response.json();
}

export async function queryAsCurrentUser(query, variables = {}) {
  const sessionToken = await getKeystoneSessionToken();

  if (!sessionToken) return null;

  const result = await requestKeystone(query, sessionToken, variables);

  if (result.errors?.length) {
    throw new Error("No se pudieron cargar los datos solicitados.");
  }

  return result.data;
}