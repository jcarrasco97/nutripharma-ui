import React from "react";
import { PieChart, Scale, Loader2, Package } from "lucide-react";

const ModalRepartoComisiones = ({
  mostrar,
  repartosActuales,
  sumaReparto,
  enviando,
  onCerrar,
  onCambioSlider,
  onRepartoEquitativo,
  onConfirmarEnvio,
}) => {
  if (!mostrar) return null;

  const coloresGrafico = [
    "bg-[#367933]",
    "bg-[#b1cb0c]",
    "bg-[#062e3a]",
    "bg-[#342c1e]",
    "bg-gray-400",
  ];

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-[#062e3a]/80 backdrop-blur-sm">
      <div className="bg-white rounded-[2.5rem] shadow-2xl max-w-lg w-full overflow-hidden animate-scale-in border border-[#b1cb0c]/20">
        <div className="bg-gradient-to-r from-[#062e3a] to-[#342c1e] p-8 text-white text-center relative">
          <div className="bg-[#b1cb0c]/20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
            <PieChart size={32} className="text-[#bed000]" />
          </div>
          <h3 className="text-2xl font-black">Asignar Comisión</h3>
          <p className="text-[#bed000]/80 mt-2 text-sm font-bold">
            Esta farmacia tiene {repartosActuales.length} nutricionistas.
            Reparte la comisión del pedido antes de enviarlo.
          </p>
        </div>

        <div className="p-8 space-y-8">
          <div className="w-full h-6 bg-[#f4f7f4] rounded-full flex overflow-hidden shadow-inner border border-gray-200">
            {repartosActuales.map((r, i) => (
              <div
                key={r.nutricionistaId}
                style={{ width: `${r.porcentaje}%` }}
                className={`h-full transition-all duration-300 ${coloresGrafico[i % coloresGrafico.length]}`}
              ></div>
            ))}
          </div>

          <div className="space-y-6">
            {repartosActuales.map((r, i) => (
              <div
                key={r.nutricionistaId}
                className="bg-[#f4f7f4] p-4 rounded-2xl border border-gray-200"
              >
                <div className="flex justify-between items-center mb-3">
                  <div className="flex items-center gap-2">
                    <div
                      className={`w-3 h-3 rounded-full ${coloresGrafico[i % coloresGrafico.length]}`}
                    ></div>
                    <span className="font-bold text-[#062e3a]">{r.nombre}</span>
                  </div>
                  <span className="font-black text-xl text-[#367933]">
                    {r.porcentaje}%
                  </span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={r.porcentaje}
                  onChange={(e) =>
                    onCambioSlider(r.nutricionistaId, e.target.value)
                  }
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#367933]"
                />
              </div>
            ))}
          </div>

          <div className="flex justify-between items-center">
            <button
              onClick={onRepartoEquitativo}
              className="text-[#367933] font-bold text-sm flex items-center gap-2 hover:text-[#006633] transition-colors"
            >
              <Scale size={16} /> Repartir a partes iguales
            </button>
            <div
              className={`text-sm font-black px-3 py-1 rounded-lg ${sumaReparto === 100 ? "bg-[#b1cb0c]/20 text-[#367933]" : "bg-red-100 text-red-700 animate-pulse"}`}
            >
              Total: {sumaReparto}%
            </div>
          </div>
        </div>

        <div className="p-6 bg-gray-50 flex gap-4 border-t border-gray-100">
          <button
            onClick={onCerrar}
            className="flex-1 py-4 bg-white border-2 border-gray-200 text-[#342c1e] font-black rounded-2xl hover:bg-gray-100 transition-colors"
          >
            Cancelar
          </button>
          <button
            onClick={onConfirmarEnvio}
            disabled={sumaReparto !== 100 || enviando}
            className="flex-1 py-4 bg-[#367933] text-white font-black rounded-2xl shadow-lg shadow-[#367933]/20 hover:bg-[#006633] transition-all disabled:bg-gray-300 flex justify-center items-center gap-2"
          >
            {enviando ? (
              <Loader2 className="animate-spin" size={20} />
            ) : (
              <>
                <Package size={18} /> Enviar Pedido
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ModalRepartoComisiones;
