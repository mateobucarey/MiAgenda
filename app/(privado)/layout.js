import { redirect } from "next/navigation";
import PrivateShell from "./private-shell";
import { getSessionUser } from "../lib/auth";

export default async function PrivateLayout({ children }) {
  const user = await getSessionUser();

  if (!user) redirect("/login");

  return <PrivateShell user={user}>{children}</PrivateShell>;
}