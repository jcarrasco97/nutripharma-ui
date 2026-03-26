import { useState, useEffect, useCallback } from "react";
import { consultasService } from "../../consultas/services/consultasService";
import { pedidosService } from "../../pedidos/services/pedidosService";
import { nutricionistasService } from "../../administracion/services/nutricionistasService";

const METAS_BASE = {
  OB1: { facturacion: 5000, productos: 800, incentivo: 200, exceso: 0 },
  OB2: { facturacion: 6800, productos: 1000, incentivo: 400, exceso: 0.05 },
  OB3: { facturacion: 8700, productos: 1200, incentivo: 600, exceso: 0.1 },
};

export const useResumenNutri = () => {
  const [datosResumen, setDatosResumen] = useState(null);
  const [perfil, setPerfil] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [errorBackend, setErrorBackend] = useState(null);

  const cargarDatos = useCallback(async () => {
    setCargando(true);
    try {
      const [miPerfil, misConsultas, misPedidos] = await Promise.all([
        nutricionistasService.obtenerMiPerfil().catch(() => null),
        consultasService.obtenerMisConsultas().catch(() => []),
        pedidosService.obtenerMisPedidos().catch(() => []),
      ]);

      if (!miPerfil) {
        setPerfil(null);
        setCargando(false);
        return;
      }

      setPerfil(miPerfil);
      const mesActual = new Date().toISOString().substring(0, 7);

      const consultasMes = misConsultas.filter(
        (c) => c.fecha?.startsWith(mesActual) && c.estado === "VALIDADA",
      );
      const pedidosMes = misPedidos.filter(
        (p) =>
          p.fechaPedido?.startsWith(mesActual) &&
          (p.estado === "ENVIADO" || p.estado === "LIQUIDADO"),
      );

      const totalNuevas = consultasMes.reduce(
        (sum, c) => sum + (c.nuevas || 0),
        0,
      );
      const totalRevisiones = consultasMes.reduce(
        (sum, c) => sum + (c.revisiones || 0),
        0,
      );
      const facturacionConsultas = totalNuevas * 25 + totalRevisiones * 20;

      const facturacionProductos = pedidosMes.reduce((sum, pedido) => {
        const miReparto = pedido.repartos?.find(
          (r) => r.nutricionistaId === miPerfil.id,
        );
        const porcentaje = miReparto ? miReparto.porcentaje : 100;
        return sum + ((pedido.totalPedido || 0) * porcentaje) / 100;
      }, 0);

      const facturacionTotal = facturacionConsultas + facturacionProductos;

      const totalKilometros = consultasMes.reduce((sum, consulta) => {
        const asignacion = miPerfil.asignaciones?.find(
          (a) =>
            Number(a.farmaciaId) === Number(consulta.farmaciaId) ||
            a.farmaciaNombre === consulta.farmaciaNombre,
        );
        return sum + (asignacion ? asignacion.kilometros || 0 : 0);
      }, 0);

      setDatosResumen({
        mes: mesActual,
        totalNuevas,
        totalRevisiones,
        facturacionConsultas,
        facturacionProductos,
        facturacionTotal,
        totalKilometros,
      });
    } catch (error) {
      console.error("Error al cargar resumen:", error);
      setErrorBackend(
        "No se pudieron cargar tus datos. Verifica tus permisos.",
      );
    } finally {
      setCargando(false);
    }
  }, []);

  useEffect(() => {
    cargarDatos();
  }, [cargarDatos]);

  // --- CÁLCULOS DERIVADOS ---
  const horasContrato = perfil?.horasContratoMensual || 40;
  const factorJornada = horasContrato / 40;

  const METAS = {
    OB1: {
      facturacion: METAS_BASE.OB1.facturacion * factorJornada,
      productos: METAS_BASE.OB1.productos * factorJornada,
      incentivo: METAS_BASE.OB1.incentivo * factorJornada,
      exceso: METAS_BASE.OB1.exceso,
    },
    OB2: {
      facturacion: METAS_BASE.OB2.facturacion * factorJornada,
      productos: METAS_BASE.OB2.productos * factorJornada,
      incentivo: METAS_BASE.OB2.incentivo * factorJornada,
      exceso: METAS_BASE.OB2.exceso,
    },
    OB3: {
      facturacion: METAS_BASE.OB3.facturacion * factorJornada,
      productos: METAS_BASE.OB3.productos * factorJornada,
      incentivo: METAS_BASE.OB3.incentivo * factorJornada,
      exceso: METAS_BASE.OB3.exceso,
    },
  };

  const calcularProgresos = () => {
    if (!datosResumen) return null;
    const { facturacionTotal, facturacionProductos } = datosResumen;

    let nivelAlcanzado = "Ninguno",
      incentivoBase = 0,
      porcentajeExceso = 0,
      umbralExceso = 0,
      proximoObjetivo = METAS.OB1,
      nombreProximoObj = "OB1";

    if (
      facturacionTotal >= METAS.OB3.facturacion &&
      facturacionProductos >= METAS.OB3.productos
    ) {
      nivelAlcanzado = "OB3";
      incentivoBase = METAS.OB3.incentivo;
      porcentajeExceso = METAS.OB3.exceso;
      umbralExceso = METAS.OB3.facturacion;
      proximoObjetivo = null;
    } else if (
      facturacionTotal >= METAS.OB2.facturacion &&
      facturacionProductos >= METAS.OB2.productos
    ) {
      nivelAlcanzado = "OB2";
      incentivoBase = METAS.OB2.incentivo;
      porcentajeExceso = METAS.OB2.exceso;
      umbralExceso = METAS.OB2.facturacion;
      proximoObjetivo = METAS.OB3;
      nombreProximoObj = "OB3";
    } else if (
      facturacionTotal >= METAS.OB1.facturacion &&
      facturacionProductos >= METAS.OB1.productos
    ) {
      nivelAlcanzado = "OB1";
      incentivoBase = METAS.OB1.incentivo;
      proximoObjetivo = METAS.OB2;
      nombreProximoObj = "OB2";
    }

    const dineroExceso =
      umbralExceso > 0 && facturacionTotal > umbralExceso
        ? facturacionTotal - umbralExceso
        : 0;
    const comisionFinal = incentivoBase + dineroExceso * porcentajeExceso;
    const metaProgreso = proximoObjetivo
      ? proximoObjetivo.facturacion
      : METAS.OB3.facturacion;
    const porcentajeLogrado = Math.min(
      (facturacionTotal / metaProgreso) * 100,
      100,
    );

    return {
      nivelAlcanzado,
      comisionFinal,
      proximoObjetivo,
      nombreProximoObj,
      porcentajeLogrado,
    };
  };

  const progresos = calcularProgresos();

  return {
    perfil,
    datosResumen,
    cargando,
    errorBackend,
    horasContrato,
    METAS,
    ...progresos,
  };
};
