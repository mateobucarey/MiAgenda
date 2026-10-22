import { prisma } from "../db";

// Mural público: no requiere sesión y expone únicamente los campos
// deliberadamente públicos. Nunca incluye datos del docente ni de alumnos.
export async function getMuralPublico(slug) {
  const today = new Date().toISOString().slice(0, 10);

  const mural = await prisma.mural.findUnique({
    where: { slug },
    include: {
      curso: { select: { nombre: true, descripcion: true } },
      temas: {
        orderBy: { orden: "asc" },
        select: { titulo: true, descripcion: true, orden: true },
      },
      examenes: {
        where: { fecha: { gte: today } },
        orderBy: { fecha: "asc" },
        select: { titulo: true, descripcion: true, fecha: true, informacionAdicional: true },
      },
      avisos: {
        where: { publicado: true },
        orderBy: { fecha: "desc" },
        select: { titulo: true, contenido: true, fecha: true },
      },
    },
  });

  if (!mural) return null;

  return {
    slug: mural.slug,
    titulo: mural.titulo,
    descripcion: mural.descripcion,
    informacionGeneral: mural.informacionGeneral,
    cursoNombre: mural.curso?.nombre || mural.titulo,
    cursoDescripcion: mural.curso?.descripcion,
    temas: mural.temas,
    examenes: mural.examenes,
    avisos: mural.avisos,
  };
}
