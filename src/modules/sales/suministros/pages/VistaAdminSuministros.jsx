import React from "react";
import { Loader2 } from "lucide-react";
import { useAdminSuministros } from "../hooks/useAdminSuministros";
import AdminSuministrosHeader from "../components/admin/AdminSuministrosHeader";
import AdminTarjetaPeticion from "../components/admin/AdminTarjetaPeticion";

const VistaAdminSuministros = () => {
  const hook = useAdminSuministros();

  if (hook.cargando)
    return (
      <div className="flex justify-center p-20">
        <Loader2 className="animate-spin text-[#367933]" size={48} />
      </div>
    );

  return (
    <div className="animate-fade-in space-y-6 pb-10">
      {/* 1. Cabecera con Buscador y Filtros (Externalizado) */}
      <AdminSuministrosHeader
        busqueda={hook.busqueda}
        setBusqueda={hook.setBusqueda}
        estadoFiltro={hook.estadoFiltro}
        setEstadoFiltro={hook.setEstadoFiltro}
      />

      {/* 2. Listado de Tarjetas */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {hook.peticionesFiltradas.length === 0 ? (
          <div className="col-span-full text-center py-20 bg-white rounded-[2.5rem] border border-gray-100">
            <p className="text-[#342c1e]/60 font-bold">
              No hay peticiones con estos filtros.
            </p>
          </div>
        ) : (
          hook.peticionesFiltradas.map((pet) => (
            <AdminTarjetaPeticion
              key={pet.id}
              pet={pet}
              onCambiarEstado={hook.handleCambiarEstado}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default VistaAdminSuministros;
