// Seed de datos de prueba para "Planificacion Docente".
// Uso: npm run seed
//
// Este script usa el contexto de Keystone directamente (sin pasar por HTTP),
// con `context.sudo()` para saltear las reglas de acceso normales (que solo
// permiten crear el primer User cuando no hay ninguno). Es idempotente: antes
// de crear cada registro busca si ya existe uno equivalente y, si lo
// encuentra, lo reutiliza en lugar de duplicarlo. Nunca borra ni modifica
// datos existentes.
//
// Requiere que exista `generated/prisma/client.ts`, generado por Keystone al
// ejecutar `npm run keystone:dev` (o `keystone:build`) al menos una vez.

import 'dotenv/config';
import { getContext } from '@keystone-6/core/context';
import keystoneConfig from '../keystone.js';
import * as PrismaModule from '../generated/prisma/client.ts';

const TEACHER_EMAIL = 'docente.prueba@demo.com';
const TEACHER_PASSWORD = process.env.SEED_TEACHER_PASSWORD || 'Demo12345!';

const TEACHER_DATA = {
  nombre: 'Juan',
  apellido: 'Pérez',
  email: TEACHER_EMAIL,
  password: TEACHER_PASSWORD,
  dni: '20345678',
  telefono: '+54 299 400-1234',
  fechaNacimiento: '1985-03-14',
  direccion: 'Av. Argentina 123, Neuquén Capital',
  institucionEducativa: 'Escuela Normal Superior N.º 1',
  cargoDocente: 'Profesor de Matemática',
  localidad: 'Neuquén Capital',
  provincia: 'Neuquén',
};

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

function track(listKey, wasCreated) {
  const bucket = wasCreated ? summary.created : summary.skipped;
  bucket[listKey] = (bucket[listKey] || 0) + 1;
}

async function ensureByUnique(model, listKey, uniqueWhere, data) {
  const existing = await model.findOne({ where: uniqueWhere });
  if (existing) {
    track(listKey, false);
    return existing;
  }
  const created = await model.createOne({ data });
  track(listKey, true);
  return created;
}

async function ensureByFilter(model, listKey, filterWhere, data) {
  const [existing] = await model.findMany({ where: filterWhere, take: 1 });
  if (existing) {
    track(listKey, false);
    return existing;
  }
  const created = await model.createOne({ data });
  track(listKey, true);
  return created;
}

async function seedTeacher(db) {
  return ensureByUnique(
    db.User,
    'User (docente)',
    { email: TEACHER_EMAIL },
    TEACHER_DATA,
  );
}

async function seedCourse(db, teacherId, courseDef) {
  const curso = await ensureByFilter(
    db.Curso,
    'Curso',
    {
      nombre: { equals: courseDef.nombre },
      cicloLectivo: { equals: courseDef.cicloLectivo },
      docenteResponsable: { id: { equals: teacherId } },
    },
    {
      nombre: courseDef.nombre,
      descripcion: courseDef.descripcion,
      cicloLectivo: courseDef.cicloLectivo,
      estado: 'activo',
      docenteResponsable: { connect: { id: teacherId } },
    },
  );

  const alumnos = [];
  for (const estudiante of courseDef.estudiantes) {
    const alumno = await ensureByUnique(
      db.Alumno,
      'Alumno',
      { dni: estudiante.dni },
      { ...estudiante, curso: { connect: { id: curso.id } } },
    );
    alumnos.push(alumno);
  }

  for (const [dateIndex, fecha] of courseDef.fechasAsistencia.entries()) {
    for (const [studentIndex, alumno] of alumnos.entries()) {
      const estado = ESTADOS_ASISTENCIA[(dateIndex + studentIndex) % ESTADOS_ASISTENCIA.length];
      await ensureByFilter(
        db.Asistencia,
        'Asistencia',
        { alumno: { id: { equals: alumno.id } }, fecha: { equals: fecha } },
        {
          alumno: { connect: { id: alumno.id } },
          curso: { connect: { id: curso.id } },
          fecha,
          estado,
        },
      );
    }
  }

  for (const [evalIndex, evaluacionDef] of EVALUACIONES_DEMO.entries()) {
    for (const [studentIndex, alumno] of alumnos.entries()) {
      const nota = courseDef.notasPorEvaluacion[evalIndex][studentIndex];
      const observacion = nota < 7 ? 'Se recomienda repasar los contenidos de la unidad.' : '';
      await ensureByFilter(
        db.Calificacion,
        'Calificacion',
        {
          alumno: { id: { equals: alumno.id } },
          evaluacion: { equals: evaluacionDef.evaluacion },
          fecha: { equals: evaluacionDef.fecha },
        },
        {
          alumno: { connect: { id: alumno.id } },
          curso: { connect: { id: curso.id } },
          evaluacion: evaluacionDef.evaluacion,
          nota,
          observacion,
          fecha: evaluacionDef.fecha,
        },
      );
    }
  }

  const mural = await ensureByUnique(
    db.Mural,
    'Mural',
    { slug: courseDef.mural.slug },
    {
      slug: courseDef.mural.slug,
      titulo: courseDef.mural.titulo,
      descripcion: courseDef.mural.descripcion,
      informacionGeneral: courseDef.mural.informacionGeneral,
      curso: { connect: { id: curso.id } },
    },
  );

  for (const tema of courseDef.mural.temas) {
    await ensureByFilter(
      db.TemaMural,
      'TemaMural',
      { mural: { id: { equals: mural.id } }, titulo: { equals: tema.titulo } },
      { ...tema, mural: { connect: { id: mural.id } } },
    );
  }

  for (const examen of courseDef.mural.examenes) {
    await ensureByFilter(
      db.ExamenMural,
      'ExamenMural',
      { mural: { id: { equals: mural.id } }, titulo: { equals: examen.titulo } },
      { ...examen, mural: { connect: { id: mural.id } } },
    );
  }

  for (const aviso of courseDef.mural.avisos) {
    await ensureByFilter(
      db.Aviso,
      'Aviso',
      { mural: { id: { equals: mural.id } }, titulo: { equals: aviso.titulo } },
      { ...aviso, mural: { connect: { id: mural.id } } },
    );
  }

  return { curso, mural };
}

async function main() {
  const context = getContext(keystoneConfig, PrismaModule);
  const db = context.sudo().db;

  try {
    const teacher = await seedTeacher(db);

    const results = [];
    for (const courseDef of COURSES_DEMO) {
      results.push(await seedCourse(db, teacher.id, courseDef));
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
    await context.prisma.$disconnect();
  }
}

main().catch((error) => {
  console.error('El seed falló:', error);
  process.exitCode = 1;
});
