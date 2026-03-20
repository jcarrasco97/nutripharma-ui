import React, { useState, useEffect } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import {
  Calendar as CalendarIcon,
  TrendingUp,
  Loader2,
  X,
  ChevronLeft,
  ChevronRight,
  Package,
  Stethoscope,
} from "lucide-react";
import { dashboardService } from "../../services/dashboardService";

const VistaResumenAdmin = () => {
  const fechaActual = new Date();
  const [anio, setAnio] = useState(fechaActual.getFullYear());
  const [mes, setMes] = useState(fechaActual.getMonth() + 1); // 1 = Ene, 12 = Dic

  const [facturacion, setFacturacion] = useState([]);
  const [eventos, setEventos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [eventoSeleccionado, setEventoSeleccionado] = useState(null);

  const cargarDatos = async () => {
    setCargando(true);
    try {
      const [datosGrafica, datosCalendario] = await Promise.all([
        dashboardService.obtenerFacturacionAdmin(anio),
        dashboardService.obtenerCalendarioAdmin(anio, mes),
      ]);
      setFacturacion(datosGrafica);
      setEventos(datosCalendario);
    } catch (error) {
      console.error("Error al cargar dashboard admin:", error);
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    cargarDatos();
  }, [anio, mes]);

  // --- Lógica del Calendario Visual ---
  const diasMes = new Date(anio, mes, 0).getDate();
  const primerDiaSemana = new Date(anio, mes - 1, 1).getDay(); // 0 = Domingo
  const offset = primerDiaSemana === 0 ? 6 : primerDiaSemana - 1; // Ajuste para que Lunes sea 0

  const cambiarMes = (delta) => {
    let nuevoMes = mes + delta;
    let nuevoAnio = anio;
    if (nuevoMes > 12) {
      nuevoMes = 1;
      nuevoAnio++;
    }
    if (nuevoMes < 1) {
      nuevoMes = 12;
      nuevoAnio--;
    }
    setMes(nuevoMes);
    setAnio(nuevoAnio);
  };

  const getEventosDelDia = (dia) => {
    const fechaStr = `${anio}-${String(mes).padStart(2, "0")}-${String(dia).padStart(2, "0")}`;
    return eventos.filter((e) => e.fecha === fechaStr);
  };

  if (cargando && facturacion.length === 0)
    return (
      <div className="flex justify-center p-20">
        <Loader2 className="animate-spin text-indigo-500" size={48} />
      </div>
    );

  return (
    <div className="space-y-8 animate-fade-in pb-10">
      {/* MODAL DEL EVENTO */}
      {eventoSeleccionado && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-sm">
          <div className="bg-white rounded-3xl shadow-2xl max-w-sm w-full overflow-hidden animate-scale-in">
            <div
              className={`p-6 text-white flex justify-between items-center ${eventoSeleccionado.tipo === "PEDIDO" ? "bg-sky-600" : "bg-emerald-600"}`}
            >
              <div className="flex items-center gap-2">
                {eventoSeleccionado.tipo === "PEDIDO" ? (
                  <Package size={24} />
                ) : (
                  <Stethoscope size={24} />
                )}
                <h3 className="text-xl font-bold">{eventoSeleccionado.tipo}</h3>
              </div>
              <button
                onClick={() => setEventoSeleccionado(null)}
                className="text-white/70 hover:text-white"
              >
                <X size={24} />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">
                  Identificador
                </p>
                <p className="font-black text-gray-800 text-lg">
                  {eventoSeleccionado.idUnico}
                </p>
              </div>
              <div>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">
                  Asunto
                </p>
                <p className="font-bold text-gray-700">
                  {eventoSeleccionado.titulo}
                </p>
              </div>
              <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">
                  Detalles / Importe
                </p>
                <p className="font-black text-xl text-gray-900">
                  {eventoSeleccionado.detalles}
                </p>
              </div>
              <div>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">
                  Estado Operativo
                </p>
                <span className="bg-gray-200 text-gray-700 font-bold px-3 py-1 rounded-md text-xs uppercase">
                  {eventoSeleccionado.estado}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* BLOQUE 1: GRÁFICA DE FACTURACIÓN */}
      <div className="bg-white p-6 md:p-8 rounded-[2.5rem] shadow-sm border border-gray-100">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div className="flex items-center gap-4">
            <div className="bg-indigo-100 p-3 rounded-2xl text-indigo-600">
              <TrendingUp size={28} />
            </div>
            <div>
              <h2 className="text-2xl font-black text-gray-800">
                Facturación Global
              </h2>
              <p className="text-gray-500 font-medium">
                Ingresos por Consultas y Venta de Productos
              </p>
            </div>
          </div>
          <div className="bg-gray-50 px-4 py-2 rounded-xl flex items-center gap-4 border border-gray-200">
            <button
              onClick={() => setAnio(anio - 1)}
              className="hover:text-indigo-600 font-bold"
            >
              <ChevronLeft size={20} />
            </button>
            <span className="font-black text-lg text-gray-800">{anio}</span>
            <button
              onClick={() => setAnio(anio + 1)}
              className="hover:text-indigo-600 font-bold"
            >
              <ChevronRight size={20} />
            </button>
          </div>
        </div>

        <div className="h-[400px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={facturacion}
              margin={{ top: 20, right: 30, left: 0, bottom: 0 }}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                vertical={false}
                stroke="#f3f4f6"
              />
              <XAxis
                dataKey="mesTexto"
                axisLine={false}
                tickLine={false}
                tick={{ fill: "#9ca3af", fontWeight: "bold" }}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fill: "#9ca3af", fontWeight: "bold" }}
                tickFormatter={(value) => `${value}€`}
              />
              <Tooltip
                cursor={{ fill: "#f9fafb" }}
                contentStyle={{
                  borderRadius: "1rem",
                  border: "none",
                  boxShadow: "0 10px 15px -3px rgb(0 0 0 / 0.1)",
                }}
                formatter={(value) => [`${value} €`]}
              />

              <Legend
                wrapperStyle={{ paddingTop: "20px", fontWeight: "bold" }}
              />
              <Bar
                dataKey="ingresosConsultas"
                name="Consultas (Servicios)"
                stackId="a"
                fill="#10b981"
                radius={[0, 0, 4, 4]}
              />
              <Bar
                dataKey="ingresosPedidos"
                name="Venta Productos"
                stackId="a"
                fill="#3b82f6"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* BLOQUE 2: CALENDARIO OPERATIVO */}
      <div className="bg-white p-6 md:p-8 rounded-[2.5rem] shadow-sm border border-gray-100">
        <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
          <div className="flex items-center gap-4">
            <div className="bg-sky-100 p-3 rounded-2xl text-sky-600">
              <CalendarIcon size={28} />
            </div>
            <div>
              <h2 className="text-2xl font-black text-gray-800">
                Calendario Operativo
              </h2>
              <p className="text-gray-500 font-medium">
                Registro de jornadas y pedidos confirmados
              </p>
            </div>
          </div>
          <div className="bg-gray-50 px-4 py-2 rounded-xl flex items-center gap-6 border border-gray-200">
            <button
              onClick={() => cambiarMes(-1)}
              className="hover:text-sky-600 font-bold p-1 bg-white rounded-lg shadow-sm"
            >
              <ChevronLeft size={20} />
            </button>
            <span className="font-black text-lg text-gray-800 uppercase w-32 text-center">
              {new Date(anio, mes - 1).toLocaleString("es-ES", {
                month: "long",
              })}{" "}
              {anio}
            </span>
            <button
              onClick={() => cambiarMes(1)}
              className="hover:text-sky-600 font-bold p-1 bg-white rounded-lg shadow-sm"
            >
              <ChevronRight size={20} />
            </button>
          </div>
        </div>

        {/* Cabecera Días */}
        <div className="grid grid-cols-7 gap-2 mb-2 text-center">
          {["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"].map((d) => (
            <div
              key={d}
              className="text-xs font-black text-gray-400 uppercase tracking-widest"
            >
              {d}
            </div>
          ))}
        </div>

        {/* Grid Días */}
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
                className={`h-24 md:h-32 p-2 flex flex-col rounded-2xl border transition-all ${esHoy ? "bg-sky-50 border-sky-200" : "bg-white border-gray-100 hover:border-sky-300"}`}
              >
                <span
                  className={`text-sm font-black w-8 h-8 flex items-center justify-center rounded-full mb-1 ${esHoy ? "bg-sky-600 text-white shadow-md" : "text-gray-600"}`}
                >
                  {dia}
                </span>
                <div className="flex-1 overflow-y-auto space-y-1 custom-scrollbar pr-1">
                  {eventosDia.map((ev) => (
                    <div
                      key={ev.idUnico}
                      onClick={() => setEventoSeleccionado(ev)}
                      className={`text-[10px] font-bold p-1.5 rounded-lg cursor-pointer truncate transition-colors ${ev.tipo === "PEDIDO" ? "bg-sky-100 text-sky-700 hover:bg-sky-200" : "bg-emerald-100 text-emerald-700 hover:bg-emerald-200"}`}
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
    </div>
  );
};

export default VistaResumenAdmin;
