var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// keystone.js
var keystone_exports = {};
__export(keystone_exports, {
  default: () => keystone_default
});
module.exports = __toCommonJS(keystone_exports);
var import_config = require("dotenv/config");
var import_core = require("@keystone-6/core");
var import_fields = require("@keystone-6/core/fields");
var import_session = require("@keystone-6/core/session");
var import_auth = require("@keystone-6/auth");
var import_adapter_better_sqlite3 = require("@prisma/adapter-better-sqlite3");
var PublicMuralTopic = import_core.g.object()({
  name: "PublicMuralTopic",
  fields: {
    titulo: import_core.g.field({ type: import_core.g.nonNull(import_core.g.String) }),
    descripcion: import_core.g.field({ type: import_core.g.String }),
    orden: import_core.g.field({ type: import_core.g.nonNull(import_core.g.Int) })
  }
});
var PublicMuralExam = import_core.g.object()({
  name: "PublicMuralExam",
  fields: {
    titulo: import_core.g.field({ type: import_core.g.nonNull(import_core.g.String) }),
    descripcion: import_core.g.field({ type: import_core.g.String }),
    fecha: import_core.g.field({ type: import_core.g.nonNull(import_core.g.String) }),
    informacionAdicional: import_core.g.field({ type: import_core.g.String })
  }
});
var PublicMuralNotice = import_core.g.object()({
  name: "PublicMuralNotice",
  fields: {
    titulo: import_core.g.field({ type: import_core.g.nonNull(import_core.g.String) }),
    contenido: import_core.g.field({ type: import_core.g.nonNull(import_core.g.String) }),
    fecha: import_core.g.field({ type: import_core.g.nonNull(import_core.g.String) })
  }
});
var PublicMural = import_core.g.object()({
  name: "PublicMural",
  fields: {
    slug: import_core.g.field({ type: import_core.g.nonNull(import_core.g.String) }),
    titulo: import_core.g.field({ type: import_core.g.nonNull(import_core.g.String) }),
    descripcion: import_core.g.field({ type: import_core.g.String }),
    informacionGeneral: import_core.g.field({ type: import_core.g.String }),
    cursoNombre: import_core.g.field({ type: import_core.g.nonNull(import_core.g.String) }),
    cursoDescripcion: import_core.g.field({ type: import_core.g.String }),
    temas: import_core.g.field({ type: import_core.g.list(import_core.g.nonNull(PublicMuralTopic)) }),
    examenes: import_core.g.field({ type: import_core.g.list(import_core.g.nonNull(PublicMuralExam)) }),
    avisos: import_core.g.field({ type: import_core.g.list(import_core.g.nonNull(PublicMuralNotice)) })
  }
});
var sessionSecret = process.env.SESSION_SECRET;
if (process.env.NODE_ENV === "production" && !sessionSecret) {
  throw new Error("SESSION_SECRET must be set in production.");
}
var session = (0, import_session.statelessSessions)({
  secret: sessionSecret || "local-development-session-secret-only-do-not-deploy",
  cookieName: "mi-agenda-session",
  maxAge: 60 * 60 * 8
});
var isSignedIn = ({ session: session2 }) => Boolean(session2?.data?.id);
var onlyOwnUser = ({ session: session2 }) => session2?.data?.id ? { id: { equals: session2.data.id } } : false;
var onlyOwnCourses = ({ session: session2 }) => session2?.data?.id ? { docenteResponsable: { id: { equals: session2.data.id } } } : false;
var onlyOwnStudents = ({ session: session2 }) => session2?.data?.id ? { curso: { docenteResponsable: { id: { equals: session2.data.id } } } } : false;
var onlyOwnMural = ({ session: session2 }) => session2?.data?.id ? { curso: { docenteResponsable: { id: { equals: session2.data.id } } } } : false;
var onlyOwnMuralContent = ({ session: session2 }) => session2?.data?.id ? { mural: { curso: { docenteResponsable: { id: { equals: session2.data.id } } } } } : false;
var onlyOwnCourseRecords = ({ session: session2 }) => session2?.data?.id ? { curso: { docenteResponsable: { id: { equals: session2.data.id } } } } : false;
var getConnectedId = (relationshipInput) => relationshipInput?.connect?.id;
var ownsCourse = async ({ session: session2, context, courseId }) => {
  if (!session2?.data?.id || !courseId) return false;
  const course = await context.sudo().query.Curso.findOne({
    where: { id: courseId },
    query: "id docenteResponsable { id }"
  });
  return course?.docenteResponsable?.id === session2.data.id;
};
var canCreateCourse = ({ session: session2, inputData }) => Boolean(session2?.data?.id) && getConnectedId(inputData.docenteResponsable) === session2.data.id && inputData.mural === void 0;
var canUpdateCourse = async ({ session: session2, context, item, inputData }) => {
  if (!session2?.data?.id) return false;
  if (inputData.mural !== void 0) return false;
  if (inputData.docenteResponsable !== void 0 && getConnectedId(inputData.docenteResponsable) !== session2.data.id) {
    return false;
  }
  return ownsCourse({ session: session2, context, courseId: item.id });
};
var ownsMural = async ({ session: session2, context, muralId }) => {
  if (!session2?.data?.id || !muralId) return false;
  const mural = await context.sudo().query.Mural.findOne({
    where: { id: muralId },
    query: "id curso { id }"
  });
  return ownsCourse({ session: session2, context, courseId: mural?.curso?.id });
};
var canCreateMural = async ({ session: session2, context, inputData }) => {
  if (inputData.temas !== void 0 || inputData.examenes !== void 0 || inputData.avisos !== void 0) {
    return false;
  }
  return ownsCourse({
    session: session2,
    context,
    courseId: getConnectedId(inputData.curso)
  });
};
var canUpdateMural = async ({ session: session2, context, item, inputData }) => {
  if (!session2?.data?.id || inputData.temas !== void 0 || inputData.examenes !== void 0 || inputData.avisos !== void 0 || !await ownsMural({ session: session2, context, muralId: item.id })) {
    return false;
  }
  if (inputData.curso !== void 0) {
    return ownsCourse({
      session: session2,
      context,
      courseId: getConnectedId(inputData.curso)
    });
  }
  return true;
};
var canCreateMuralContent = async ({ session: session2, context, inputData }) => ownsMural({
  session: session2,
  context,
  muralId: getConnectedId(inputData.mural)
});
var canUpdateMuralContent = async ({ session: session2, context, item, inputData, listKey }) => {
  if (!session2?.data?.id) return false;
  const content = await context.sudo().query[listKey].findOne({
    where: { id: item.id },
    query: "id mural { id }"
  });
  if (!await ownsMural({
    session: session2,
    context,
    muralId: content?.mural?.id
  })) {
    return false;
  }
  if (inputData.mural !== void 0) {
    return ownsMural({
      session: session2,
      context,
      muralId: getConnectedId(inputData.mural)
    });
  }
  return true;
};
var publicMuralBySlug = async (_source, { slug }, context) => {
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
    `
  });
  if (!mural) return null;
  const today = (/* @__PURE__ */ new Date()).toISOString().slice(0, 10);
  return {
    slug: mural.slug,
    titulo: mural.titulo,
    descripcion: mural.descripcion,
    informacionGeneral: mural.informacionGeneral,
    cursoNombre: mural.curso?.nombre || mural.titulo,
    cursoDescripcion: mural.curso?.descripcion,
    temas: mural.temas,
    examenes: mural.examenes.filter((exam) => exam.fecha >= today),
    avisos: mural.avisos
  };
};
var canCreateStudent = async ({ session: session2, context, inputData }) => ownsCourse({
  session: session2,
  context,
  courseId: getConnectedId(inputData.curso)
});
var canUpdateStudent = async ({ session: session2, context, item, inputData }) => {
  if (!session2?.data?.id) return false;
  const student = await context.sudo().query.Alumno.findOne({
    where: { id: item.id },
    query: "id curso { id }"
  });
  if (!await ownsCourse({
    session: session2,
    context,
    courseId: student?.curso?.id
  })) {
    return false;
  }
  if (inputData.curso !== void 0) {
    return ownsCourse({
      session: session2,
      context,
      courseId: getConnectedId(inputData.curso)
    });
  }
  return true;
};
var studentBelongsToOwnedCourse = async ({ session: session2, context, studentId, courseId }) => {
  if (!session2?.data?.id || !studentId || !courseId) return false;
  if (!await ownsCourse({ session: session2, context, courseId })) return false;
  const student = await context.sudo().query.Alumno.findOne({
    where: { id: studentId },
    query: "id curso { id }"
  });
  return student?.curso?.id === courseId;
};
var canCreateCourseStudentRecord = async ({ session: session2, context, inputData }) => studentBelongsToOwnedCourse({
  session: session2,
  context,
  studentId: getConnectedId(inputData.alumno),
  courseId: getConnectedId(inputData.curso)
});
var canUpdateCourseStudentRecord = async ({ session: session2, context, item, inputData, listKey }) => {
  if (!session2?.data?.id) return false;
  const record = await context.sudo().query[listKey].findOne({
    where: { id: item.id },
    query: "id alumno { id } curso { id }"
  });
  if (!record || !await studentBelongsToOwnedCourse({
    session: session2,
    context,
    studentId: record.alumno?.id,
    courseId: record.curso?.id
  })) {
    return false;
  }
  const studentId = inputData.alumno === void 0 ? record.alumno?.id : getConnectedId(inputData.alumno);
  const courseId = inputData.curso === void 0 ? record.curso?.id : getConnectedId(inputData.curso);
  return studentBelongsToOwnedCourse({ session: session2, context, studentId, courseId });
};
var hasDuplicateAttendance = async ({ context, studentId, date, excludeId }) => {
  if (!studentId || !date) return false;
  const records = await context.sudo().query.Asistencia.findMany({
    where: {
      alumno: { id: { equals: studentId } },
      fecha: { equals: date }
    }
  });
  return records.some((record) => record.id !== excludeId);
};
var canCreateAttendance = async ({ session: session2, context, inputData }) => {
  const studentId = getConnectedId(inputData.alumno);
  const courseId = getConnectedId(inputData.curso);
  if (!await studentBelongsToOwnedCourse({ session: session2, context, studentId, courseId })) {
    return false;
  }
  return !await hasDuplicateAttendance({
    context,
    studentId,
    date: inputData.fecha
  });
};
var canUpdateAttendance = async ({ session: session2, context, item, inputData }) => {
  if (!await canUpdateCourseStudentRecord({
    session: session2,
    context,
    item,
    inputData,
    listKey: "Asistencia"
  })) {
    return false;
  }
  const record = await context.sudo().query.Asistencia.findOne({
    where: { id: item.id },
    query: "id fecha alumno { id }"
  });
  const studentId = inputData.alumno === void 0 ? record?.alumno?.id : getConnectedId(inputData.alumno);
  const date = inputData.fecha === void 0 ? record?.fecha : inputData.fecha;
  return !await hasDuplicateAttendance({
    context,
    studentId,
    date,
    excludeId: item.id
  });
};
var canUpdateGrade = (args) => canUpdateCourseStudentRecord({
  ...args,
  listKey: "Calificacion"
});
var canCreateFirstUser = async ({ session: session2, context }) => {
  if (session2) return false;
  return await context.sudo().db.User.count() === 0;
};
var { withAuth } = (0, import_auth.createAuth)({
  listKey: "User",
  identityField: "email",
  secretField: "password",
  sessionData: "id nombre apellido email"
});
var keystone_default = withAuth((0, import_core.config)({
  db: {
    provider: "sqlite",
    prismaClientOptions: () => ({
      adapter: new import_adapter_better_sqlite3.PrismaBetterSqlite3({ url: process.env.DATABASE_URL })
    })
  },
  lists: {
    KeystoneSystem: (0, import_core.list)({
      access: () => false,
      fields: {
        systemKey: (0, import_fields.text)({ validation: { isRequired: true } })
      }
    }),
    User: (0, import_core.list)({
      access: {
        operation: {
          query: isSignedIn,
          create: canCreateFirstUser,
          update: isSignedIn,
          delete: () => false
        },
        filter: {
          query: onlyOwnUser,
          update: onlyOwnUser
        },
        item: {
          update: ({ session: session2, item, inputData }) => session2?.data?.id === item.id && inputData.cursos === void 0 && inputData.email === void 0 && inputData.password === void 0
        }
      },
      fields: {
        nombre: (0, import_fields.text)({ validation: { isRequired: true } }),
        apellido: (0, import_fields.text)({ validation: { isRequired: true } }),
        email: (0, import_fields.text)({
          validation: { isRequired: true },
          isIndexed: "unique"
        }),
        password: (0, import_fields.password)({ validation: { isRequired: true } }),
        dni: (0, import_fields.text)({
          validation: {
            match: {
              regex: /^$|^[0-9]{7,8}$/,
              explanation: "Ingres\xE1 7 u 8 d\xEDgitos, sin puntos."
            }
          }
        }),
        telefono: (0, import_fields.text)(),
        fechaNacimiento: (0, import_fields.calendarDay)(),
        direccion: (0, import_fields.text)({ ui: { displayMode: "textarea" } }),
        institucionEducativa: (0, import_fields.text)(),
        cargoDocente: (0, import_fields.text)(),
        localidad: (0, import_fields.text)(),
        provincia: (0, import_fields.text)(),
        cursos: (0, import_fields.relationship)({ ref: "Curso.docenteResponsable", many: true })
      }
    }),
    Curso: (0, import_core.list)({
      access: {
        operation: {
          query: isSignedIn,
          create: isSignedIn,
          update: isSignedIn,
          delete: isSignedIn
        },
        filter: {
          query: onlyOwnCourses,
          update: onlyOwnCourses,
          delete: onlyOwnCourses
        },
        item: {
          create: canCreateCourse,
          update: canUpdateCourse
        }
      },
      fields: {
        nombre: (0, import_fields.text)({ validation: { isRequired: true } }),
        descripcion: (0, import_fields.text)({ ui: { displayMode: "textarea" } }),
        cicloLectivo: (0, import_fields.integer)({ validation: { isRequired: true } }),
        docenteResponsable: (0, import_fields.relationship)({
          ref: "User.cursos",
          validation: { isRequired: true }
        }),
        estado: (0, import_fields.select)({
          type: "string",
          defaultValue: "activo",
          options: [
            { label: "Activo", value: "activo" },
            { label: "Finalizado", value: "finalizado" }
          ]
        }),
        alumnos: (0, import_fields.relationship)({ ref: "Alumno.curso", many: true }),
        asistencias: (0, import_fields.relationship)({ ref: "Asistencia.curso", many: true }),
        calificaciones: (0, import_fields.relationship)({ ref: "Calificacion.curso", many: true }),
        mural: (0, import_fields.relationship)({ ref: "Mural.curso" })
      }
    }),
    Alumno: (0, import_core.list)({
      access: {
        operation: {
          query: isSignedIn,
          create: isSignedIn,
          update: isSignedIn,
          delete: isSignedIn
        },
        filter: {
          query: onlyOwnStudents,
          update: onlyOwnStudents,
          delete: onlyOwnStudents
        },
        item: {
          create: canCreateStudent,
          update: canUpdateStudent
        }
      },
      fields: {
        nombre: (0, import_fields.text)({ validation: { isRequired: true } }),
        apellido: (0, import_fields.text)({ validation: { isRequired: true } }),
        dni: (0, import_fields.text)({
          validation: { isRequired: true },
          isIndexed: "unique"
        }),
        email: (0, import_fields.text)(),
        curso: (0, import_fields.relationship)({
          ref: "Curso.alumnos",
          validation: { isRequired: true }
        }),
        asistencias: (0, import_fields.relationship)({ ref: "Asistencia.alumno", many: true }),
        calificaciones: (0, import_fields.relationship)({ ref: "Calificacion.alumno", many: true })
      }
    }),
    Mural: (0, import_core.list)({
      access: {
        operation: {
          query: isSignedIn,
          create: isSignedIn,
          update: isSignedIn,
          delete: isSignedIn
        },
        filter: {
          query: onlyOwnMural,
          update: onlyOwnMural,
          delete: onlyOwnMural
        },
        item: {
          create: canCreateMural,
          update: canUpdateMural
        }
      },
      fields: {
        slug: (0, import_fields.text)({
          validation: { isRequired: true },
          isIndexed: "unique"
        }),
        titulo: (0, import_fields.text)({ validation: { isRequired: true } }),
        descripcion: (0, import_fields.text)({ ui: { displayMode: "textarea" } }),
        informacionGeneral: (0, import_fields.text)({ ui: { displayMode: "textarea" } }),
        curso: (0, import_fields.relationship)({
          ref: "Curso.mural",
          validation: { isRequired: true }
        }),
        temas: (0, import_fields.relationship)({ ref: "TemaMural.mural", many: true }),
        examenes: (0, import_fields.relationship)({ ref: "ExamenMural.mural", many: true }),
        avisos: (0, import_fields.relationship)({ ref: "Aviso.mural", many: true })
      }
    }),
    TemaMural: (0, import_core.list)({
      access: {
        operation: {
          query: isSignedIn,
          create: isSignedIn,
          update: isSignedIn,
          delete: isSignedIn
        },
        filter: {
          query: onlyOwnMuralContent,
          update: onlyOwnMuralContent,
          delete: onlyOwnMuralContent
        },
        item: {
          create: canCreateMuralContent,
          update: (args) => canUpdateMuralContent({ ...args, listKey: "TemaMural" })
        }
      },
      fields: {
        titulo: (0, import_fields.text)({ validation: { isRequired: true } }),
        descripcion: (0, import_fields.text)({ ui: { displayMode: "textarea" } }),
        orden: (0, import_fields.integer)({ defaultValue: 0 }),
        mural: (0, import_fields.relationship)({
          ref: "Mural.temas",
          validation: { isRequired: true }
        })
      }
    }),
    ExamenMural: (0, import_core.list)({
      access: {
        operation: {
          query: isSignedIn,
          create: isSignedIn,
          update: isSignedIn,
          delete: isSignedIn
        },
        filter: {
          query: onlyOwnMuralContent,
          update: onlyOwnMuralContent,
          delete: onlyOwnMuralContent
        },
        item: {
          create: canCreateMuralContent,
          update: (args) => canUpdateMuralContent({ ...args, listKey: "ExamenMural" })
        }
      },
      fields: {
        titulo: (0, import_fields.text)({ validation: { isRequired: true } }),
        descripcion: (0, import_fields.text)({ ui: { displayMode: "textarea" } }),
        fecha: (0, import_fields.calendarDay)({ validation: { isRequired: true } }),
        informacionAdicional: (0, import_fields.text)({ ui: { displayMode: "textarea" } }),
        mural: (0, import_fields.relationship)({
          ref: "Mural.examenes",
          validation: { isRequired: true }
        })
      }
    }),
    Aviso: (0, import_core.list)({
      access: {
        operation: {
          query: isSignedIn,
          create: isSignedIn,
          update: isSignedIn,
          delete: isSignedIn
        },
        filter: {
          query: onlyOwnMuralContent,
          update: onlyOwnMuralContent,
          delete: onlyOwnMuralContent
        },
        item: {
          create: canCreateMuralContent,
          update: (args) => canUpdateMuralContent({ ...args, listKey: "Aviso" })
        }
      },
      fields: {
        titulo: (0, import_fields.text)({ validation: { isRequired: true } }),
        contenido: (0, import_fields.text)({
          validation: { isRequired: true },
          ui: { displayMode: "textarea" }
        }),
        fecha: (0, import_fields.calendarDay)({ validation: { isRequired: true } }),
        publicado: (0, import_fields.checkbox)({ defaultValue: false }),
        mural: (0, import_fields.relationship)({
          ref: "Mural.avisos",
          validation: { isRequired: true }
        })
      }
    }),
    Asistencia: (0, import_core.list)({
      access: {
        operation: {
          query: isSignedIn,
          create: isSignedIn,
          update: isSignedIn,
          delete: isSignedIn
        },
        filter: {
          query: onlyOwnCourseRecords,
          update: onlyOwnCourseRecords,
          delete: onlyOwnCourseRecords
        },
        item: {
          create: canCreateAttendance,
          update: canUpdateAttendance
        }
      },
      fields: {
        alumno: (0, import_fields.relationship)({
          ref: "Alumno.asistencias",
          validation: { isRequired: true }
        }),
        curso: (0, import_fields.relationship)({
          ref: "Curso.asistencias",
          validation: { isRequired: true }
        }),
        fecha: (0, import_fields.calendarDay)({ validation: { isRequired: true } }),
        estado: (0, import_fields.select)({
          type: "string",
          options: [
            { label: "Presente", value: "presente" },
            { label: "Ausente", value: "ausente" },
            { label: "Tarde", value: "tarde" },
            { label: "Justificado", value: "justificado" }
          ],
          validation: { isRequired: true }
        })
      }
    }),
    Calificacion: (0, import_core.list)({
      access: {
        operation: {
          query: isSignedIn,
          create: isSignedIn,
          update: isSignedIn,
          delete: isSignedIn
        },
        filter: {
          query: onlyOwnCourseRecords,
          update: onlyOwnCourseRecords,
          delete: onlyOwnCourseRecords
        },
        item: {
          create: canCreateCourseStudentRecord,
          update: canUpdateGrade
        }
      },
      fields: {
        alumno: (0, import_fields.relationship)({
          ref: "Alumno.calificaciones",
          validation: { isRequired: true }
        }),
        curso: (0, import_fields.relationship)({
          ref: "Curso.calificaciones",
          validation: { isRequired: true }
        }),
        evaluacion: (0, import_fields.text)({ validation: { isRequired: true } }),
        nota: (0, import_fields.float)({
          validation: { isRequired: true, min: 0, max: 10 }
        }),
        observacion: (0, import_fields.text)({ ui: { displayMode: "textarea" } }),
        fecha: (0, import_fields.calendarDay)({ validation: { isRequired: true } })
      }
    })
  },
  ui: {
    isAccessAllowed: async (context) => Boolean(context.session?.data?.id) || await context.sudo().db.User.count() === 0
  },
  server: {
    port: 3001
  },
  graphql: {
    extendGraphqlSchema: import_core.g.extend(() => ({
      query: {
        publicMural: import_core.g.field({
          type: PublicMural,
          args: {
            slug: import_core.g.arg({ type: import_core.g.nonNull(import_core.g.String) })
          },
          resolve: publicMuralBySlug
        })
      }
    }))
  },
  session
}));
//# sourceMappingURL=config.js.map
