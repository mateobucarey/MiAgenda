import { prisma } from "../db";

// Solo calificaciones de cursos del docente autenticado.
export async function getCalificacionesDelDocente(docenteId) {
  return prisma.curso.findMany({
    where: { docenteResponsableId: docenteId },
    include: {
      calificaciones: {
        include: { alumno: { select: { nombre: true, apellido: true } } },
        orderBy: { fecha: "desc" },
      },
    },
    orderBy: { nombre: "asc" },
  });
}
