import React from "react";
import { Loader2, Mail, Trash2 } from "lucide-react";

const ListadoAdmins = ({ admins, cargando, handleEliminar }) => {
  return (
    <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="p-6 border-b border-gray-100 bg-[#f4f7f4] flex items-center justify-between">
        <h3 className="font-bold text-[#062e3a]">Administradores Activos</h3>
        <span className="bg-[#062e3a]/10 text-[#062e3a] text-xs font-black px-3 py-1 rounded-full">
          {admins.length} Usuarios
        </span>
      </div>

      {cargando ? (
        <div className="flex justify-center py-12">
          <Loader2 className="animate-spin text-[#367933]" size={32} />
        </div>
      ) : (
        <div className="divide-y divide-gray-50">
          {admins.map((admin) => (
            <div
              key={admin.id}
              className="p-5 flex justify-between items-center hover:bg-[#f4f7f4] transition-colors group"
            >
              <div className="flex items-center gap-4">
                <div className="bg-[#062e3a] text-white w-12 h-12 rounded-full flex items-center justify-center font-black text-lg shadow-md shrink-0">
                  {admin.nombre.charAt(0)}
                  {admin.apellidos ? admin.apellidos.charAt(0) : ""}
                </div>
                <div>
                  <p className="font-black text-[#062e3a] text-lg">
                    {admin.nombre} {admin.apellidos}
                  </p>
                  <p className="text-sm font-bold text-[#367933] flex items-center gap-1">
                    <Mail size={14} /> {admin.email}
                  </p>
                </div>
              </div>
              <button
                onClick={() => handleEliminar(admin.id)}
                className="p-3 text-red-500 bg-red-50 rounded-xl hover:bg-red-500 hover:text-white transition-all opacity-100 md:opacity-0 group-hover:opacity-100"
                title="Revocar Acceso"
              >
                <Trash2 size={18} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ListadoAdmins;
