"use client";

import {
  CBadge,
  CButton,
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CContainer,
  CRow,
} from "@coreui/react";

export default function CoreUIDemo() {
  return (
    <CContainer className="py-5">
      <CRow className="justify-content-center">
        <CCol md={8} lg={6}>
          <CCard>
            <CCardHeader className="d-flex justify-content-between align-items-center">
              <span>Mi Agenda</span>
              <CBadge color="success">CoreUI activo</CBadge>
            </CCardHeader>
            <CCardBody>
              <h1 className="h3">Centro educativo</h1>
              <p className="text-body-secondary">
                Esta pantalla confirma la integración de CoreUI con Next.js.
              </p>
              <CButton color="primary">Continuar</CButton>
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>
    </CContainer>
  );
}