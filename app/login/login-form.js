"use client";

import { useActionState } from "react";
import {
  CAlert,
  CButton,
  CCard,
  CCardBody,
  CCardHeader,
  CContainer,
  CFormInput,
  CFormLabel,
} from "@coreui/react";
import { signIn } from "./actions";

const initialState = { status: "idle", message: "" };

export default function LoginForm() {
  const [state, formAction, pending] = useActionState(signIn, initialState);

  return (
    <main className="bg-body-tertiary min-vh-100 d-flex align-items-center py-5">
      <CContainer style={{ maxWidth: "440px" }}>
        <CCard>
          <CCardHeader className="fw-semibold">Planificación Docente</CCardHeader>
          <CCardBody className="p-4">
            <h1 className="h4 mb-1">Iniciar sesión</h1>
            <p className="text-body-secondary mb-4">Ingresá con tu cuenta docente.</p>

            {state.message && (
              <CAlert color="danger" role="alert">{state.message}</CAlert>
            )}

            <form action={formAction}>
              <div className="mb-3">
                <CFormLabel htmlFor="email">Email</CFormLabel>
                <CFormInput
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="username"
                  required
                />
              </div>
              <div className="mb-4">
                <CFormLabel htmlFor="password">Contraseña</CFormLabel>
                <CFormInput
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                />
              </div>
              <CButton color="primary" type="submit" disabled={pending}>
                {pending ? "Ingresando..." : "Iniciar sesión"}
              </CButton>
            </form>
          </CCardBody>
        </CCard>
      </CContainer>
    </main>
  );
}