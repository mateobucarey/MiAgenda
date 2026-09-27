"use client";

import { useActionState } from "react";
import {
  CAlert,
  CButton,
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CContainer,
  CFormInput,
  CFormLabel,
  CFormTextarea,
  CRow,
} from "@coreui/react";
import { saveProfile } from "./actions";

const initialState = { status: "idle", message: "" };

function TextField({ id, label, value = "", type = "text", required = false }) {
  return (
    <div className="mb-3">
      <CFormLabel htmlFor={id}>{label}</CFormLabel>
      <CFormInput
        id={id}
        name={id}
        type={type}
        defaultValue={value || ""}
        required={required}
      />
    </div>
  );
}

function TextAreaField({ id, label, value = "" }) {
  return (
    <div className="mb-3">
      <CFormLabel htmlFor={id}>{label}</CFormLabel>
      <CFormTextarea id={id} name={id} rows={3} defaultValue={value || ""} />
    </div>
  );
}

export default function ProfileForm({ profile }) {
  const [state, formAction, pending] = useActionState(saveProfile, initialState);

  return (
    <div className="container-fluid px-0">
      <header className="mb-4">
        <h1 className="h3 mb-1">Mi perfil</h1>
        <p className="mb-0 text-body-secondary">Datos personales e institucionales.</p>
      </header>

      {state.message && (
        <CAlert color={state.status === "success" ? "success" : "danger"}>
          {state.message}
        </CAlert>
      )}

      <form action={formAction}>
        <CRow className="g-4">
          <CCol lg={6}>
            <CCard className="h-100">
              <CCardHeader className="fw-semibold">Datos personales</CCardHeader>
              <CCardBody>
                <TextField id="nombre" label="Nombre" value={profile.nombre} required />
                <TextField id="apellido" label="Apellido" value={profile.apellido} required />
                <TextField id="dni" label="DNI" value={profile.dni} />
                <TextField id="telefono" label="Teléfono" value={profile.telefono} type="tel" />
                <TextField
                  id="fechaNacimiento"
                  label="Fecha de nacimiento"
                  value={profile.fechaNacimiento}
                  type="date"
                />
                <TextAreaField id="direccion" label="Dirección" value={profile.direccion} />
                <div className="mb-3">
                  <CFormLabel htmlFor="email">Email de acceso</CFormLabel>
                  <CFormInput id="email" type="email" value={profile.email || ""} readOnly />
                  <div className="form-text">El email y la contraseña se administran con la autenticación.</div>
                </div>
              </CCardBody>
            </CCard>
          </CCol>

          <CCol lg={6}>
            <CCard className="h-100">
              <CCardHeader className="fw-semibold">Datos institucionales</CCardHeader>
              <CCardBody>
                <TextField
                  id="institucionEducativa"
                  label="Institución educativa"
                  value={profile.institucionEducativa}
                />
                <TextField id="cargoDocente" label="Cargo / rol docente" value={profile.cargoDocente} />
                <TextField id="localidad" label="Localidad" value={profile.localidad} />
                <TextField id="provincia" label="Provincia" value={profile.provincia} />
              </CCardBody>
            </CCard>
          </CCol>
        </CRow>

        <div className="d-flex justify-content-end pt-4">
          <CButton color="primary" type="submit" disabled={pending}>
            {pending ? "Guardando..." : "Guardar cambios"}
          </CButton>
        </div>
      </form>
    </div>
  );
}