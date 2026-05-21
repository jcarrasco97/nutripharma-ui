import React, { useState } from "react";
import { Loader2 } from "lucide-react";
import { useSuministros } from "../hooks/useSuministros";
import NutriChecklistMaterial from "../components/nutricionista/NutriChecklistMaterial";
import NutriHistorialPeticiones from "../components/nutricionista/NutriHistorialPeticiones";
import { Badge } from "@/shared/components/ui/Badge";

const VistaSuministros = () => {
  const hook = useSuministros();
  const [vistaActiva, setVistaActiva] = useState("nuevo");

  if (hook.cargando)
    return (
      <div className="flex justify-center p-8">
        <Loader2 className="animate-spin text-primary" size={48} />
      </div>
    );

  const TABS = [
    { key: "nuevo", label: "Solicitar Material" },
    {
      key: "historial",
      label: "Mis Peticiones",
      count: hook.peticionesFiltradas.length,
    },
  ];

  return (
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

      {/* ── CONTENIDO: NUEVO PEDIDO ── */}
      {vistaActiva === "nuevo" && (
        <div className="max-w-3xl pt-2">
          <NutriChecklistMaterial
            materiales={hook.materiales}
            seleccionados={hook.seleccionados}
            onCheckbox={hook.handleCheckbox}
            onSolicitar={hook.handleSolicitar}
            enviando={hook.enviando}
          />
        </div>
      )}

      {/* ── CONTENIDO: HISTORIAL ── */}
      {vistaActiva === "historial" && (
        <div className="max-w-3xl pt-2">
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
      )}
    </div>
  );
};

export default VistaSuministros;
