import React from "react";
import { Loader2 } from "lucide-react";

import { useConsultas } from "../hooks/useConsultas";
import FormularioRegistro from "../components/FormularioRegistro";
import HistorialTurnos from "../components/HistorialTurnos";
import ModalResumenTurno from "../components/ModalResumenTurno";
import ModalVerEvidencia from "../components/ModalVerEvidencia";

const VistaConsultas = () => {
  const hook = useConsultas();

  if (hook.cargando) {
    return (
      <div className="flex justify-center p-8">
        <Loader2 className="animate-spin text-[#367933]" size={48} />
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 animate-fade-in relative">
      {/* 👇 AÑADIMOS EL MODAL VISOR AQUÍ 👇 */}
      <ModalVerEvidencia
        urlEvidencia={hook.urlEvidenciaModal}
        fechaConsulta={hook.consultaFotoSeleccionada?.fecha} // 👇 AHORA SÍ PASAMOS LAS FECHAS
        evidenciaFecha={hook.consultaFotoSeleccionada?.evidenciaFecha}
        onClose={hook.cerrarModalEvidencia}
      />

      <ModalResumenTurno
        mostrar={hook.mostrarModal}
        onCerrar={() => hook.setMostrarModal(false)}
        onConfirmar={hook.confirmarYGuardar}
        guardando={hook.guardando}
        formulario={hook.formulario}
        farmaciaNombre={hook.farmaciaSeleccionadaNombre}
        previewUrl={hook.previewUrl}
      />

      <FormularioRegistro
        farmacias={hook.farmacias}
        formulario={hook.formulario}
        onChange={hook.handleChange}
        onPreSubmit={hook.handlePreSubmit} // 👈 Cambiado: ahora valida antes de abrir modal
        archivoEvidencia={hook.archivoEvidencia}
        previewUrl={hook.previewUrl}
        handleArchivoChange={hook.handleArchivoChange}
        horasOcupadasHoy={hook.horasOcupadasHoy} // 👈 Añadido: para mostrar los bloques ocupados
        onVerPreview={hook.handleVerPreview}
      />

      <HistorialTurnos
        consultasTotales={hook.consultas} // 👈 Le pasamos TODAS en bruto, él se encarga de filtrar
        handleIncidencia={hook.handleIncidencia}
        handleConfirmarAntiguo={hook.handleConfirmarAntiguo}
        toggleObservaciones={hook.toggleObservaciones}
        obsExpandidas={hook.obsExpandidas}
        handleSubirEvidenciaAposteriori={hook.handleSubirEvidenciaAposteriori}
        handleVerFoto={hook.handleVerFoto}
      />
    </div>
  );
};

export default VistaConsultas;
