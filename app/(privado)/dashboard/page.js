import { queryAsCurrentUser } from "../../lib/keystone";
import { getProximosFeriados } from "../../lib/feriados";
import { getClima } from "../../lib/clima";
import { DashboardView } from "../page-views";

const dashboardQuery = `
  query DashboardSummary {
    authenticatedItem {
      localidad
      provincia
    }
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

  const [feriadosResult, climaResult] = await Promise.all([
    getProximosFeriados(),
    getClima({
      localidad: data?.authenticatedItem?.localidad,
      provincia: data?.authenticatedItem?.provincia,
    }),
  ]);

  return (
    <DashboardView
      courses={courses}
      feriados={feriadosResult.feriados}
      feriadosError={feriadosResult.error}
      clima={climaResult.clima}
      climaError={climaResult.error}
    />
  );
}