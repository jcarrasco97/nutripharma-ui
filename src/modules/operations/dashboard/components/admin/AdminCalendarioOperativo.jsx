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
  <div className="bg-surface rounded-md border border-neutral/10 p-5">

    {/* CABECERA */}
    <div className="flex items-center justify-between gap-4 mb-4 flex-wrap">
      <div className="flex items-center gap-2">
        <CalendarIcon size={18} className="text-primary" />
        <div>
          <h2 className="text-sm font-semibold text-secondary leading-tight">
            Calendario Operativo
          </h2>
          <p className="text-xs text-neutral/50 leading-tight">
            Registro de jornadas y pedidos confirmados
          </p>
        </div>
      </div>

      {/* Controlador de mes */}
      <div className="flex items-center gap-2 bg-neutral/5 border border-neutral/10 rounded-md px-3 h-10">
        <button
          onClick={() => cambiarMes(-1)}
          className="hover:text-primary text-secondary transition-colors"
        >
          <ChevronLeft size={16} />
        </button>
        <span className="text-sm font-medium text-secondary capitalize w-28 text-center">
          {new Date(anio, mes - 1).toLocaleString("es-ES", { month: "long" })}{" "}
          {anio}
        </span>
        <button
          onClick={() => cambiarMes(1)}
          className="hover:text-primary text-secondary transition-colors"
        >
          <ChevronRight size={16} />
        </button>
      </div>
    </div>

    {/* Cabecera días de la semana */}
    <div className="grid grid-cols-7 gap-1 md:gap-2 mb-2 text-center">
      {["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"].map((d) => (
        <div
          key={d}
          className="text-[10px] font-medium text-neutral/40 uppercase tracking-wider text-center"
        >
          {d}
        </div>
      ))}
    </div>

    {/* Grid del calendario */}
    <div className="grid grid-cols-7 gap-1 md:gap-2">

      {/* Celdas vacías de offset */}
      {Array.from({ length: offset }).map((_, i) => (
        <div
          key={`empty-${i}`}
          className="aspect-square md:aspect-auto md:h-28 xl:h-32 bg-neutral/[0.02] rounded-md border border-neutral/5"
        />
      ))}

      {/* Celdas de días */}
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
            className={`aspect-square md:aspect-auto md:h-28 xl:h-32 p-1 md:p-2 flex flex-col items-center md:items-start rounded-md border cursor-pointer transition-colors ${
              esHoy
                ? "bg-primary/[0.03] border-primary/20"
                : "bg-surface border-neutral/10 hover:border-primary/30"
            }`}
          >
            {/* Número del día */}
            <span
              className={`text-xs md:text-sm font-semibold w-6 h-6 md:w-7 md:h-7 flex items-center justify-center rounded-full mb-1 flex-shrink-0 transition-colors ${
                esHoy
                  ? "bg-primary text-surface"
                  : "text-secondary"
              }`}
            >
              {dia}
            </span>

            {/* MÓVIL: Puntos de color */}
            <div className="flex md:hidden gap-1.5 mt-1">
              {consultasDia.length > 0 && (
                <div className="w-2 h-2 rounded-full bg-[#367933] shadow-sm" />
              )}
              {pedidosDia.length > 0 && (
                <div className="w-2 h-2 rounded-full bg-[#b1cb0c] shadow-sm" />
              )}
            </div>

            {/* DESKTOP: Badges */}
            <div className="hidden md:flex flex-1 flex-col gap-1.5 overflow-hidden w-full">
              {consultasDia.length > 0 && (
                <div className="bg-primary/10 text-primary px-1 lg:px-2 py-1 xl:py-1.5 rounded-md flex items-center justify-center xl:justify-start gap-1.5 text-xs font-medium">
                  <ClipboardList size={13} className="shrink-0" />
                  <span className="hidden xl:inline">Consultas:</span>
                  <span>{consultasDia.length}</span>
                </div>
              )}
              {pedidosDia.length > 0 && (
                <div className="bg-secondary/[0.07] text-secondary px-1 lg:px-2 py-1 xl:py-1.5 rounded-md flex items-center justify-center xl:justify-start gap-1.5 text-xs font-medium">
                  <ShoppingBag size={13} className="shrink-0" />
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