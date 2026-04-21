import React from "react";
import { Loader2 } from "lucide-react";
import { useSuministros } from "../hooks/useSuministros";
import NutriChecklistMaterial from "../components/nutricionista/NutriChecklistMaterial";
import NutriHistorialPeticiones from "../components/nutricionista/NutriHistorialPeticiones";

const VistaSuministros = () => {
  const hook = useSuministros();

  if (hook.cargando)
    return (
      <div className="flex justify-center p-8">
        <Loader2 className="animate-spin text-[#367933]" size={48} />
      </div>
    );

  return (
    <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 animate-fade-in">
      {/* 1. Columna Izquierda: Checklist para solicitar material */}
      <NutriChecklistMaterial
        materiales={hook.materiales}
        seleccionados={hook.seleccionados}
        onCheckbox={hook.handleCheckbox}
        onSolicitar={hook.handleSolicitar}
        enviando={hook.enviando}
      />

      {/* 2. Columna Derecha: Filtros e Historial de mis peticiones */}
      <NutriHistorialPeticiones
        peticionesFiltradas={hook.peticionesFiltradas}
        mesFiltro={hook.mesFiltro}
        setMesFiltro={hook.setMesFiltro}
        estadoFiltro={hook.estadoFiltro}
        setEstadoFiltro={hook.setEstadoFiltro}
        ordenFiltro={hook.ordenFiltro}
        setOrdenFiltro={hook.setOrdenFiltro}
        mesesDisponibles={hook.mesesDisponibles}
      />
    </div>
  );
};

export default VistaSuministros;
