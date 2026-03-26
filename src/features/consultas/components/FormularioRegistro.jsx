import React from "react";
import { Stethoscope, AlertTriangle, CheckCircle } from "lucide-react";

const FormularioRegistro = ({
  farmacias,
  formulario,
  onChange,
  onPreSubmit,
}) => {
  return (
    <div className="xl:col-span-1 bg-white rounded-[2.5rem] shadow-sm border border-gray-100 p-8 h-fit">
      <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-100">
        <div className="bg-[#b1cb0c]/20 p-3 rounded-2xl text-[#367933]">
          <Stethoscope size={24} />
        </div>
        <h2 className="text-2xl font-black text-[#062e3a]">Registrar Turno</h2>
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          onPreSubmit();
        }}
        className="space-y-5"
      >
        <div>
          <label className="block text-xs font-bold text-[#342c1e]/70 uppercase tracking-widest mb-1.5">
            Farmacia
          </label>
          {farmacias.length === 0 ? (
            <div className="p-3 bg-red-50 text-red-600 border border-red-100 rounded-xl text-sm font-bold flex items-center gap-2">
              <AlertTriangle size={16} /> No tienes farmacias asignadas.
            </div>
          ) : (
            <select
              name="farmaciaId"
              value={formulario.farmaciaId}
              onChange={onChange}
              className="w-full bg-[#f4f7f4] border border-gray-200 rounded-xl px-4 py-3 text-sm font-bold text-[#062e3a] focus:ring-2 focus:ring-[#b1cb0c] focus:border-transparent outline-none transition-colors appearance-none"
              required
            >
              {farmacias.map((f) => (
                <option key={f.id} value={f.id}>
                  {f.nombre}
                </option>
              ))}
            </select>
          )}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-[#342c1e]/70 uppercase tracking-widest mb-1.5">
              Fecha
            </label>
            <input
              type="date"
              name="fecha"
              value={formulario.fecha}
              onChange={onChange}
              className="w-full bg-[#f4f7f4] border border-gray-200 rounded-xl px-4 py-3 text-sm font-bold text-[#062e3a] focus:ring-2 focus:ring-[#b1cb0c] outline-none"
              required
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-[#342c1e]/70 uppercase tracking-widest mb-1.5">
              Turno
            </label>
            <select
              name="tipoTurno"
              value={formulario.tipoTurno}
              onChange={onChange}
              className="w-full bg-[#f4f7f4] border border-gray-200 rounded-xl px-4 py-3 text-sm font-bold text-[#062e3a] focus:ring-2 focus:ring-[#b1cb0c] outline-none appearance-none"
            >
              <option value="MANANA">Mañana</option>
              <option value="TARDE">Tarde</option>
              <option value="DIA_COMPLETO">Día Completo</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-[#342c1e]/70 uppercase tracking-widest mb-1.5">
              Hora Inicio
            </label>
            <input
              type="time"
              name="horaInicio"
              value={formulario.horaInicio}
              onChange={onChange}
              className="w-full bg-[#f4f7f4] border border-gray-200 rounded-xl px-4 py-3 text-sm font-bold text-[#062e3a] focus:ring-2 focus:ring-[#b1cb0c] outline-none"
              required
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-[#342c1e]/70 uppercase tracking-widest mb-1.5">
              Hora Fin
            </label>
            <input
              type="time"
              name="horaFin"
              value={formulario.horaFin}
              onChange={onChange}
              className="w-full bg-[#f4f7f4] border border-gray-200 rounded-xl px-4 py-3 text-sm font-bold text-[#062e3a] focus:ring-2 focus:ring-[#b1cb0c] outline-none"
              required
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 p-5 bg-[#f4f7f4] rounded-[1.5rem] border border-gray-100">
          {["nuevas", "revisiones", "promociones", "personalFarmacia"].map(
            (campo) => (
              <div key={campo}>
                <label className="block text-[10px] font-black text-[#342c1e]/60 uppercase tracking-widest mb-1.5">
                  {campo
                    .replace("personalFarmacia", "Personal")
                    .replace("promociones", "Promo")}
                </label>
                <input
                  type="number"
                  min="0"
                  name={campo}
                  value={formulario[campo]}
                  onChange={onChange}
                  className="w-full border-gray-200 rounded-lg py-2 px-3 text-sm font-bold text-[#062e3a] focus:ring-2 focus:ring-[#b1cb0c] outline-none"
                />
              </div>
            ),
          )}
        </div>

        <div>
          <label className="block text-xs font-bold text-[#342c1e]/70 uppercase tracking-widest mb-1.5">
            Observaciones
          </label>
          <textarea
            name="observacionesJornada"
            value={formulario.observacionesJornada}
            onChange={onChange}
            rows="2"
            className="w-full bg-[#f4f7f4] border border-gray-200 rounded-xl px-4 py-3 text-sm text-[#062e3a] focus:ring-2 focus:ring-[#b1cb0c] outline-none"
          ></textarea>
        </div>

        <button
          type="submit"
          disabled={farmacias.length === 0}
          className="w-full bg-[#367933] hover:bg-[#006633] text-white font-black py-4 rounded-[1.25rem] transition-colors shadow-lg shadow-[#367933]/20 disabled:bg-gray-300 flex justify-center items-center gap-2 mt-4 active:scale-[0.98]"
        >
          <CheckCircle size={20} /> Revisar y Registrar
        </button>
      </form>
    </div>
  );
};

export default FormularioRegistro;
