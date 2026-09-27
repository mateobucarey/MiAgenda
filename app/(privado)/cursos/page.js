import { queryAsCurrentUser } from "../../lib/keystone";
import { CoursesView } from "../page-views";

const coursesQuery = `
  query MyCourses {
    cursos {
      id
      nombre
      descripcion
      cicloLectivo
      estado
      alumnosCount
      mural { slug }
    }
  }
`;

export const metadata = { title: "Mis cursos | Planificación Docente" };

export default async function CoursesPage() {
  const data = await queryAsCurrentUser(coursesQuery);
  const courses = data?.cursos || [];
  return <CoursesView courses={courses} />;
}