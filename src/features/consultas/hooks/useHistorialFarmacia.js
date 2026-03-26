import { useState, useEffect, useCallback } from "react";
import { consultasService } from "../services/consultasService";

export const useHistorialFarmacia = () => {
  const [consultas, setConsultas] = useState([]);
  const [cargando, setCargando] = useState(true);

  const [busqueda, setBusqueda] = useState("");
  const [fechaFiltro, setFechaFiltro] = useState("");
  const [orden, setOrden] = useState("desc");

  const cargarHistorial = useCallback(async () => {
    setCargando(true);
    try {
      const data = await consultasService.obtenerHistorialFarmacia();
      setConsultas(data);
    } catch (error) {
      console.error("Error al cargar el historial:", error);
    } finally {
      setCargando(false);
    }
  }, []);

  useEffect(() => {
    cargarHistorial();
  }, [cargarHistorial]);

  const consultasFiltradas = consultas
    .filter((c) => {
      const coincideNombre = c.nutricionistaNombre
        ?.toLowerCase()
        .includes(busqueda.toLowerCase());
      const coincideFecha = fechaFiltro === "" || c.fecha === fechaFiltro;
      return coincideNombre && coincideFecha;
    })
    .sort((a, b) => {
      const dateA = new Date(a.fecha);
      const dateB = new Date(b.fecha);
      return orden === "desc" ? dateB - dateA : dateA - dateB;
    });

  return {
    consultas,
    cargando,
    busqueda,
    setBusqueda,
    fechaFiltro,
    setFechaFiltro,
    orden,
    setOrden,
    consultasFiltradas,
  };
};
