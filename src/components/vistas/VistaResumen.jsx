import React, { useState, useEffect } from "react";
import {
  Clock,
  TrendingUp,
  Users,
  DollarSign,
  Calendar,
  AlertCircle,
  Loader2,
} from "lucide-react";
import { dashboardService } from "../../services/dashboardService";

const VistaResumen = () => {
  // 1. ESTADOS
  const [datos, setDatos] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");

  // Por defecto, cargamos el mes y año actual
  const fechaActual = new Date();
  const [mes, setMes] = useState(fechaActual.getMonth() + 1); // getMonth() va de 0 a 11
  const [anio, setAnio] = useState(fechaActual.getFullYear());

  // ID temporal hardcodeado para el MVP (Asumimos que Laura es la ID 1)
  const NUTRICIONISTA_ID = 1;

  // 2. EFECTO: Cargar datos cuando cambie el mes o el año
  useEffect(() => {
    const cargarDatos = async () => {
      setCargando(true);
      setError("");
      try {
        const resumen = await dashboardService.obtenerResumenNutricionista(
          NUTRICIONISTA_ID,
          anio,
          mes,
        );
        setDatos(resumen);
      } catch (err) {
        console.error("Error al cargar resumen:", err);
        setError(
          "No se pudieron cargar los datos. Verifica tu conexión o intenta loguearte de nuevo.",
        );
      } finally {
        setCargando(false);
      }
    };

    cargarDatos();
  }, [mes, anio]);

  // 3. RENDERIZADOS CONDICIONALES
  if (cargando) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-sky-600">
        <Loader2 size={48} className="animate-spin mb-4" />
        <p className="font-medium text-lg">Calculando métricas del mes...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-red-500">
        <AlertCircle size={48} className="mb-4" />
        <p className="font-medium text-lg">{error}</p>
      </div>
    );
  }

  // 4. CONTROL DE "EMPTY STATES" (Sin datos)
  // Consideramos que no hay actividad si las horas y las ventas son 0
  const sinActividad =
    datos?.horasTrabajadas === 0 && datos?.volumenVentasEuros === 0;

  return (
    <div className="space-y-6 animate-fade-in">
      {/* --- BARRA DE CONTROLES (Filtros) --- */}
      <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex flex-wrap gap-4 items-center justify-between">
        <div className="flex items-center gap-2 text-sky-800">
          <Calendar size={20} />
          <h3 className="font-bold">Periodo de Análisis</h3>
        </div>

        <div className="flex gap-4">
          <select
            value={mes}
            onChange={(e) => setMes(Number(e.target.value))}
            className="border-gray-200 rounded-xl text-sm font-medium focus:ring-sky-500"
          >
            <option value={1}>Enero</option>
            <option value={2}>Febrero</option>
            <option value={3}>Marzo</option>
            <option value={4}>Abril</option>
            <option value={5}>Mayo</option>
            <option value={6}>Junio</option>
            <option value={7}>Julio</option>
            <option value={8}>Agosto</option>
            <option value={9}>Septiembre</option>
            <option value={10}>Octubre</option>
            <option value={11}>Noviembre</option>
            <option value={12}>Diciembre</option>
          </select>

          <select
            value={anio}
            onChange={(e) => setAnio(Number(e.target.value))}
            className="border-gray-200 rounded-xl text-sm font-medium focus:ring-sky-500"
          >
            <option value={2026}>2026</option>
            <option value={2027}>2027</option>
          </select>
        </div>
      </div>

      {/* --- ALERTA DE SIN ACTIVIDAD --- */}
      {sinActividad && (
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-6 flex items-start gap-4">
          <AlertCircle className="text-amber-500 shrink-0" size={24} />
          <div>
            <h4 className="text-amber-800 font-bold">
              No hay registros confirmados
            </h4>
            <p className="text-amber-700 text-sm mt-1">
              Aún no has cerrado ningún turno ni realizado ventas durante este
              mes. Recuerda que los turnos en estado "Borrador" no computan en
              este resumen.
            </p>
          </div>
        </div>
      )}

      {/* --- TARJETAS DE MÉTRICAS --- */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        {/* Tarjeta Horas */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-10">
            <Clock size={64} />
          </div>
          <div className="relative z-10">
            <p className="text-gray-500 text-sm font-bold uppercase tracking-wider mb-2">
              Bolsa de Horas
            </p>
            <h3 className="text-3xl font-black text-gray-800">
              {datos.horasTrabajadas}{" "}
              <span className="text-lg text-gray-400 font-medium">
                / {datos.horasContrato}h
              </span>
            </h3>

            <div
              className={`mt-4 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold ${
                datos.balanceHoras >= 0
                  ? "bg-emerald-100 text-emerald-800"
                  : "bg-red-100 text-red-800"
              }`}
            >
              {datos.balanceHoras >= 0 ? "+" : ""}
              {datos.balanceHoras}h de balance
            </div>
          </div>
        </div>

        {/* Tarjeta Ventas */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-10">
            <TrendingUp size={64} />
          </div>
          <div className="relative z-10">
            <p className="text-gray-500 text-sm font-bold uppercase tracking-wider mb-2">
              Volumen de Ventas
            </p>
            <h3 className="text-3xl font-black text-gray-800">
              {datos.volumenVentasEuros.toFixed(2)}€
            </h3>
            <p className="text-sm text-gray-500 mt-4 font-medium">
              Facturado a farmacias
            </p>
          </div>
        </div>

        {/* Tarjeta Pacientes (Agrupados) */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-10">
            <Users size={64} />
          </div>
          <div className="relative z-10">
            <p className="text-gray-500 text-sm font-bold uppercase tracking-wider mb-2">
              Pacientes Vistos
            </p>
            <h3 className="text-3xl font-black text-gray-800">
              {datos.totalNuevas + datos.totalRevisiones}{" "}
              <span className="text-lg text-gray-400 font-medium">totales</span>
            </h3>
            <div className="mt-4 flex gap-3 text-xs font-bold text-gray-500">
              <span>{datos.totalNuevas} Nuevas</span>
              <span>•</span>
              <span>{datos.totalRevisiones} Revisiones</span>
            </div>
          </div>
        </div>

        {/* Tarjeta Bonus Estimado */}
        <div className="bg-sky-600 rounded-2xl p-6 shadow-sm relative overflow-hidden text-white">
          <div className="absolute top-0 right-0 p-4 opacity-20">
            <DollarSign size={64} />
          </div>
          <div className="relative z-10">
            <p className="text-sky-100 text-sm font-bold uppercase tracking-wider mb-2">
              Bonus Estimado
            </p>
            <h3 className="text-3xl font-black">
              {datos.bonusEstimadoEuros.toFixed(2)}€
            </h3>
            <p className="text-sm text-sky-100 mt-4 font-medium">
              5% s/ Ventas de este mes
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VistaResumen;
