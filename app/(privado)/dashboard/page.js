import { queryAsCurrentUser } from "../../lib/keystone";
import { DashboardView } from "../page-views";

const dashboardQuery = `
  query DashboardSummary {
    cursos {
      id
      nombre
      cicloLectivo
      estado
      alumnosCount
    }
  }
`;

export const metadata = { title: "Inicio | Planificación Docente" };

export default async function DashboardPage() {
  const data = await queryAsCurrentUser(dashboardQuery);
  const courses = data?.cursos || [];
  return <DashboardView courses={courses} />;
}