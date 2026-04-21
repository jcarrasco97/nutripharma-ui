import { useState, useEffect, useCallback } from "react";

// Subimos dos niveles (../../) para salir de admin/hooks/ y llegar a features/
import { consultasService } from "../../consultas/services/consultasService";
import { pedidosService } from "../../../sales/pedidos/services/pedidosService";
import { suministrosService } from "../../../sales/suministros/services/suministrosService";

// Para el nutricionistasService solo subimos un nivel porque ya está dentro de admin/
import { nutricionistasService } from "../../../organization/nutricionistas/services/nutricionistasService";

export const useValidaciones = () => {
  // 1. ESTADOS DE NAVEGACIÓN Y DATOS
  const [pestañaActual, setPestañaActual] = useState("consultas");
  const [pendientes, setPendientes] = useState([]);
  const [historial, setHistorial] = useState([]);
  const [cargando, setCargando] = useState(false);
  const [listaNutrisGlobal, setListaNutrisGlobal] = useState([]);
  // --- ESTADOS PARA LIQUIDACIÓN (CIERRE DE CAJA) ---
  const [subPestañaConsultas, setSubPestañaConsultas] = useState("validar");
  const [pendientesLiquidar, setPendientesLiquidar] = useState([]);
  const [seleccionadasLiquidacion, setSeleccionadasLiquidacion] = useState([]);
  const [filtroNutriLiquidacion, setFiltroNutriLiquidacion] = useState("");
  const [filtroMesLiquidacion, setFiltroMesLiquidacion] = useState("ALL");
  const [ordenLiquidacion, setOrdenLiquidacion] = useState("FECHA_DESC");
  // 2. ESTADOS DE MODALES Y EDICIÓN
  const [detalleSeleccionado, setDetalleSeleccionado] = useState(null);
  const [mostrarModalReparto, setMostrarModalReparto] = useState(false);
  const [repartosActuales, setRepartosActuales] = useState([]);
  const [pedidoEnProceso, setPedidoEnProceso] = useState(null);
  const [enviando, setEnviando] = useState(false);
  // --- ESTADOS PARA LA EVIDENCIA (FOTO) ---
  const [urlEvidenciaModal, setUrlEvidenciaModal] = useState(null);

  const [formEdicion, setFormEdicion] = useState({
    nuevas: 0,
    revisiones: 0,
    promociones: 0,
    personalFarmacia: 0,
  });

  // =========================================================================
  // CARGA DE DATOS
  // =========================================================================
  const cargarDatos = useCallback(async () => {
    setCargando(true);
    try {
      if (pestañaActual === "consultas") {
        const [todas, nutris] = await Promise.all([
          consultasService.obtenerTodas(),
          nutricionistasService.listarTodas().catch(() => [])
        ]);

        setListaNutrisGlobal(nutris);

        // El Mazo de Cartas (Solo Pendientes o con Incidencia)
        setPendientes(todas.filter(c => c.estado === "PENDIENTE_VALIDACION" || c.estado === "CON_INCIDENCIA"));

        // La Bandeja de Liquidación (Solo Validadas listas para cobrar)
        setPendientesLiquidar(todas.filter(c => c.estado === "VALIDADA"));

        // EL HISTORIAL ENTERPRISE (BIEN)
        // Mostramos absolutamente todas las consultas para tener el control total.
        // (Opcional: puedes mantener el filtro de BORRADOR si no quieres que el admin vea lo que la nutri aún no ha terminado de escribir).
        setHistorial(todas.filter(c => c.estado !== "BORRADOR"));
      } else if (pestañaActual === "pedidos") {
        const [todos, nutris] = await Promise.all([
          pedidosService.obtenerTodos(),
          nutricionistasService.listarTodas(),
        ]);
        setPendientes(todos.filter((p) => p.estado === "PENDIENTE_ENVIO"));
        setHistorial(todos.filter((p) => p.estado !== "PENDIENTE_ENVIO"));
        setListaNutrisGlobal(nutris);
      } else if (pestañaActual === "suministros") {
        const todos = await suministrosService.listarPeticionesAdmin();
        setPendientes(todos.filter((s) => s.estado === "SOLICITADO"));
        setHistorial(todos.filter((s) => s.estado !== "SOLICITADO"));
      }
    } catch (error) {
      console.error(`Error al cargar ${pestañaActual}:`, error);
    } finally {
      setCargando(false);
    }
  }, [pestañaActual]);

  useEffect(() => {
    cargarDatos();
  }, [cargarDatos]);

  // =========================================================================
  // LÓGICA DE CONSULTAS (Validar, Editar, Cancelar)
  // =========================================================================
  const abrirDetalleConsulta = (consulta) => {
    setDetalleSeleccionado(consulta);
    setFormEdicion({
      nuevas: consulta.nuevas || 0,
      revisiones: consulta.revisiones || 0,
      promociones: consulta.promociones || 0,
      personalFarmacia: consulta.personalFarmacia || 0,
    });
  };

  const handleEditarYValidar = async () => {
    if (
      !window.confirm(
        "¿Guardar cambios y validar esta consulta? El sistema recalculará automáticamente las comisiones de la farmacia.",
      )
    )
      return;
    setEnviando(true);
    try {
      await consultasService.editarYValidarTurnoAdmin(detalleSeleccionado.id, formEdicion);
      avanzarDespuesDeAccion();
      cargarDatos();
      alert(
        "Consulta actualizada y validada con éxito. Matemáticas recalculadas.",
      );
    } catch (error) {
      console.error(error);
      alert(
        error.response?.data?.message ||
        "Error al editar y validar la consulta.",
      );
    } finally {
      setEnviando(false);
    }
  };

  const handleCancelarConsulta = async () => {
    if (
      !window.confirm(
        "🚨 ¡ATENCIÓN! ¿Seguro que deseas ANULAR esta consulta permanentemente? Si ya generó dinero, se descontará del saldo de la farmacia.",
      )
    )
      return;
    setEnviando(true);
    try {
      await consultasService.cancelarTurnoAdmin(detalleSeleccionado.id);
      avanzarDespuesDeAccion();
      cargarDatos();
      alert("Consulta anulada correctamente. Saldos revertidos si procedía.");
    } catch (error) {
      console.error(error);
      alert(error.response?.data?.message || "Error al anular la consulta.");
    } finally {
      setEnviando(false);
    }
  };

  // =========================================================================
  // LÓGICA DE PEDIDOS (Comisiones Multicapa)
  // =========================================================================

  const handleCancelarPedido = async (id) => {
    if (
      !window.confirm(
        "🚨 ¡ATENCIÓN! ¿Seguro que deseas CANCELAR este pedido? Se revertirá el saldo virtual a la farmacia si se utilizó.",
      )
    )
      return;

    setEnviando(true);
    try {
      await pedidosService.cancelarPedidoAdmin(id);
      avanzarDespuesDeAccion();
      cargarDatos();
      alert("Pedido anulado correctamente.");
    } catch (error) {
      console.error(error);
      alert("Error al anular el pedido.");
    } finally {
      setEnviando(false);
    }
  };

  const iniciarProcesoEnvio = (pedido) => {
    setPedidoEnProceso(pedido);
    const nutrisDeEstaFarmacia = listaNutrisGlobal.filter((n) =>
      n.asignaciones?.some((a) => a.farmaciaNombre === pedido.farmaciaNombre),
    );

    if (nutrisDeEstaFarmacia.length > 1) {
      const porcBase = Math.floor(100 / nutrisDeEstaFarmacia.length);
      let resto = 100 - porcBase * nutrisDeEstaFarmacia.length;
      const repartoEquitativo = nutrisDeEstaFarmacia.map((n, index) => ({
        nutricionistaId: n.id,
        nombre: n.nombre + " " + n.apellidos,
        porcentaje: index === 0 ? porcBase + resto : porcBase,
      }));
      setRepartosActuales(repartoEquitativo);
      setMostrarModalReparto(true);
      return;
    }

    if (!window.confirm("¿Marcar este pedido como Enviado por mensajería?"))
      return;

    const repartoDirecto =
      nutrisDeEstaFarmacia.length === 1
        ? [{ nutricionistaId: nutrisDeEstaFarmacia[0].id, porcentaje: 100 }]
        : [];

    ejecutarEnvioBackend(pedido.id, repartoDirecto);
  };

  const handleCambioSlider = (nutriId, nuevoPorcentaje) => {
    let valor = Math.round(Number(nuevoPorcentaje));
    setRepartosActuales((prev) => {
      const otros = prev.filter((r) => r.nutricionistaId !== nutriId);
      if (otros.length === 1) {
        return prev.map((r) =>
          r.nutricionistaId === nutriId
            ? { ...r, porcentaje: valor }
            : { ...r, porcentaje: 100 - valor },
        );
      }
      return prev.map((r) =>
        r.nutricionistaId === nutriId ? { ...r, porcentaje: valor } : r,
      );
    });
  };

  const setRepartoEquitativo = () => {
    const porcBase = Math.floor(100 / repartosActuales.length);
    let resto = 100 - porcBase * repartosActuales.length;
    setRepartosActuales((prev) =>
      prev.map((n, index) => ({
        ...n,
        porcentaje: index === 0 ? porcBase + resto : porcBase,
      })),
    );
  };

  const ejecutarEnvioBackend = async (pedidoId, listaRepartosFinal) => {
    setEnviando(true);
    try {
      await pedidosService.marcarComoEnviadoAdmin(pedidoId, listaRepartosFinal);
      setMostrarModalReparto(false);
      setPedidoEnProceso(null);
      avanzarDespuesDeAccion();
      cargarDatos();
    } catch (error) {
      console.error(error);
      alert("Error al enviar el pedido y asignar comisión");
    } finally {
      setEnviando(false);
    }
  };

  // =========================================================================
  // LÓGICA DE SUMINISTROS
  // =========================================================================
  const handleEstadoSuministro = async (id, estado) => {
    if (!window.confirm(`¿Seguro que quieres ${estado} esta petición?`)) return;
    setEnviando(true);
    try {
      await suministrosService.cambiarEstadoPeticion(id, estado);
      avanzarDespuesDeAccion();
      cargarDatos();
    } catch (error) {
      console.error(error);
      alert("Error al actualizar suministro");
    } finally {
      setEnviando(false);
    }
  };

  // =========================================================================
  // UTILIDADES
  // =========================================================================
  const calcularTotalesPedido = (lineas = []) => {
    let totalReal = 0,
      totalVirtual = 0;
    lineas.forEach((l) => {
      if (l.pagadoConSaldo) totalVirtual += l.subtotal;
      else totalReal += l.subtotal;
    });
    return { totalReal, totalVirtual };
  };

  const agruparLineasPorProducto = (lineas = []) => {
    const agrupado = {};
    lineas.forEach((l) => {
      if (!agrupado[l.nombreProducto])
        agrupado[l.nombreProducto] = { real: 0, virtual: 0, bonificados: 0 };
      if (l.pagadoConSaldo) agrupado[l.nombreProducto].virtual += l.cantidad;
      else {
        agrupado[l.nombreProducto].real += l.cantidad;
        agrupado[l.nombreProducto].bonificados += l.bonificados || 0;
      }
    });
    return Object.entries(agrupado);
  };

  const sumaReparto = repartosActuales.reduce(
    (sum, r) => sum + r.porcentaje,
    0,
  );

  const handleVerFoto = async (id) => {
    try {
      setCargando(true);
      const url = await consultasService.verEvidencia(id);
      setUrlEvidenciaModal(url);
    } catch (error) {
      console.error("Error visualizando evidencia:", error);
      alert("Error al descargar la foto.");
    } finally {
      setCargando(false);
    }
  };

  const cerrarModalEvidencia = () => {
    if (urlEvidenciaModal) URL.revokeObjectURL(urlEvidenciaModal);
    setUrlEvidenciaModal(null);
  };

  const handleBorrarEvidenciaAdmin = async (id) => {
    if (
      !window.confirm(
        "¿Seguro que deseas ELIMINAR esta evidencia? Se destruirá de Google Drive y el nutricionista tendrá que subir una nueva.",
      )
    )
      return;

    setEnviando(true);
    try {
      const consultaActualizada =
        await consultasService.eliminarEvidenciaAdmin(id);
      setDetalleSeleccionado(consultaActualizada);
      cargarDatos();
      alert(
        "Evidencia eliminada correctamente. El candado del nutricionista se ha abierto.",
      );
    } catch (error) {
      console.error("Error borrando evidencia:", error);
      alert("Error al intentar borrar la evidencia.");
    } finally {
      setEnviando(false);
    }
  };
  // =========================================================================
  // 🧭 NAVEGACIÓN MODO ENFOQUE (EL MAZO DE CARTAS)
  // =========================================================================
  const indexActual = pendientes.findIndex(p => p.id === detalleSeleccionado?.id);
  const hayAnterior = indexActual > 0;
  const haySiguiente = indexActual >= 0 && indexActual < pendientes.length - 1;
  const totalPendientes = pendientes.length;

  const abrirDetalleIndex = (consulta) => {
    setDetalleSeleccionado(consulta);
    if (pestañaActual === "consultas" && consulta) {
      setFormEdicion({
        nuevas: consulta.nuevas || 0,
        revisiones: consulta.revisiones || 0,
        promociones: consulta.promociones || 0,
        personalFarmacia: consulta.personalFarmacia || 0,
      });
    }
  };

  const irAnterior = () => {
    if (hayAnterior) abrirDetalleIndex(pendientes[indexActual - 1]);
  };

  const irSiguiente = () => {
    if (haySiguiente) abrirDetalleIndex(pendientes[indexActual + 1]);
  };

  const avanzarDespuesDeAccion = () => {
    if (haySiguiente) {
      abrirDetalleIndex(pendientes[indexActual + 1]);
    } else if (hayAnterior) {
      abrirDetalleIndex(pendientes[indexActual - 1]);
    } else {
      setDetalleSeleccionado(null);
    }
  };

  // =========================================================================
  // 💰 LÓGICA DE LIQUIDACIÓN (CIERRE DE CAJA)
  // =========================================================================
  const toggleSeleccionLiquidacion = (id) => {
    setSeleccionadasLiquidacion(prev =>
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const seleccionarTodasLiquidacion = (idsVisibles) => {
    // Si ya están todas seleccionadas, las deselecciona. Si no, selecciona todas las visibles.
    const todasSeleccionadas = idsVisibles.every(id => seleccionadasLiquidacion.includes(id));
    if (todasSeleccionadas) {
      setSeleccionadasLiquidacion(prev => prev.filter(id => !idsVisibles.includes(id)));
    } else {
      setSeleccionadasLiquidacion(prev => [...new Set([...prev, ...idsVisibles])]);
    }
  };

  const handleLiquidarLote = async () => {
    if (seleccionadasLiquidacion.length === 0) return;
    if (!window.confirm(`¿Confirmas que has revisado y pagado estas ${seleccionadasLiquidacion.length} consultas? Pasarán al estado LIQUIDADA y desaparecerán de esta bandeja.`)) return;

    setEnviando(true);
    try {
      await consultasService.liquidarLote(seleccionadasLiquidacion);
      setSeleccionadasLiquidacion([]); // Limpiamos la cesta
      cargarDatos();
      alert("¡Liquidación completada con éxito!");
    } catch (error) {
      console.error(error);
      alert("Error al liquidar las consultas.");
    } finally {
      setEnviando(false);
    }
  };


  // Exponemos TODO lo que la UI necesita para pintarse
  return {
    pestañaActual,
    setPestañaActual,
    pendientes,
    historial, // <--- Dato en bruto inyectado correctamente
    cargando,
    enviando,
    detalleSeleccionado,
    setDetalleSeleccionado,
    mostrarModalReparto,
    setMostrarModalReparto,
    repartosActuales,
    sumaReparto,
    formEdicion,
    setFormEdicion,
    pedidoEnProceso,
    setPedidoEnProceso,

    // Acciones
    abrirDetalleConsulta,
    handleEditarYValidar,
    handleCancelarConsulta,
    handleCancelarPedido,
    iniciarProcesoEnvio,
    handleCambioSlider,
    setRepartoEquitativo,
    ejecutarEnvioBackend,
    handleEstadoSuministro,
    urlEvidenciaModal,
    handleVerFoto,
    handleBorrarEvidenciaAdmin,
    cerrarModalEvidencia,

    // Utilidades
    calcularTotalesPedido,
    agruparLineasPorProducto,

    indexActual,
    totalPendientes,
    hayAnterior,
    haySiguiente,
    irAnterior,
    irSiguiente,
    // Liquidación
    subPestañaConsultas,
    setSubPestañaConsultas,
    pendientesLiquidar,
    seleccionadasLiquidacion,
    filtroNutriLiquidacion,
    setFiltroNutriLiquidacion,
    filtroMesLiquidacion,
    setFiltroMesLiquidacion,
    ordenLiquidacion,
    setOrdenLiquidacion,
    listaNutrisGlobal,
    toggleSeleccionLiquidacion,
    seleccionarTodasLiquidacion,
    handleLiquidarLote
  };
};
