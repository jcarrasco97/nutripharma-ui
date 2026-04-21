import React from "react";
import {
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  ClipboardList,
  ShoppingBag
} from "lucide-react";

const AdminCalendarioOperativo = ({
  anio,
  mes,
  cambiarMes,
  diasMes,
  offset,
  getEventosDelDia,
  fechaActual,
  onSelectDate,
}) => (
  <div className="bg-white p-4 sm:p-6 md:p-8 rounded-[2.5rem] shadow-sm border border-gray-100">
    <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
      <div className="flex items-center gap-4">
        <div className="bg-[#b1cb0c]/20 p-3 rounded-2xl text-[#367933]">
          <CalendarIcon size={28} />
        </div>
        <div className="text-center md:text-left">
          <h2 className="text-xl md:text-2xl font-black text-[#062e3a]">
            Calendario Operativo
          </h2>
          <p className="text-sm md:text-base text-[#342c1e] font-medium">
            Registro de jornadas y pedidos confirmados
          </p>
        </div>
      </div>
      <div className="bg-gray-50 px-4 py-2 rounded-xl flex items-center gap-4 md:gap-6 border border-gray-200">
        <button
          onClick={() => cambiarMes(-1)}
          className="text-[#062e3a] hover:text-[#367933] font-bold p-1 bg-white rounded-lg shadow-sm transition-colors"
        >
          <ChevronLeft size={20} />
        </button>
        <span className="font-black text-base md:text-lg text-[#062e3a] uppercase w-28 md:w-32 text-center">
          {new Date(anio, mes - 1).toLocaleString("es-ES", { month: "long" })}{" "}
          {anio}
        </span>
        <button
          onClick={() => cambiarMes(1)}
          className="text-[#062e3a] hover:text-[#367933] font-bold p-1 bg-white rounded-lg shadow-sm transition-colors"
        >
          <ChevronRight size={20} />
        </button>
      </div>
    </div>

    <div className="grid grid-cols-7 gap-1 md:gap-2 mb-2 text-center">
      {["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"].map((d) => (
        <div
          key={d}
          className="text-[10px] md:text-xs font-black text-[#342c1e] uppercase tracking-widest"
        >
          {d}
        </div>
      ))}
    </div>

    <div className="grid grid-cols-7 gap-1 md:gap-2">
      {Array.from({ length: offset }).map((_, i) => (
        <div
          key={`empty-${i}`}
          className="aspect-square md:aspect-auto md:h-28 xl:h-32 bg-gray-50/50 rounded-xl md:rounded-2xl border border-gray-50"
        ></div>
      ))}
      {Array.from({ length: diasMes }).map((_, i) => {
        const dia = i + 1;
        const eventosDia = getEventosDelDia(dia);
        const consultasDia = eventosDia.filter((ev) => ev.tipo !== "PEDIDO");
        const pedidosDia = eventosDia.filter((ev) => ev.tipo === "PEDIDO");

        const esHoy =
          dia === fechaActual.getDate() &&
          mes === fechaActual.getMonth() + 1 &&
          anio === fechaActual.getFullYear();

        return (
          <div
            key={dia}
            onClick={() =>
              onSelectDate &&
              onSelectDate(new Date(anio, mes - 1, dia), {
                consultas: consultasDia,
                pedidos: pedidosDia,
              })
            }
            className={`aspect-square md:aspect-auto md:h-28 xl:h-32 p-1 md:p-2 flex flex-col items-center md:items-start rounded-xl md:rounded-2xl border cursor-pointer hover:shadow-md transition-all ${esHoy
                ? "bg-[#f4f7f4] border-[#367933]/30"
                : "bg-white border-gray-100 hover:border-[#367933]/40"
              }`}
          >
            {/* Número del día */}
            <span
              className={`text-xs md:text-sm font-black w-6 h-6 md:w-8 md:h-8 flex items-center justify-center rounded-full mb-1 flex-shrink-0 transition-colors ${esHoy ? "bg-[#367933] text-white shadow-md" : "text-[#062e3a]"
                }`}
            >
              {dia}
            </span>

            {/* --- ESCENARIO 3: MÓVIL (Puntos de color) --- */}
            <div className="flex md:hidden gap-1.5 mt-1">
              {consultasDia.length > 0 && (
                <div className="w-2 h-2 rounded-full bg-[#367933] shadow-sm"></div>
              )}
              {pedidosDia.length > 0 && (
                <div className="w-2 h-2 rounded-full bg-[#b1cb0c] shadow-sm"></div>
              )}
            </div>

            {/* --- ESCENARIOS 1 y 2: TABLET Y DESKTOP (Badges) --- */}
            <div className="hidden md:flex flex-1 flex-col gap-1.5 overflow-hidden w-full">
              {consultasDia.length > 0 && (
                <div className="bg-[#367933]/10 text-[#367933] px-1 lg:px-2 py-1 xl:py-1.5 rounded-lg flex items-center justify-center xl:justify-start gap-1.5 text-xs xl:text-sm font-black">
                  <ClipboardList size={14} className="shrink-0" />
                  <span className="hidden xl:inline">Consultas:</span>
                  <span>{consultasDia.length}</span>
                </div>
              )}
              {pedidosDia.length > 0 && (
                <div className="bg-[#b1cb0c]/20 text-[#062e3a] px-1 lg:px-2 py-1 xl:py-1.5 rounded-lg flex items-center justify-center xl:justify-start gap-1.5 text-xs xl:text-sm font-black">
                  <ShoppingBag size={14} className="shrink-0" />
                  <span className="hidden xl:inline">Pedidos:</span>
                  <span>{pedidosDia.length}</span>
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  </div>
);

export default AdminCalendarioOperativo;