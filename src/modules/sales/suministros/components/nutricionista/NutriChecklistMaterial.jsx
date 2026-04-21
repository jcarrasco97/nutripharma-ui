import React from "react";
import { CheckSquare, Clock, Send, Loader2 } from "lucide-react";

const NutriChecklistMaterial = ({ materiales, seleccionados, onCheckbox, onSolicitar, enviando }) => (
  <div className="bg-white rounded-[2.5rem] shadow-sm border border-gray-100 p-8">
    <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-100">
      <div className="bg-[#367933]/10 p-3 rounded-2xl text-[#367933]"><CheckSquare size={24} /></div>
      <h2 className="text-2xl font-black text-[#062e3a]">Solicitar Material</h2>
    </div>
    <div className="space-y-3 mb-8">
      {materiales.map((mat) => (
        <label key={mat.id} className={`flex items-center p-4 border-2 rounded-2xl transition-all duration-200 ${!mat.disponible ? "border-gray-100 bg-[#f4f7f4] cursor-not-allowed opacity-70" : seleccionados.includes(mat.id) ? "border-[#367933] bg-[#b1cb0c]/10 cursor-pointer shadow-sm" : "border-gray-100 hover:border-[#b1cb0c]/50 hover:bg-gray-50 cursor-pointer"}`}>
          <input type="checkbox" checked={seleccionados.includes(mat.id)} onChange={() => onCheckbox(mat.id)} disabled={!mat.disponible} className="w-5 h-5 text-[#367933] rounded border-gray-300 focus:ring-[#367933]" />
          <div className="ml-4 flex-1 flex justify-between items-center">
            <div><span className="block font-black text-[#062e3a] text-lg">{mat.nombre}</span><span className="block text-xs font-bold text-[#342c1e]/60 mt-0.5">Cantidad estándar: {mat.cantidadEstandar} uds.</span></div>
            {!mat.disponible && <span className="text-[10px] font-black bg-amber-100 text-amber-700 px-2 py-1 rounded-md uppercase flex items-center gap-1"><Clock size={10} strokeWidth={3} /> En curso</span>}
          </div>
        </label>
      ))}
    </div>
    <button onClick={onSolicitar} disabled={seleccionados.length === 0 || enviando} className="w-full bg-[#367933] hover:bg-[#006633] disabled:bg-gray-300 text-white font-black py-4 rounded-[1.25rem] flex items-center justify-center transition-colors shadow-lg shadow-[#367933]/20">
      {enviando ? <Loader2 className="animate-spin" size={20} /> : <><Send size={18} className="mr-2" /> Enviar Petición</>}
    </button>
  </div>
);

export default NutriChecklistMaterial;