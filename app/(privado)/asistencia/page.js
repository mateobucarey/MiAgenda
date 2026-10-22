import { redirect } from "next/navigation";
import { getSessionUser } from "../../lib/auth";
import { getAsistenciasDelDocente } from "../../lib/data/asistencias";
import { AttendanceView } from "../page-views";

export const metadata = { title: "Asistencia | Planificación Docente" };

export default async function AttendancePage() {
  const user = await getSessionUser();
  if (!user) redirect("/login");

  const courses = await getAsistenciasDelDocente(user.id);
  return <AttendanceView courses={courses} />;
}