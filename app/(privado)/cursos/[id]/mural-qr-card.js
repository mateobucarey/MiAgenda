"use client";

import { useEffect, useState } from "react";
import { CAlert, CButton, CCard, CCardBody, CCardHeader } from "@coreui/react";
import { QRCodeSVG } from "qrcode.react";

export default function MuralQrCard({ slug }) {
  const [muralUrl, setMuralUrl] = useState("");
  const [copyMessage, setCopyMessage] = useState("");

  useEffect(() => {
    setMuralUrl(new URL(`/mural/${encodeURIComponent(slug)}`, window.location.origin).toString());
  }, [slug]);

  const copyUrl = async () => {
    try {
      await navigator.clipboard.writeText(muralUrl);
      setCopyMessage("URL copiada.");
    } catch {
      setCopyMessage("No se pudo copiar automáticamente. Seleccioná la URL para copiarla.");
    }
  };

  return (
    <CCard className="mb-4">
      <CCardHeader className="fw-semibold">Acceso al mural</CCardHeader>
      <CCardBody className="d-flex flex-column align-items-start gap-3">
        {muralUrl ? (
          <>
            <div className="rounded border bg-white p-3">
              <QRCodeSVG
                value={muralUrl}
                size={256}
                level="M"
                marginSize={4}
                title="Código QR del mural público"
                style={{ display: "block", width: "min(256px, 100%)", height: "auto" }}
              />
            </div>
            <a className="font-monospace text-break" href={muralUrl} target="_blank" rel="noreferrer">
              {muralUrl}
            </a>
            <CButton color="primary" type="button" onClick={copyUrl}>
              Copiar URL
            </CButton>
            <p className="mb-0 text-body-secondary">
              Escaneá este código para consultar el mural del curso.
            </p>
            {copyMessage && (
              <CAlert color={copyMessage === "URL copiada." ? "success" : "warning"} className="mb-0">
                {copyMessage}
              </CAlert>
            )}
          </>
        ) : (
          <p className="mb-0 text-body-secondary">Preparando el acceso público al mural…</p>
        )}
      </CCardBody>
    </CCard>
  );
}