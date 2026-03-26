import { useState, useEffect } from "react";
import { consultasService } from "../services/consultasService"; // Ajusta esta ruta según donde lo guardes
import { farmaciaService } from "../../administracion/services/farmaciaService"; // Ajusta ruta
import { nutricionistasService } from "../../administracion/services/nutricionistasService"; // Ajusta ruta

export const useConsultas = () => {
  const [consultas, setConsultas] = useState([]);
  const [farmacias, setFarmacias] = useState([]);
  const [perfil, setPerfil] = useState(null);
  const [cargando, setCargando] = useState(true);

  const [mesFiltro, setMesFiltro] = useState("Todos");
  const [ordenFiltro, setOrdenFiltro] = useState("recientes");
  const [busqueda, setBusqueda] = useState("");

  const [mostrarModal, setMostrarModal] = useState(false);
  const [guardando, setGuardando] = useState(false);

  const [obsExpandidas, setObsExpandidas] = useState({});

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
      const [datosConsultas, todasLasFarmacias, miPerfil] = await Promise.all([
        consultasService.obtenerMisConsultas(),
        farmaciaService.listarTodas(),
        nutricionistasService.obtenerMiPerfil(),
      ]);
      setConsultas(datosConsultas);
      setPerfil(miPerfil);

      const misFarmacias = todasLasFarmacias.filter((f) =>
        miPerfil.asignaciones?.some((a) => a.farmaciaId === f.id),
      );
      setFarmacias(misFarmacias);

      if (misFarmacias.length > 0) {
        setFormulario((prev) => ({
          ...prev,
          farmaciaId: misFarmacias[0].id,
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

  const confirmarYGuardar = async () => {
    if (!perfil) return alert("El perfil no ha cargado correctamente.");
    if (!formulario.farmaciaId) return alert("Debes seleccionar una farmacia.");

    setGuardando(true);
    try {
      const payload = {
        ...formulario,
        nutricionistaId: perfil.id,
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
      const mensajeError =
        err.response?.data?.message ||
        err.message ||
        "Error al registrar el turno.";
      alert(`⚠️ OPERACIÓN DENEGADA:\n\n${mensajeError}`);
    } finally {
      setGuardando(false);
    }
  };

  const handleIncidencia = async (id, mensajePrevio, estadoActual) => {
    const tituloPrompt =
      estadoActual === "VALIDADA"
        ? "Este turno ya estaba liquidado. Describe el error para que la central re-calcule las comisiones:"
        : "Describe el motivo de la incidencia para que la central lo corrija:";

    const mensaje = window.prompt(tituloPrompt, mensajePrevio || "");
    if (mensaje === null) return;
    if (mensaje.trim() === "") return alert("El mensaje no puede estar vacío.");

    try {
      await consultasService.abrirIncidencia(id, mensaje);
      cargarDatos();
    } catch (error) {
      alert(error.response?.data?.message || "Error al abrir incidencia.");
    }
  };

  const handleConfirmarAntiguo = async (id) => {
    if (
      !window.confirm(
        "¿Seguro que quieres confirmar tu jornada y enviarla a central?",
      )
    )
      return;
    try {
      await consultasService.confirmar(id);
      cargarDatos();
    } catch (error) {
      console.error(error); // <--- Usamos la variable para quitar el warning
      alert("Error al confirmar.");
    }
  };

  const toggleObservaciones = (id) => {
    setObsExpandidas((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const farmaciaSeleccionadaNombre =
    farmacias.find((f) => f.id === Number(formulario.farmaciaId))?.nombre || "";

  return {
    // Datos y estados
    cargando,
    farmacias,
    formulario,
    guardando,
    mostrarModal,
    mesFiltro,
    ordenFiltro,
    busqueda,
    mesesDisponibles,
    consultasFiltradas,
    obsExpandidas,
    farmaciaSeleccionadaNombre,

    // Funciones
    setMesFiltro,
    setOrdenFiltro,
    setBusqueda,
    setMostrarModal,
    handleChange,
    confirmarYGuardar,
    handleIncidencia,
    handleConfirmarAntiguo,
    toggleObservaciones,
  };
};
