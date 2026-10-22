// Seed de datos de prueba para "Planificacion Docente".
// Uso: npm run seed
//
// Este script usa Prisma directamente contra la base PostgreSQL configurada
// en DATABASE_URL. Es idempotente: antes de crear cada registro busca si ya
// existe uno equivalente y, si lo encuentra, lo reutiliza en lugar de
// duplicarlo. Nunca borra ni modifica datos existentes.
//
// Requiere haber aplicado las migraciones: npx prisma migrate dev

import 'dotenv/config';
import { prisma } from '../app/lib/db.js';
import { hashPassword } from '../app/lib/passwords.js';

const TEACHER_EMAIL = 'docente.prueba@demo.com';
const TEACHER_PASSWORD = process.env.SEED_TEACHER_PASSWORD || 'Demo12345!';

const EVALUACIONES_DEMO = [
  { evaluacion: 'Trabajo práctico 1 (demo)', fecha: '2026-04-06' },
  { evaluacion: 'Parcial 1 (demo)', fecha: '2026-05-22' },
];

const COURSES_DEMO = [
  {
    nombre: '1° A - Matemática',
    descripcion: 'Curso de prueba (datos demo) — 1er año, división A, turno mañana.',
    cicloLectivo: 2026,
    estudiantes: [
      { nombre: 'Ana', apellido: 'Demo', dni: 'DEMO1A01', email: 'ana.demo@demo.com' },
      { nombre: 'Bruno', apellido: 'Demo', dni: 'DEMO1A02', email: 'bruno.demo@demo.com' },
      { nombre: 'Camila', apellido: 'Demo', dni: 'DEMO1A03', email: 'camila.demo@demo.com' },
      { nombre: 'Diego', apellido: 'Demo', dni: 'DEMO1A04', email: 'diego.demo@demo.com' },
      { nombre: 'Elena', apellido: 'Demo', dni: 'DEMO1A05', email: 'elena.demo@demo.com' },
    ],
    fechasAsistencia: ['2026-03-10', '2026-03-17', '2026-03-24'],
    notasPorEvaluacion: [[8, 6, 9, 5, 7], [7, 9, 6, 8, 5]],
    mural: {
      slug: 'demo-1a-matematica',
      titulo: 'Mural 1° A - Matemática (demo)',
      descripcion: 'Espacio público de prueba para el curso 1° A - Matemática.',
      informacionGeneral: 'Clases los lunes, miércoles y viernes de 8 a 12hs. Material disponible en la fotocopiadora del turno mañana.',
      temas: [
        { titulo: 'Unidad 1: Números enteros', descripcion: 'Operaciones y propiedades.', orden: 1 },
        { titulo: 'Unidad 2: Ecuaciones lineales', descripcion: 'Resolución de ecuaciones de primer grado.', orden: 2 },
        { titulo: 'Unidad 3: Geometría plana', descripcion: 'Perímetro, área y figuras básicas.', orden: 3 },
      ],
      examenes: [
        { titulo: 'Primer parcial (demo)', descripcion: 'Unidades 1 y 2.', fecha: '2026-10-15', informacionAdicional: 'Traer calculadora y regla.' },
        { titulo: 'Trabajo práctico integrador (demo)', descripcion: 'Entrega en grupos de hasta 3 alumnos.', fecha: '2026-11-05', informacionAdicional: '' },
      ],
      avisos: [
        { titulo: 'Bienvenida al ciclo lectivo 2026 (demo)', contenido: 'Bienvenidos al curso. Cualquier consulta, escribir al docente.', fecha: '2026-03-01', publicado: true },
        { titulo: 'Borrador reunión de padres (demo, no publicado)', contenido: 'Reunión tentativa, aún no confirmada.', fecha: '2026-09-20', publicado: false },
      ],
    },
  },
  {
    nombre: '2° B - Matemática',
    descripcion: 'Curso de prueba (datos demo) — 2do año, división B, turno tarde.',
    cicloLectivo: 2026,
    estudiantes: [
      { nombre: 'Franco', apellido: 'Demo', dni: 'DEMO2B01', email: 'franco.demo@demo.com' },
      { nombre: 'Gimena', apellido: 'Demo', dni: 'DEMO2B02', email: 'gimena.demo@demo.com' },
      { nombre: 'Hugo', apellido: 'Demo', dni: 'DEMO2B03', email: 'hugo.demo@demo.com' },
      { nombre: 'Iara', apellido: 'Demo', dni: 'DEMO2B04', email: 'iara.demo@demo.com' },
      { nombre: 'Joaquín', apellido: 'Demo', dni: 'DEMO2B05', email: 'joaquin.demo@demo.com' },
    ],
    fechasAsistencia: ['2026-03-11', '2026-03-18', '2026-03-25'],
    notasPorEvaluacion: [[9, 7, 5, 8, 6], [6, 8, 9, 5, 7]],
    mural: {
      slug: 'demo-2b-matematica',
      titulo: 'Mural 2° B - Matemática (demo)',
      descripcion: 'Espacio público de prueba para el curso 2° B - Matemática.',
      informacionGeneral: 'Clases los martes y jueves de 14 a 18hs. Consultas por mensajería institucional.',
      temas: [
        { titulo: 'Unidad 1: Funciones lineales', descripcion: 'Pendiente, ordenada al origen y gráficos.', orden: 1 },
        { titulo: 'Unidad 2: Sistemas de ecuaciones', descripcion: 'Métodos de resolución.', orden: 2 },
        { titulo: 'Unidad 3: Estadística básica', descripcion: 'Medidas de tendencia central.', orden: 3 },
      ],
      examenes: [
        { titulo: 'Primer parcial (demo)', descripcion: 'Unidades 1 y 2.', fecha: '2026-10-20', informacionAdicional: 'Examen a libro abierto.' },
        { titulo: 'Coloquio integrador (demo)', descripcion: 'Defensa oral individual.', fecha: '2026-11-10', informacionAdicional: '' },
      ],
      avisos: [
        { titulo: 'Bienvenida al ciclo lectivo 2026 (demo)', contenido: 'Bienvenidos al curso. El material se comparte por mensajería institucional.', fecha: '2026-03-01', publicado: true },
        { titulo: 'Borrador cambio de horario (demo, no publicado)', contenido: 'Posible cambio de horario en evaluación, a confirmar.', fecha: '2026-09-22', publicado: false },
      ],
    },
  },
];

const ESTADOS_ASISTENCIA = ['presente', 'ausente', 'tarde', 'justificado'];

const summary = { created: {}, skipped: {} };

function track(label, wasCreated) {
  const bucket = wasCreated ? summary.created : summary.skipped;
  bucket[label] = (bucket[label] || 0) + 1;
}

async function seedTeacher() {
  const existing = await prisma.user.findUnique({ where: { email: TEACHER_EMAIL } });
  if (existing) {
    track('User (docente)', false);
    return existing;
  }

  const created = await prisma.user.create({
    data: {
      nombre: 'Juan',
      apellido: 'Pérez',
      email: TEACHER_EMAIL,
      password: await hashPassword(TEACHER_PASSWORD),
      dni: '20345678',
      telefono: '+54 299 400-1234',
      fechaNacimiento: '1985-03-14',
      direccion: 'Av. Argentina 123, Neuquén Capital',
      institucionEducativa: 'Escuela Normal Superior N.º 1',
      cargoDocente: 'Profesor de Matemática',
      localidad: 'Neuquén Capital',
      provincia: 'Neuquén',
    },
  });
  track('User (docente)', true);
  return created;
}

async function seedCourse(teacherId, courseDef) {
  let curso = await prisma.curso.findFirst({
    where: {
      nombre: courseDef.nombre,
      cicloLectivo: courseDef.cicloLectivo,
      docenteResponsableId: teacherId,
    },
  });

  if (curso) {
    track('Curso', false);
  } else {
    curso = await prisma.curso.create({
      data: {
        nombre: courseDef.nombre,
        descripcion: courseDef.descripcion,
        cicloLectivo: courseDef.cicloLectivo,
        estado: 'activo',
        docenteResponsable: { connect: { id: teacherId } },
      },
    });
    track('Curso', true);
  }

  const alumnos = [];
  for (const estudiante of courseDef.estudiantes) {
    let alumno = await prisma.alumno.findUnique({ where: { dni: estudiante.dni } });
    if (alumno) {
      track('Alumno', false);
    } else {
      alumno = await prisma.alumno.create({
        data: { ...estudiante, curso: { connect: { id: curso.id } } },
      });
      track('Alumno', true);
    }
    alumnos.push(alumno);
  }

  for (const [dateIndex, fecha] of courseDef.fechasAsistencia.entries()) {
    for (const [studentIndex, alumno] of alumnos.entries()) {
      const estado = ESTADOS_ASISTENCIA[(dateIndex + studentIndex) % ESTADOS_ASISTENCIA.length];
      const existing = await prisma.asistencia.findFirst({
        where: { alumnoId: alumno.id, fecha },
      });
      if (existing) {
        track('Asistencia', false);
      } else {
        await prisma.asistencia.create({
          data: {
            alumno: { connect: { id: alumno.id } },
            curso: { connect: { id: curso.id } },
            fecha,
            estado,
          },
        });
        track('Asistencia', true);
      }
    }
  }

  for (const [evalIndex, evaluacionDef] of EVALUACIONES_DEMO.entries()) {
    for (const [studentIndex, alumno] of alumnos.entries()) {
      const nota = courseDef.notasPorEvaluacion[evalIndex][studentIndex];
      const observacion = nota < 7 ? 'Se recomienda repasar los contenidos de la unidad.' : '';
      const existing = await prisma.calificacion.findFirst({
        where: {
          alumnoId: alumno.id,
          evaluacion: evaluacionDef.evaluacion,
          fecha: evaluacionDef.fecha,
        },
      });
      if (existing) {
        track('Calificacion', false);
      } else {
        await prisma.calificacion.create({
          data: {
            alumno: { connect: { id: alumno.id } },
            curso: { connect: { id: curso.id } },
            evaluacion: evaluacionDef.evaluacion,
            nota,
            observacion,
            fecha: evaluacionDef.fecha,
          },
        });
        track('Calificacion', true);
      }
    }
  }

  let mural = await prisma.mural.findUnique({ where: { slug: courseDef.mural.slug } });
  if (mural) {
    track('Mural', false);
  } else {
    // Conectar el curso desde el mural actualiza la FK 1:1 en Curso.
    mural = await prisma.mural.create({
      data: {
        slug: courseDef.mural.slug,
        titulo: courseDef.mural.titulo,
        descripcion: courseDef.mural.descripcion,
        informacionGeneral: courseDef.mural.informacionGeneral,
        curso: { connect: { id: curso.id } },
      },
    });
    track('Mural', true);
  }

  for (const tema of courseDef.mural.temas) {
    const existing = await prisma.temaMural.findFirst({
      where: { muralId: mural.id, titulo: tema.titulo },
    });
    if (existing) {
      track('TemaMural', false);
    } else {
      await prisma.temaMural.create({
        data: { ...tema, mural: { connect: { id: mural.id } } },
      });
      track('TemaMural', true);
    }
  }

  for (const examen of courseDef.mural.examenes) {
    const existing = await prisma.examenMural.findFirst({
      where: { muralId: mural.id, titulo: examen.titulo },
    });
    if (existing) {
      track('ExamenMural', false);
    } else {
      await prisma.examenMural.create({
        data: { ...examen, mural: { connect: { id: mural.id } } },
      });
      track('ExamenMural', true);
    }
  }

  for (const aviso of courseDef.mural.avisos) {
    const existing = await prisma.aviso.findFirst({
      where: { muralId: mural.id, titulo: aviso.titulo },
    });
    if (existing) {
      track('Aviso', false);
    } else {
      await prisma.aviso.create({
        data: { ...aviso, mural: { connect: { id: mural.id } } },
      });
      track('Aviso', true);
    }
  }

  return { curso, mural };
}

async function main() {
  try {
    const teacher = await seedTeacher();

    const results = [];
    for (const courseDef of COURSES_DEMO) {
      results.push(await seedCourse(teacher.id, courseDef));
    }

    console.log('\nSeed de datos de prueba completado.\n');
    console.log('Creados:', summary.created);
    console.log('Ya existían:', summary.skipped);
    console.log('\nDocente de prueba:');
    console.log(`  Email:      ${TEACHER_EMAIL}`);
    console.log(`  Contraseña: ${TEACHER_PASSWORD}`);
    console.log('\nMurales públicos:');
    for (const { mural } of results) {
      console.log(`  http://localhost:3000/mural/${mural.slug}`);
    }
  } finally {
    await prisma.$disconnect();
  }
}

main().catch((error) => {
  console.error('El seed falló:', error);
  process.exitCode = 1;
});
