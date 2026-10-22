import { notFound, redirect } from "next/navigation";
import { getSessionUser } from "../../../lib/auth";
import { getCursoDelDocente } from "../../../lib/data/cursos";
import { CourseView } from "../../page-views";

export default async function CoursePage({ params }) {
  const user = await getSessionUser();
  if (!user) redirect("/login");

  const { id } = await params;
  const course = await getCursoDelDocente(user.id, id);

  if (!course) notFound();
  return <CourseView course={course} />;
}