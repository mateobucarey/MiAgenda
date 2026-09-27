"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import {
  getLoginPath,
  getKeystoneSessionToken,
  KEYSTONE_SESSION_COOKIE,
  requestKeystone,
} from "../lib/keystone";

const endSessionMutation = "mutation EndSession { endSession }";

export async function logOut() {
  const sessionToken = await getKeystoneSessionToken();

  if (sessionToken) {
    await requestKeystone(endSessionMutation, sessionToken).catch(() => null);
    (await cookies()).delete(KEYSTONE_SESSION_COOKIE);
  }

  redirect(getLoginPath());
}