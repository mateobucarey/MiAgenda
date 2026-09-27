import { queryAsCurrentUser } from "../../lib/keystone";
import { AttendanceView } from "../page-views";

const attendanceQuery = `
  query MyAttendance {
    cursos {
      id
      nombre
      asistencias {
        id
        fecha
        estado
        alumno { nombre apellido }
      }
    }
  }
`;

export const metadata = { title: "Asistencia | Planificación Docente" };

export default async function AttendancePage() {
  const data = await queryAsCurrentUser(attendanceQuery);
  const courses = data?.cursos || [];
  return <AttendanceView courses={courses} />;
}