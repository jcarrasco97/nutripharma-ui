import React, { useState, useEffect } from "react";
import {
  Stethoscope,
  Save,
  CheckCircle,
  AlertTriangle,
  Clock,
  MapPin,
  Loader2,
  X,
  Filter,
  ArrowUpDown,
  Search, // <-- Asegúrate de que esto está
  Calendar, // <-- ¡AQUÍ ESTABA EL FALLO DEL RENDERIZADO!
} from "lucide-react";
import { consultasService } from "../../services/consultasService";
import { farmaciaService } from "../../services/farmaciaService";
import { nutricionistasService } from "../../services/nutricionistasService";

const VistaConsultas = () => {
  const [consultas, setConsultas] = useState([]);
  const [farmacias, setFarmacias] = useState([]);
  const [perfil, setPerfil] = useState(null);
  const [cargando, setCargando] = useState(true);

  // ESTADOS DE FILTRO
  const [mesFiltro, setMesFiltro] = useState("Todos");
  const [ordenFiltro, setOrdenFiltro] = useState("recientes");
  const [busqueda, setBusqueda] = useState("");

  const [mostrarModal, setMostrarModal] = useState(false);
  const [guardando, setGuardando] = useState(false);

  const [formulario, setFormulario] = useState({
    farmaciaId: "",
    fecha: new Date().toISOString().split("T")[0],
    tipoTurno: "MANANA",
    horaInicio: "09:00",
    horaFin: "14:00",
    nuevas: 0,
    revisiones: 0,
    promociones: 0,
    personalFarmacia: 0,
    observacionesJornada: "",
  });

  const cargarDatos = async () => {
    setCargando(true);
    try {
      const [datosConsultas, datosFarmacias, miPerfil] = await Promise.all([
        consultasService.obtenerMisConsultas(),
        farmaciaService.listarTodas(),
        nutricionistasService.obtenerMiPerfil(),
      ]);
      setConsultas(datosConsultas);
      setFarmacias(datosFarmacias);
      setPerfil(miPerfil);

      if (datosFarmacias.length > 0) {
        setFormulario((prev) => ({
          ...prev,
          farmaciaId: datosFarmacias[0].id,
        }));
      }
    } catch (error) {
      console.error("Error cargando datos:", error);
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    cargarDatos();
  }, []);

  // --- LÓGICA DE FILTRADO Y ORDENACIÓN ---
  const mesesDisponibles = [
    "Todos",
    ...new Set(consultas.map((c) => c.fecha.substring(0, 7))),
  ].sort((a, b) => b.localeCompare(a));

  const consultasFiltradas = consultas
    .filter((c) => {
      const coincideMes =
        mesFiltro === "Todos" || c.fecha.startsWith(mesFiltro);
      const coincideBusqueda = c.farmaciaNombre
        .toLowerCase()
        .includes(busqueda.toLowerCase());
      return coincideMes && coincideBusqueda;
    })
    .sort((a, b) => {
      if (ordenFiltro === "recientes")
        return new Date(b.fecha) - new Date(a.fecha);
      return new Date(a.fecha) - new Date(b.fecha);
    });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormulario({ ...formulario, [name]: value });
  };

  const handlePreSubmit = (e) => {
    e.preventDefault();
    setMostrarModal(true);
  };

  // --- CORRECCIÓN CLAVE: Uso de .crear() y .confirmar() ---
  const confirmarYGuardar = async () => {
    if (!perfil)
      return alert("El perfil del usuario no ha cargado correctamente.");
    setGuardando(true);
    try {
      const payload = {
        ...formulario,
        nutricionistaId: perfil.id, // Sincronizado dinámicamente
        farmaciaId: Number(formulario.farmaciaId),
        horaInicio:
          formulario.horaInicio.length === 5
            ? formulario.horaInicio + ":00"
            : formulario.horaInicio,
        horaFin:
          formulario.horaFin.length === 5
            ? formulario.horaFin + ":00"
            : formulario.horaFin,
      };

      const nuevaConsulta = await consultasService.crear(payload);
      await consultasService.confirmar(nuevaConsulta.id);

      setMostrarModal(false);
      cargarDatos();

      setFormulario((prev) => ({
        ...prev,
        nuevas: 0,
        revisiones: 0,
        promociones: 0,
        personalFarmacia: 0,
        observacionesJornada: "",
      }));
    } catch (err) {
      console.error("Error al guardar:", err); // Chivato para la consola de React (F12)
      alert(
        "Error al registrar el turno: " +
          (err.response?.data?.message || err.message),
      );
    } finally {
      setGuardando(false);
    }
  };

  // --- CORRECCIÓN CLAVE: Uso de .abrirIncidencia() ---
  const handleIncidencia = async (id) => {
    const mensaje = window.prompt("Escribe el motivo de la incidencia:");
    if (!mensaje) return;
    try {
      await consultasService.abrirIncidencia(id, mensaje);
      cargarDatos();
    } catch (error) {
      console.error("Error incidencia:", error);
      alert(error.response?.data?.message || "Error al abrir incidencia.");
    }
  };

  // --- CORRECCIÓN CLAVE: Uso de .confirmar() ---
  const handleConfirmarAntiguo = async (id) => {
    if (!window.confirm("¿Seguro que quieres confirmar?")) return;
    try {
      await consultasService.confirmar(id);
      cargarDatos();
    } catch (err) {
      console.error("Error al confirmar antiguo:", err);
      alert("Error al confirmar.");
    }
  };

  if (cargando)
    return (
      <div className="flex justify-center p-8">
        <Loader2 className="animate-spin text-sky-500" size={48} />
      </div>
    );

  const farmaciaSeleccionadaNombre =
    farmacias.find((f) => f.id === Number(formulario.farmaciaId))?.nombre || "";

  return (
    <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 animate-fade-in relative">
      {/* MODAL DE CONFIRMACIÓN */}
      {mostrarModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-sm">
          <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full overflow-hidden animate-fade-in">
            <div className="bg-sky-600 p-6 text-white flex justify-between items-center">
              <h3 className="text-xl font-bold">Resumen del Turno</h3>
              <button
                onClick={() => setMostrarModal(false)}
                className="text-sky-200 hover:text-white transition-colors"
              >
                <X size={24} />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div className="bg-gray-50 rounded-xl p-4 border border-gray-100 space-y-2 text-sm">
                <p>
                  <strong className="text-gray-700">Farmacia:</strong>{" "}
                  {farmaciaSeleccionadaNombre}
                </p>
                <p>
                  <strong className="text-gray-700">Fecha:</strong>{" "}
                  {formulario.fecha} ({formulario.tipoTurno})
                </p>
                <p>
                  <strong className="text-gray-700">Horario:</strong>{" "}
                  {formulario.horaInicio} a {formulario.horaFin}
                </p>
                <div className="border-t border-gray-200 my-2 pt-2 grid grid-cols-2 gap-2">
                  <p>
                    <strong className="text-gray-700">Nuevas:</strong>{" "}
                    {formulario.nuevas}
                  </p>
                  <p>
                    <strong className="text-gray-700">Revisiones:</strong>{" "}
                    {formulario.revisiones}
                  </p>
                  <p>
                    <strong className="text-gray-700">Promo:</strong>{" "}
                    {formulario.promociones}
                  </p>
                  <p>
                    <strong className="text-gray-700">Personal:</strong>{" "}
                    {formulario.personalFarmacia}
                  </p>
                </div>
              </div>
              <div className="flex gap-3 pt-4">
                <button
                  onClick={() => setMostrarModal(false)}
                  disabled={guardando}
                  className="flex-1 py-3 px-4 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold rounded-xl transition-colors disabled:opacity-50"
                >
                  Cancelar
                </button>
                <button
                  onClick={confirmarYGuardar}
                  disabled={guardando}
                  className="flex-1 py-3 px-4 bg-sky-600 hover:bg-sky-700 text-white font-bold rounded-xl transition-colors flex items-center justify-center disabled:opacity-50"
                >
                  {guardando ? (
                    <Loader2 className="animate-spin" size={20} />
                  ) : (
                    "Sí, Confirmar"
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* FORMULARIO DE REGISTRO */}
      <div className="xl:col-span-1 bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-100">
          <div className="bg-sky-100 p-2 rounded-lg text-sky-600">
            <Stethoscope size={24} />
          </div>
          <h2 className="text-xl font-bold text-gray-800">Registrar Turno</h2>
        </div>

        <form onSubmit={handlePreSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">
              Farmacia
            </label>
            <select
              name="farmaciaId"
              value={formulario.farmaciaId}
              onChange={handleChange}
              className="w-full border-gray-200 rounded-xl text-sm"
              required
            >
              {farmacias.map((f) => (
                <option key={f.id} value={f.id}>
                  {f.nombre}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">
                Fecha
              </label>
              <input
                type="date"
                name="fecha"
                value={formulario.fecha}
                onChange={handleChange}
                className="w-full border-gray-200 rounded-xl text-sm"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">
                Turno
              </label>
              <select
                name="tipoTurno"
                value={formulario.tipoTurno}
                onChange={handleChange}
                className="w-full border-gray-200 rounded-xl text-sm"
              >
                <option value="MANANA">Mañana</option>
                <option value="TARDE">Tarde</option>
                <option value="DIA_COMPLETO">Día Completo</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">
                Hora Inicio
              </label>
              <input
                type="time"
                name="horaInicio"
                value={formulario.horaInicio}
                onChange={handleChange}
                className="w-full border-gray-200 rounded-xl text-sm"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">
                Hora Fin
              </label>
              <input
                type="time"
                name="horaFin"
                value={formulario.horaFin}
                onChange={handleChange}
                className="w-full border-gray-200 rounded-xl text-sm"
                required
              />
            </div>
          </div>

          {/* MÉTRICAS DE ACTIVIDAD */}
          <div className="grid grid-cols-2 gap-4 p-4 bg-gray-50 rounded-xl border border-gray-100">
            <div>
              <label className="block text-xs font-bold text-gray-500 mb-1">
                Nuevas
              </label>
              <input
                type="number"
                min="0"
                name="nuevas"
                value={formulario.nuevas}
                onChange={handleChange}
                className="w-full border-gray-200 rounded-lg text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-500 mb-1">
                Revisiones
              </label>
              <input
                type="number"
                min="0"
                name="revisiones"
                value={formulario.revisiones}
                onChange={handleChange}
                className="w-full border-gray-200 rounded-lg text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-500 mb-1">
                Promociones
              </label>
              <input
                type="number"
                min="0"
                name="promociones"
                value={formulario.promociones}
                onChange={handleChange}
                className="w-full border-gray-200 rounded-lg text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-500 mb-1">
                Personal
              </label>
              <input
                type="number"
                min="0"
                name="personalFarmacia"
                value={formulario.personalFarmacia}
                onChange={handleChange}
                className="w-full border-gray-200 rounded-lg text-sm"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">
              Observaciones
            </label>
            <textarea
              name="observacionesJornada"
              value={formulario.observacionesJornada}
              onChange={handleChange}
              rows="2"
              className="w-full border-gray-200 rounded-xl text-sm"
            ></textarea>
          </div>

          <button
            type="submit"
            className="w-full bg-sky-600 hover:bg-sky-700 text-white font-bold py-3 rounded-xl transition-colors shadow-md"
          >
            <CheckCircle size={18} className="mr-2" /> Revisar y Registrar
          </button>
        </form>
      </div>

      {/* HISTORIAL Y FILTROS */}
      <div className="xl:col-span-2 space-y-4">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-4">
          <h2 className="text-xl font-bold text-gray-800">
            Historial de Turnos
          </h2>

          <div className="flex gap-2 w-full md:w-auto">
            <div className="relative flex-1 md:w-36">
              <Filter
                size={14}
                className="absolute left-2.5 top-3 text-gray-400"
              />
              <select
                value={mesFiltro}
                onChange={(e) => setMesFiltro(e.target.value)}
                className="w-full pl-8 pr-2 py-2 text-xs border border-gray-200 rounded-lg bg-white"
              >
                {mesesDisponibles.map((mes) => (
                  <option key={mes} value={mes}>
                    {mes === "Todos" ? "Todos los meses" : mes}
                  </option>
                ))}
              </select>
            </div>
            <div className="relative flex-1 md:w-36">
              <ArrowUpDown
                size={14}
                className="absolute left-2.5 top-3 text-gray-400"
              />
              <select
                value={ordenFiltro}
                onChange={(e) => setOrdenFiltro(e.target.value)}
                className="w-full pl-8 pr-2 py-2 text-xs border border-gray-200 rounded-lg bg-white"
              >
                <option value="recientes">Más Recientes</option>
                <option value="antiguos">Más Antiguos</option>
              </select>
            </div>
          </div>
        </div>

        {/* Buscador de farmacias */}
        <div className="relative mb-4">
          <Search size={16} className="absolute left-3 top-3 text-gray-400" />
          <input
            type="text"
            placeholder="Buscar por nombre de farmacia..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-xl text-sm"
          />
        </div>

        {consultasFiltradas.length === 0 ? (
          <div className="bg-white p-8 rounded-2xl border border-gray-100 text-center text-gray-500">
            No se encontraron turnos con estos filtros.
          </div>
        ) : (
          consultasFiltradas.map((c) => (
            <div
              key={c.id}
              className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 flex flex-col md:flex-row gap-4 items-center justify-between transition-all hover:shadow-md"
            >
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span
                    className={`px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wide
                    ${c.estado === "BORRADOR" ? "bg-gray-100 text-gray-600" : ""}
                    ${c.estado === "CONFIRMADA" ? "bg-emerald-100 text-emerald-700" : ""}
                    ${c.estado === "CON_INCIDENCIA" ? "bg-amber-100 text-amber-700" : ""}
                  `}
                  >
                    {c.estado.replace("_", " ")}
                  </span>
                  <span className="text-sm font-bold text-gray-800 flex items-center gap-1">
                    <MapPin size={14} /> {c.farmaciaNombre}
                  </span>
                </div>
                <div className="text-sm text-gray-500 flex items-center gap-3">
                  <span className="flex items-center gap-1">
                    <Clock size={14} /> {c.fecha} ({c.tipoTurno})
                  </span>
                  <span>
                    {c.horaInicio.substring(0, 5)} - {c.horaFin.substring(0, 5)}
                  </span>
                </div>
                <div className="text-xs text-gray-400 mt-2 font-medium">
                  Nuevas: {c.nuevas} | Revisiones: {c.revisiones} | Promo:{" "}
                  {c.promociones} | Personal: {c.personalFarmacia}
                </div>
                {c.mensajeIncidencia && (
                  <div className="mt-2 text-sm text-amber-700 bg-amber-50 p-2 rounded-lg border border-amber-100">
                    <strong>Incidencia:</strong> {c.mensajeIncidencia}
                  </div>
                )}
              </div>

              <div className="flex gap-2 w-full md:w-auto">
                {c.estado === "BORRADOR" && (
                  <button
                    onClick={() => handleConfirmarAntiguo(c.id)}
                    className="flex-1 md:flex-none px-4 py-2 bg-emerald-50 text-emerald-600 hover:bg-emerald-600 hover:text-white rounded-xl font-bold transition-colors flex items-center justify-center gap-2"
                  >
                    <CheckCircle size={18} /> Confirmar
                  </button>
                )}
                {c.estado === "CONFIRMADA" && (
                  <button
                    onClick={() => handleIncidencia(c.id)}
                    className="flex-1 md:flex-none px-4 py-2 bg-amber-50 text-amber-600 hover:bg-amber-500 hover:text-white rounded-xl font-bold transition-colors flex items-center justify-center gap-2"
                  >
                    <AlertTriangle size={18} /> Abrir Incidencia
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default VistaConsultas;
