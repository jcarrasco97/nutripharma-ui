import { useState, useEffect, useCallback } from "react";
import { dashboardService } from "../services/dashboardService";

export const useResumenAdmin = () => {
  const fechaActual = new Date();
  const [anio, setAnio] = useState(fechaActual.getFullYear());
  const [mes, setMes] = useState(fechaActual.getMonth() + 1);

  const [facturacion, setFacturacion] = useState([]);
  const [eventos, setEventos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [eventoSeleccionado, setEventoSeleccionado] = useState(null);

  const cargarDatos = useCallback(async () => {
    setCargando(true);
    try {
      const [datosGrafica, datosCalendario] = await Promise.all([
        dashboardService.obtenerFacturacionAdmin(anio).catch(() => []),
        dashboardService.obtenerCalendarioAdmin(anio, mes).catch(() => []),
      ]);
      setFacturacion(datosGrafica);
      setEventos(datosCalendario);
    } catch (error) {
      console.error("Error al cargar dashboard admin:", error);
    } finally {
      setCargando(false);
    }
  }, [anio, mes]);

  useEffect(() => {
    cargarDatos();
  }, [cargarDatos]);

  const diasMes = new Date(anio, mes, 0).getDate();
  const primerDiaSemana = new Date(anio, mes - 1, 1).getDay();
  const offset = primerDiaSemana === 0 ? 6 : primerDiaSemana - 1;

  const cambiarMes = (delta) => {
    let nuevoMes = mes + delta,
      nuevoAnio = anio;
    if (nuevoMes > 12) {
      nuevoMes = 1;
      nuevoAnio++;
    }
    if (nuevoMes < 1) {
      nuevoMes = 12;
      nuevoAnio--;
    }
    setMes(nuevoMes);
    setAnio(nuevoAnio);
  };

  const getEventosDelDia = (dia) => {
    const fechaStr = `${anio}-${String(mes).padStart(2, "0")}-${String(dia).padStart(2, "0")}`;
    return eventos.filter((e) => e.fecha === fechaStr);
  };

  return {
    fechaActual,
    anio,
    setAnio,
    mes,
    cambiarMes,
    facturacion,
    eventos,
    cargando,
    eventoSeleccionado,
    setEventoSeleccionado,
    diasMes,
    offset,
    getEventosDelDia,
  };
};
