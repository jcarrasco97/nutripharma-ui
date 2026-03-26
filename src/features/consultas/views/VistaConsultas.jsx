import React from "react";
import { Loader2 } from "lucide-react";

// 1. Importamos el Cerebro
import { useConsultas } from "../hooks/useConsultas";

// 2. Importamos los Órganos Visuales (Ajusta las rutas según donde los hayas guardado)
import FormularioRegistro from "../components/FormularioRegistro";
import HistorialTurnos from "../components/HistorialTurnos";
import ModalResumenTurno from "../components/ModalResumenTurno";

const VistaConsultas = () => {
  // Invocamos el cerebro. Nos devuelve solo lo que necesitamos.
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
      <ModalResumenTurno
        mostrar={hook.mostrarModal}
        onCerrar={() => hook.setMostrarModal(false)}
        onConfirmar={hook.confirmarYGuardar}
        guardando={hook.guardando}
        formulario={hook.formulario}
        farmaciaNombre={hook.farmaciaSeleccionadaNombre}
      />

      <FormularioRegistro
        farmacias={hook.farmacias}
        formulario={hook.formulario}
        onChange={hook.handleChange}
        onPreSubmit={() => hook.setMostrarModal(true)}
      />

      <HistorialTurnos
        consultasFiltradas={hook.consultasFiltradas}
        mesesDisponibles={hook.mesesDisponibles}
        mesFiltro={hook.mesFiltro}
        setMesFiltro={hook.setMesFiltro}
        ordenFiltro={hook.ordenFiltro}
        setOrdenFiltro={hook.setOrdenFiltro}
        busqueda={hook.busqueda}
        setBusqueda={hook.setBusqueda}
        handleIncidencia={hook.handleIncidencia}
        handleConfirmarAntiguo={hook.handleConfirmarAntiguo}
        toggleObservaciones={hook.toggleObservaciones}
        obsExpandidas={hook.obsExpandidas}
      />
    </div>
  );
};

export default VistaConsultas;
