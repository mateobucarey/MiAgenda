import { redirect } from "next/navigation";
import LoginForm from "./login-form";
import { getSessionUser } from "../lib/auth";

export const metadata = { title: "Iniciar sesión | Planificación Docente" };

export default async function LoginPage() {
  const user = await getSessionUser();

  if (user) redirect("/dashboard");

  return <LoginForm />;
}