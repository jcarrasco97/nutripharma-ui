import { useState, useEffect } from "react";
import { consultasService } from "../services/consultasService";
// Consumimos los módulos vecinos limpiamente
import { farmaciaService } from "@/modules/organization/farmacias";
import { nutricionistasService } from "@/modules/organization/nutricionistas";

export const useConsultas = () => {
  const [consultas, setConsultas] = useState([]);
  const [farmacias, setFarmacias] = useState([]);
  const [perfil, setPerfil] = useState(null);
  const [cargando, setCargando] = useState(true);

  const [mostrarModal, setMostrarModal] = useState(false);
  const [guardando, setGuardando] = useState(false);
  const [obsExpandidas, setObsExpandidas] = useState({});

  const [archivoEvidencia, setArchivoEvidencia] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [urlEvidenciaModal, setUrlEvidenciaModal] = useState(null);
  const [consultaFotoSeleccionada, setConsultaFotoSeleccionada] =
    useState(null);

  const [formulario, setFormulario] = useState({
    farmaciaId: "",
    fecha: new Date().toISOString().split("T")[0],
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

  const horasOcupadasHoy = consultas
    .filter((c) => c.fecha === formulario.fecha && c.estado !== "CANCELADA")
    .map((c) => ({
      inicio: c.horaInicio.substring(0, 5),
      fin: c.horaFin.substring(0, 5),
    }))
    .sort((a, b) => a.inicio.localeCompare(b.inicio));

  const comprobarSolapamientoReact = () => {
    const start = formulario.horaInicio;
    const end = formulario.horaFin;
    for (let ocupado of horasOcupadasHoy) {
      if (start < ocupado.fin && end > ocupado.inicio) {
        return true;
      }
    }
    return false;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormulario({ ...formulario, [name]: value });
  };

  const handleArchivoChange = (e) => {
    if (!e.target.files || e.target.files.length === 0) {
      setArchivoEvidencia(null);
      if (previewUrl) URL.revokeObjectURL(previewUrl);
      setPreviewUrl(null);
      return;
    }

    const file = e.target.files[0];
    setArchivoEvidencia(file);
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setPreviewUrl(URL.createObjectURL(file));
  };

  const handlePreSubmit = () => {
    if (formulario.horaFin <= formulario.horaInicio) {
      return alert(
        "Error: La hora de fin debe ser posterior a la hora de inicio.",
      );
    }
    if (comprobarSolapamientoReact()) {
      return alert(
        "🚨 CONFLICTO DE AGENDA: El horario seleccionado se solapa con un turno que ya tienes registrado este día.",
      );
    }
    setMostrarModal(true);
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

      if (archivoEvidencia) {
        await consultasService.subirEvidencia(
          nuevaConsulta.id,
          archivoEvidencia,
        );
      }

      setMostrarModal(false);
      setFormulario((prev) => ({
        ...prev,
        nuevas: 0,
        revisiones: 0,
        promociones: 0,
        personalFarmacia: 0,
        observacionesJornada: "",
      }));
      setArchivoEvidencia(null);
      if (previewUrl) URL.revokeObjectURL(previewUrl);
      setPreviewUrl(null);

      cargarDatos();
      alert(
        archivoEvidencia
          ? "Turno y foto registrados con éxito."
          : "Turno registrado con éxito.",
      );
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

  const handleSubirEvidenciaAposteriori = async (consultaId, file) => {
    try {
      setCargando(true);
      await consultasService.subirEvidencia(consultaId, file);
      await cargarDatos();
      alert("Evidencia fotográfica adjuntada correctamente.");
    } catch (error) {
      alert(error.response?.data?.message || "Error al subir la foto a Drive.");
    } finally {
      setCargando(false);
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
      console.error(error);
      alert("Error al confirmar.");
    }
  };

  const toggleObservaciones = (id) => {
    setObsExpandidas((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleVerFoto = async (consulta) => {
    try {
      setCargando(true);
      const url = await consultasService.verEvidencia(consulta.id);
      setConsultaFotoSeleccionada(consulta);
      setUrlEvidenciaModal(url);
    } catch (error) {
      console.error("Error visualizando evidencia:", error);
      alert(
        "Error al descargar la foto. Es posible que el archivo ya no exista en Drive.",
      );
    } finally {
      setCargando(false);
    }
  };

  const handleVerPreview = () => {
    if (previewUrl) {
      setConsultaFotoSeleccionada({
        fecha: formulario.fecha,
        evidenciaFecha: new Date().toISOString(),
      });
      setUrlEvidenciaModal(previewUrl);
    }
  };

  const cerrarModalEvidencia = () => {
    if (urlEvidenciaModal && urlEvidenciaModal !== previewUrl) {
      URL.revokeObjectURL(urlEvidenciaModal);
    }
    setUrlEvidenciaModal(null);
    setConsultaFotoSeleccionada(null);
  };

  const farmaciaSeleccionadaNombre =
    farmacias.find((f) => f.id === Number(formulario.farmaciaId))?.nombre || "";

  return {
    consultas, // 👈 Exportado aquí
    cargando,
    farmacias,
    formulario,
    guardando,
    mostrarModal,
    obsExpandidas,
    farmaciaSeleccionadaNombre,
    archivoEvidencia,
    previewUrl,
    consultaFotoSeleccionada,
    horasOcupadasHoy,
    handleVerFoto,
    urlEvidenciaModal,
    handleVerPreview,
    cerrarModalEvidencia,
    setMostrarModal,
    handleChange,
    handleArchivoChange,
    handlePreSubmit,
    confirmarYGuardar,
    handleIncidencia,
    handleConfirmarAntiguo,
    toggleObservaciones,
    handleSubirEvidenciaAposteriori,
  };
};
