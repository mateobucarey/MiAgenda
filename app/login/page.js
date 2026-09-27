import { redirect } from "next/navigation";
import LoginForm from "./login-form";
import {
  authenticatedUserQuery,
  getKeystoneSessionToken,
  requestKeystone,
} from "../lib/keystone";

export const metadata = { title: "Iniciar sesión | Planificación Docente" };

export default async function LoginPage() {
  const sessionToken = await getKeystoneSessionToken();

  if (sessionToken) {
    try {
      const result = await requestKeystone(authenticatedUserQuery, sessionToken);
      if (result.data?.authenticatedItem) redirect("/dashboard");
    } catch (error) {
      if (error?.digest?.startsWith("NEXT_REDIRECT")) throw error;
    }
  }

  return <LoginForm />;
}