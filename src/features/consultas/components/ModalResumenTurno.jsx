import React from "react";
import { X, Loader2 } from "lucide-react";

const ModalResumenTurno = ({
  mostrar,
  onCerrar,
  onConfirmar,
  guardando,
  formulario,
  farmaciaNombre,
}) => {
  if (!mostrar) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#062e3a]/60 backdrop-blur-sm">
      <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full overflow-hidden animate-fade-in">
        <div className="bg-[#062e3a] p-6 text-white flex justify-between items-center">
          <h3 className="text-xl font-bold">Resumen del Turno</h3>
          <button
            onClick={onCerrar}
            className="text-white/70 hover:text-[#b1cb0c] transition-colors"
          >
            <X size={24} />
          </button>
        </div>
        <div className="p-6 space-y-4">
          <div className="bg-[#f4f7f4] rounded-xl p-5 border border-gray-100 space-y-3 text-sm">
            <p>
              <strong className="text-[#062e3a]">Farmacia:</strong>{" "}
              <span className="font-bold text-[#367933]">{farmaciaNombre}</span>
            </p>
            <p>
              <strong className="text-[#062e3a]">Horario:</strong>{" "}
              <span className="font-bold text-[#342c1e]">
                {formulario.horaInicio} a {formulario.horaFin}
              </span>
            </p>
            <div className="border-t border-gray-200 my-2 pt-3 grid grid-cols-2 gap-3">
              <p>
                <strong className="text-[#062e3a]">Nuevas:</strong>{" "}
                <span className="font-black text-[#367933]">
                  {formulario.nuevas}
                </span>
              </p>
              <p>
                <strong className="text-[#062e3a]">Revisiones:</strong>{" "}
                <span className="font-black text-[#367933]">
                  {formulario.revisiones}
                </span>
              </p>
              <p>
                <strong className="text-[#062e3a]">Promo:</strong>{" "}
                <span className="font-black text-[#367933]">
                  {formulario.promociones}
                </span>
              </p>
              <p>
                <strong className="text-[#062e3a]">Personal:</strong>{" "}
                <span className="font-black text-[#367933]">
                  {formulario.personalFarmacia}
                </span>
              </p>
            </div>
          </div>
          <div className="flex gap-3 pt-4">
            <button
              onClick={onCerrar}
              disabled={guardando}
              className="flex-1 py-3 px-4 bg-gray-100 hover:bg-gray-200 text-[#342c1e] font-bold rounded-xl transition-colors disabled:opacity-50"
            >
              Cancelar
            </button>
            <button
              onClick={onConfirmar}
              disabled={guardando}
              className="flex-1 py-3 px-4 bg-[#367933] hover:bg-[#006633] text-white font-bold rounded-xl transition-colors flex items-center justify-center shadow-lg shadow-[#367933]/20 disabled:opacity-50"
            >
              {guardando ? (
                <Loader2 className="animate-spin" size={20} />
              ) : (
                "Sí, Confirmar"
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModalResumenTurno;
