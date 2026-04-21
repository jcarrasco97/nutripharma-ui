import { useState, useEffect, useCallback } from "react";
import { farmaciaService } from "../../../organization/farmacias/services/farmaciaService";
import { pedidosService } from "../../../sales/pedidos/services/pedidosService";

export const useResumenFarmacia = () => {
  const [perfil, setPerfil] = useState(null);
  const [pedidos, setPedidos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(false);

  const [mesFiltro, setMesFiltro] = useState("Todos");
  const [ordenFiltro, setOrdenFiltro] = useState("recientes");

  const cargarDatos = useCallback(async () => {
    setCargando(true);
    setError(false);
    try {
      const [miPerfil, misPedidos] = await Promise.all([
        farmaciaService.obtenerMiPerfil().catch(() => null),
        pedidosService.obtenerMisPedidos().catch(() => []),
      ]);

      if (!miPerfil) {
        setPerfil(null);
        setCargando(false);
        return;
      }

      setPerfil(miPerfil);
      setPedidos(misPedidos);
    } catch (err) {
      console.error("Error al cargar farmacia:", err);
      setError(true);
    } finally {
      setCargando(false);
    }
  }, []);

  useEffect(() => {
    cargarDatos();
  }, [cargarDatos]);

  const mesesDisponibles = [
    "Todos",
    ...new Set(pedidos.map((p) => p.fechaPedido?.substring(0, 7))),
  ].sort((a, b) => b.localeCompare(a));

  const pedidosFiltradosYOrdenados = pedidos
    .filter(
      (p) => mesFiltro === "Todos" || p.fechaPedido?.startsWith(mesFiltro),
    )
    .sort((a, b) => {
      if (ordenFiltro === "recientes")
        return new Date(b.fechaPedido) - new Date(a.fechaPedido);
      if (ordenFiltro === "antiguos")
        return new Date(a.fechaPedido) - new Date(b.fechaPedido);
      if (ordenFiltro === "precio_desc")
        return (b.totalPedido || 0) - (a.totalPedido || 0);
      if (ordenFiltro === "precio_asc")
        return (a.totalPedido || 0) - (b.totalPedido || 0);
      return 0;
    });

  return {
    perfil,
    cargando,
    error,
    cargarDatos,
    mesFiltro,
    setMesFiltro,
    ordenFiltro,
    setOrdenFiltro,
    mesesDisponibles,
    pedidosFiltradosYOrdenados,
  };
};
