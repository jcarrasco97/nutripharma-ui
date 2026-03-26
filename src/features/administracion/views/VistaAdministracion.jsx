import React from "react";
import { Users, Store, Loader2, PackagePlus } from "lucide-react";

import { useAdministracion } from "../hooks/useAdministracion";
import FormularioEntidad from "../components/FormularioAdministracion";
import ModalEdicionEntidad from "../components/ModalEdicionAdministracion";
import ListadoEntidades from "../components/ListadoAdministracion";
import ArchivoBajas from "../components/ArchivoAdministracion";

const VistaAdministracion = () => {
  const hook = useAdministracion();

  if (hook.cargando && hook.nutricionistas.length === 0) {
    return (
      <div className="flex justify-center py-20">
        <Loader2 className="animate-spin text-[#367933]" size={48} />
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-in pb-10 relative">
      <ModalEdicionEntidad {...hook} />

      <div className="flex gap-4 border-b border-gray-200 pb-4 overflow-x-auto custom-scrollbar">
        <button
          onClick={() => hook.setPestana("nutricionistas")}
          className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold transition-all whitespace-nowrap ${hook.pestana === "nutricionistas" ? "bg-[#367933] text-white shadow-md" : "bg-gray-50 text-[#342c1e]/70 hover:bg-gray-100 hover:text-[#062e3a]"}`}
        >
          <Users size={20} /> Plantilla Nutricionistas
        </button>
        <button
          onClick={() => hook.setPestana("farmacias")}
          className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold transition-all whitespace-nowrap ${hook.pestana === "farmacias" ? "bg-[#367933] text-white shadow-md" : "bg-gray-50 text-[#342c1e]/70 hover:bg-gray-100 hover:text-[#062e3a]"}`}
        >
          <Store size={20} /> Red de Farmacias
        </button>
        <button
          onClick={() => hook.setPestana("productos")}
          className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold transition-all whitespace-nowrap ${hook.pestana === "productos" ? "bg-[#367933] text-white shadow-md" : "bg-gray-50 text-[#342c1e]/70 hover:bg-gray-100 hover:text-[#062e3a]"}`}
        >
          <PackagePlus size={20} /> Catálogo Productos
        </button>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        <div className="xl:col-span-2 space-y-6">
          <ListadoEntidades {...hook} />
          <ArchivoBajas {...hook} />
        </div>

        <FormularioEntidad {...hook} />
      </div>
    </div>
  );
};

export default VistaAdministracion;
