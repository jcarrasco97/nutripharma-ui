import React, { useState } from "react";
import { FileText, Loader2 } from "lucide-react";

// Imports limpios desde los submódulos (rutas relativas porque estamos en el mismo módulo)
import { useDocumentacion, PanelSubidaDocumentos, FiltrosDocumentos, GridDocumentos } from "../documentacion";
import { SubidaFacturas, ListadoFacturas } from "../facturas";

const DocumentacionPage = () => {
  const hook = useDocumentacion();
  const [updateCounter, setUpdateCounter] = useState(0);

  if (hook.cargando) {
    return (
      <div className="flex justify-center p-20">
        <Loader2 className="animate-spin text-[#367933]" size={48} />
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-in pb-10">
      {/* 1. Panel de subida (Exclusivo Administradores) */}
      {hook.isAdmin && <PanelSubidaDocumentos {...hook} />}

      {/* 2. Repositorio Común */}
      <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-100">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8 pb-4 border-b border-gray-100">
          <div className="flex items-center gap-4">
            <div className="bg-[#f4f7f4] p-3 rounded-2xl text-[#367933]">
              <FileText size={24} />
            </div>
            <h2 className="text-xl font-black text-[#062e3a]">
              Repositorio Documental
            </h2>
          </div>
        </div>

        <FiltrosDocumentos {...hook} />
        <GridDocumentos {...hook} />
      </div>

      {/* 3. Panel de Facturas de Gastos (Nutricionistas) */}
      {!hook.isAdmin && !hook.esFarmacia && (
        <div className="space-y-8 mt-12">
          <SubidaFacturas onSubidaExitosa={() => setUpdateCounter(c => c + 1)} />
          <ListadoFacturas esAdmin={false} forceUpdate={updateCounter} />
        </div>
      )}

      {/* 4. Panel de Facturas de Gastos (Admins) */}
      {hook.isAdmin && (
        <div className="mt-12">
          <ListadoFacturas esAdmin={true} forceUpdate={updateCounter} />
        </div>
      )}
    </div>
  );
};

export default DocumentacionPage;
