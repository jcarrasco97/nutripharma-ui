import React from "react";
import {
  Filter,
  ArrowUpDown,
  Search,
  MapPin,
  Edit,
  AlertTriangle,
  Ban,
  Clock,
  FileText,
  CheckCircle,
  Camera, // <-- IMPORTADO
  Lock,
  RefreshCw,
  Eye,
} from "lucide-react";

const HistorialTurnos = ({
  consultasFiltradas,
  mesesDisponibles,
  mesFiltro,
  setMesFiltro,
  ordenFiltro,
  setOrdenFiltro,
  busqueda,
  setBusqueda,
  handleIncidencia,
  handleConfirmarAntiguo,
  toggleObservaciones,
  obsExpandidas,
  handleSubirEvidenciaAposteriori, // <-- NUEVA PROP
  handleVerFoto,
}) => {
  return (
    <div className="xl:col-span-2 space-y-6">
      <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-100">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6 pb-4 border-b border-gray-100">
          <h2 className="text-2xl font-black text-[#062e3a]">
            Historial de Turnos
          </h2>
          <div className="flex gap-2 w-full md:w-auto">
            <div className="relative flex-1 md:w-40">
              <Filter
                size={14}
                className="absolute left-3 top-3.5 text-gray-400"
              />
              <select
                value={mesFiltro}
                onChange={(e) => setMesFiltro(e.target.value)}
                className="w-full pl-9 pr-2 py-3 text-xs font-bold text-[#062e3a] border border-gray-200 rounded-xl bg-[#f4f7f4] focus:bg-white focus:border-[#b1cb0c] outline-none appearance-none"
              >
                {mesesDisponibles.map((mes) => (
                  <option key={mes} value={mes}>
                    {mes === "Todos" ? "Todos los meses" : mes}
                  </option>
                ))}
              </select>
            </div>
            <div className="relative flex-1 md:w-40">
              <ArrowUpDown
                size={14}
                className="absolute left-3 top-3.5 text-gray-400"
              />
              <select
                value={ordenFiltro}
                onChange={(e) => setOrdenFiltro(e.target.value)}
                className="w-full pl-9 pr-2 py-3 text-xs font-bold text-[#062e3a] border border-gray-200 rounded-xl bg-[#f4f7f4] focus:bg-white focus:border-[#b1cb0c] outline-none appearance-none"
              >
                <option value="recientes">Más Recientes</option>
                <option value="antiguos">Más Antiguos</option>
              </select>
            </div>
          </div>
        </div>

        <div className="relative mb-6">
          <Search size={16} className="absolute left-4 top-3.5 text-gray-400" />
          <input
            type="text"
            placeholder="Buscar por nombre de farmacia..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            className="w-full pl-11 pr-4 py-3 bg-[#f4f7f4] border border-gray-200 rounded-xl text-sm text-[#062e3a] focus:bg-white focus:border-[#b1cb0c] outline-none transition-colors"
          />
        </div>

        <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
          {consultasFiltradas.length === 0 ? (
            <div className="bg-[#f4f7f4] p-8 rounded-[1.5rem] border-2 border-dashed border-gray-200 text-center text-[#342c1e]/60 font-bold">
              No se encontraron turnos con estos filtros.
            </div>
          ) : (
            consultasFiltradas.map((c) => (
              <div
                key={c.id}
                className="bg-white rounded-[1.5rem] shadow-sm border border-gray-100 p-6 flex flex-col transition-all hover:shadow-md hover:border-[#b1cb0c]/50"
              >
                <div className="flex justify-between items-start mb-2">
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
                      <MapPin size={16} className="text-[#367933]" />{" "}
                      {c.farmaciaNombre}
                    </span>
                  </div>

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
                          : "bg-[#f4f7f4] text-[#342c1e]/70 hover:bg-gray-200 border border-gray-200"
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

                <div className="text-sm text-[#342c1e]/80 flex items-center gap-3 mb-3 font-medium">
                  <span className="flex items-center gap-1">
                    <Clock size={14} className="text-[#062e3a]/50" /> {c.fecha}{" "}
                    ({c.tipoTurno})
                  </span>
                  <span>
                    {c.horaInicio.substring(0, 5)} - {c.horaFin.substring(0, 5)}
                  </span>
                </div>

                <div className="bg-[#f4f7f4] p-3 rounded-xl border border-gray-100 text-xs text-[#062e3a] font-bold flex flex-wrap items-center gap-4">
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
                    <span className="text-[#367933]">{c.personalFarmacia}</span>
                  </span>

                  <div className="ml-auto flex items-center gap-2">
                    {/* 👇 SI HAY FOTO, PONEMOS EL BOTÓN DE VERLA 👇 */}
                    {c.evidenciaUrl && (
                      <button
                        onClick={() => handleVerFoto(c.id)}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#062e3a]/10 hover:bg-[#062e3a]/20 text-[#062e3a] text-[10px] font-black uppercase tracking-widest transition-colors"
                        title="Ver evidencia fotográfica"
                      >
                        <Eye size={14} /> Ver Foto
                      </button>
                    )}

                    {/* 👇 LA LÓGICA DE SUBIR / SUSTITUIR / CANDADO 👇 */}
                    {!c.evidenciaUrl ? (
                      <label className="cursor-pointer flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gray-200 hover:bg-gray-300 text-[#062e3a] text-[10px] font-black uppercase tracking-widest transition-colors border border-gray-300">
                        <Camera size={14} /> Adjuntar Foto
                        <input
                          type="file"
                          className="hidden"
                          accept="image/*"
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
                      <label
                        className="cursor-pointer flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-50 hover:bg-amber-100 text-amber-700 text-[10px] font-black uppercase tracking-widest transition-colors border border-amber-200"
                        title="Sustituir foto antes de que central valide"
                      >
                        <RefreshCw size={14} /> Sustituir Foto
                        <input
                          type="file"
                          className="hidden"
                          accept="image/*"
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
                      <div
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#b1cb0c]/20 text-[#367933] text-[10px] font-black uppercase tracking-widest border border-[#b1cb0c]/50"
                        title="Evidencia bloqueada."
                      >
                        <Lock size={14} /> Evidencia Sellada
                      </div>
                    )}
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
                        {obsExpandidas[c.id] ? "Ocultar Notas" : "Ver Notas"}
                      </button>
                    )}
                  </div>
                </div>

                {obsExpandidas[c.id] && c.observacionesJornada && (
                  <div className="mt-3 p-4 bg-amber-50 rounded-xl text-sm text-amber-800 border border-amber-100 animate-fade-in font-medium">
                    <strong className="block text-[10px] uppercase tracking-widest text-amber-600 mb-1">
                      Notas de la jornada:
                    </strong>
                    {c.observacionesJornada}
                  </div>
                )}

                {c.mensajeIncidencia && (
                  <div className="mt-3 text-sm text-amber-700 bg-amber-50 p-3 rounded-xl border border-amber-100 flex items-start gap-2">
                    <AlertTriangle size={16} className="shrink-0 mt-0.5" />
                    <span>
                      <strong>Incidencia reportada:</strong>{" "}
                      {c.mensajeIncidencia}
                    </span>
                  </div>
                )}

                {c.estado === "BORRADOR" && (
                  <div className="flex justify-end mt-4">
                    <button
                      onClick={() => handleConfirmarAntiguo(c.id)}
                      className="px-6 py-3 bg-[#b1cb0c]/20 text-[#367933] hover:bg-[#367933] hover:text-white rounded-xl font-black transition-colors flex items-center justify-center gap-2"
                    >
                      <CheckCircle size={18} /> Confirmar Jornada
                    </button>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default HistorialTurnos;
