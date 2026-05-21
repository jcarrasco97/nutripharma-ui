import React, { useState } from "react";
import { Loader2 } from "lucide-react";

import { useConsultas } from "../hooks/useConsultas";
import FormularioRegistro from "../components/FormularioRegistro";
import HistorialTurnos from "../components/HistorialTurnos";
import ModalResumenTurno from "../components/ModalResumenTurno";
import ModalVerEvidencia from "../components/ModalVerEvidencia";
import { Badge } from "@/shared/components/ui/Badge";

const ConsultasPage = () => {
  const hook = useConsultas();

  // ── ESTADO UI ──
  const [vistaActiva, setVistaActiva] = useState("nuevo");

  if (hook.cargando) {
    return (
      <div className="flex justify-center p-8">
        <Loader2 className="animate-spin text-primary" size={48} />
      </div>
    );
  }

  // ── DEFINICIÓN DE PESTAÑAS (Estilo Vercel Underline) ──
  const TABS = [
    { key: "nuevo", label: "Nuevo Turno" },
    { key: "historial", label: "Historial", count: hook.consultas.length },
  ];

  return (
    <>
      {/* ── MODAL VER EVIDENCIA (intacto) ── */}
      <ModalVerEvidencia
        urlEvidencia={hook.urlEvidenciaModal}
        fechaConsulta={hook.consultaFotoSeleccionada?.fecha}
        evidenciaFecha={hook.consultaFotoSeleccionada?.evidenciaFecha}
        onClose={hook.cerrarModalEvidencia}
      />

      {/* ── MODAL RESUMEN TURNO (intacto) ── */}
      <ModalResumenTurno
        mostrar={hook.mostrarModal}
        onCerrar={() => hook.setMostrarModal(false)}
        onConfirmar={hook.confirmarYGuardar}
        guardando={hook.guardando}
        formulario={hook.formulario}
        farmaciaNombre={hook.farmaciaSeleccionadaNombre}
        previewUrl={hook.previewUrl}
      />

      {/* ── PÁGINA PRINCIPAL ── */}
      <div className="space-y-4 animate-fade-in pb-10 -mt-2 md:-mt-4">

        {/* ── CABECERA: TABS ── */}
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-end gap-4 min-h-[40px] mb-4">
          <div className="flex gap-4">
            {TABS.map((tab) => {
              const isActive = vistaActiva === tab.key;
              return (
                <button
                  key={tab.key}
                  onClick={() => setVistaActiva(tab.key)}
                  className={`pb-2 text-[14px] font-medium transition-colors whitespace-nowrap border-b-2 px-1 outline-none flex items-center gap-1.5 ${isActive
                    ? "border-primary text-primary"
                    : "border-transparent text-neutral/50 hover:text-secondary hover:border-neutral/30"
                    }`}
                >
                  {tab.label}
                  {/* Badge numérico (Solo si existe 'count') */}
                  {tab.count !== undefined && (
                    <Badge
                      className={`border-none text-[10px] font-black px-1.5 py-0 h-4 transition-colors ${isActive
                        ? "bg-primary/10 text-primary"
                        : "bg-neutral/10 text-neutral/60"
                        }`}
                    >
                      {tab.count}
                    </Badge>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* ── CONTENIDO: NUEVO TURNO ── */}
        {vistaActiva === "nuevo" && (
          <div className="max-w-3xl pt-2">
            <FormularioRegistro
              farmacias={hook.farmacias}
              formulario={hook.formulario}
              onChange={hook.handleChange}
              onPreSubmit={hook.handlePreSubmit}
              archivoEvidencia={hook.archivoEvidencia}
              previewUrl={hook.previewUrl}
              handleArchivoChange={hook.handleArchivoChange}
              horasOcupadasHoy={hook.horasOcupadasHoy}
              onVerPreview={hook.handleVerPreview}
            />
          </div>
        )}

        {/* ── CONTENIDO: HISTORIAL ── */}
        {vistaActiva === "historial" && (
          <div className="pt-2">
            {/* Se mantiene intacto para refactorizarlo a DataTable en el siguiente prompt */}
            <HistorialTurnos
              consultasTotales={hook.consultas}
              handleIncidencia={hook.handleIncidencia}
              handleConfirmarAntiguo={hook.handleConfirmarAntiguo}
              toggleObservaciones={hook.toggleObservaciones}
              obsExpandidas={hook.obsExpandidas}
              handleSubirEvidenciaAposteriori={hook.handleSubirEvidenciaAposteriori}
              handleVerFoto={hook.handleVerFoto}
            />
          </div>
        )}
      </div>
    </>
  );
};

export default ConsultasPage;