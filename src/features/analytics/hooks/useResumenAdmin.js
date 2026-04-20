import { useState, useEffect, useCallback, useMemo } from "react";
import { dashboardService } from "../services/dashboardService";
import { farmaciaService } from "../../administracion/services/farmaciaService";
import { nutricionistasService } from "../../administracion/services/nutricionistasService";

export const useResumenAdmin = () => {
  const fechaActual = new Date();
  const [anio, setAnio] = useState(fechaActual.getFullYear());
  const [mes, setMes] = useState(fechaActual.getMonth() + 1);

  const [facturacion, setFacturacion] = useState([]);
  const [eventos, setEventos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [eventoSeleccionado, setEventoSeleccionado] = useState(null);

  // States para los filtros paralelos
  const [listadoFarmacias, setListadoFarmacias] = useState([]);
  const [listadoNutricionistas, setListadoNutricionistas] = useState([]);
  const [filtroFarmacia, setFiltroFarmacia] = useState("");
  const [filtroNutri, setFiltroNutri] = useState("");

  const cargarDatos = useCallback(async () => {
    setCargando(true);
    try {
      const [datosGrafica, datosCalendario] = await Promise.all([
        dashboardService.obtenerFacturacionAdmin(anio, anio, filtroFarmacia, filtroNutri).catch(() => []),
        dashboardService.obtenerCalendarioAdmin(anio, mes).catch(() => []),
      ]);
      setFacturacion(datosGrafica.totalesRango || []);
      setEventos(datosCalendario);
    } catch (error) {
      console.error("Error al cargar dashboard admin:", error);
    } finally {
      setCargando(false);
    }
  }, [anio, mes, filtroFarmacia, filtroNutri]);

  // Cargar Catalogos de Filtros (solo una vez)
  useEffect(() => {
    const cargarListas = async () => {
      try {
        const [farmacias, nutris] = await Promise.all([
          farmaciaService.listarTodas().catch(() => []),
          nutricionistasService.listarTodas().catch(() => [])
        ]);
        setListadoFarmacias(farmacias);
        setListadoNutricionistas(nutris);
      } catch (e) {
        console.error("Error cargando filtros:", e);
      }
    };
    cargarListas();
  }, []);

  useEffect(() => {
    cargarDatos();
  }, [cargarDatos]);

  // 👇 LÓGICA DE FILTROS EN CASCADA 👇

  // 1. Si hay Nutri seleccionada, mostramos solo sus Farmacias. Si no, todas.
  const farmaciasDisponibles = useMemo(() => {
    if (!filtroNutri) return listadoFarmacias;

    const nutriSeleccionada = listadoNutricionistas.find(n => n.id.toString() === filtroNutri.toString());
    if (!nutriSeleccionada || !nutriSeleccionada.asignaciones) return listadoFarmacias;

    const idsFarmaciasAsignadas = nutriSeleccionada.asignaciones.map(a => a.farmaciaId.toString());
    return listadoFarmacias.filter(f => idsFarmaciasAsignadas.includes(f.id.toString()));
  }, [filtroNutri, listadoFarmacias, listadoNutricionistas]);

  // 2. Si hay Farmacia seleccionada, mostramos solo las Nutris que la tienen asignada. Si no, todas.
  const nutrisDisponibles = useMemo(() => {
    if (!filtroFarmacia) return listadoNutricionistas;

    return listadoNutricionistas.filter(n =>
      n.asignaciones && n.asignaciones.some(a => a.farmaciaId.toString() === filtroFarmacia.toString())
    );
  }, [filtroFarmacia, listadoNutricionistas]);

  // 👆 FIN DE LÓGICA EN CASCADA 👆

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
    // Exportamos las listas filtradas en lugar de las globales crudas
    listadoFarmacias: farmaciasDisponibles,
    listadoNutricionistas: nutrisDisponibles,
    filtroFarmacia,
    setFiltroFarmacia,
    filtroNutri,
    setFiltroNutri
  };
};