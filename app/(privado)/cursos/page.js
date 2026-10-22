import { redirect } from "next/navigation";
import { getSessionUser } from "../../lib/auth";
import { getCursosDelDocente } from "../../lib/data/cursos";
import { CoursesView } from "../page-views";

export const metadata = { title: "Mis cursos | Planificación Docente" };

export default async function CoursesPage() {
  const user = await getSessionUser();
  if (!user) redirect("/login");

  const courses = await getCursosDelDocente(user.id);
  return <CoursesView courses={courses} />;
}