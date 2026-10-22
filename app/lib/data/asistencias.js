import { prisma } from "../db";

// Solo asistencias de cursos del docente autenticado.
export async function getAsistenciasDelDocente(docenteId) {
  return prisma.curso.findMany({
    where: { docenteResponsableId: docenteId },
    include: {
      asistencias: {
        include: { alumno: { select: { nombre: true, apellido: true } } },
        orderBy: { fecha: "desc" },
      },
    },
    orderBy: { nombre: "asc" },
  });
}
