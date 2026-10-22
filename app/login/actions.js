"use server";

import { redirect } from "next/navigation";
import { prisma } from "../lib/db";
import { verifyPassword } from "../lib/passwords";
import { startSession } from "../lib/auth";

export async function signIn(_previousState, formData) {
  const email = String(formData.get("email") || "").trim().toLowerCase();
  const password = String(formData.get("password") || "");

  if (!email || !password) {
    return { status: "error", message: "Ingresá email y contraseña." };
  }

  try {
    const user = await prisma.user.findUnique({ where: { email } });
    const valid = Boolean(user) && await verifyPassword(password, user.password);

    if (!valid) {
      return { status: "error", message: "Email o contraseña incorrectos." };
    }

    await startSession(user.id);
  } catch {
    return { status: "error", message: "No se pudo iniciar sesión. Volvé a intentarlo." };
  }

  redirect("/dashboard");
}