import React from "react";
import { Archive, Mail, RefreshCw } from "lucide-react";

const ArchivoBajasAdmins = ({
  mostrarBajas,
  setMostrarBajas,
  adminsBajas,
  handleRestaurar,
}) => {
  return (
    <div className="bg-gray-50 border border-gray-200 rounded-3xl p-4 mt-6">
      <div className="text-center mb-2">
        <button
          onClick={() => setMostrarBajas(!mostrarBajas)}
          className="inline-flex items-center gap-2 text-sm font-bold text-[#342c1e]/60 hover:text-[#062e3a] transition-colors"
        >
          <Archive size={16} />{" "}
          {mostrarBajas
            ? "Ocultar Historial de Bajas"
            : "Ver Historial de Bajas"}
        </button>
      </div>

      {mostrarBajas && (
        <div className="mt-4 border-t-2 border-dashed border-gray-200 pt-4">
          <h4 className="text-xs font-black uppercase text-[#342c1e]/50 mb-4 px-2 tracking-widest">
            Administradores Inactivos (Solo Lectura)
          </h4>
          <div className="space-y-2">
            {adminsBajas.length === 0 ? (
              <p className="text-sm text-[#342c1e]/50 italic px-2 font-bold">
                No hay historial de bajas.
              </p>
            ) : (
              adminsBajas.map((admin) => (
                <div
                  key={admin.id}
                  className="p-4 bg-gray-200/50 rounded-2xl flex items-center justify-between group"
                >
                  <div className="flex items-center gap-4 grayscale opacity-75">
                    <div className="bg-gray-300 text-gray-500 w-10 h-10 rounded-full flex items-center justify-center font-black text-sm shadow-inner shrink-0">
                      {admin.nombre.charAt(0)}
                      {admin.apellidos ? admin.apellidos.charAt(0) : ""}
                    </div>
                    <div>
                      <p className="font-bold text-[#342c1e]/70 text-base line-through">
                        {admin.nombre} {admin.apellidos}
                      </p>
                      <p className="text-xs font-medium text-[#342c1e]/50 flex items-center gap-1">
                        <Mail size={12} /> {admin.email}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => handleRestaurar(admin.id)}
                    className="p-2 text-emerald-600 bg-emerald-50 rounded-xl hover:bg-emerald-100 opacity-0 group-hover:opacity-100 transition-opacity"
                    title="Restaurar Acceso"
                  >
                    <RefreshCw size={18} />
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ArchivoBajasAdmins;
