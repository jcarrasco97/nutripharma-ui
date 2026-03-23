import React, { useState, useEffect } from "react";
import {
  History,
  Search,
  Calendar,
  ArrowUpDown,
  User,
  TrendingUp,
  Clock,
  Filter,
  Loader2,
} from "lucide-react";
import { consultasService } from "./consultasService";

const VistaHistorialFarmacia = () => {
  const [consultas, setConsultas] = useState([]);
  const [cargando, setCargando] = useState(true);

  // Estados de Filtro
  const [busqueda, setBusqueda] = useState("");
  const [fechaFiltro, setFechaFiltro] = useState("");
  const [orden, setOrden] = useState("desc"); // desc = más recientes primero

  const cargarHistorial = async () => {
    setCargando(true);
    try {
      const data = await consultasService.obtenerHistorialFarmacia();
      setConsultas(data);
    } catch (error) {
      console.error("Error al cargar el historial:", error);
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    cargarHistorial();
  }, []);

  // Lógica de Filtrado y Ordenación
  const consultasFiltradas = consultas
    .filter((c) => {
      const coincideNombre = c.nutricionistaNombre
        .toLowerCase()
        .includes(busqueda.toLowerCase());
      const coincideFecha = fechaFiltro === "" || c.fecha === fechaFiltro;
      return coincideNombre && coincideFecha;
    })
    .sort((a, b) => {
      const dateA = new Date(a.fecha);
      const dateB = new Date(b.fecha);
      return orden === "desc" ? dateB - dateA : dateA - dateB;
    });

  if (cargando)
    return (
      <div className="flex justify-center p-20">
        <Loader2 className="animate-spin text-sky-500" size={48} />
      </div>
    );

  return (
    <div className="space-y-6 animate-fade-in pb-10">
      {/* CABECERA Y RESUMEN RÁPIDO */}
      <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-100 flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="flex items-center gap-4">
          <div className="bg-emerald-600 p-4 rounded-3xl text-white shadow-lg shadow-emerald-100">
            <History size={28} />
          </div>
          <div>
            <h2 className="text-2xl font-black text-gray-800">
              Historial de Consultas
            </h2>
            <p className="text-gray-500 font-medium">
              Registro de nutricionistas y jornadas en tu farmacia.
            </p>
          </div>
        </div>

        <div className="flex gap-4">
          <div className="bg-gray-50 px-6 py-3 rounded-2xl border border-gray-100 text-center">
            <span className="block text-[10px] font-black text-gray-400 uppercase tracking-widest">
              Total Jornadas
            </span>
            <span className="text-xl font-black text-gray-800">
              {consultas.length}
            </span>
          </div>
        </div>
      </div>

      {/* BARRA DE FILTROS (Estilo Suministros) */}
      <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-gray-100 flex flex-wrap gap-4">
        <div className="relative flex-1 min-w-[250px]">
          <Search size={18} className="absolute left-4 top-3.5 text-gray-400" />
          <input
            type="text"
            placeholder="Buscar por nombre del nutricionista..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:bg-white focus:border-emerald-500 outline-none transition-all"
          />
        </div>

        <div className="relative min-w-[180px]">
          <Calendar
            size={18}
            className="absolute left-4 top-3.5 text-gray-400"
          />
          <input
            type="date"
            value={fechaFiltro}
            onChange={(e) => setFechaFiltro(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:bg-white focus:border-emerald-500 outline-none transition-all"
          />
        </div>

        <div className="relative min-w-[180px]">
          <ArrowUpDown
            size={18}
            className="absolute left-4 top-3.5 text-gray-400"
          />
          <select
            value={orden}
            onChange={(e) => setOrden(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:bg-white focus:border-emerald-500 outline-none transition-all appearance-none"
          >
            <option value="desc">Más recientes</option>
            <option value="asc">Más antiguos</option>
          </select>
        </div>
      </div>

      {/* LISTADO DE RESULTADOS */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {consultasFiltradas.length === 0 ? (
          <div className="col-span-full bg-white p-20 rounded-[3rem] text-center border-2 border-dashed border-gray-100">
            <Filter size={48} className="mx-auto text-gray-200 mb-4" />
            <p className="text-gray-400 font-bold">
              No hay registros que coincidan con la búsqueda.
            </p>
          </div>
        ) : (
          consultasFiltradas.map((c) => (
            <div
              key={c.id}
              className="bg-white p-6 rounded-[2rem] shadow-sm border border-gray-100 hover:shadow-xl hover:border-emerald-100 transition-all group"
            >
              <div className="flex justify-between items-start mb-6">
                <div className="bg-emerald-50 p-3 rounded-2xl text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                  <User size={24} />
                </div>
                <span
                  className={`text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest ${
                    c.estado === "CONFIRMADA"
                      ? "bg-emerald-100 text-emerald-700"
                      : "bg-amber-100 text-amber-700"
                  }`}
                >
                  {c.estado}
                </span>
              </div>

              <h3 className="text-lg font-black text-gray-800 mb-1">
                {c.nutricionistaNombre}
              </h3>
              <div className="flex items-center gap-2 text-gray-400 mb-6">
                <Calendar size={14} />
                <span className="text-xs font-bold uppercase">{c.fecha}</span>
              </div>

              <div className="grid grid-cols-2 gap-4 pt-6 border-t border-gray-50">
                <div className="flex flex-col">
                  <span className="text-[10px] font-black text-gray-400 uppercase tracking-tighter">
                    Horario
                  </span>
                  <div className="flex items-center gap-1 text-gray-700 font-bold text-sm">
                    <Clock size={14} className="text-emerald-500" />
                    {c.horaInicio.substring(0, 5)} - {c.horaFin.substring(0, 5)}
                  </div>
                </div>
                <div className="flex flex-col">
                  <span className="text-[10px] font-black text-gray-400 uppercase tracking-tighter">
                    Turno
                  </span>
                  <span className="text-gray-700 font-bold text-sm uppercase">
                    {c.tipoTurno}
                  </span>
                </div>
              </div>

              <div className="mt-6 bg-gray-50 p-4 rounded-2xl flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <TrendingUp size={16} className="text-emerald-600" />
                  <span className="text-xs font-bold text-gray-600">
                    Comisión Generada
                  </span>
                </div>
                {/* Calculamos la comisión 70/30 (30% para farmacia) basándonos en los precios estándar */}
                <span className="text-lg font-black text-emerald-700">
                  {((c.nuevas * 25 + c.revisiones * 20) * 0.3).toFixed(2)}€
                </span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default VistaHistorialFarmacia;
