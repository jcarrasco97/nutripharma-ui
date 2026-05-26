import React, { useState, useMemo } from "react";
import {
  Search,
  ArrowUpDown,
  MapPin,
  Edit,
  AlertTriangle,
  Ban,
  Clock,
  FileText,
  CheckCircle,
  Camera,
  Lock,
  RefreshCw,
  Eye,
  Filter,
  ChevronDown,
  Database,
} from "lucide-react";

const HistorialTurnos = ({
  consultasTotales = [],
  handleIncidencia,
  handleConfirmarAntiguo,
  toggleObservaciones,
  obsExpandidas,
  handleSubirEvidenciaAposteriori,
  handleVerFoto,
}) => {
  const [busqueda, setBusqueda] = useState("");
  const [filtroMesAno, setFiltroMesAno] = useState("INITIAL");
  const [orden, setOrden] = useState("FECHA_DESC");

  const opciones = useMemo(() => {
    const mesesUnicos = new Set();
    consultasTotales.forEach((item) => {
      if (item.fecha && typeof item.fecha === "string") {
        const parts = item.fecha.split("-");
        if (parts.length >= 2) {
          mesesUnicos.add(`${parts[0]}-${parts[1]}`);
        }
      }
    });
    return {
      meses: Array.from(mesesUnicos).sort((a, b) => b.localeCompare(a)),
    };
  }, [consultasTotales]);

  const mesActivo =
    filtroMesAno === "INITIAL"
      ? opciones.meses.length > 0
        ? opciones.meses[0]
        : "ALL"
      : filtroMesAno;

  const filtradosYOrdenados = useMemo(() => {
    const filtrados = consultasTotales.filter((item) => {
      const termino = busqueda.toLowerCase();
      let pasaTexto = true;
      if (termino) {
        const targetStr = (item.farmaciaNombre || "").toLowerCase();
        pasaTexto = targetStr.includes(termino);
      }

      let pasaFecha = true;
      if (mesActivo !== "ALL") {
        pasaFecha = item.fecha?.startsWith(mesActivo);
      }

      return pasaTexto && pasaFecha;
    });

    return filtrados.sort((a, b) => {
      const timeA = new Date(a.fecha).getTime();
      const timeB = new Date(b.fecha).getTime();

      switch (orden) {
        case "FECHA_ASC":
          return timeA - timeB;
        case "FECHA_DESC":
          return timeB - timeA;
        case "PENDIENTES_PRIMERO": {
          const pesoA = [
            "BORRADOR",
            "PENDIENTE_VALIDACION",
            "CON_INCIDENCIA",
          ].includes(a.estado)
            ? 0
            : 1;
          const pesoB = [
            "BORRADOR",
            "PENDIENTE_VALIDACION",
            "CON_INCIDENCIA",
          ].includes(b.estado)
            ? 0
            : 1;
          if (pesoA !== pesoB) return pesoA - pesoB;
          return timeB - timeA;
        }
        case "EXITOSOS_PRIMERO": {
          const pesoA = [
            "VALIDADA",
            "ENVIADO",
            "LIQUIDADO",
            "APROBADO",
            "CONFIRMADA",
          ].includes(a.estado)
            ? 0
            : 1;
          const pesoB = [
            "VALIDADA",
            "ENVIADO",
            "LIQUIDADO",
            "APROBADO",
            "CONFIRMADA",
          ].includes(b.estado)
            ? 0
            : 1;
          if (pesoA !== pesoB) return pesoA - pesoB;
          return timeB - timeA;
        }
        case "CANCELADOS_PRIMERO": {
          const pesoA = ["CANCELADA", "CANCELADO", "RECHAZADA"].includes(
            a.estado,
          )
            ? 0
            : 1;
          const pesoB = ["CANCELADA", "CANCELADO", "RECHAZADA"].includes(
            b.estado,
          )
            ? 0
            : 1;
          if (pesoA !== pesoB) return pesoA - pesoB;
          return timeB - timeA;
        }
        default:
          return 0;
      }
    });
  }, [consultasTotales, busqueda, mesActivo, orden]);

  const formatoMesCorto = (key) => {
    const [year, month] = key.split("-");
    const nombre = new Date(year, month - 1).toLocaleString("es-ES", {
      month: "short",
    });
    return `${nombre.charAt(0).toUpperCase() + nombre.slice(1).replace(".", "")} ${year}`;
  };

  return (
    <div className="xl:col-span-2 space-y-6 flex flex-col h-full animate-fade-in">
      <div className="bg-white p-6 md:p-8 rounded-[2.5rem] shadow-sm border border-gray-100 flex flex-col gap-6">
        {/* CABECERA Y FILTROS COMPACTOS */}
        <div className="flex flex-col xl:flex-row justify-between items-start xl:items-end gap-4 pb-4 border-b border-gray-100">
          <div className="shrink-0">
            <h2 className="text-2xl font-black text-[#062e3a] leading-tight flex items-center gap-3">
              Historial de Turnos
              <span className="bg-[#f4f7f4] text-[#367933] text-xs px-2.5 py-1 rounded-lg">
                {filtradosYOrdenados.length}
              </span>
            </h2>
            <p className="text-[11px] font-bold text-[#342c1e]/50 uppercase tracking-widest mt-1">
              Registro de actividad por farmacia
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2 w-full xl:w-auto justify-end">
            {/* 1. FECHA (MES) */}
            <div className="relative bg-[#f4f7f4] px-3 py-2 rounded-xl border border-transparent focus-within:border-[#b1cb0c] transition-all flex-1 sm:flex-none min-w-[130px]">
              <select
                value={mesActivo}
                onChange={(e) => setFiltroMesAno(e.target.value)}
                className="w-full bg-transparent outline-none text-[11px] font-black text-[#062e3a] uppercase tracking-widest cursor-pointer pr-4 appearance-none"
              >
                <option value="ALL">Todas las Fechas</option>
                {opciones.meses.map((m) => (
                  <option key={m} value={m}>
                    {formatoMesCorto(m)}
                  </option>
                ))}
              </select>
              <ChevronDown
                size={14}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-[#062e3a]/40 pointer-events-none"
              />
            </div>

            {/* 2. FILTRO */}
            <div className="relative flex items-center bg-[#f4f7f4] px-3 py-2 rounded-xl border border-transparent focus-within:border-[#b1cb0c] transition-all flex-1 sm:flex-none min-w-[140px]">
              <ArrowUpDown size={14} className="text-[#062e3a] mr-2 shrink-0" />
              <select
                value={orden}
                onChange={(e) => setOrden(e.target.value)}
                className="w-full bg-transparent outline-none text-[11px] font-black text-[#062e3a] uppercase tracking-widest cursor-pointer pr-4 appearance-none"
              >
                <option value="FECHA_DESC">Más recientes</option>
                <option value="FECHA_ASC">Más antiguos</option>
                <option value="PENDIENTES_PRIMERO">Pendientes primero</option>
                <option value="EXITOSOS_PRIMERO">Validados primero</option>
                <option value="CANCELADOS_PRIMERO">Cancelados primero</option>
              </select>
              <ChevronDown
                size={14}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-[#062e3a]/40 pointer-events-none"
              />
            </div>

            {/* 3. BUSCADOR */}
            <div className="flex items-center bg-[#f4f7f4] px-3 py-2 rounded-xl border border-transparent focus-within:border-[#b1cb0c] transition-all w-full sm:w-auto sm:flex-1 min-w-[180px]">
              <Search size={14} className="text-[#062e3a]/40 mr-2 shrink-0" />
              <input
                type="text"
                placeholder="Buscar farmacia..."
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
                className="bg-transparent outline-none text-xs w-full font-bold text-[#062e3a] placeholder:text-[#062e3a]/30"
              />
            </div>
          </div>
        </div>

        {/* LISTADO DE TURNOS */}
        <div className="space-y-5 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
          {filtradosYOrdenados.length === 0 ? (
            <div className="bg-[#f4f7f4] p-10 rounded-[2rem] border-2 border-dashed border-gray-200 text-center flex flex-col items-center">
              <Filter size={32} className="text-[#062e3a]/20 mb-3" />
              <p className="text-[11px] font-black text-[#062e3a]/40 uppercase tracking-widest">
                No hay turnos que coincidan con la búsqueda.
              </p>
            </div>
          ) : (
            filtradosYOrdenados.map((c) => {
              const totalGenerado =
                (c.nuevas || 0) * 25 + (c.revisiones || 0) * 20;
              return (
                <div
                  key={c.id}
                  className="bg-white rounded-[2rem] shadow-sm border border-gray-100 p-6 md:p-8 flex flex-col transition-all hover:shadow-md hover:border-[#b1cb0c]/30"
                >
                  {/* FILA 1: ESTADO Y ACCIONES RÁPIDAS */}
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-4">
                    <div className="flex flex-wrap items-center gap-3">
                      <span
                        className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
                          c.estado === "BORRADOR"
                            ? "bg-gray-100 text-[#342c1e]/70"
                            : c.estado === "VALIDADA"
                              ? "bg-[#b1cb0c]/20 text-[#367933]"
                              : c.estado === "CANCELADA"
                                ? "bg-red-100 text-red-700"
                                : "bg-amber-100 text-amber-700"
                        }`}
                      >
                        {c.estado.replace("_", " ")}
                      </span>
                      <span className="text-lg font-black text-[#062e3a] flex items-center gap-1.5 truncate">
                        <MapPin size={16} className="text-[#367933]" />
                        {c.farmaciaNombre}
                      </span>
                    </div>

                    <div className="flex gap-2">
                      {(c.estado === "PENDIENTE_VALIDACION" ||
                        c.estado === "VALIDADA" ||
                        c.estado === "CON_INCIDENCIA") && (
                        <button
                          onClick={() =>
                            handleIncidencia(c.id, c.mensajeIncidencia, c.estado)
                          }
                          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-colors ${
                            c.estado === "CON_INCIDENCIA"
                              ? "bg-amber-50 text-amber-600 hover:bg-amber-100 border border-amber-200"
                              : "bg-[#f4f7f4] text-[#342c1e]/70 hover:bg-gray-200 border border-transparent"
                          }`}
                        >
                          {c.estado === "CON_INCIDENCIA" ? (
                            <Edit size={14} />
                          ) : (
                            <AlertTriangle size={14} />
                          )}
                          {c.estado === "CON_INCIDENCIA"
                            ? "Editar Incidencia"
                            : "Reportar Error"}
                        </button>
                      )}
                      {c.estado === "CANCELADA" && (
                        <span className="text-red-500" title="Turno Anulado">
                          <Ban size={20} />
                        </span>
                      )}
                    </div>
                  </div>

                  {/* FILA 2: FECHAS Y MÉTRICAS */}
                  <div className="flex flex-col xl:flex-row justify-between items-start gap-4">
                    <div className="flex flex-wrap items-center gap-3 w-full xl:w-auto">
                      <span className="flex items-center gap-1 bg-[#062e3a]/5 px-2 py-1 rounded-lg">
                        <Clock size={14} className="text-[#062e3a]/50" />
                        <span className="font-bold text-[#062e3a]">
                          {c.fecha}
                        </span>
                      </span>
                      <span className="bg-[#367933]/10 text-[#367933] px-2 py-1 rounded-lg font-black">
                        {c.horaInicio.substring(0, 5)} -{" "}
                        {c.horaFin.substring(0, 5)}
                      </span>
                    </div>

                    <div className="bg-[#f4f7f4] p-3 rounded-xl border border-gray-100 text-xs text-[#062e3a] font-bold flex flex-wrap items-center gap-4 w-full xl:w-auto">
                      <span>
                        Nuevas: <span className="text-[#367933]">{c.nuevas}</span>
                      </span>
                      <span>
                        Revisiones:{" "}
                        <span className="text-[#367933]">{c.revisiones}</span>
                      </span>
                      <span>
                        Promo:{" "}
                        <span className="text-[#367933]">{c.promociones}</span>
                      </span>
                      <span>
                        Personal:{" "}
                        <span className="text-[#367933]">
                          {c.personalFarmacia}
                        </span>
                      </span>
                      <span className="flex items-center gap-1 bg-[#367933]/10 text-[#367933] px-2 py-0.5 rounded-lg font-black ml-auto">
                        Ingresos: {totalGenerado}€
                      </span>
                      {c.comisionGenerada != null && (
                        <span className="flex items-center gap-1 bg-[#b1cb0c]/20 text-[#367933] px-2 py-0.5 rounded-lg">
                          <CheckCircle size={11} />
                          Comisión:{" "}
                          <span className="font-black">
                            {Number(c.comisionGenerada).toFixed(2)}€
                          </span>
                        </span>
                      )}
                    </div>
                  </div>

                  {/* FILA 3: NOTAS Y FOTOS */}
                  <div className="flex flex-wrap items-center justify-between gap-4 pt-4 mt-4 border-t border-gray-100">
                    <div className="flex gap-2">
                      {c.observacionesJornada && (
                        <button
                          onClick={() => toggleObservaciones(c.id)}
                          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-colors text-[10px] font-black uppercase tracking-widest border ${
                            obsExpandidas[c.id]
                              ? "bg-[#062e3a] text-white border-[#062e3a]"
                              : "bg-[#b1cb0c]/20 text-[#367933] hover:bg-[#b1cb0c]/40 border-transparent"
                          }`}
                        >
                          <FileText size={14} />
                          {obsExpandidas[c.id] ? "Cerrar" : "Notas"}
                        </button>
                      )}
                      {c.fechaCreacion && (
                        <span className="flex items-center gap-1 text-[10px] font-bold text-[#342c1e]/40">
                          <Database size={11} className="shrink-0" />
                          Registrado:{" "}
                          {new Date(c.fechaCreacion).toLocaleString("es-ES", {
                            day: "2-digit",
                            month: "2-digit",
                            year: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-2 ml-auto">
                      {/* 1. Botón Ver Foto - Solo aparece si HAY foto */}
                      {c.evidenciaUrl && (
                        <button
                          onClick={() => handleVerFoto(c)}
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#062e3a]/10 hover:bg-[#062e3a]/20 text-[#062e3a] text-[10px] font-black uppercase tracking-widest transition-colors"
                          title="Ver evidencia fotográfica"
                        >
                          <Eye size={14} /> Ver Foto
                        </button>
                      )}

                      {/* 2. Lógica de Subida/Sustitución/Sellado */}
                      {!c.evidenciaUrl ? (
                        // CASO A: NO hay foto -> Siempre permitimos añadir
                        <label className="cursor-pointer flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gray-200 hover:bg-gray-300 text-[#062e3a] text-[10px] font-black uppercase tracking-widest transition-colors border border-gray-300">
                          <Camera size={14} /> Añadir Foto
                          <input
                            type="file"
                            className="hidden"
                            accept="image/*"
                            onClick={(e) => (e.target.value = null)}
                            onChange={(e) => {
                              if (e.target.files && e.target.files.length > 0) {
                                if (
                                  window.confirm(
                                    `¿Subir la imagen seleccionada como evidencia del turno?`,
                                  )
                                ) {
                                  handleSubirEvidenciaAposteriori(
                                    c.id,
                                    e.target.files[0],
                                  );
                                }
                              }
                            }}
                          />
                        </label>
                      ) : c.estado !== "VALIDADA" ? (
                        // CASO B: SÍ hay foto y NO está validada -> Permitimos sustituir
                        <label className="cursor-pointer flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-50 hover:bg-amber-100 text-amber-700 text-[10px] font-black uppercase tracking-widest transition-colors border border-amber-200">
                          <RefreshCw size={14} /> Sustituir
                          <input
                            type="file"
                            className="hidden"
                            accept="image/*"
                            onClick={(e) => (e.target.value = null)}
                            onChange={(e) => {
                              if (e.target.files && e.target.files.length > 0) {
                                if (
                                  window.confirm(
                                    `¿Seguro que quieres reemplazar la evidencia actual?`,
                                  )
                                ) {
                                  handleSubirEvidenciaAposteriori(
                                    c.id,
                                    e.target.files[0],
                                  );
                                }
                              }
                            }}
                          />
                        </label>
                      ) : (
                        // CASO C: SÍ hay foto y SÍ está validada -> Evidencia Sellada
                        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#b1cb0c]/20 text-[#367933] text-[10px] font-black uppercase tracking-widest border border-[#b1cb0c]/50">
                          <Lock size={14} /> Bloqueada
                        </div>
                      )}
                    </div>
                  </div>

                  {obsExpandidas[c.id] && c.observacionesJornada && (
                    <div className="mt-4 p-4 bg-amber-50 rounded-xl text-sm text-amber-800 border border-amber-100 animate-fade-in font-medium">
                      <strong className="block text-[10px] uppercase tracking-widest text-amber-600 mb-1">
                        Notas de la jornada:
                      </strong>
                      {c.observacionesJornada}
                    </div>
                  )}

                  {c.mensajeIncidencia && (
                    <div className="mt-4 text-sm text-amber-700 bg-amber-50 p-3 rounded-xl border border-amber-100 flex items-start gap-2">
                      <AlertTriangle size={16} className="shrink-0 mt-0.5" />
                      <span>
                        <strong>Incidencia reportada:</strong>{" "}
                        {c.mensajeIncidencia}
                      </span>
                    </div>
                  )}

                  {c.estado === "BORRADOR" && (
                    <div className="flex justify-end mt-4 pt-4 border-t border-gray-100">
                      <button
                        onClick={() => handleConfirmarAntiguo(c.id)}
                        className="px-6 py-3 bg-[#b1cb0c]/20 text-[#367933] hover:bg-[#367933] hover:text-white rounded-xl font-black transition-colors flex items-center justify-center gap-2"
                      >
                        <CheckCircle size={18} /> Confirmar Jornada
                      </button>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};

export default HistorialTurnos;
