import { queryAsCurrentUser } from "../../lib/keystone";
import { GradesView } from "../page-views";

const gradesQuery = `
  query MyGrades {
    cursos {
      id
      nombre
      calificaciones {
        id
        evaluacion
        nota
        observacion
        fecha
        alumno { nombre apellido }
      }
    }
  }
`;

export const metadata = { title: "Calificaciones | Planificación Docente" };

export default async function GradesPage() {
  const data = await queryAsCurrentUser(gradesQuery);
  const courses = data?.cursos || [];
  return <GradesView courses={courses} />;
}