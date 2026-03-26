import React from "react";
import {
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

const AdminCalendarioOperativo = ({
  anio,
  mes,
  cambiarMes,
  diasMes,
  offset,
  getEventosDelDia,
  fechaActual,
  setEventoSeleccionado,
}) => (
  <div className="bg-white p-6 md:p-8 rounded-[2.5rem] shadow-sm border border-gray-100">
    <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
      <div className="flex items-center gap-4">
        <div className="bg-[#b1cb0c]/20 p-3 rounded-2xl text-[#367933]">
          <CalendarIcon size={28} />
        </div>
        <div>
          <h2 className="text-2xl font-black text-[#062e3a]">
            Calendario Operativo
          </h2>
          <p className="text-[#342c1e] font-medium">
            Registro de jornadas y pedidos confirmados
          </p>
        </div>
      </div>
      <div className="bg-gray-50 px-4 py-2 rounded-xl flex items-center gap-6 border border-gray-200">
        <button
          onClick={() => cambiarMes(-1)}
          className="text-[#062e3a] hover:text-[#367933] font-bold p-1 bg-white rounded-lg shadow-sm"
        >
          <ChevronLeft size={20} />
        </button>
        <span className="font-black text-lg text-[#062e3a] uppercase w-32 text-center">
          {new Date(anio, mes - 1).toLocaleString("es-ES", { month: "long" })}{" "}
          {anio}
        </span>
        <button
          onClick={() => cambiarMes(1)}
          className="text-[#062e3a] hover:text-[#367933] font-bold p-1 bg-white rounded-lg shadow-sm"
        >
          <ChevronRight size={20} />
        </button>
      </div>
    </div>

    <div className="grid grid-cols-7 gap-2 mb-2 text-center">
      {["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"].map((d) => (
        <div
          key={d}
          className="text-xs font-black text-[#342c1e] uppercase tracking-widest"
        >
          {d}
        </div>
      ))}
    </div>

    <div className="grid grid-cols-7 gap-2">
      {Array.from({ length: offset }).map((_, i) => (
        <div
          key={`empty-${i}`}
          className="h-24 md:h-32 bg-gray-50/50 rounded-2xl border border-gray-50"
        ></div>
      ))}
      {Array.from({ length: diasMes }).map((_, i) => {
        const dia = i + 1;
        const eventosDia = getEventosDelDia(dia);
        const esHoy =
          dia === fechaActual.getDate() &&
          mes === fechaActual.getMonth() + 1 &&
          anio === fechaActual.getFullYear();
        return (
          <div
            key={dia}
            className={`h-24 md:h-32 p-2 flex flex-col rounded-2xl border transition-all ${esHoy ? "bg-[#f4f7f4] border-[#367933]/30" : "bg-white border-gray-100 hover:border-[#b1cb0c]"}`}
          >
            <span
              className={`text-sm font-black w-8 h-8 flex items-center justify-center rounded-full mb-1 ${esHoy ? "bg-[#367933] text-white shadow-md" : "text-[#062e3a]"}`}
            >
              {dia}
            </span>
            <div className="flex-1 overflow-y-auto space-y-1 custom-scrollbar pr-1">
              {eventosDia.map((ev) => (
                <div
                  key={ev.idUnico}
                  onClick={() => setEventoSeleccionado(ev)}
                  className={`text-[10px] font-bold p-1.5 rounded-lg cursor-pointer truncate transition-colors ${ev.tipo === "PEDIDO" ? "bg-[#062e3a]/10 text-[#062e3a] hover:bg-[#062e3a]/20" : "bg-[#b1cb0c]/20 text-[#367933] hover:bg-[#b1cb0c]/40"}`}
                  title={ev.titulo}
                >
                  {ev.tipo === "PEDIDO" ? "📦" : "🩺"} {ev.idUnico}
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  </div>
);

export default AdminCalendarioOperativo;
