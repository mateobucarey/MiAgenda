import 'dotenv/config';
import { config, g, list } from '@keystone-6/core';
import {
  calendarDay,
  checkbox,
  float,
  integer,
  password,
  relationship,
  select,
  text,
} from '@keystone-6/core/fields';
import { statelessSessions } from '@keystone-6/core/session';
import { createAuth } from '@keystone-6/auth';
import { PrismaBetterSqlite3 } from '@prisma/adapter-better-sqlite3';

const PublicMuralTopic = g.object()({
  name: 'PublicMuralTopic',
  fields: {
    titulo: g.field({ type: g.nonNull(g.String) }),
    descripcion: g.field({ type: g.String }),
    orden: g.field({ type: g.nonNull(g.Int) }),
  },
});

const PublicMuralExam = g.object()({
  name: 'PublicMuralExam',
  fields: {
    titulo: g.field({ type: g.nonNull(g.String) }),
    descripcion: g.field({ type: g.String }),
    fecha: g.field({ type: g.nonNull(g.String) }),
    informacionAdicional: g.field({ type: g.String }),
  },
});

const PublicMuralNotice = g.object()({
  name: 'PublicMuralNotice',
  fields: {
    titulo: g.field({ type: g.nonNull(g.String) }),
    contenido: g.field({ type: g.nonNull(g.String) }),
    fecha: g.field({ type: g.nonNull(g.String) }),
  },
});

const PublicMural = g.object()({
  name: 'PublicMural',
  fields: {
    slug: g.field({ type: g.nonNull(g.String) }),
    titulo: g.field({ type: g.nonNull(g.String) }),
    descripcion: g.field({ type: g.String }),
    informacionGeneral: g.field({ type: g.String }),
    cursoNombre: g.field({ type: g.nonNull(g.String) }),
    cursoDescripcion: g.field({ type: g.String }),
    temas: g.field({ type: g.list(g.nonNull(PublicMuralTopic)) }),
    examenes: g.field({ type: g.list(g.nonNull(PublicMuralExam)) }),
    avisos: g.field({ type: g.list(g.nonNull(PublicMuralNotice)) }),
  },
});

const sessionSecret = process.env.SESSION_SECRET;

if (process.env.NODE_ENV === 'production' && !sessionSecret) {
  throw new Error('SESSION_SECRET must be set in production.');
}

const session = statelessSessions({
  secret: sessionSecret || 'local-development-session-secret-only-do-not-deploy',
  cookieName: 'mi-agenda-session',
  maxAge: 60 * 60 * 8,
});

const isSignedIn = ({ session }) => Boolean(session?.data?.id);

const onlyOwnUser = ({ session }) => session?.data?.id
  ? { id: { equals: session.data.id } }
  : false;

const onlyOwnCourses = ({ session }) => session?.data?.id
  ? { docenteResponsable: { id: { equals: session.data.id } } }
  : false;

const onlyOwnStudents = ({ session }) => session?.data?.id
  ? { curso: { docenteResponsable: { id: { equals: session.data.id } } } }
  : false;

const onlyOwnMural = ({ session }) => session?.data?.id
  ? { curso: { docenteResponsable: { id: { equals: session.data.id } } } }
  : false;

const onlyOwnMuralContent = ({ session }) => session?.data?.id
  ? { mural: { curso: { docenteResponsable: { id: { equals: session.data.id } } } } }
  : false;

const onlyOwnCourseRecords = ({ session }) => session?.data?.id
  ? { curso: { docenteResponsable: { id: { equals: session.data.id } } } }
  : false;

const getConnectedId = (relationshipInput) => relationshipInput?.connect?.id;

const ownsCourse = async ({ session, context, courseId }) => {
  if (!session?.data?.id || !courseId) return false;

  const course = await context.sudo().query.Curso.findOne({
    where: { id: courseId },
    query: 'id docenteResponsable { id }',
  });

  return course?.docenteResponsable?.id === session.data.id;
};

const canCreateCourse = ({ session, inputData }) => Boolean(session?.data?.id)
  && getConnectedId(inputData.docenteResponsable) === session.data.id
  && inputData.mural === undefined;

const canUpdateCourse = async ({ session, context, item, inputData }) => {
  if (!session?.data?.id) return false;
  if (inputData.mural !== undefined) return false;

  if (inputData.docenteResponsable !== undefined
    && getConnectedId(inputData.docenteResponsable) !== session.data.id) {
    return false;
  }

  return ownsCourse({ session, context, courseId: item.id });
};

const ownsMural = async ({ session, context, muralId }) => {
  if (!session?.data?.id || !muralId) return false;

  const mural = await context.sudo().query.Mural.findOne({
    where: { id: muralId },
    query: 'id curso { id }',
  });

  return ownsCourse({ session, context, courseId: mural?.curso?.id });
};

const canCreateMural = async ({ session, context, inputData }) => {
  if (inputData.temas !== undefined
    || inputData.examenes !== undefined
    || inputData.avisos !== undefined) {
    return false;
  }

  return ownsCourse({
    session,
    context,
    courseId: getConnectedId(inputData.curso),
  });
};

const canUpdateMural = async ({ session, context, item, inputData }) => {
  if (!session?.data?.id
    || inputData.temas !== undefined
    || inputData.examenes !== undefined
    || inputData.avisos !== undefined
    || !await ownsMural({ session, context, muralId: item.id })) {
    return false;
  }

  if (inputData.curso !== undefined) {
    return ownsCourse({
      session,
      context,
      courseId: getConnectedId(inputData.curso),
    });
  }

  return true;
};

const canCreateMuralContent = async ({ session, context, inputData }) =>
  ownsMural({
    session,
    context,
    muralId: getConnectedId(inputData.mural),
  });

const canUpdateMuralContent = async ({ session, context, item, inputData, listKey }) => {
  if (!session?.data?.id) return false;

  const content = await context.sudo().query[listKey].findOne({
    where: { id: item.id },
    query: 'id mural { id }',
  });

  if (!await ownsMural({
    session,
    context,
    muralId: content?.mural?.id,
  })) {
    return false;
  }

  if (inputData.mural !== undefined) {
    return ownsMural({
      session,
      context,
      muralId: getConnectedId(inputData.mural),
    });
  }

  return true;
};

const publicMuralBySlug = async (_source, { slug }, context) => {
  const mural = await context.sudo().query.Mural.findOne({
    where: { slug },
    query: `
      slug
      titulo
      descripcion
      informacionGeneral
      curso { nombre descripcion }
      temas(orderBy: { orden: asc }) { titulo descripcion orden }
      examenes(orderBy: { fecha: asc }) { titulo descripcion fecha informacionAdicional }
      avisos(where: { publicado: { equals: true } }, orderBy: { fecha: desc }) {
        titulo contenido fecha
      }
    `,
  });

  if (!mural) return null;

  const today = new Date().toISOString().slice(0, 10);

  return {
    slug: mural.slug,
    titulo: mural.titulo,
    descripcion: mural.descripcion,
    informacionGeneral: mural.informacionGeneral,
    cursoNombre: mural.curso?.nombre || mural.titulo,
    cursoDescripcion: mural.curso?.descripcion,
    temas: mural.temas,
    examenes: mural.examenes.filter((exam) => exam.fecha >= today),
    avisos: mural.avisos,
  };
};

const canCreateStudent = async ({ session, context, inputData }) => ownsCourse({
  session,
  context,
  courseId: getConnectedId(inputData.curso),
});

const canUpdateStudent = async ({ session, context, item, inputData }) => {
  if (!session?.data?.id) return false;

  const student = await context.sudo().query.Alumno.findOne({
    where: { id: item.id },
    query: 'id curso { id }',
  });

  if (!await ownsCourse({
    session,
    context,
    courseId: student?.curso?.id,
  })) {
    return false;
  }

  if (inputData.curso !== undefined) {
    return ownsCourse({
      session,
      context,
      courseId: getConnectedId(inputData.curso),
    });
  }

  return true;
};

const studentBelongsToOwnedCourse = async ({ session, context, studentId, courseId }) => {
  if (!session?.data?.id || !studentId || !courseId) return false;
  if (!await ownsCourse({ session, context, courseId })) return false;

  const student = await context.sudo().query.Alumno.findOne({
    where: { id: studentId },
    query: 'id curso { id }',
  });

  return student?.curso?.id === courseId;
};

const canCreateCourseStudentRecord = async ({ session, context, inputData }) =>
  studentBelongsToOwnedCourse({
    session,
    context,
    studentId: getConnectedId(inputData.alumno),
    courseId: getConnectedId(inputData.curso),
  });

const canUpdateCourseStudentRecord = async ({ session, context, item, inputData, listKey }) => {
  if (!session?.data?.id) return false;

  const record = await context.sudo().query[listKey].findOne({
    where: { id: item.id },
    query: 'id alumno { id } curso { id }',
  });

  if (!record || !await studentBelongsToOwnedCourse({
    session,
    context,
    studentId: record.alumno?.id,
    courseId: record.curso?.id,
  })) {
    return false;
  }

  const studentId = inputData.alumno === undefined
    ? record.alumno?.id
    : getConnectedId(inputData.alumno);
  const courseId = inputData.curso === undefined
    ? record.curso?.id
    : getConnectedId(inputData.curso);

  return studentBelongsToOwnedCourse({ session, context, studentId, courseId });
};

const hasDuplicateAttendance = async ({ context, studentId, date, excludeId }) => {
  if (!studentId || !date) return false;

  const records = await context.sudo().query.Asistencia.findMany({
    where: {
      alumno: { id: { equals: studentId } },
      fecha: { equals: date },
    },
  });

  return records.some((record) => record.id !== excludeId);
};

const canCreateAttendance = async ({ session, context, inputData }) => {
  const studentId = getConnectedId(inputData.alumno);
  const courseId = getConnectedId(inputData.curso);

  if (!await studentBelongsToOwnedCourse({ session, context, studentId, courseId })) {
    return false;
  }

  return !await hasDuplicateAttendance({
    context,
    studentId,
    date: inputData.fecha,
  });
};

const canUpdateAttendance = async ({ session, context, item, inputData }) => {
  if (!await canUpdateCourseStudentRecord({
    session,
    context,
    item,
    inputData,
    listKey: 'Asistencia',
  })) {
    return false;
  }

  const record = await context.sudo().query.Asistencia.findOne({
    where: { id: item.id },
    query: 'id fecha alumno { id }',
  });
  const studentId = inputData.alumno === undefined
    ? record?.alumno?.id
    : getConnectedId(inputData.alumno);
  const date = inputData.fecha === undefined ? record?.fecha : inputData.fecha;

  return !await hasDuplicateAttendance({
    context,
    studentId,
    date,
    excludeId: item.id,
  });
};

const canUpdateGrade = (args) => canUpdateCourseStudentRecord({
  ...args,
  listKey: 'Calificacion',
});

const canCreateFirstUser = async ({ session, context }) => {
  if (session) return false;
  return (await context.sudo().db.User.count()) === 0;
};

const { withAuth } = createAuth({
  listKey: 'User',
  identityField: 'email',
  secretField: 'password',
  sessionData: 'id nombre apellido email',
});

export default withAuth(config({
  db: {
    provider: 'sqlite',
    prismaClientOptions: () => ({
      adapter: new PrismaBetterSqlite3({ url: process.env.DATABASE_URL }),
    }),
  },
  lists: {
    KeystoneSystem: list({
      access: () => false,
      fields: {
        systemKey: text({ validation: { isRequired: true } }),
      },
    }),
    User: list({
      access: {
        operation: {
          query: isSignedIn,
          create: canCreateFirstUser,
          update: isSignedIn,
          delete: () => false,
        },
        filter: {
          query: onlyOwnUser,
          update: onlyOwnUser,
        },
        item: {
          update: ({ session, item, inputData }) => session?.data?.id === item.id
            && inputData.cursos === undefined
            && inputData.email === undefined
            && inputData.password === undefined,
        },
      },
      fields: {
        nombre: text({ validation: { isRequired: true } }),
        apellido: text({ validation: { isRequired: true } }),
        email: text({
          validation: { isRequired: true },
          isIndexed: 'unique',
        }),
        password: password({ validation: { isRequired: true } }),
        dni: text({
          validation: {
            match: {
              regex: /^$|^[0-9]{7,8}$/,
              explanation: 'Ingresá 7 u 8 dígitos, sin puntos.',
            },
          },
        }),
        telefono: text(),
        fechaNacimiento: calendarDay(),
        direccion: text({ ui: { displayMode: 'textarea' } }),
        institucionEducativa: text(),
        cargoDocente: text(),
        localidad: text(),
        provincia: text(),
        cursos: relationship({ ref: 'Curso.docenteResponsable', many: true }),
      },
    }),
    Curso: list({
      access: {
        operation: {
          query: isSignedIn,
          create: isSignedIn,
          update: isSignedIn,
          delete: isSignedIn,
        },
        filter: {
          query: onlyOwnCourses,
          update: onlyOwnCourses,
          delete: onlyOwnCourses,
        },
        item: {
          create: canCreateCourse,
          update: canUpdateCourse,
        },
      },
      fields: {
        nombre: text({ validation: { isRequired: true } }),
        descripcion: text({ ui: { displayMode: 'textarea' } }),
        cicloLectivo: integer({ validation: { isRequired: true } }),
        docenteResponsable: relationship({
          ref: 'User.cursos',
          validation: { isRequired: true },
        }),
        estado: select({
          type: 'string',
          defaultValue: 'activo',
          options: [
            { label: 'Activo', value: 'activo' },
            { label: 'Finalizado', value: 'finalizado' },
          ],
        }),
        alumnos: relationship({ ref: 'Alumno.curso', many: true }),
        asistencias: relationship({ ref: 'Asistencia.curso', many: true }),
        calificaciones: relationship({ ref: 'Calificacion.curso', many: true }),
        mural: relationship({ ref: 'Mural.curso' }),
      },
    }),
    Alumno: list({
      access: {
        operation: {
          query: isSignedIn,
          create: isSignedIn,
          update: isSignedIn,
          delete: isSignedIn,
        },
        filter: {
          query: onlyOwnStudents,
          update: onlyOwnStudents,
          delete: onlyOwnStudents,
        },
        item: {
          create: canCreateStudent,
          update: canUpdateStudent,
        },
      },
      fields: {
        nombre: text({ validation: { isRequired: true } }),
        apellido: text({ validation: { isRequired: true } }),
        dni: text({
          validation: { isRequired: true },
          isIndexed: 'unique',
        }),
        email: text(),
        curso: relationship({
          ref: 'Curso.alumnos',
          validation: { isRequired: true },
        }),
        asistencias: relationship({ ref: 'Asistencia.alumno', many: true }),
        calificaciones: relationship({ ref: 'Calificacion.alumno', many: true }),
      },
    }),
    Mural: list({
      access: {
        operation: {
          query: isSignedIn,
          create: isSignedIn,
          update: isSignedIn,
          delete: isSignedIn,
        },
        filter: {
          query: onlyOwnMural,
          update: onlyOwnMural,
          delete: onlyOwnMural,
        },
        item: {
          create: canCreateMural,
          update: canUpdateMural,
        },
      },
      fields: {
        slug: text({
          validation: { isRequired: true },
          isIndexed: 'unique',
        }),
        titulo: text({ validation: { isRequired: true } }),
        descripcion: text({ ui: { displayMode: 'textarea' } }),
        informacionGeneral: text({ ui: { displayMode: 'textarea' } }),
        curso: relationship({
          ref: 'Curso.mural',
          validation: { isRequired: true },
        }),
        temas: relationship({ ref: 'TemaMural.mural', many: true }),
        examenes: relationship({ ref: 'ExamenMural.mural', many: true }),
        avisos: relationship({ ref: 'Aviso.mural', many: true }),
      },
    }),
    TemaMural: list({
      access: {
        operation: {
          query: isSignedIn,
          create: isSignedIn,
          update: isSignedIn,
          delete: isSignedIn,
        },
        filter: {
          query: onlyOwnMuralContent,
          update: onlyOwnMuralContent,
          delete: onlyOwnMuralContent,
        },
        item: {
          create: canCreateMuralContent,
          update: (args) => canUpdateMuralContent({ ...args, listKey: 'TemaMural' }),
        },
      },
      fields: {
        titulo: text({ validation: { isRequired: true } }),
        descripcion: text({ ui: { displayMode: 'textarea' } }),
        orden: integer({ defaultValue: 0 }),
        mural: relationship({
          ref: 'Mural.temas',
          validation: { isRequired: true },
        }),
      },
    }),
    ExamenMural: list({
      access: {
        operation: {
          query: isSignedIn,
          create: isSignedIn,
          update: isSignedIn,
          delete: isSignedIn,
        },
        filter: {
          query: onlyOwnMuralContent,
          update: onlyOwnMuralContent,
          delete: onlyOwnMuralContent,
        },
        item: {
          create: canCreateMuralContent,
          update: (args) => canUpdateMuralContent({ ...args, listKey: 'ExamenMural' }),
        },
      },
      fields: {
        titulo: text({ validation: { isRequired: true } }),
        descripcion: text({ ui: { displayMode: 'textarea' } }),
        fecha: calendarDay({ validation: { isRequired: true } }),
        informacionAdicional: text({ ui: { displayMode: 'textarea' } }),
        mural: relationship({
          ref: 'Mural.examenes',
          validation: { isRequired: true },
        }),
      },
    }),
    Aviso: list({
      access: {
        operation: {
          query: isSignedIn,
          create: isSignedIn,
          update: isSignedIn,
          delete: isSignedIn,
        },
        filter: {
          query: onlyOwnMuralContent,
          update: onlyOwnMuralContent,
          delete: onlyOwnMuralContent,
        },
        item: {
          create: canCreateMuralContent,
          update: (args) => canUpdateMuralContent({ ...args, listKey: 'Aviso' }),
        },
      },
      fields: {
        titulo: text({ validation: { isRequired: true } }),
        contenido: text({
          validation: { isRequired: true },
          ui: { displayMode: 'textarea' },
        }),
        fecha: calendarDay({ validation: { isRequired: true } }),
        publicado: checkbox({ defaultValue: false }),
        mural: relationship({
          ref: 'Mural.avisos',
          validation: { isRequired: true },
        }),
      },
    }),
    Asistencia: list({
      access: {
        operation: {
          query: isSignedIn,
          create: isSignedIn,
          update: isSignedIn,
          delete: isSignedIn,
        },
        filter: {
          query: onlyOwnCourseRecords,
          update: onlyOwnCourseRecords,
          delete: onlyOwnCourseRecords,
        },
        item: {
          create: canCreateAttendance,
          update: canUpdateAttendance,
        },
      },
      fields: {
        alumno: relationship({
          ref: 'Alumno.asistencias',
          validation: { isRequired: true },
        }),
        curso: relationship({
          ref: 'Curso.asistencias',
          validation: { isRequired: true },
        }),
        fecha: calendarDay({ validation: { isRequired: true } }),
        estado: select({
          type: 'string',
          options: [
            { label: 'Presente', value: 'presente' },
            { label: 'Ausente', value: 'ausente' },
            { label: 'Tarde', value: 'tarde' },
            { label: 'Justificado', value: 'justificado' },
          ],
          validation: { isRequired: true },
        }),
      },
    }),
    Calificacion: list({
      access: {
        operation: {
          query: isSignedIn,
          create: isSignedIn,
          update: isSignedIn,
          delete: isSignedIn,
        },
        filter: {
          query: onlyOwnCourseRecords,
          update: onlyOwnCourseRecords,
          delete: onlyOwnCourseRecords,
        },
        item: {
          create: canCreateCourseStudentRecord,
          update: canUpdateGrade,
        },
      },
      fields: {
        alumno: relationship({
          ref: 'Alumno.calificaciones',
          validation: { isRequired: true },
        }),
        curso: relationship({
          ref: 'Curso.calificaciones',
          validation: { isRequired: true },
        }),
        evaluacion: text({ validation: { isRequired: true } }),
        nota: float({
          validation: { isRequired: true, min: 0, max: 10 },
        }),
        observacion: text({ ui: { displayMode: 'textarea' } }),
        fecha: calendarDay({ validation: { isRequired: true } }),
      },
    }),
  },
  ui: {
    isAccessAllowed: async (context) => Boolean(context.session?.data?.id)
      || (await context.sudo().db.User.count()) === 0,
  },
  server: {
    port: 3001,
  },
  graphql: {
    extendGraphqlSchema: g.extend(() => ({
      query: {
        publicMural: g.field({
          type: PublicMural,
          args: {
            slug: g.arg({ type: g.nonNull(g.String) }),
          },
          resolve: publicMuralBySlug,
        }),
      },
    })),
  },
  session,
}));