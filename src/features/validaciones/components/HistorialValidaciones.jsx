import React, { useState, useMemo } from "react";
import {
  Search,
  ChevronLeft,
  ChevronRight,
  Filter,
  ArrowUpDown,
} from "lucide-react";

const HistorialValidaciones = ({
  historial = [],
  pestañaActual,
  onVerDetalle,
}) => {
  // 1. Estados Locales del Filtro, Ordenación y Paginación
  const [busqueda, setBusqueda] = useState("");
  const [filtroMesAno, setFiltroMesAno] = useState("INITIAL");
  const [orden, setOrden] = useState("FECHA_DESC");
  const [paginaActual, setPaginaActual] = useState(1);
  const itemsPorPagina = 10;

  // 2. Extracción Inteligente de Fechas (Eliminamos la extracción de estados)
  const opciones = useMemo(() => {
    const mesesUnicos = new Set();

    historial.forEach((item) => {
      const rawDate =
        pestañaActual === "suministros"
          ? item.fechaPeticion
          : item.fecha || item.fechaPedido;

      if (rawDate && typeof rawDate === "string") {
        const parts = rawDate.split("-");
        if (parts.length >= 2) {
          mesesUnicos.add(`${parts[0]}-${parts[1]}`);
        }
      }
    });

    const mesesOrdenados = Array.from(mesesUnicos).sort((a, b) =>
      b.localeCompare(a),
    );
    return { meses: mesesOrdenados };
  }, [historial, pestañaActual]);

  // Estado Derivado para auto-seleccionar el último mes
  const mesActivo =
    filtroMesAno === "INITIAL"
      ? opciones.meses.length > 0
        ? opciones.meses[0]
        : "ALL"
      : filtroMesAno;

  // 3. Motor de Filtrado y ORDENACIÓN POR PESOS
  const filtradosYOrdenados = useMemo(() => {
    // A. Filtrado Base (Texto y Fecha)
    const resultadoFiltrado = historial.filter((item) => {
      const termino = busqueda.toLowerCase();
      let pasaTexto = true;
      if (termino) {
        const targetStr = (
          (item.nutricionistaNombre || "") +
          (item.creadoPorNombre || "") +
          (item.farmaciaNombre || "") +
          (item.id || "")
        ).toLowerCase();
        pasaTexto = targetStr.includes(termino);
      }

      let pasaFecha = true;
      if (mesActivo !== "ALL") {
        const rawDate =
          pestañaActual === "suministros"
            ? item.fechaPeticion
            : item.fecha || item.fechaPedido;
        pasaFecha =
          rawDate &&
          typeof rawDate === "string" &&
          rawDate.startsWith(mesActivo);
      }

      return pasaTexto && pasaFecha;
    });

    // B. Ordenación Inteligente
    return resultadoFiltrado.sort((a, b) => {
      const getFecha = (item) =>
        pestañaActual === "suministros"
          ? item.fechaPeticion
          : item.fecha || item.fechaPedido;
      const getResponsable = (item) =>
        (pestañaActual === "pedidos"
          ? item.creadoPorNombre || "Sistema"
          : item.nutricionistaNombre) || "";
      const getEstado = (item) => item.estado || "";

      // Funciones auxiliares para fechas seguras
      const timeA = getFecha(a) ? new Date(getFecha(a)).getTime() : 0;
      const timeB = getFecha(b) ? new Date(getFecha(b)).getTime() : 0;

      switch (orden) {
        case "FECHA_ASC":
          return timeA - timeB;
        case "FECHA_DESC":
          return timeB - timeA;
        case "RESPONSABLE_ASC":
          return getResponsable(a).localeCompare(getResponsable(b));
        case "RESPONSABLE_DESC":
          return getResponsable(b).localeCompare(getResponsable(a));

        // ORDENACIÓN POR PESOS (Los cancelados valen 0, el resto 1. Los 0 van arriba)
        case "CANCELADOS_PRIMERO": {
          const esCancelado = (est) =>
            ["CANCELADA", "CANCELADO", "RECHAZADA"].includes(est) ? 0 : 1;
          const pesoA = esCancelado(getEstado(a));
          const pesoB = esCancelado(getEstado(b));

          if (pesoA !== pesoB) return pesoA - pesoB;
          // Si ambos son cancelados o ambos exitosos, ordenamos por fecha por defecto
          return timeB - timeA;
        }
        case "EXITOSOS_PRIMERO": {
          const esExitoso = (est) =>
            ["VALIDADA", "ENVIADO", "LIQUIDADO", "APROBADO"].includes(est)
              ? 0
              : 1;
          const pesoA = esExitoso(getEstado(a));
          const pesoB = esExitoso(getEstado(b));

          if (pesoA !== pesoB) return pesoA - pesoB;
          return timeB - timeA;
        }
        default:
          return 0;
      }
    });
  }, [historial, busqueda, mesActivo, orden, pestañaActual]);

  // 4. Paginación Matemática
  const totalPaginas =
    Math.ceil(filtradosYOrdenados.length / itemsPorPagina) || 1;
  const indexInicio = (paginaActual - 1) * itemsPorPagina;
  const itemsPaginados = filtradosYOrdenados.slice(
    indexInicio,
    indexInicio + itemsPorPagina,
  );

  const formatoMesCorto = (key) => {
    const [year, month] = key.split("-");
    const nombre = new Date(year, month - 1).toLocaleString("es-ES", {
      month: "short",
    });
    return `${nombre.charAt(0).toUpperCase() + nombre.slice(1).replace(".", "")} ${year}`;
  };

  return (
    <div className="bg-white p-6 md:p-8 rounded-[2.5rem] shadow-sm border border-gray-100 flex flex-col h-full">
      {/* CABECERA Y FILTROS */}
      <div className="flex flex-col xl:flex-row justify-between items-start xl:items-end mb-6 gap-4 border-b border-gray-100 pb-6">
        <div className="shrink-0">
          <h3 className="text-xl font-black text-[#062e3a] capitalize flex items-center gap-2">
            Historial de {pestañaActual}
            <span className="bg-[#f4f7f4] text-[#367933] text-xs px-2 py-1 rounded-lg">
              {filtradosYOrdenados.length}
            </span>
          </h3>
          <p className="text-sm text-[#342c1e]/70 font-bold mt-1">
            Registro de operaciones procesadas
          </p>
        </div>

        {/* BARRA DE CONTROLES SÚPER COMPACTA */}
        {/* Añadido xl:flex-1 para que ocupe el resto del espacio junto al título */}
        <div className="flex flex-wrap md:flex-nowrap items-center gap-2 w-full xl:flex-1 justify-end">
          {/* Selector Fecha */}
          <div className="flex items-center h-10 bg-[#f4f7f4] px-3 rounded-xl border border-gray-200 shrink-0 w-auto">
            <select
              value={mesActivo}
              onChange={(e) => {
                setFiltroMesAno(e.target.value);
                setPaginaActual(1);
              }}
              className="h-full bg-transparent outline-none text-[11px] font-black text-[#062e3a] uppercase tracking-widest cursor-pointer"
            >
              <option value="ALL">Todas las Fechas</option>
              {opciones.meses.map((m) => (
                <option key={m} value={m}>
                  {formatoMesCorto(m)}
                </option>
              ))}
            </select>
          </div>

          {/* Selector Ordenar (ESTILO CORPORATIVO UNIFICADO) */}
          <div className="flex items-center h-10 bg-[#f4f7f4] px-3 rounded-xl border border-gray-200 shrink-0 w-auto">
            <ArrowUpDown size={14} className="text-[#062e3a] mr-2 shrink-0" />
            <select
              value={orden}
              onChange={(e) => {
                setOrden(e.target.value);
                setPaginaActual(1);
              }}
              className="h-full bg-transparent outline-none text-[11px] font-black text-[#062e3a] uppercase tracking-widest cursor-pointer"
            >
              <option value="FECHA_DESC">Más recientes</option>
              <option value="FECHA_ASC">Más antiguos</option>
              <option value="RESPONSABLE_ASC">Responsable (A-Z)</option>
              <option value="RESPONSABLE_DESC">Responsable (Z-A)</option>
              <option value="CANCELADOS_PRIMERO">Cancelados primero</option>
              <option value="EXITOSOS_PRIMERO">Exitosos primero</option>
            </select>
          </div>

          {/* Buscador de Texto */}
          <div className="flex items-center h-10 bg-[#f4f7f4] px-3 rounded-xl border border-gray-200 flex-1 min-w-[180px]">
            <Search size={14} className="text-gray-400 mr-2 shrink-0" />
            <input
              type="text"
              placeholder="Buscar responsable o destino..."
              value={busqueda}
              onChange={(e) => {
                setBusqueda(e.target.value);
                setPaginaActual(1);
              }}
              className="h-full w-full bg-transparent outline-none text-xs font-bold text-[#062e3a]"
            />
          </div>
        </div>
      </div>

      {/* TABLA CON SCROLL INTERNO */}
      <div className="overflow-x-auto custom-scrollbar max-h-[500px] overflow-y-auto relative border border-gray-100 rounded-xl">
        <table className="w-full text-left border-collapse min-w-[800px]">
          <thead className="sticky top-0 bg-[#f4f7f4] shadow-sm z-10">
            <tr>
              <th className="py-4 pl-6 text-[10px] font-black text-[#342c1e]/50 uppercase tracking-widest">
                Fecha
              </th>
              <th className="py-4 text-[10px] font-black text-[#342c1e]/50 uppercase tracking-widest">
                Responsable
              </th>
              <th className="py-4 text-[10px] font-black text-[#342c1e]/50 uppercase tracking-widest">
                Destino / Ubicación
              </th>
              <th className="py-4 text-[10px] font-black text-[#342c1e]/50 uppercase tracking-widest text-center">
                Estado
              </th>
              <th className="py-4 pr-6 text-[10px] font-black text-[#342c1e]/50 uppercase tracking-widest text-right">
                Acción
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {itemsPaginados.length === 0 ? (
              <tr>
                <td colSpan="5" className="py-16 text-center">
                  <Filter size={32} className="mx-auto text-gray-300 mb-2" />
                  <p className="text-[#342c1e]/60 font-bold">
                    No hay registros con estos filtros.
                  </p>
                </td>
              </tr>
            ) : (
              itemsPaginados.map((item) => (
                <tr
                  key={item.id}
                  className="hover:bg-gray-50 transition-colors group bg-white"
                >
                  <td className="py-4 text-sm font-bold text-[#342c1e]/70 pl-6 whitespace-nowrap">
                    {pestañaActual === "suministros"
                      ? new Date(item.fechaPeticion).toLocaleDateString()
                      : item.fecha || item.fechaPedido}
                  </td>

                  <td className="py-4 text-sm font-black text-[#062e3a]">
                    {pestañaActual === "pedidos"
                      ? item.creadoPorNombre || "Sistema"
                      : item.nutricionistaNombre}
                  </td>

                  <td className="py-4 text-sm font-bold text-[#367933]">
                    {pestañaActual === "suministros" ? (
                      <span className="text-gray-400 text-xs uppercase tracking-widest">
                        Sede Central
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 whitespace-nowrap">
                        📍 {item.farmaciaNombre}
                      </span>
                    )}
                  </td>

                  <td className="py-4 text-center">
                    <span
                      className={`text-[9px] font-black px-3 py-1 rounded-md uppercase tracking-widest whitespace-nowrap ${
                        [
                          "VALIDADA",
                          "ENVIADO",
                          "LIQUIDADO",
                          "APROBADO",
                        ].includes(item.estado)
                          ? "bg-[#b1cb0c]/20 text-[#367933]"
                          : ["CANCELADA", "CANCELADO", "RECHAZADA"].includes(
                                item.estado,
                              )
                            ? "bg-red-100 text-red-700"
                            : "bg-amber-100 text-amber-700"
                      }`}
                    >
                      {item.estado.replace("_", " ")}
                    </span>
                  </td>

                  <td className="py-4 text-right pr-6">
                    <button
                      onClick={() => onVerDetalle(item)}
                      className="bg-white border border-gray-200 text-[#342c1e] hover:bg-[#062e3a] hover:text-white px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-colors shadow-sm"
                    >
                      Detalles
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* PIE DE TABLA: PAGINACIÓN */}
      <div className="flex justify-between items-center mt-6 pt-4 border-t border-gray-100">
        <p className="text-xs font-bold text-gray-400">
          Mostrando {itemsPaginados.length > 0 ? indexInicio + 1 : 0} -{" "}
          {indexInicio + itemsPaginados.length} de {filtradosYOrdenados.length}
        </p>
        <div className="flex gap-2">
          <button
            onClick={() => setPaginaActual((p) => Math.max(1, p - 1))}
            disabled={paginaActual === 1}
            className="p-2 rounded-lg border border-gray-200 text-[#062e3a] hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronLeft size={16} />
          </button>
          <span className="flex items-center text-xs font-black text-[#062e3a] px-2">
            Pág {paginaActual} / {totalPaginas}
          </span>
          <button
            onClick={() =>
              setPaginaActual((p) => Math.min(totalPaginas, p + 1))
            }
            disabled={paginaActual === totalPaginas}
            className="p-2 rounded-lg border border-gray-200 text-[#062e3a] hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default HistorialValidaciones;
