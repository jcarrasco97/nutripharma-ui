import React from "react";
import {
  Stethoscope,
  AlertTriangle,
  CheckCircle,
  Camera,
  ChevronDown,
  Eye,
  RefreshCw,
  Trash2,
} from "lucide-react";

const FormularioRegistro = ({
  farmacias,
  formulario,
  onChange,
  onPreSubmit,
  handleArchivoChange,
  previewUrl,
  horasOcupadasHoy = [],
  onVerPreview,
}) => {
  const opcionesHora = [];
  for (let h = 7; h <= 22; h++) {
    const hora = h.toString().padStart(2, "0");
    opcionesHora.push(`${hora}:00`, `${hora}:30`);
  }

  const estaBloqueado = (hora) => {
    return horasOcupadasHoy.some((h) => hora >= h.inicio && hora < h.fin);
  };

  const duracionValida = () => {
    if (!formulario.horaInicio || !formulario.horaFin) return false;
    return formulario.horaInicio < formulario.horaFin;
  };

  return (
    <div className="xl:col-span-1 bg-white rounded-[2.5rem] shadow-sm border border-gray-100 p-8 h-fit animate-fade-in flex flex-col space-y-6">
      {/* CABECERA */}
      <div className="flex items-center gap-4 pb-4 border-b border-gray-100">
        <div className="bg-[#b1cb0c]/20 p-3 rounded-2xl text-[#367933]">
          <Stethoscope size={28} />
        </div>
        <div>
          <h2 className="text-2xl font-black text-[#062e3a] leading-tight">
            Registrar Turno
          </h2>
          <p className="text-[11px] font-bold text-[#342c1e]/50 uppercase tracking-widest mt-0.5">
            Ingreso de jornada
          </p>
        </div>
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          onPreSubmit();
        }}
        className="space-y-6"
      >
        {/* FARMACIA Y FECHA */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="md:col-span-2">
            <label className="block text-[10px] font-black text-[#062e3a]/50 uppercase tracking-widest mb-1.5 ml-1">
              Farmacia
            </label>
            <div className="relative">
              <select
                name="farmaciaId"
                value={formulario.farmaciaId}
                onChange={onChange}
                className="w-full bg-[#f4f7f4] border border-transparent focus:border-[#b1cb0c] rounded-xl px-4 py-3.5 text-sm font-bold text-[#062e3a] outline-none appearance-none transition-all cursor-pointer"
                required
              >
                {farmacias.length === 0 && (
                  <option value="">Sin farmacias asignadas</option>
                )}
                {farmacias.map((f) => (
                  <option key={f.id} value={f.id}>
                    {f.nombre}
                  </option>
                ))}
              </select>
              <ChevronDown
                size={16}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-[#062e3a]/40 pointer-events-none"
              />
            </div>
          </div>
          <div className="md:col-span-1">
            <label className="block text-[10px] font-black text-[#062e3a]/50 uppercase tracking-widest mb-1.5 ml-1">
              Fecha
            </label>
            <input
              type="date"
              name="fecha"
              value={formulario.fecha}
              onChange={onChange}
              className="w-full px-4 py-3.5 bg-[#f4f7f4] border border-transparent focus:border-[#b1cb0c] rounded-xl text-sm font-bold text-[#062e3a] outline-none transition-all"
              required
            />
          </div>
        </div>

        {/* ENTRADA Y SALIDA */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-[10px] font-black text-[#062e3a]/50 uppercase tracking-widest mb-1.5 ml-1">
              Entrada
            </label>
            <div className="relative">
              <select
                name="horaInicio"
                value={formulario.horaInicio}
                onChange={onChange}
                className="w-full bg-[#f4f7f4] border border-transparent focus:border-[#b1cb0c] rounded-xl pl-4 pr-8 py-3.5 text-sm font-black text-[#062e3a] outline-none appearance-none transition-all cursor-pointer"
              >
                {opcionesHora.map((h) => (
                  <option
                    key={`ini-${h}`}
                    value={h}
                    disabled={estaBloqueado(h)}
                  >
                    {h} {estaBloqueado(h) ? " (Ocupado)" : ""}
                  </option>
                ))}
              </select>
              <ChevronDown
                size={14}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#062e3a]/40 pointer-events-none"
              />
            </div>
          </div>
          <div>
            <label className="block text-[10px] font-black text-[#062e3a]/50 uppercase tracking-widest mb-1.5 ml-1">
              Salida
            </label>
            <div className="relative">
              <select
                name="horaFin"
                value={formulario.horaFin}
                onChange={onChange}
                className="w-full bg-[#f4f7f4] border border-transparent focus:border-[#b1cb0c] rounded-xl pl-4 pr-8 py-3.5 text-sm font-black text-[#062e3a] outline-none appearance-none transition-all cursor-pointer"
              >
                {opcionesHora.map((h) => (
                  <option
                    key={`fin-${h}`}
                    value={h}
                    disabled={estaBloqueado(h)}
                  >
                    {h} {estaBloqueado(h) ? " (Ocupado)" : ""}
                  </option>
                ))}
              </select>
              <ChevronDown
                size={14}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#062e3a]/40 pointer-events-none"
              />
            </div>
          </div>
        </div>

        {!duracionValida() && formulario.horaInicio && formulario.horaFin && (
          <div className="flex items-start gap-1.5 text-red-500 text-[10px] font-black uppercase tracking-widest -mt-2">
            <AlertTriangle size={14} /> La salida debe ser posterior a la
            entrada.
          </div>
        )}

        {/* MÉTRICAS (2x2) */}
        <div className="grid grid-cols-2 gap-4">
          {[
            { id: "nuevas", label: "Nuevas" },
            { id: "revisiones", label: "Revisiones" },
            { id: "promociones", label: "Promocionales" },
            { id: "personalFarmacia", label: "Personal" },
          ].map((item) => (
            <div key={item.id} className="relative">
              <label className="block text-[10px] font-black text-[#062e3a]/50 uppercase tracking-widest mb-1.5 ml-1">
                {item.label}
              </label>
              <input
                type="number"
                inputMode="numeric"
                pattern="[0-9]*"
                name={item.id}
                value={formulario[item.id]}
                onChange={onChange}
                onFocus={(e) => e.target.select()}
                className="w-full bg-[#f4f7f4] border border-transparent focus:border-[#062e3a] focus:bg-white rounded-xl py-3 px-4 text-sm font-bold text-[#062e3a] outline-none transition-all [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
              />
            </div>
          ))}
        </div>

        {/* OBSERVACIONES */}
        <div>
          <label className="block text-[10px] font-black text-[#062e3a]/50 uppercase tracking-widest mb-1.5 ml-1">
            Observaciones (Opcional)
          </label>
          <textarea
            name="observacionesJornada"
            value={formulario.observacionesJornada}
            onChange={onChange}
            rows="2"
            placeholder="Añade notas de la jornada..."
            className="w-full bg-[#f4f7f4] border border-transparent focus:border-[#b1cb0c] rounded-xl px-4 py-3 text-sm text-[#062e3a] outline-none resize-none transition-all placeholder:font-medium placeholder:text-[#062e3a]/30 font-bold"
          ></textarea>
        </div>

        {/* EVIDENCIA FOTOGRÁFICA */}
        <div className="flex flex-col gap-2 pt-2 border-t border-gray-100">
          <span className="text-[10px] font-black text-[#062e3a]/50 uppercase tracking-widest flex items-center gap-1.5">
            <Camera size={14} /> Evidencia (Opcional)
          </span>

          {!previewUrl ? (
            <label className="cursor-pointer flex items-center justify-center gap-1.5 w-full py-3 rounded-xl bg-[#f4f7f4] hover:bg-gray-200 text-[#062e3a] text-[10px] font-black uppercase tracking-widest transition-colors border border-gray-200">
              Añadir Foto
              <input
                type="file"
                className="hidden"
                accept="image/*"
                onChange={handleArchivoChange}
              />
            </label>
          ) : (
            <div className="flex gap-2 w-full">
              <button
                type="button"
                onClick={onVerPreview}
                className="flex-1 flex items-center justify-center gap-1.5 py-3 rounded-xl bg-[#062e3a]/10 hover:bg-[#062e3a]/20 text-[#062e3a] text-[10px] font-black uppercase tracking-widest transition-colors"
              >
                <Eye size={14} /> Ver
              </button>
              <label className="flex-1 cursor-pointer flex items-center justify-center gap-1.5 py-3 rounded-xl bg-[#b1cb0c]/20 hover:bg-[#b1cb0c]/40 text-[#367933] text-[10px] font-black uppercase tracking-widest transition-colors border border-[#b1cb0c]/50">
                <RefreshCw size={14} /> Sustituir
                <input
                  type="file"
                  className="hidden"
                  accept="image/*"
                  onChange={handleArchivoChange}
                />
              </label>
              <button
                type="button"
                onClick={() => handleArchivoChange({ target: { files: [] } })}
                className="flex-1 flex items-center justify-center gap-1.5 py-3 rounded-xl bg-red-50 hover:bg-red-100 text-red-600 text-[10px] font-black uppercase tracking-widest transition-colors border border-red-200"
              >
                <Trash2 size={14} /> Borrar
              </button>
            </div>
          )}
        </div>

        {/* BOTÓN SUBMIT */}
        <button
          type="submit"
          disabled={farmacias.length === 0 || !duracionValida()}
          className="w-full bg-[#367933] hover:bg-[#006633] text-white font-black py-4 rounded-xl transition-all shadow-md shadow-[#367933]/20 flex justify-center items-center gap-2 mt-4 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <CheckCircle size={18} /> Enviar
        </button>
      </form>
    </div>
  );
};

export default FormularioRegistro;
