import Link from "next/link";
import { notFound } from "next/navigation";
import { queryAsCurrentUser } from "../../../lib/keystone";
import { CourseView } from "../../page-views";

const courseQuery = `
  query CourseDetails($where: CursoWhereUniqueInput!) {
    curso(where: $where) {
      id
      nombre
      descripcion
      cicloLectivo
      estado
      alumnos { id nombre apellido dni email }
      mural { slug }
    }
  }
`;

export default async function CoursePage({ params }) {
  const { id } = await params;
  const data = await queryAsCurrentUser(courseQuery, { where: { id } });
  const course = data?.curso;

  if (!course) notFound();
  return <CourseView course={course} />;
}