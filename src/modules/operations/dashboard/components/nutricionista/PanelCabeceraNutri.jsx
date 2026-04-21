import React from "react";
import {
  TrendingUp,
  Car,
  Users,
  Euro,
  CalendarDays,
  ChevronDown,
  Clock,
} from "lucide-react";

const PanelCabeceraNutri = ({
  perfil,
  horasContrato,
  mesesDisponibles = [],
  mesFiltro,
  setMesFiltro,
  datosResumen,
}) => {
  // Formateador de meses ("Abr 2026")
  const formatoMesCorto = (key) => {
    if (!key) return "";
    const [year, month] = key.split("-");
    const nombre = new Date(year, month - 1).toLocaleString("es-ES", {
      month: "short",
    });
    return `${nombre.charAt(0).toUpperCase() + nombre.slice(1).replace(".", "")} ${year}`;
  };

  return (
    <div className="w-full bg-gradient-to-br from-[#006633] to-[#68b54e] rounded-[2.5rem] p-8 lg:p-10 text-white shadow-xl shadow-[#367933]/20 relative overflow-hidden">
      {/* Elementos decorativos de fondo */}
      <div className="absolute top-0 right-0 -mt-10 -mr-10 w-64 h-64 bg-white opacity-5 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 -mb-10 -ml-10 w-48 h-48 bg-[#bed000] opacity-10 rounded-full blur-2xl pointer-events-none"></div>

      <div className="relative z-10 flex flex-col gap-8">
        {/* HEADER: Saludo y Selector de Mes */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 border-b border-white/20 pb-6">
          <div>
            <h2 className="text-3xl lg:text-4xl font-black mb-2 flex items-center gap-3 tracking-tight">
              <TrendingUp size={36} className="text-[#bed000]" />
              Hola, {perfil.nombre}
            </h2>
            <p className="text-white/80 font-bold text-sm uppercase tracking-widest flex items-center gap-2">
              <Clock size={16} /> Contrato Activo:{" "}
              <span className="text-[#bed000]">{horasContrato} h/semana</span>
            </p>
          </div>

          <div className="flex flex-col gap-2 w-full md:w-auto">
            <label className="text-[10px] font-black text-white/60 uppercase tracking-widest ml-1">
              Rendimiento del mes
            </label>
            <div className="relative bg-white/10 hover:bg-white/20 transition-colors px-4 py-3 rounded-xl border border-white/20 backdrop-blur-md min-w-[180px]">
              <CalendarDays
                size={16}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-[#bed000]"
              />
              <select
                value={mesFiltro}
                onChange={(e) => setMesFiltro(e.target.value)}
                className="w-full bg-transparent outline-none text-sm font-black text-white uppercase tracking-widest cursor-pointer pl-8 pr-4 appearance-none [&>option]:text-[#062e3a]"
              >
                {mesesDisponibles.length === 0 && (
                  <option value="">Sin datos</option>
                )}
                {mesesDisponibles.map((m) => (
                  <option key={m} value={m}>
                    {formatoMesCorto(m)}
                  </option>
                ))}
              </select>
              <ChevronDown
                size={16}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-white/50 pointer-events-none"
              />
            </div>
          </div>
        </div>

        {/* CUERPO: Tarjetas de Métricas (Apiladas verticalmente) */}
        {datosResumen && (
          <div className="flex flex-col gap-4">
            {/* Tarjeta 1: Consultas */}
            <div className="bg-white/10 p-5 md:p-6 rounded-3xl border border-white/10 backdrop-blur-md flex flex-col md:flex-row md:items-center justify-between gap-4 md:gap-8 hover:bg-white/15 transition-colors">
              <div className="flex items-center gap-3 md:w-1/3 shrink-0">
                <div className="bg-[#bed000]/20 p-2.5 rounded-xl text-[#bed000]">
                  <Users size={22} />
                </div>
                <h3 className="font-black text-sm uppercase tracking-widest text-white/90">
                  Volumen de Consultas
                </h3>
              </div>
              <div className="flex flex-row gap-8 md:justify-end flex-1">
                <div className="flex-1 md:flex-none">
                  <p className="text-white/60 text-[10px] font-bold uppercase tracking-widest mb-1">
                    Nuevas
                  </p>
                  <p className="text-3xl md:text-4xl font-black">
                    {datosResumen.totalNuevas}
                  </p>
                </div>
                <div className="flex-1 md:flex-none">
                  <p className="text-white/60 text-[10px] font-bold uppercase tracking-widest mb-1">
                    Revisiones
                  </p>
                  <p className="text-3xl md:text-4xl font-black">
                    {datosResumen.totalRevisiones}
                  </p>
                </div>
              </div>
            </div>

            {/* Tarjeta 2: Facturación */}
            <div className="bg-white/10 p-5 md:p-6 rounded-3xl border border-white/10 backdrop-blur-md flex flex-col md:flex-row md:items-center justify-between gap-4 md:gap-8 hover:bg-white/15 transition-colors">
              <div className="flex items-center gap-3 md:w-1/3 shrink-0">
                <div className="bg-[#bed000]/20 p-2.5 rounded-xl text-[#bed000]">
                  <Euro size={22} />
                </div>
                <h3 className="font-black text-sm uppercase tracking-widest text-white/90">
                  Facturación Generada
                </h3>
              </div>
              <div className="flex flex-row gap-8 md:justify-end flex-1">
                <div className="flex-1 md:flex-none">
                  <p className="text-white/60 text-[10px] font-bold uppercase tracking-widest mb-1">
                    Servicios
                  </p>
                  <p className="text-3xl md:text-4xl font-black">
                    {datosResumen.facturacionConsultas.toFixed(2)}€
                  </p>
                </div>
                <div className="flex-1 md:flex-none">
                  <p className="text-white/60 text-[10px] font-bold uppercase tracking-widest mb-1">
                    Productos
                  </p>
                  <p className="text-3xl md:text-4xl font-black">
                    {datosResumen.facturacionProductos.toFixed(2)}€
                  </p>
                </div>
              </div>
            </div>

            {/* Tarjeta 3: Logística */}
            <div className="bg-[#bed000] p-5 md:p-6 rounded-3xl border border-[#bed000]/50 flex flex-col md:flex-row md:items-center justify-between gap-4 md:gap-8 shadow-lg shadow-[#bed000]/20 z-10">
              <div className="flex items-center gap-3 md:w-1/3 shrink-0">
                <div className="bg-[#006633]/10 p-2.5 rounded-xl text-[#006633]">
                  <Car size={22} />
                </div>
                <h3 className="font-black text-sm uppercase tracking-widest text-[#006633]">
                  Logística & Desplazamiento
                </h3>
              </div>
              <div className="flex flex-row gap-8 md:justify-end flex-1">
                <div className="flex-1 md:flex-none">
                  <p className="text-[#006633]/60 text-[10px] font-black uppercase tracking-widest mb-1">
                    Distancia Total Recorrida
                  </p>
                  <p className="text-4xl md:text-5xl font-black text-[#006633] tracking-tighter">
                    {datosResumen.totalKilometros}{" "}
                    <span className="text-xl font-bold opacity-70 tracking-normal">
                      km
                    </span>
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PanelCabeceraNutri;
