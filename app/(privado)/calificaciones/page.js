import { redirect } from "next/navigation";
import { getSessionUser } from "../../lib/auth";
import { getCalificacionesDelDocente } from "../../lib/data/calificaciones";
import { GradesView } from "../page-views";

export const metadata = { title: "Calificaciones | Planificación Docente" };

export default async function GradesPage() {
  const user = await getSessionUser();
  if (!user) redirect("/login");

  const courses = await getCalificacionesDelDocente(user.id);
  return <GradesView courses={courses} />;
}