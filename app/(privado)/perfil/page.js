import { redirect } from "next/navigation";
import ProfileForm from "./profile-form";
import {
  authenticatedUserProfileQuery,
  getLoginPath,
  getKeystoneSessionToken,
  requestKeystone,
} from "../../lib/keystone";

export const metadata = {
  title: "Mi perfil | Planificación Docente",
};

export default async function ProfilePage() {
  const sessionToken = await getKeystoneSessionToken();
  const result = await requestKeystone(authenticatedUserProfileQuery, sessionToken);
  const profile = result.data?.authenticatedItem;

  if (!profile) redirect(getLoginPath());

  return <ProfileForm profile={profile} />;
}