import { cookies } from "next/headers";
import { SignJWT, jwtVerify } from "jose";
import { prisma } from "./db";

export const SESSION_COOKIE = "mi-agenda-session";
export const SESSION_MAX_AGE_SECONDS = 60 * 60 * 8; // 8 horas

const DEV_ONLY_SECRET = "local-development-session-secret-only-do-not-deploy";

function getSecretKey() {
  const secret = process.env.SESSION_SECRET;

  if (!secret) {
    if (process.env.NODE_ENV === "production") {
      throw new Error("SESSION_SECRET debe estar definida en producción.");
    }
    return new TextEncoder().encode(DEV_ONLY_SECRET);
  }

  return new TextEncoder().encode(secret);
}

async function createSessionToken(userId) {
  return new SignJWT({ sub: userId })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(`${SESSION_MAX_AGE_SECONDS}s`)
    .sign(getSecretKey());
}

// Solo usable desde Server Actions o Route Handlers (escribe la cookie).
export async function startSession(userId) {
  const token = await createSessionToken(userId);

  (await cookies()).set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_MAX_AGE_SECONDS,
  });
}

export async function endSession() {
  (await cookies()).delete(SESSION_COOKIE);
}

// Lee y verifica la sesión; devuelve el docente autenticado o null.
export async function getSessionUser() {
  const token = (await cookies()).get(SESSION_COOKIE)?.value;
  if (!token) return null;

  let userId;
  try {
    const { payload } = await jwtVerify(token, getSecretKey());
    userId = payload.sub;
  } catch {
    return null;
  }

  if (!userId) return null;

  try {
    return await prisma.user.findUnique({ where: { id: userId } });
  } catch {
    return null;
  }
}
