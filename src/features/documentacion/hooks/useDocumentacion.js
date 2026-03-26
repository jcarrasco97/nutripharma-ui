import { useState, useEffect, useCallback } from "react";
import { jwtDecode } from "jwt-decode";
import { documentosService } from "../services/documentosService";

export const useDocumentacion = () => {
  const [documentos, setDocumentos] = useState([]);
  const [destinatarios, setDestinatarios] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [subiendo, setSubiendo] = useState(false);
  const [descargandoId, setDescargandoId] = useState(null);
  const [borrandoId, setBorrandoId] = useState(null);

  const [filtroTexto, setFiltroTexto] = useState("");
  const [filtroMes, setFiltroMes] = useState("Todos");

  const [formulario, setFormulario] = useState({
    alcance: "GLOBAL_TODOS",
    propietarioEmail: "",
    archivo: null,
  });

  const token = localStorage.getItem("token");
  const isAdmin = token ? jwtDecode(token).roles.includes("ROLE_ADMIN") : false;

  const cargarDatos = useCallback(async () => {
    setCargando(true);
    try {
      const docs = await documentosService.listar();
      setDocumentos(docs);
      if (isAdmin) {
        const dest = await documentosService.obtenerDestinatarios();
        setDestinatarios(dest);
      }
    } catch (error) {
      console.error("Error al cargar datos:", error);
    } finally {
      setCargando(false);
    }
  }, [isAdmin]);

  useEffect(() => {
    cargarDatos();
  }, [cargarDatos]);

  const handleSubir = async (e) => {
    e.preventDefault();
    if (!formulario.archivo) return alert("Por favor, selecciona un archivo.");
    if (formulario.alcance === "INDIVIDUAL" && !formulario.propietarioEmail) {
      return alert("Por favor, selecciona un destinatario.");
    }

    setSubiendo(true);
    try {
      const formData = new FormData();
      formData.append("alcance", formulario.alcance);
      if (formulario.alcance === "INDIVIDUAL") {
        formData.append("propietarioEmail", formulario.propietarioEmail);
      }
      formData.append("archivo", formulario.archivo);

      await documentosService.subir(formData);
      alert("Documento subido con éxito.");
      setFormulario({
        alcance: "GLOBAL_TODOS",
        propietarioEmail: "",
        archivo: null,
      });
      document.getElementById("fileInput").value = "";
      cargarDatos();
    } catch (error) {
      console.error("Error al subir:", error);
      alert("Error al subir el documento.");
    } finally {
      setSubiendo(false);
    }
  };

  const handleDescargar = async (id, nombreOriginal) => {
    setDescargandoId(id);
    try {
      await documentosService.descargar(id, nombreOriginal);
    } catch (error) {
      alert("Error al descargar el archivo.");
      console.error(error);
    } finally {
      setDescargandoId(null);
    }
  };

  const handleBorrar = async (id) => {
    if (
      !window.confirm(
        "¿Estás seguro de que deseas eliminar este documento? Se borrará permanentemente de la base de datos y de la nube.",
      )
    )
      return;
    setBorrandoId(id);
    try {
      await documentosService.eliminar(id);
      alert("Documento eliminado correctamente.");
      cargarDatos();
    } catch (error) {
      alert("Error al eliminar el documento.");
      console.error(error);
    } finally {
      setBorrandoId(null);
    }
  };

  const mesesDisponibles = [
    "Todos",
    ...new Set(documentos.map((d) => d.fechaSubida.substring(0, 7))),
  ].sort((a, b) => b.localeCompare(a));

  const documentosFiltrados = documentos
    .filter((d) => filtroMes === "Todos" || d.fechaSubida.startsWith(filtroMes))
    .filter((d) =>
      d.nombreOriginal.toLowerCase().includes(filtroTexto.toLowerCase()),
    );

  return {
    documentosFiltrados,
    destinatarios,
    cargando,
    subiendo,
    descargandoId,
    borrandoId,
    filtroTexto,
    setFiltroTexto,
    filtroMes,
    setFiltroMes,
    formulario,
    setFormulario,
    isAdmin,
    mesesDisponibles,
    handleSubir,
    handleDescargar,
    handleBorrar,
  };
};
