import { redirect } from "next/navigation";
import ProfileForm from "./profile-form";
import { getSessionUser } from "../../lib/auth";

export const metadata = {
  title: "Mi perfil | Planificación Docente",
};

export default async function ProfilePage() {
  const profile = await getSessionUser();

  if (!profile) redirect("/login");

  return <ProfileForm profile={profile} />;
}