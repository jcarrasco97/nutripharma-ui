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
} from "lucide-react";
import { consultasService } from "../../services/consultasService";
import { farmaciaService } from "../../services/farmaciaService";

const VistaConsultas = () => {
  const [consultas, setConsultas] = useState([]);
  const [farmacias, setFarmacias] = useState([]);
  const [cargando, setCargando] = useState(true);

  // NUEVO ESTADO: Controla si el Pop-Up está visible
  const [mostrarModal, setMostrarModal] = useState(false);
  const [guardando, setGuardando] = useState(false);

  const NUTRICIONISTA_ID = 1; // ID temporal de Laura

  // Estado del formulario
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
      const [datosConsultas, datosFarmacias] = await Promise.all([
        consultasService.listarTodas(),
        farmaciaService.listarTodas(),
      ]);
      setConsultas(datosConsultas);
      setFarmacias(datosFarmacias);
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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormulario({ ...formulario, [name]: value });
  };

  // 1. ABRIR EL POP-UP (En lugar de guardar directamente)
  const handlePreSubmit = (e) => {
    e.preventDefault();
    setMostrarModal(true); // Mostramos el modal de confirmación
  };

  // 2. CONFIRMAR Y GUARDAR (El doble combo a la API)
  const confirmarYGuardar = async () => {
    setGuardando(true);
    try {
      const payload = {
        ...formulario,
        nutricionistaId: NUTRICIONISTA_ID,
        farmaciaId: Number(formulario.farmaciaId),
        horaInicio: formulario.horaInicio + ":00",
        horaFin: formulario.horaFin + ":00",
      };

      // Paso 1: Creamos el borrador
      const nuevaConsulta = await consultasService.crear(payload);

      // Paso 2: Lo confirmamos inmediatamente usando el ID que nos ha devuelto el backend
      await consultasService.confirmar(nuevaConsulta.id);

      setMostrarModal(false); // Cerramos el pop-up
      cargarDatos(); // Recargamos la lista

      // Reseteamos las cantidades para el próximo turno, pero mantenemos la farmacia
      setFormulario((prev) => ({
        ...prev,
        nuevas: 0,
        revisiones: 0,
        promociones: 0,
        personalFarmacia: 0,
        observacionesJornada: "",
      }));
    } catch {
      alert("Error al registrar y confirmar el turno.");
    } finally {
      setGuardando(false);
    }
  };

  // 3. ABRIR INCIDENCIA (Se mantiene igual)
  const handleIncidencia = async (id) => {
    const mensaje = window.prompt("Escribe el motivo de la incidencia:");
    if (!mensaje) return;
    try {
      await consultasService.abrirIncidencia(id, mensaje);
      cargarDatos();
    } catch (error) {
      alert(error.response?.data?.message || "Error al abrir incidencia.");
    }
  };

  // Mantenemos el handleConfirmar original por si quedó algún borrador antiguo colgado
  const handleConfirmarAntiguo = async (id) => {
    if (!window.confirm("¿Seguro que quieres confirmar?")) return;
    try {
      await consultasService.confirmar(id);
      cargarDatos();
    } catch {
      alert("Error al confirmar.");
    }
  };

  if (cargando)
    return (
      <div className="flex justify-center p-8">
        <Loader2 className="animate-spin text-sky-500" size={48} />
      </div>
    );

  // Obtener el nombre de la farmacia seleccionada para mostrarlo en el Pop-Up
  const farmaciaSeleccionada =
    farmacias.find((f) => f.id === Number(formulario.farmaciaId))?.nombre || "";

  return (
    <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 animate-fade-in relative">
      {/* --- EL POP-UP (MODAL) --- */}
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
              <p className="text-gray-600 text-sm">
                Revisa los datos antes de confirmar. Una vez guardado, solo
                podrás modificarlo abriendo una incidencia.
              </p>

              <div className="bg-gray-50 rounded-xl p-4 border border-gray-100 space-y-2 text-sm">
                <p>
                  <strong className="text-gray-700">Farmacia:</strong>{" "}
                  {farmaciaSeleccionada}
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
      {/* --- FIN DEL POP-UP --- */}

      {/* FORMULARIO DE REGISTRO */}
      <div className="xl:col-span-1 bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-100">
          <div className="bg-sky-100 p-2 rounded-lg text-sky-600">
            <Stethoscope size={24} />
          </div>
          <h2 className="text-xl font-bold text-gray-800">Registrar Turno</h2>
        </div>

        {/* Cambiamos el onSubmit al nuevo handlePreSubmit */}
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
            className="w-full bg-sky-600 hover:bg-sky-700 text-white font-bold py-3 rounded-xl flex items-center justify-center transition-colors shadow-md shadow-sky-200"
          >
            <CheckCircle size={18} className="mr-2" /> Revisar y Registrar
          </button>
        </form>
      </div>

      {/* HISTORIAL Y MÁQUINA DE ESTADOS */}
      <div className="xl:col-span-2 space-y-4">
        <h2 className="text-xl font-bold text-gray-800 mb-4">
          Historial de Turnos
        </h2>

        {consultas.length === 0 ? (
          <div className="bg-white p-8 rounded-2xl border border-gray-100 text-center text-gray-500">
            No tienes turnos registrados aún.
          </div>
        ) : (
          consultas.map((c) => (
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
                  {c.promociones}
                </div>
                {c.mensajeIncidencia && (
                  <div className="mt-2 text-sm text-amber-700 bg-amber-50 p-2 rounded-lg border border-amber-100">
                    <strong>Incidencia:</strong> {c.mensajeIncidencia}
                  </div>
                )}
              </div>

              {/* BOTONES DE LA MÁQUINA DE ESTADOS */}
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
