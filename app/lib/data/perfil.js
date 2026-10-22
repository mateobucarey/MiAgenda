import { prisma } from "../db";

const PROFILE_FIELDS = [
  "nombre",
  "apellido",
  "dni",
  "telefono",
  "fechaNacimiento",
  "direccion",
  "institucionEducativa",
  "cargoDocente",
  "localidad",
  "provincia",
];

// Actualiza únicamente campos del perfil permitidos. El email, la contraseña
// y las relaciones (cursos) no se pueden modificar desde el perfil.
export async function updatePerfilDocente(userId, data) {
  const safeData = Object.fromEntries(
    PROFILE_FIELDS
      .filter((field) => data[field] !== undefined)
      .map((field) => [field, data[field]]),
  );

  return prisma.user.update({
    where: { id: userId },
    data: safeData,
  });
}
