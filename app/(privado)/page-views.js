"use client";

import Link from "next/link";
import {
  CAlert,
  CBadge,
  CButton,
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CRow,
} from "@coreui/react";
import MuralQrCard from "./cursos/[id]/mural-qr-card";

function formatFeriadoFecha(value) {
  return new Intl.DateTimeFormat("es-AR", {
    dateStyle: "long",
    timeZone: "UTC",
  }).format(new Date(`${value}T00:00:00Z`));
}

function formatDiaClima(value, index) {
  if (index === 0) return "Hoy";
  return new Intl.DateTimeFormat("es-AR", {
    weekday: "long",
    timeZone: "UTC",
  }).format(new Date(`${value}T00:00:00Z`));
}

const formatTemperatura = (value) => (value == null ? "-" : `${Math.round(value)}°`);

export function DashboardView({
  courses,
  feriados = [],
  feriadosError = null,
  clima = null,
  climaError = null,
}) {
  const studentCount = courses.reduce((total, course) => total + (course.alumnosCount || 0), 0);

  return (
    <div className="container-fluid px-0">
      <div className="mb-4">
        <h1 className="h3 mb-1">Inicio</h1>
        <p className="mb-0 text-body-secondary">Resumen de tus cursos y accesos frecuentes.</p>
      </div>

      <CRow className="g-3 mb-4">
        <CCol sm={6} xl={4}>
          <CCard className="h-100">
            <CCardBody>
              <div className="small text-body-secondary">Cursos</div>
              <div className="display-6 fw-semibold">{courses.length}</div>
              <Link href="/cursos" className="small">Ver mis cursos</Link>
            </CCardBody>
          </CCard>
        </CCol>
        <CCol sm={6} xl={4}>
          <CCard className="h-100">
            <CCardBody>
              <div className="small text-body-secondary">Alumnos en tus cursos</div>
              <div className="display-6 fw-semibold">{studentCount}</div>
              <span className="small text-body-secondary">Total según las inscripciones actuales</span>
            </CCardBody>
          </CCard>
        </CCol>
        <CCol sm={6} xl={4}>
          <CCard className="h-100">
            <CCardHeader className="fw-semibold">Próximos feriados</CCardHeader>
            <CCardBody>
              {feriadosError ? (
                <CAlert color="light" className="mb-0">{feriadosError}</CAlert>
              ) : feriados.length ? (
                <ul className="list-unstyled mb-0">
                  {feriados.map((feriado, index) => (
                    <li
                      key={`${feriado.fecha}-${feriado.nombre}`}
                      className={`d-flex align-items-start justify-content-between gap-3 py-2${index < feriados.length - 1 ? " border-bottom" : ""}`}
                    >
                      <div>
                        <div className="fw-semibold">{feriado.nombre}</div>
                        <div className="small text-body-secondary">
                          {formatFeriadoFecha(feriado.fecha)}
                        </div>
                      </div>
                      {feriado.tipo && (
                        <CBadge color="secondary" className="text-nowrap text-capitalize">
                          {feriado.tipo}
                        </CBadge>
                      )}
                    </li>
                  ))}
                </ul>
              ) : (
                <CAlert color="info" className="mb-0">
                  No hay feriados próximos para mostrar.
                </CAlert>
              )}
            </CCardBody>
          </CCard>
        </CCol>
        <CCol sm={6} xl={4}>
          <CCard className="h-100">
            <CCardHeader className="fw-semibold">
              Clima{clima?.localidadNombre ? ` en ${clima.localidadNombre}` : ""}
            </CCardHeader>
            <CCardBody>
              {climaError ? (
                <CAlert color="light" className="mb-0">
                  {climaError}{" "}
                  <Link href="/perfil" className="alert-link">Ir a mi perfil</Link>
                </CAlert>
              ) : clima ? (
                <>
                  <div className="d-flex align-items-baseline gap-2 mb-1">
                    <span className="display-6 fw-semibold">
                      {formatTemperatura(clima.temperatura)}
                    </span>
                    <span className="text-body-secondary">{clima.descripcion}</span>
                  </div>
                  {clima.humedad != null && (
                    <div className="small text-body-secondary mb-3">
                      Humedad {clima.humedad}%
                    </div>
                  )}
                  <ul className="list-unstyled mb-0">
                    {clima.dias.map((dia, index) => (
                      <li
                        key={dia.fecha}
                        className={`d-flex align-items-center justify-content-between gap-3 py-2${index < clima.dias.length - 1 ? " border-bottom" : ""}`}
                      >
                        <span className="text-capitalize">{formatDiaClima(dia.fecha, index)}</span>
                        <span className="small text-nowrap">
                          {formatTemperatura(dia.maxima)} / {formatTemperatura(dia.minima)}
                          {dia.probabilidadLluvia != null && (
                            <span className="text-body-secondary"> · {dia.probabilidadLluvia}% lluvia</span>
                          )}
                        </span>
                      </li>
                    ))}
                  </ul>
                </>
              ) : (
                <CAlert color="info" className="mb-0">No hay datos del clima para mostrar.</CAlert>
              )}
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>

      <CRow className="g-4">
        <CCol lg={7}>
          <CCard>
            <CCardHeader className="fw-semibold">Acceso a tus cursos</CCardHeader>
            <CCardBody>
              {courses.length ? (
                <div className="list-group list-group-flush">
                  {courses.slice(0, 5).map((course) => (
                    <Link
                      className="list-group-item list-group-item-action d-flex align-items-center justify-content-between gap-3 px-0"
                      href={`/cursos/${course.id}`}
                      key={course.id}
                    >
                      <span className="text-truncate">{course.nombre}</span>
                      <span className="small text-body-secondary text-nowrap">
                        {course.cicloLectivo} · {course.alumnosCount || 0} alumnos
                      </span>
                    </Link>
                  ))}
                </div>
              ) : (
                <CAlert color="info" className="mb-0">Todavía no tenés cursos para mostrar.</CAlert>
              )}
              {courses.length > 5 && (
                <CButton as={Link} href="/cursos" color="link" className="px-0 pb-0">
                  Ver todos los cursos
                </CButton>
              )}
            </CCardBody>
          </CCard>
        </CCol>
        <CCol lg={5}>
          <CCard>
            <CCardHeader className="fw-semibold">Accesos rápidos</CCardHeader>
            <CCardBody className="d-flex flex-wrap gap-2">
              <CButton as={Link} href="/cursos" color="primary">Mis cursos</CButton>
              <CButton as={Link} href="/asistencia" color="light">Asistencia</CButton>
              <CButton as={Link} href="/calificaciones" color="light">Calificaciones</CButton>
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>
    </div>
  );
}

export function CoursesView({ courses }) {
  return (
    <div className="container-fluid px-0">
      <div className="mb-4">
        <h1 className="h3 mb-1">Mis cursos</h1>
        <p className="mb-0 text-body-secondary">Cursos asociados a tu cuenta docente.</p>
      </div>
      {courses.length ? (
        <div className="row g-3">
          {courses.map((course) => (
            <div className="col-12 col-md-6 col-xxl-4" key={course.id}>
              <CCard className="h-100">
                <CCardHeader className="d-flex align-items-start justify-content-between gap-3">
                  <span className="fw-semibold">{course.nombre}</span>
                  <span className="badge text-bg-light text-nowrap">{course.estado}</span>
                </CCardHeader>
                <CCardBody className="d-flex flex-column align-items-start">
                  <p className="text-body-secondary small mb-3">
                    {course.descripcion || "Sin descripción"}
                  </p>
                  <div className="small mb-3">
                    Ciclo {course.cicloLectivo} · {course.alumnosCount || 0} alumnos
                  </div>
                  <CButton as={Link} href={`/cursos/${course.id}`} color="primary" className="mt-auto">
                    Abrir curso
                  </CButton>
                  {course.mural?.slug && (
                    <Link href={`/mural/${course.mural.slug}`} className="small mt-3">
                      Ver mural público
                    </Link>
                  )}
                </CCardBody>
              </CCard>
            </div>
          ))}
        </div>
      ) : (
        <CAlert color="info">Todavía no tenés cursos asociados.</CAlert>
      )}
    </div>
  );
}

export function CourseView({ course }) {
  return (
    <div className="container-fluid px-0">
      <div className="d-flex flex-wrap align-items-start justify-content-between gap-3 mb-4">
        <div>
          <Link href="/cursos" className="small">Mis cursos</Link>
          <h1 className="h3 mt-2 mb-1">{course.nombre}</h1>
          <p className="mb-0 text-body-secondary">
            Ciclo {course.cicloLectivo} · {course.estado}
          </p>
        </div>
        {course.mural?.slug && (
          <CButton as={Link} href={`/mural/${course.mural.slug}`} color="light">
            Abrir mural público
          </CButton>
        )}
      </div>

      {course.descripcion && <p className="mb-4">{course.descripcion}</p>}

      <div className="d-flex flex-wrap gap-2 mb-4">
        <CButton as={Link} href={`/asistencia#${course.id}`} color="light">Asistencia</CButton>
        <CButton as={Link} href={`/calificaciones#${course.id}`} color="light">Calificaciones</CButton>
      </div>

      {course.mural?.slug && <MuralQrCard slug={course.mural.slug} />}

      <CCard>
        <CCardHeader className="d-flex align-items-center justify-content-between gap-3">
          <span className="fw-semibold">Alumnos</span>
          <span className="badge text-bg-light">{course.alumnos.length}</span>
        </CCardHeader>
        <CCardBody>
          {course.alumnos.length ? (
            <div className="table-responsive">
              <table className="table table-hover align-middle mb-0">
                <thead><tr><th>Apellido</th><th>Nombre</th><th>DNI</th><th>Email</th></tr></thead>
                <tbody>
                  {course.alumnos.map((student) => (
                    <tr key={student.id}>
                      <td>{student.apellido}</td>
                      <td>{student.nombre}</td>
                      <td>{student.dni}</td>
                      <td>{student.email || "-"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <CAlert color="info" className="mb-0">Este curso todavía no tiene alumnos.</CAlert>
          )}
        </CCardBody>
      </CCard>
    </div>
  );
}

export function AttendanceView({ courses }) {
  return (
    <div className="container-fluid px-0">
      <div className="mb-4">
        <h1 className="h3 mb-1">Asistencia</h1>
        <p className="mb-0 text-body-secondary">Registros de tus cursos, agrupados por curso.</p>
      </div>
      {courses.length ? courses.map((course) => {
        const records = [...course.asistencias].sort((first, second) => second.fecha.localeCompare(first.fecha));
        return (
          <CCard className="mb-3" id={course.id} key={course.id}>
            <CCardHeader className="fw-semibold">{course.nombre}</CCardHeader>
            <CCardBody>
              {records.length ? (
                <div className="table-responsive">
                  <table className="table table-hover align-middle mb-0">
                    <thead><tr><th>Fecha</th><th>Alumno</th><th>Estado</th></tr></thead>
                    <tbody>
                      {records.map((record) => (
                        <tr key={record.id}>
                          <td>{record.fecha}</td>
                          <td>{record.alumno?.apellido} {record.alumno?.nombre}</td>
                          <td>{record.estado}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : <p className="mb-0 text-body-secondary">Sin registros de asistencia.</p>}
            </CCardBody>
          </CCard>
        );
      }) : <CAlert color="info">Todavía no tenés cursos asociados.</CAlert>}
    </div>
  );
}

export function GradesView({ courses }) {
  return (
    <div className="container-fluid px-0">
      <div className="mb-4">
        <h1 className="h3 mb-1">Calificaciones</h1>
        <p className="mb-0 text-body-secondary">Registros de tus cursos, agrupados por curso.</p>
      </div>
      {courses.length ? courses.map((course) => {
        const grades = [...course.calificaciones].sort((first, second) => second.fecha.localeCompare(first.fecha));
        return (
          <CCard className="mb-3" id={course.id} key={course.id}>
            <CCardHeader className="fw-semibold">{course.nombre}</CCardHeader>
            <CCardBody>
              {grades.length ? (
                <div className="table-responsive">
                  <table className="table table-hover align-middle mb-0">
                    <thead><tr><th>Fecha</th><th>Alumno</th><th>Evaluación</th><th>Nota</th><th>Observación</th></tr></thead>
                    <tbody>
                      {grades.map((grade) => (
                        <tr key={grade.id}>
                          <td>{grade.fecha}</td>
                          <td>{grade.alumno?.apellido} {grade.alumno?.nombre}</td>
                          <td>{grade.evaluacion}</td>
                          <td>{grade.nota}</td>
                          <td>{grade.observacion || "-"}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : <p className="mb-0 text-body-secondary">Sin calificaciones registradas.</p>}
            </CCardBody>
          </CCard>
        );
      }) : <CAlert color="info">Todavía no tenés cursos asociados.</CAlert>}
    </div>
  );
}