import { useState, useEffect, useCallback } from "react";
import { suministrosService } from "../services/suministrosService";

export const useSuministros = () => {
  const [materiales, setMateriales] = useState([]);
  const [peticiones, setPeticiones] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [enviando, setEnviando] = useState(false);
  const [seleccionados, setSeleccionados] = useState([]);
  const [mesFiltro, setMesFiltro] = useState("Todos");
  const [ordenFiltro, setOrdenFiltro] = useState("recientes");
  const [estadoFiltro, setEstadoFiltro] = useState("Todos");

  const cargarDatos = useCallback(async () => {
    setCargando(true);
    try {
      const [datosMat, datosPet] = await Promise.all([
        suministrosService.listarMateriales(),
        suministrosService.obtenerMisPeticiones(),
      ]);
      setMateriales(datosMat);
      setPeticiones(datosPet);
    } catch (error) {
      console.error("Error al cargar suministros:", error);
    } finally {
      setCargando(false);
    }
  }, []);

  useEffect(() => {
    cargarDatos();
  }, [cargarDatos]);

  const handleCheckbox = (id) => {
    setSeleccionados((prev) =>
      prev.includes(id)
        ? prev.filter((itemId) => itemId !== id)
        : [...prev, id],
    );
  };

  const handleSolicitar = async () => {
    if (seleccionados.length === 0)
      return alert("Selecciona al menos un material.");
    setEnviando(true);
    try {
      await suministrosService.crearPeticion(seleccionados);
      alert("Petición de suministros enviada correctamente.");
      setSeleccionados([]);
      cargarDatos();
    } catch (error) {
      alert("Error al enviar la petición.");
      console.error(error);
    } finally {
      setEnviando(false);
    }
  };

  const mesesDisponibles = [
    "Todos",
    ...new Set(peticiones.map((p) => p.fechaPeticion.substring(0, 7))),
  ].sort((a, b) => b.localeCompare(a));

  const peticionesFiltradas = peticiones
    .filter(
      (p) => mesFiltro === "Todos" || p.fechaPeticion.startsWith(mesFiltro),
    )
    .filter((p) => estadoFiltro === "Todos" || p.estado === estadoFiltro)
    .sort((a, b) => {
      const dateA = new Date(a.fechaPeticion);
      const dateB = new Date(b.fechaPeticion);
      return ordenFiltro === "recientes" ? dateB - dateA : dateA - dateB;
    });

  return {
    materiales,
    peticionesFiltradas,
    cargando,
    enviando,
    seleccionados,
    mesFiltro,
    setMesFiltro,
    ordenFiltro,
    setOrdenFiltro,
    estadoFiltro,
    setEstadoFiltro,
    mesesDisponibles,
    handleCheckbox,
    handleSolicitar,
  };
};
