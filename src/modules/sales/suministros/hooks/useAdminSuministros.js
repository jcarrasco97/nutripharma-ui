import { useState, useEffect, useCallback } from "react";
import { suministrosService } from "../services/suministrosService";

export const useAdminSuministros = () => {
  const [peticiones, setPeticiones] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [busqueda, setBusqueda] = useState("");
  const [estadoFiltro, setEstadoFiltro] = useState("Todos");

  const cargarPeticiones = useCallback(async () => {
    setCargando(true);
    try {
      const datos = await suministrosService.listarPeticionesAdmin();
      setPeticiones(datos);
    } catch (error) {
      console.error("Error cargando peticiones admin:", error);
    } finally {
      setCargando(false);
    }
  }, []);

  useEffect(() => {
    cargarPeticiones();
  }, [cargarPeticiones]);

  const handleCambiarEstado = async (id, nuevoEstado) => {
    if (
      !window.confirm(
        `¿Seguro que quieres marcar esta petición como ${nuevoEstado}?`,
      )
    )
      return;
    try {
      await suministrosService.cambiarEstado(id, nuevoEstado);
      cargarPeticiones();
    } catch (error) {
      console.error("Error al cambiar estado:", error);
      alert("Error al cambiar el estado.");
    }
  };

  const peticionesFiltradas = peticiones.filter((p) => {
    const matchEstado = estadoFiltro === "Todos" || p.estado === estadoFiltro;
    const matchNombre = p.nutricionistaNombre
      .toLowerCase()
      .includes(busqueda.toLowerCase());
    return matchEstado && matchNombre;
  });

  return {
    peticionesFiltradas,
    cargando,
    busqueda,
    setBusqueda,
    estadoFiltro,
    setEstadoFiltro,
    handleCambiarEstado,
  };
};
