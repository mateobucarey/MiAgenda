-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "nombre" TEXT NOT NULL DEFAULT '',
    "apellido" TEXT NOT NULL DEFAULT '',
    "email" TEXT NOT NULL DEFAULT '',
    "password" TEXT NOT NULL,
    "dni" TEXT NOT NULL DEFAULT '',
    "telefono" TEXT NOT NULL DEFAULT '',
    "fechaNacimiento" TEXT,
    "direccion" TEXT NOT NULL DEFAULT '',
    "institucionEducativa" TEXT NOT NULL DEFAULT '',
    "cargoDocente" TEXT NOT NULL DEFAULT '',
    "localidad" TEXT NOT NULL DEFAULT '',
    "provincia" TEXT NOT NULL DEFAULT '',

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Curso" (
    "id" TEXT NOT NULL,
    "nombre" TEXT NOT NULL DEFAULT '',
    "descripcion" TEXT NOT NULL DEFAULT '',
    "cicloLectivo" INTEGER NOT NULL,
    "docenteResponsable" TEXT NOT NULL,
    "estado" TEXT NOT NULL DEFAULT 'activo',
    "mural" TEXT,

    CONSTRAINT "Curso_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Alumno" (
    "id" TEXT NOT NULL,
    "nombre" TEXT NOT NULL DEFAULT '',
    "apellido" TEXT NOT NULL DEFAULT '',
    "dni" TEXT NOT NULL DEFAULT '',
    "email" TEXT NOT NULL DEFAULT '',
    "curso" TEXT NOT NULL,

    CONSTRAINT "Alumno_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Mural" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL DEFAULT '',
    "titulo" TEXT NOT NULL DEFAULT '',
    "descripcion" TEXT NOT NULL DEFAULT '',
    "informacionGeneral" TEXT NOT NULL DEFAULT '',

    CONSTRAINT "Mural_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TemaMural" (
    "id" TEXT NOT NULL,
    "titulo" TEXT NOT NULL DEFAULT '',
    "descripcion" TEXT NOT NULL DEFAULT '',
    "orden" INTEGER NOT NULL DEFAULT 0,
    "mural" TEXT NOT NULL,

    CONSTRAINT "TemaMural_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ExamenMural" (
    "id" TEXT NOT NULL,
    "titulo" TEXT NOT NULL DEFAULT '',
    "descripcion" TEXT NOT NULL DEFAULT '',
    "fecha" TEXT NOT NULL,
    "informacionAdicional" TEXT NOT NULL DEFAULT '',
    "mural" TEXT NOT NULL,

    CONSTRAINT "ExamenMural_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Aviso" (
    "id" TEXT NOT NULL,
    "titulo" TEXT NOT NULL DEFAULT '',
    "contenido" TEXT NOT NULL DEFAULT '',
    "fecha" TEXT NOT NULL,
    "publicado" BOOLEAN NOT NULL DEFAULT false,
    "mural" TEXT NOT NULL,

    CONSTRAINT "Aviso_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Asistencia" (
    "id" TEXT NOT NULL,
    "alumno" TEXT NOT NULL,
    "curso" TEXT NOT NULL,
    "fecha" TEXT NOT NULL,
    "estado" TEXT NOT NULL,

    CONSTRAINT "Asistencia_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Calificacion" (
    "id" TEXT NOT NULL,
    "alumno" TEXT NOT NULL,
    "curso" TEXT NOT NULL,
    "evaluacion" TEXT NOT NULL DEFAULT '',
    "nota" DOUBLE PRECISION NOT NULL,
    "observacion" TEXT NOT NULL DEFAULT '',
    "fecha" TEXT NOT NULL,

    CONSTRAINT "Calificacion_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Curso_mural_key" ON "Curso"("mural");

-- CreateIndex
CREATE INDEX "Curso_docenteResponsable_idx" ON "Curso"("docenteResponsable");

-- CreateIndex
CREATE UNIQUE INDEX "Alumno_dni_key" ON "Alumno"("dni");

-- CreateIndex
CREATE INDEX "Alumno_curso_idx" ON "Alumno"("curso");

-- CreateIndex
CREATE UNIQUE INDEX "Mural_slug_key" ON "Mural"("slug");

-- CreateIndex
CREATE INDEX "TemaMural_mural_idx" ON "TemaMural"("mural");

-- CreateIndex
CREATE INDEX "ExamenMural_mural_idx" ON "ExamenMural"("mural");

-- CreateIndex
CREATE INDEX "Aviso_mural_idx" ON "Aviso"("mural");

-- CreateIndex
CREATE INDEX "Asistencia_curso_idx" ON "Asistencia"("curso");

-- CreateIndex
CREATE UNIQUE INDEX "Asistencia_alumno_fecha_key" ON "Asistencia"("alumno", "fecha");

-- CreateIndex
CREATE INDEX "Calificacion_alumno_idx" ON "Calificacion"("alumno");

-- CreateIndex
CREATE INDEX "Calificacion_curso_idx" ON "Calificacion"("curso");

-- AddForeignKey
ALTER TABLE "Curso" ADD CONSTRAINT "Curso_docenteResponsable_fkey" FOREIGN KEY ("docenteResponsable") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Curso" ADD CONSTRAINT "Curso_mural_fkey" FOREIGN KEY ("mural") REFERENCES "Mural"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Alumno" ADD CONSTRAINT "Alumno_curso_fkey" FOREIGN KEY ("curso") REFERENCES "Curso"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TemaMural" ADD CONSTRAINT "TemaMural_mural_fkey" FOREIGN KEY ("mural") REFERENCES "Mural"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ExamenMural" ADD CONSTRAINT "ExamenMural_mural_fkey" FOREIGN KEY ("mural") REFERENCES "Mural"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Aviso" ADD CONSTRAINT "Aviso_mural_fkey" FOREIGN KEY ("mural") REFERENCES "Mural"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Asistencia" ADD CONSTRAINT "Asistencia_alumno_fkey" FOREIGN KEY ("alumno") REFERENCES "Alumno"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Asistencia" ADD CONSTRAINT "Asistencia_curso_fkey" FOREIGN KEY ("curso") REFERENCES "Curso"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Calificacion" ADD CONSTRAINT "Calificacion_alumno_fkey" FOREIGN KEY ("alumno") REFERENCES "Alumno"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Calificacion" ADD CONSTRAINT "Calificacion_curso_fkey" FOREIGN KEY ("curso") REFERENCES "Curso"("id") ON DELETE CASCADE ON UPDATE CASCADE;
