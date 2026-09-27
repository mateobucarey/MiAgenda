"use server";

import { revalidatePath } from "next/cache";
import {
  getKeystoneSessionToken,
  requestKeystone,
} from "../../lib/keystone";

const updateProfileMutation = `
  mutation UpdateProfile($where: UserWhereUniqueInput!, $data: UserUpdateInput!) {
    updateUser(where: $where, data: $data) { id }
  }
`;

const identityQuery = `
  query CurrentUserId {
    authenticatedItem { id }
  }
`;

const textValue = (formData, field) => String(formData.get(field) || "").trim();

export async function saveProfile(_previousState, formData) {
  const sessionToken = await getKeystoneSessionToken();

  if (!sessionToken) {
    return {
      status: "error",
      message: "La sesión venció. Iniciá sesión nuevamente para guardar el perfil.",
    };
  }

  const nombre = textValue(formData, "nombre");
  const apellido = textValue(formData, "apellido");
  const dni = textValue(formData, "dni");
  const fechaNacimiento = textValue(formData, "fechaNacimiento");

  if (!nombre || !apellido) {
    return { status: "error", message: "Nombre y apellido son obligatorios." };
  }

  if (dni && !/^[0-9]{7,8}$/.test(dni)) {
    return { status: "error", message: "El DNI debe tener 7 u 8 dígitos, sin puntos." };
  }

  if (fechaNacimiento && !/^\d{4}-\d{2}-\d{2}$/.test(fechaNacimiento)) {
    return { status: "error", message: "La fecha de nacimiento no tiene un formato válido." };
  }

  try {
    const identity = await requestKeystone(identityQuery, sessionToken);
    const userId = identity.data?.authenticatedItem?.id;

    if (!userId) {
      return {
        status: "error",
        message: "La sesión venció. Iniciá sesión nuevamente para guardar el perfil.",
      };
    }

    const result = await requestKeystone(updateProfileMutation, sessionToken, {
      where: { id: userId },
      data: {
        nombre,
        apellido,
        dni,
        telefono: textValue(formData, "telefono"),
        fechaNacimiento: fechaNacimiento || null,
        direccion: textValue(formData, "direccion"),
        institucionEducativa: textValue(formData, "institucionEducativa"),
        cargoDocente: textValue(formData, "cargoDocente"),
        localidad: textValue(formData, "localidad"),
        provincia: textValue(formData, "provincia"),
      },
    });

    if (result.errors?.length || !result.data?.updateUser?.id) {
      return {
        status: "error",
        message: "No se pudieron guardar los cambios. Revisá los datos e intentá nuevamente.",
      };
    }

    revalidatePath("/perfil");
    return { status: "success", message: "El perfil se guardó correctamente." };
  } catch {
    return {
      status: "error",
      message: "No se pudo conectar con el sistema. Volvé a intentar en unos minutos.",
    };
  }
}