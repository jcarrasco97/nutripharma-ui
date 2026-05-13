import React from "react";
import { useValidaciones } from "../hooks/useValidaciones";
import PanelLiquidacion from "../components/PanelLiquidacion";
import ModalDetalleValidacion from "../components/ModalDetalleValidacion";
import { ModalVerEvidencia } from "@/modules/operations/consultas";

/**
 * Vista independiente: Cierre de Caja (Liquidación)
 * Renderiza únicamente el PanelLiquidacion sin la cabecera "Centro de Validaciones"
 * ni las pestañas de navegación de ValidacionesPage.
 *
 * El hook arranca en "consultas" por defecto, que es precisamente el contexto
 * que carga los datos de liquidación (pendientesLiquidar viene de consultas VALIDADAS).
 */
const CierreCajaPage = () => {
  const hook = useValidaciones();

  return (
    <div className="space-y-6 animate-fade-in pb-10 relative">
      {/* Modales necesarios para el panel (ver detalle desde el ojo del PanelLiquidacion) */}
      <ModalVerEvidencia
        urlEvidencia={hook.urlEvidenciaModal}
        fechaConsulta={hook.detalleSeleccionado?.fecha}
        evidenciaFecha={hook.detalleSeleccionado?.evidenciaFecha}
        onClose={hook.cerrarModalEvidencia}
      />

      <ModalDetalleValidacion
        detalle={hook.detalleSeleccionado}
        pestañaActual={hook.pestañaActual}
        formEdicion={hook.formEdicion}
        setFormEdicion={hook.setFormEdicion}
        enviando={hook.enviando}
        onCerrar={() => hook.setDetalleSeleccionado(null)}
        onCancelarConsulta={hook.handleCancelarConsulta}
        onEditarYValidar={hook.handleEditarYValidar}
        calcularTotalesPedido={hook.calcularTotalesPedido}
        agruparLineasPorProducto={hook.agruparLineasPorProducto}
        onVerFoto={hook.handleVerFoto}
        onBorrarEvidencia={hook.handleBorrarEvidenciaAdmin}
        onIniciarEnvio={() => hook.iniciarProcesoEnvio(hook.detalleSeleccionado)}
        onEstadoSuministro={hook.handleEstadoSuministro}
        onCancelarPedido={hook.handleCancelarPedido}
        indexActual={hook.indexActual}
        totalPendientes={hook.totalPendientes}
        hayAnterior={hook.hayAnterior}
        haySiguiente={hook.haySiguiente}
        onAnterior={hook.irAnterior}
        onSiguiente={hook.irSiguiente}
      />

      {/* Panel de Liquidación (componente completo) */}
      <PanelLiquidacion hook={hook} />
    </div>
  );
};

export default CierreCajaPage;
