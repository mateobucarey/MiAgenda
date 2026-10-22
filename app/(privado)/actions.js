"use server";

import { redirect } from "next/navigation";
import { endSession } from "../lib/auth";

export async function logOut() {
  await endSession();
  redirect("/login");
}