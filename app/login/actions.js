"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import {
  KEYSTONE_SESSION_COOKIE,
  requestKeystone,
} from "../lib/keystone";

const authenticateMutation = `
  mutation SignIn($email: String!, $password: String!) {
    authenticateUserWithPassword(email: $email, password: $password) {
      ... on UserAuthenticationWithPasswordSuccess { sessionToken }
      ... on UserAuthenticationWithPasswordFailure { message }
    }
  }
`;

export async function signIn(_previousState, formData) {
  const email = String(formData.get("email") || "").trim();
  const password = String(formData.get("password") || "");

  if (!email || !password) {
    return { status: "error", message: "Ingresá email y contraseña." };
  }

  let sessionToken;

  try {
    const result = await requestKeystone(authenticateMutation, undefined, { email, password });
    sessionToken = result.data?.authenticateUserWithPassword?.sessionToken;
  } catch {
    return { status: "error", message: "No se pudo iniciar sesión. Volvé a intentarlo." };
  }

  if (!sessionToken) {
    return { status: "error", message: "Email o contraseña incorrectos." };
  }

  (await cookies()).set(KEYSTONE_SESSION_COOKIE, sessionToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 8,
  });

  redirect("/dashboard");
}