import React from "react";
import { Clock, XCircle, CheckCircle } from "lucide-react";

const AdminTarjetaPeticion = ({ pet, onCambiarEstado }) => (
  <div
    className={`bg-white rounded-[2rem] p-6 border-2 transition-all shadow-sm ${pet.estado === "SOLICITADO" ? "border-[#b1cb0c]/50 hover:shadow-lg hover:border-[#b1cb0c]" : "border-gray-50 opacity-75 hover:opacity-100"}`}
  >
    <div className="flex justify-between items-start mb-4 border-b border-gray-50 pb-4">
      <div>
        <span className="text-[10px] font-black text-[#342c1e]/60 uppercase tracking-widest">
          Petición #{pet.id}
        </span>
        <h3 className="text-lg font-black text-[#062e3a]">
          {pet.nutricionistaNombre}
        </h3>
        <p className="text-xs text-[#342c1e] font-bold mt-1 flex items-center gap-1">
          <Clock size={12} /> {pet.fechaPeticion}
        </p>
      </div>
      <span
        className={`text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest ${pet.estado === "SOLICITADO" ? "bg-[#b1cb0c]/20 text-[#367933]" : pet.estado === "APROBADO" ? "bg-emerald-100 text-emerald-700" : "bg-red-100 text-red-700"}`}
      >
        {pet.estado}
      </span>
    </div>
    <div className="mb-6 min-h-[100px]">
      <p className="text-xs font-black text-[#342c1e]/60 uppercase tracking-widest mb-2">
        Material Requerido:
      </p>
      <ul className="space-y-1 text-sm font-bold text-[#062e3a]">
        {pet.materiales.map((mat, i) => (
          <li key={i} className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-[#367933]"></div>
            {mat.nombre}{" "}
            <span className="text-[#342c1e]/70 font-medium">
              ({mat.cantidadEstandar} uds)
            </span>
          </li>
        ))}
      </ul>
    </div>
    {pet.estado === "SOLICITADO" && (
      <div className="flex gap-2 pt-4 border-t border-gray-50">
        <button
          onClick={() => onCambiarEstado(pet.id, "CANCELADO")}
          className="flex-1 py-3 bg-red-50 hover:bg-red-100 text-red-600 font-black text-xs uppercase tracking-widest rounded-xl transition-colors flex justify-center items-center gap-2"
        >
          <XCircle size={16} /> Denegar
        </button>
        <button
          onClick={() => onCambiarEstado(pet.id, "APROBADO")}
          className="flex-1 py-3 bg-emerald-500 hover:bg-emerald-600 text-white font-black text-xs uppercase tracking-widest rounded-xl transition-colors shadow-md shadow-emerald-200 flex justify-center items-center gap-2"
        >
          <CheckCircle size={16} /> Aprobar
        </button>
      </div>
    )}
  </div>
);

export default AdminTarjetaPeticion;
