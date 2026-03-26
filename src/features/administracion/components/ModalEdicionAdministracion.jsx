import React from "react";
import { Edit, X, Save, Car, MapPin } from "lucide-react";

const ModalEdicionAdministracion = ({
  itemEditando, setItemEditando, pestana, handleActualizar,
  farmacias, handleToggleFarmacia, handleCambiarKilometros
}) => {
  if (!itemEditando) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#062e3a]/70 backdrop-blur-sm">
      <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full overflow-hidden animate-scale-in">
        <div className="p-6 bg-[#062e3a] text-white flex justify-between items-center">
          <h3 className="text-xl font-bold flex items-center gap-2">
            <Edit size={20} className="text-[#bed000]" /> Modificar Datos
          </h3>
          <button onClick={() => setItemEditando(null)} className="text-white/70 hover:text-[#bed000] transition-colors">
            <X size={24} />
          </button>
        </div>
        
        <form onSubmit={handleActualizar} className="p-6 space-y-4 max-h-[70vh] overflow-y-auto custom-scrollbar">
          
          {pestana === "nutricionistas" && (
            <>
              <input type="text" value={itemEditando.nombre} onChange={(e) => setItemEditando({ ...itemEditando, nombre: e.target.value })} className="w-full p-3 bg-[#f4f7f4] border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#b1cb0c] outline-none text-[#062e3a] font-bold" placeholder="Nombre" required />
              <input type="text" value={itemEditando.apellidos} onChange={(e) => setItemEditando({ ...itemEditando, apellidos: e.target.value })} className="w-full p-3 bg-[#f4f7f4] border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#b1cb0c] outline-none text-[#062e3a] font-bold" placeholder="Apellidos" required />
              <input type="number" value={itemEditando.horasContratoMensual} onChange={(e) => setItemEditando({ ...itemEditando, horasContratoMensual: e.target.value })} className="w-full p-3 bg-[#f4f7f4] border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#b1cb0c] outline-none text-[#062e3a] font-bold" placeholder="Horas mensuales" required />

              <div className="pt-2 border-t border-gray-100">
                <label className="block text-sm font-bold text-[#062e3a] mb-2">Asignación y Kilometraje</label>
                <div className="max-h-56 overflow-y-auto space-y-2 p-3 border border-gray-200 rounded-xl bg-gray-50 custom-scrollbar">
                  {farmacias.map((farmacia) => {
                    const asignacionInfo = itemEditando.asignaciones?.find((a) => a.farmaciaId === farmacia.id);
                    const isChecked = !!asignacionInfo;
                    return (
                      <div key={farmacia.id} className={`flex flex-col p-3 rounded-lg border transition-all ${isChecked ? "bg-white border-[#b1cb0c]/50 shadow-sm" : "bg-transparent border-transparent hover:bg-gray-100"}`}>
                        <label className="flex items-center gap-3 cursor-pointer">
                          <input type="checkbox" checked={isChecked} onChange={(e) => handleToggleFarmacia(farmacia.id, e.target.checked, true)} className="w-4 h-4 text-[#367933] rounded border-gray-300 focus:ring-[#367933]" />
                          <span className="text-sm font-bold text-[#062e3a]">{farmacia.nombre}</span>
                        </label>
                        {isChecked && (
                          <div className="mt-2 pl-7 flex items-center gap-2 animate-fade-in">
                            <Car size={14} className="text-gray-400" />
                            <input type="number" min="0" value={asignacionInfo.kilometros} onChange={(e) => handleCambiarKilometros(farmacia.id, e.target.value, true)} className="w-20 p-1 text-sm border border-gray-200 rounded-md focus:ring-2 focus:ring-[#b1cb0c] outline-none font-bold text-[#062e3a]" placeholder="Km" required />
                            <span className="text-xs font-bold text-[#342c1e]/60">Km totales</span>
                          </div>
                        )}
                      </div>
                    );
                  })}
                  {farmacias.length === 0 && <p className="text-xs text-gray-500 text-center">No hay farmacias.</p>}
                </div>
              </div>
            </>
          )}

          {pestana === "farmacias" && (
            <>
              <input type="text" value={itemEditando.nombre} onChange={(e) => setItemEditando({ ...itemEditando, nombre: e.target.value })} className="w-full p-3 bg-[#f4f7f4] border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#b1cb0c] outline-none text-[#062e3a] font-bold" placeholder="Nombre Farmacia" required />
              <input type="text" value={itemEditando.cif} onChange={(e) => setItemEditando({ ...itemEditando, cif: e.target.value })} className="w-full p-3 bg-[#f4f7f4] border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#b1cb0c] outline-none text-[#062e3a] font-bold" placeholder="CIF" required />
              <input type="text" value={itemEditando.direccion} onChange={(e) => setItemEditando({ ...itemEditando, direccion: e.target.value })} className="w-full p-3 bg-[#f4f7f4] border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#b1cb0c] outline-none text-[#062e3a] font-bold" placeholder="Dirección" required />
              <label className="flex items-center gap-3 p-4 bg-[#b1cb0c]/10 border border-[#b1cb0c]/30 rounded-xl cursor-pointer mt-2">
                <input type="checkbox" checked={itemEditando.esProvinciaLocal !== false} onChange={(e) => setItemEditando({ ...itemEditando, esProvinciaLocal: e.target.checked })} className="w-5 h-5 text-[#367933] rounded focus:ring-[#367933]" />
                <span className="text-sm font-bold text-[#062e3a]">Provincia de Almería (Aplica PVF)</span>
              </label>
              <div className="relative mt-2">
                <label className="block text-xs font-bold text-[#342c1e]/70 uppercase mb-1">Comisión para la Farmacia</label>
                <input type="number" value={itemEditando.porcentajeComision || 30} onChange={(e) => setItemEditando({ ...itemEditando, porcentajeComision: e.target.value })} required min="0" max="100" step="0.1" className="w-full p-3 bg-[#f4f7f4] border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#b1cb0c] outline-none text-[#062e3a] font-bold" />
                <span className="absolute right-4 top-10 text-gray-400 font-bold">%</span>
              </div>
            </>
          )}

          {pestana === "productos" && (
            <>
              <input type="text" value={itemEditando.nombreProducto} onChange={(e) => setItemEditando({ ...itemEditando, nombreProducto: e.target.value })} className="w-full p-3 bg-[#f4f7f4] border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#b1cb0c] outline-none text-[#062e3a] font-bold" placeholder="Nombre Producto" required />
              <div className="flex gap-2">
                <input type="number" step="0.01" value={itemEditando.pvf} onChange={(e) => setItemEditando({ ...itemEditando, pvf: e.target.value })} className="w-full p-3 bg-[#f4f7f4] border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#b1cb0c] outline-none text-[#062e3a] font-bold" placeholder="PVF" required />
                <input type="number" step="0.01" value={itemEditando.pvp} onChange={(e) => setItemEditando({ ...itemEditando, pvp: e.target.value })} className="w-full p-3 bg-[#f4f7f4] border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#b1cb0c] outline-none text-[#062e3a] font-bold" placeholder="PVP" required />
              </div>
            </>
          )}

          <button type="submit" className="w-full bg-[#367933] hover:bg-[#006633] text-white font-bold py-3 rounded-xl flex items-center justify-center gap-2 mt-4 shadow-lg shadow-[#367933]/20 transition-colors">
            <Save size={18} /> Guardar Cambios
          </button>
        </form>
      </div>
    </div>
  );
};

export default ModalEdicionAdministracion;