import { redirect } from "next/navigation";
import { getSessionUser } from "../../lib/auth";
import { getCursosDelDocente } from "../../lib/data/cursos";
import { getProximosFeriados } from "../../lib/feriados";
import { getClima } from "../../lib/clima";
import { DashboardView } from "../page-views";

export const metadata = { title: "Inicio | Planificación Docente" };

export default async function DashboardPage() {
  const user = await getSessionUser();
  if (!user) redirect("/login");

  const courses = await getCursosDelDocente(user.id);

  const [feriadosResult, climaResult] = await Promise.all([
    getProximosFeriados(),
    getClima({ localidad: user.localidad, provincia: user.provincia }),
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