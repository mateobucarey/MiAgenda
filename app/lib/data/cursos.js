import { prisma } from "../db";

// Todas las consultas filtran por docenteResponsableId: un docente solo
// puede ver los cursos de los que es responsable.
const withAlumnosCount = ({ _count, ...curso }) => ({
  ...curso,
  alumnosCount: _count?.alumnos ?? 0,
});

export async function getCursosDelDocente(docenteId) {
  const cursos = await prisma.curso.findMany({
    where: { docenteResponsableId: docenteId },
    include: {
      _count: { select: { alumnos: true } },
      mural: { select: { slug: true } },
    },
    orderBy: { nombre: "asc" },
  });

  return cursos.map(withAlumnosCount);
}

export async function getCursoDelDocente(docenteId, cursoId) {
  return prisma.curso.findFirst({
    where: { id: cursoId, docenteResponsableId: docenteId },
    include: {
      alumnos: { orderBy: [{ apellido: "asc" }, { nombre: "asc" }] },
      mural: { select: { slug: true } },
    },
  });
}
