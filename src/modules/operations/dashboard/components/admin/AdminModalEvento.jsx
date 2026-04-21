import React from "react";
import { Package, Stethoscope, X } from "lucide-react";

const AdminModalEvento = ({ eventoSeleccionado, setEventoSeleccionado }) => {
  if (!eventoSeleccionado) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#062e3a]/60 backdrop-blur-sm">
      <div className="bg-white rounded-3xl shadow-2xl max-w-sm w-full overflow-hidden animate-scale-in">
        <div
          className={`p-6 text-white flex justify-between items-center ${eventoSeleccionado.tipo === "PEDIDO" ? "bg-[#062e3a]" : "bg-[#367933]"}`}
        >
          <div className="flex items-center gap-2">
            {eventoSeleccionado.tipo === "PEDIDO" ? (
              <Package size={24} />
            ) : (
              <Stethoscope size={24} />
            )}
            <h3 className="text-xl font-bold">{eventoSeleccionado.tipo}</h3>
          </div>
          <button
            onClick={() => setEventoSeleccionado(null)}
            className="text-white/70 hover:text-white"
          >
            <X size={24} />
          </button>
        </div>
        <div className="p-6 space-y-4">
          <div>
            <p className="text-xs font-bold text-[#342c1e] uppercase tracking-widest">
              Identificador
            </p>
            <p className="font-black text-[#062e3a] text-lg">
              {eventoSeleccionado.idUnico}
            </p>
          </div>
          <div>
            <p className="text-xs font-bold text-[#342c1e] uppercase tracking-widest">
              Asunto
            </p>
            <p className="font-bold text-[#062e3a]">
              {eventoSeleccionado.titulo}
            </p>
          </div>
          <div className="bg-[#f4f7f4] p-4 rounded-xl border border-gray-100">
            <p className="text-xs font-bold text-[#342c1e] uppercase tracking-widest mb-1">
              Detalles / Importe
            </p>
            <p className="font-black text-xl text-[#062e3a]">
              {eventoSeleccionado.detalles}
            </p>
          </div>
          <div>
            <p className="text-xs font-bold text-[#342c1e] uppercase tracking-widest mb-1">
              Estado Operativo
            </p>
            <span className="bg-[#b1cb0c]/20 text-[#367933] font-bold px-3 py-1 rounded-md text-xs uppercase">
              {eventoSeleccionado.estado}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminModalEvento;
