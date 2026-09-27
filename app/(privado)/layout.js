import { redirect } from "next/navigation";
import PrivateShell from "./private-shell";
import {
  authenticatedUserQuery,
  getLoginPath,
  getKeystoneSessionToken,
  requestKeystone,
} from "../lib/keystone";

export default async function PrivateLayout({ children }) {
  const sessionToken = await getKeystoneSessionToken();

  if (!sessionToken) redirect(getLoginPath());

  const result = await requestKeystone(authenticatedUserQuery, sessionToken);
  const user = result.data?.authenticatedItem;

  if (!user) redirect(getLoginPath());

  return <PrivateShell user={user}>{children}</PrivateShell>;
}