import React, { useState, useEffect } from "react";
import {
  CheckCircle,
  Clock,
  Package,
  Stethoscope,
  Loader2,
  ShieldCheck,
  XCircle,
  FileBox,
  Search,
  Eye,
  Wallet,
  Banknote,
  PieChart,
  Scale,
} from "lucide-react";
import { consultasService } from "../consultas/consultasService";
import { pedidosService } from "../pedidos/pedidosService";
import { suministrosService } from "../suministros/suministrosService";
import { nutricionistasService } from "../admin/nutricionistasService";

const VistaValidaciones = () => {
  const [pestañaActual, setPestañaActual] = useState("consultas");

  const [pendientes, setPendientes] = useState([]);
  const [historial, setHistorial] = useState([]);
  const [cargando, setCargando] = useState(false);
  const [busqueda, setBusqueda] = useState("");

  const [detalleSeleccionado, setDetalleSeleccionado] = useState(null);
  const [listaNutrisGlobal, setListaNutrisGlobal] = useState([]); // <-- Para cruzar datos de comisiones

  // --- ESTADO DEL MODAL MULTICAPA ---
  const [mostrarModalReparto, setMostrarModalReparto] = useState(false);
  const [repartosActuales, setRepartosActuales] = useState([]);
  const [pedidoEnProceso, setPedidoEnProceso] = useState(null);
  const [enviando, setEnviando] = useState(false);

  const cargarDatos = async () => {
    setCargando(true);
    try {
      if (pestañaActual === "consultas") {
        const todas = await consultasService.obtenerTodas();
        setPendientes(todas.filter((c) => c.estado === "PENDIENTE_VALIDACION"));
        setHistorial(
          todas.filter(
            (c) =>
              c.estado !== "PENDIENTE_VALIDACION" && c.estado !== "BORRADOR",
          ),
        );
      } else if (pestañaActual === "pedidos") {
        const [todos, nutris] = await Promise.all([
          pedidosService.obtenerTodos(),
          nutricionistasService.listarTodas(), // El admin tiene permiso total
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
  };

  useEffect(() => {
    setBusqueda("");
    cargarDatos();
  }, [pestañaActual]);

  const handleValidarConsulta = async (id) => {
    if (!window.confirm("¿Validar consulta y generar comisión a la farmacia?"))
      return;
    try {
      await consultasService.validarTurnoAdmin(id);
      cargarDatos();
    } catch (error) {
      console.error(error);
      alert("Error al validar");
    }
  };

  // =========================================================================
  // LÓGICA DE INTERCEPCIÓN DEL PEDIDO (MULTICAPA PARA ADMIN)
  // =========================================================================
  const iniciarProcesoEnvio = (pedido) => {
    setPedidoEnProceso(pedido);

    // Buscamos cuántas chicas trabajan en la farmacia de este pedido
    const nutrisDeEstaFarmacia = listaNutrisGlobal.filter((n) =>
      n.asignaciones?.some((a) => a.farmaciaNombre === pedido.farmaciaNombre),
    );

    // Si hay 2 o más, interceptamos y abrimos el Modal.
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

    // Si hay 1 o ninguna, se envía directamente con confirmación normal
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
      } else {
        return prev.map((r) =>
          r.nutricionistaId === nutriId ? { ...r, porcentaje: valor } : r,
        );
      }
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
      cargarDatos();
    } catch (error) {
      console.error(error);
      alert("Error al enviar el pedido y asignar comisión");
    } finally {
      setEnviando(false);
    }
  };
  // =========================================================================

  const handleEstadoSuministro = async (id, estado) => {
    if (!window.confirm(`¿Seguro que quieres ${estado} esta petición?`)) return;
    try {
      await suministrosService.cambiarEstadoPeticion(id, estado);
      cargarDatos();
    } catch (error) {
      console.error(error);
      alert("Error al actualizar suministro");
    }
  };

  const calcularTotalesPedido = (lineas = []) => {
    let totalReal = 0;
    let totalVirtual = 0;
    lineas.forEach((l) => {
      if (l.pagadoConSaldo) totalVirtual += l.subtotal;
      else totalReal += l.subtotal;
    });
    return { totalReal, totalVirtual };
  };

  const agruparLineasPorProducto = (lineas = []) => {
    const agrupado = {};
    lineas.forEach((l) => {
      if (!agrupado[l.nombreProducto]) {
        agrupado[l.nombreProducto] = { real: 0, virtual: 0, bonificados: 0 };
      }
      if (l.pagadoConSaldo) {
        agrupado[l.nombreProducto].virtual += l.cantidad;
      } else {
        agrupado[l.nombreProducto].real += l.cantidad;
        agrupado[l.nombreProducto].bonificados += l.bonificados || 0;
      }
    });
    return Object.entries(agrupado);
  };

  const historialFiltrado = historial.filter((item) => {
    const termino = busqueda.toLowerCase();
    if (pestañaActual === "consultas")
      return (
        item.nutricionistaNombre?.toLowerCase().includes(termino) ||
        item.farmaciaNombre?.toLowerCase().includes(termino) ||
        item.fecha?.includes(termino)
      );
    if (pestañaActual === "pedidos")
      return (
        item.farmaciaNombre?.toLowerCase().includes(termino) ||
        item.fechaPedido?.includes(termino) ||
        item.id?.toString().includes(termino)
      );
    if (pestañaActual === "suministros")
      return item.nutricionistaNombre?.toLowerCase().includes(termino);
    return true;
  });

  const sumaReparto = repartosActuales.reduce(
    (sum, r) => sum + r.porcentaje,
    0,
  );
  const coloresGrafico = [
    "bg-sky-500",
    "bg-indigo-500",
    "bg-emerald-500",
    "bg-amber-500",
    "bg-purple-500",
  ];

  return (
    <div className="space-y-8 animate-fade-in pb-10 relative">
      {/* MODAL REPARTO MULTICAPA (ADMIN) */}
      {mostrarModalReparto && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-gray-900/80 backdrop-blur-sm">
          <div className="bg-white rounded-[2.5rem] shadow-2xl max-w-lg w-full overflow-hidden animate-scale-in">
            <div className="bg-gray-900 p-8 text-white text-center relative">
              <div className="bg-sky-500 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg shadow-sky-500/30">
                <PieChart size={32} />
              </div>
              <h3 className="text-2xl font-black">Asignar Comisión</h3>
              <p className="text-gray-400 mt-2 text-sm">
                Esta farmacia tiene {repartosActuales.length} nutricionistas.
                Reparte la comisión del pedido antes de enviarlo.
              </p>
            </div>

            <div className="p-8 space-y-8">
              <div className="w-full h-6 bg-gray-100 rounded-full flex overflow-hidden shadow-inner">
                {repartosActuales.map((r, i) => (
                  <div
                    key={r.nutricionistaId}
                    style={{ width: `${r.porcentaje}%` }}
                    className={`h-full transition-all duration-300 ${coloresGrafico[i % coloresGrafico.length]}`}
                  ></div>
                ))}
              </div>

              <div className="space-y-6">
                {repartosActuales.map((r, i) => (
                  <div
                    key={r.nutricionistaId}
                    className="bg-gray-50 p-4 rounded-2xl border border-gray-100"
                  >
                    <div className="flex justify-between items-center mb-3">
                      <div className="flex items-center gap-2">
                        <div
                          className={`w-3 h-3 rounded-full ${coloresGrafico[i % coloresGrafico.length]}`}
                        ></div>
                        <span className="font-bold text-gray-800">
                          {r.nombre}
                        </span>
                      </div>
                      <span className="font-black text-xl text-gray-900">
                        {r.porcentaje}%
                      </span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={r.porcentaje}
                      onChange={(e) =>
                        handleCambioSlider(r.nutricionistaId, e.target.value)
                      }
                      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-sky-500"
                    />
                  </div>
                ))}
              </div>

              <div className="flex justify-between items-center">
                <button
                  onClick={setRepartoEquitativo}
                  className="text-sky-600 font-bold text-sm flex items-center gap-2 hover:text-sky-800 transition-colors"
                >
                  <Scale size={16} /> Repartir a partes iguales
                </button>
                <div
                  className={`text-sm font-black px-3 py-1 rounded-lg ${sumaReparto === 100 ? "bg-emerald-100 text-emerald-700" : "bg-red-100 text-red-700 animate-pulse"}`}
                >
                  Total: {sumaReparto}%
                </div>
              </div>
            </div>

            <div className="p-6 bg-gray-50 flex gap-4">
              <button
                onClick={() => {
                  setMostrarModalReparto(false);
                  setPedidoEnProceso(null);
                }}
                className="flex-1 py-4 bg-white border-2 border-gray-200 text-gray-600 font-black rounded-2xl hover:bg-gray-100 transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={() =>
                  ejecutarEnvioBackend(pedidoEnProceso.id, repartosActuales)
                }
                disabled={sumaReparto !== 100 || enviando}
                className="flex-1 py-4 bg-sky-600 text-white font-black rounded-2xl shadow-lg hover:bg-sky-700 transition-all disabled:bg-gray-300 disabled:shadow-none flex justify-center items-center gap-2"
              >
                {enviando ? (
                  <Loader2 className="animate-spin" size={20} />
                ) : (
                  <>
                    <Package size={18} /> Enviar Pedido
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {detalleSeleccionado && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-sm">
          <div className="bg-white rounded-3xl shadow-2xl max-w-lg w-full overflow-hidden animate-scale-in">
            <div className="p-6 bg-gray-900 text-white flex justify-between items-center">
              <h3 className="text-xl font-bold flex items-center gap-2">
                <Eye size={20} /> Informe Detallado
              </h3>
              <button
                onClick={() => setDetalleSeleccionado(null)}
                className="text-gray-400 hover:text-white"
              >
                <XCircle size={24} />
              </button>
            </div>

            <div className="p-6 max-h-[70vh] overflow-y-auto custom-scrollbar">
              {pestañaActual === "consultas" && (
                <div className="space-y-4">
                  <div className="bg-indigo-50 p-4 rounded-2xl border border-indigo-100">
                    <p className="text-xs font-bold text-indigo-400 uppercase tracking-widest mb-1">
                      Jornada
                    </p>
                    <p className="font-black text-gray-800 text-lg">
                      {detalleSeleccionado.fecha} (
                      {detalleSeleccionado.tipoTurno})
                    </p>
                    <p className="text-sm font-medium text-gray-600 mt-1">
                      {detalleSeleccionado.horaInicio?.substring(0, 5)} -{" "}
                      {detalleSeleccionado.horaFin?.substring(0, 5)}
                    </p>
                  </div>
                  <p className="font-bold text-gray-700">
                    Nutricionista:{" "}
                    <span className="font-medium text-gray-500">
                      {detalleSeleccionado.nutricionistaNombre}
                    </span>
                  </p>
                  <p className="font-bold text-gray-700">
                    Farmacia:{" "}
                    <span className="font-medium text-gray-500">
                      {detalleSeleccionado.farmaciaNombre}
                    </span>
                  </p>

                  <div className="grid grid-cols-2 gap-2 mt-4">
                    <div className="bg-gray-50 p-3 rounded-xl">
                      <p className="text-xs text-gray-400 uppercase font-bold">
                        Nuevas
                      </p>
                      <p className="font-black text-xl">
                        {detalleSeleccionado.nuevas}
                      </p>
                    </div>
                    <div className="bg-gray-50 p-3 rounded-xl">
                      <p className="text-xs text-gray-400 uppercase font-bold">
                        Revisiones
                      </p>
                      <p className="font-black text-xl">
                        {detalleSeleccionado.revisiones}
                      </p>
                    </div>
                    <div className="bg-gray-50 p-3 rounded-xl">
                      <p className="text-xs text-gray-400 uppercase font-bold">
                        Promo
                      </p>
                      <p className="font-black text-xl">
                        {detalleSeleccionado.promociones}
                      </p>
                    </div>
                    <div className="bg-gray-50 p-3 rounded-xl">
                      <p className="text-xs text-gray-400 uppercase font-bold">
                        Personal
                      </p>
                      <p className="font-black text-xl">
                        {detalleSeleccionado.personalFarmacia}
                      </p>
                    </div>
                  </div>
                  {detalleSeleccionado.observacionesJornada && (
                    <div className="mt-4">
                      <p className="text-xs font-bold text-gray-400 uppercase mb-1">
                        Notas
                      </p>
                      <p className="text-sm bg-gray-50 p-3 rounded-lg border border-gray-100">
                        {detalleSeleccionado.observacionesJornada}
                      </p>
                    </div>
                  )}
                </div>
              )}

              {pestañaActual === "pedidos" && (
                <div className="space-y-4">
                  <div className="bg-sky-50 p-4 rounded-2xl border border-sky-100 flex justify-between items-center">
                    <div>
                      <p className="text-xs font-bold text-sky-500 uppercase tracking-widest mb-1">
                        Pedido #{detalleSeleccionado.id}
                      </p>
                      <p className="font-black text-gray-800 text-lg">
                        {detalleSeleccionado.farmaciaNombre}
                      </p>
                    </div>
                    <span className="bg-sky-600 text-white font-bold px-3 py-1 rounded-lg text-sm">
                      {detalleSeleccionado.estado}
                    </span>
                  </div>
                  <p className="font-bold text-gray-700">
                    Fecha:{" "}
                    <span className="font-medium text-gray-500">
                      {detalleSeleccionado.fechaPedido}
                    </span>
                  </p>

                  <div className="mt-4 border border-gray-100 rounded-xl overflow-hidden">
                    <p className="bg-gray-50 text-xs font-bold text-gray-500 uppercase p-3 border-b border-gray-100">
                      Desglose Resumido
                    </p>
                    <div className="p-4 space-y-4">
                      {agruparLineasPorProducto(detalleSeleccionado.lineas).map(
                        ([nombreProd, cants], idx) => {
                          const totalLinea =
                            cants.real + cants.bonificados + cants.virtual;
                          return (
                            <div
                              key={idx}
                              className="pb-4 border-b border-gray-50 last:border-0 last:pb-0"
                            >
                              <p className="font-black text-gray-800 mb-1">
                                {nombreProd}
                              </p>
                              <ul className="text-xs space-y-1 ml-2">
                                {cants.real > 0 && (
                                  <li className="text-gray-600">
                                    • {cants.real}x (Dinero Real)
                                  </li>
                                )}
                                {cants.bonificados > 0 && (
                                  <li className="text-emerald-600 font-bold">
                                    • {cants.bonificados}x (Bonificados /
                                    Gratis)
                                  </li>
                                )}
                                {cants.virtual > 0 && (
                                  <li className="text-purple-600 font-bold">
                                    • {cants.virtual}x (Saldo Virtual)
                                  </li>
                                )}
                              </ul>
                              <p className="text-xs font-black text-gray-400 mt-2">
                                TOTAL {nombreProd}: {totalLinea} uds.
                              </p>
                            </div>
                          );
                        },
                      )}
                    </div>
                  </div>

                  {/* NUEVO: Mostrar el reparto de comisiones si existe */}
                  {detalleSeleccionado.repartos &&
                    detalleSeleccionado.repartos.length > 0 && (
                      <div className="mt-4 border border-gray-100 rounded-xl overflow-hidden">
                        <p className="bg-gray-50 text-xs font-bold text-gray-500 uppercase p-3 border-b border-gray-100">
                          Comisión Asignada
                        </p>
                        <div className="p-4 space-y-2">
                          {detalleSeleccionado.repartos.map((r, i) => (
                            <div
                              key={i}
                              className="flex justify-between items-center text-sm font-bold text-gray-700"
                            >
                              <span>{r.nutricionistaNombre}</span>
                              <span className="text-sky-600 bg-sky-50 px-2 py-1 rounded-md">
                                {r.porcentaje}%
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                  <div className="bg-gray-900 rounded-2xl p-6 text-white mt-4 flex justify-between items-center">
                    <div>
                      <p className="text-xs text-gray-400 uppercase font-bold mb-1">
                        Dinero Físico Abonado
                      </p>
                      <p className="text-3xl font-black text-sky-400">
                        {(detalleSeleccionado.totalPedido || 0).toFixed(2)}€
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {pestañaActual === "suministros" && (
                <div className="space-y-4">
                  <div className="bg-emerald-50 p-4 rounded-2xl border border-emerald-100 flex justify-between items-center">
                    <div>
                      <p className="text-xs font-bold text-emerald-500 uppercase tracking-widest mb-1">
                        Petición Suministros
                      </p>
                      <p className="font-black text-gray-800 text-lg">
                        {detalleSeleccionado.nutricionistaNombre}
                      </p>
                    </div>
                    <span
                      className={`font-bold px-3 py-1 rounded-lg text-sm text-white ${detalleSeleccionado.estado === "APROBADO" ? "bg-emerald-600" : "bg-red-500"}`}
                    >
                      {detalleSeleccionado.estado}
                    </span>
                  </div>
                  <p className="font-bold text-gray-700">
                    Fecha:{" "}
                    <span className="font-medium text-gray-500">
                      {new Date(
                        detalleSeleccionado.fechaPeticion,
                      ).toLocaleDateString()}
                    </span>
                  </p>

                  <div className="mt-4 border border-gray-100 rounded-xl overflow-hidden">
                    <p className="bg-gray-50 text-xs font-bold text-gray-500 uppercase p-3 border-b border-gray-100">
                      Materiales Enviados
                    </p>
                    <ul className="p-4 space-y-2 text-sm font-bold text-gray-700">
                      {detalleSeleccionado.materiales?.map((m, i) => (
                        <li
                          key={i}
                          className="flex justify-between items-center border-b border-gray-50 pb-2 last:border-0 last:pb-0"
                        >
                          <span>{m.nombre}</span>
                          <span className="text-xs text-emerald-600 bg-emerald-50 px-2 py-1 rounded-md">
                            {m.cantidadEstandar} uds
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}
            </div>

            <div className="p-4 border-t border-gray-100 text-right">
              <button
                onClick={() => setDetalleSeleccionado(null)}
                className="px-6 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold rounded-xl"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* CABECERA */}
      <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-100 flex flex-col md:flex-row items-start md:items-center gap-6">
        <div className="bg-indigo-600 p-4 rounded-3xl text-white shadow-lg shadow-indigo-100">
          <ShieldCheck size={32} />
        </div>
        <div>
          <h2 className="text-2xl font-black text-gray-800">
            Centro de Validaciones
          </h2>
          <p className="text-gray-500 font-medium">
            Bandeja de entrada para control de calidad, envíos y auditoría
            general.
          </p>
        </div>
      </div>

      <div className="flex flex-wrap gap-2 p-2 bg-white rounded-3xl border border-gray-100 shadow-sm w-fit">
        <button
          onClick={() => setPestañaActual("consultas")}
          className={`flex items-center gap-2 px-6 py-3 rounded-2xl font-bold transition-all ${pestañaActual === "consultas" ? "bg-indigo-50 text-indigo-700" : "text-gray-500 hover:bg-gray-50"}`}
        >
          <Stethoscope size={18} /> Consultas (
          {pestañaActual === "consultas" ? pendientes.length : ""})
        </button>
        <button
          onClick={() => setPestañaActual("pedidos")}
          className={`flex items-center gap-2 px-6 py-3 rounded-2xl font-bold transition-all ${pestañaActual === "pedidos" ? "bg-sky-50 text-sky-700" : "text-gray-500 hover:bg-gray-50"}`}
        >
          <Package size={18} /> Pedidos (
          {pestañaActual === "pedidos" ? pendientes.length : ""})
        </button>
        <button
          onClick={() => setPestañaActual("suministros")}
          className={`flex items-center gap-2 px-6 py-3 rounded-2xl font-bold transition-all ${pestañaActual === "suministros" ? "bg-emerald-50 text-emerald-700" : "text-gray-500 hover:bg-gray-50"}`}
        >
          <FileBox size={18} /> Material (
          {pestañaActual === "suministros" ? pendientes.length : ""})
        </button>
      </div>

      <div>
        <h3 className="text-lg font-black text-gray-800 mb-4 px-2 uppercase tracking-wide">
          Requiere tu Atención
        </h3>

        {cargando ? (
          <div className="flex justify-center py-10">
            <Loader2 className="animate-spin text-indigo-500" size={40} />
          </div>
        ) : pendientes.length === 0 ? (
          <div className="bg-white p-12 rounded-[2.5rem] border border-gray-100 shadow-sm text-center">
            <CheckCircle size={48} className="mx-auto text-emerald-400 mb-4" />
            <h3 className="text-xl font-black text-gray-800 mb-2">
              Bandeja Vacía
            </h3>
            <p className="text-gray-500 font-medium">
              No hay elementos pendientes de validación. ¡Buen trabajo!
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {pestañaActual === "consultas" &&
              pendientes.map((c) => (
                <div
                  key={c.id}
                  className="bg-white p-6 rounded-[2rem] border-2 border-dashed border-indigo-200 hover:border-indigo-400 transition-all flex flex-col"
                >
                  <div className="flex justify-between items-start mb-4">
                    <span className="bg-amber-100 text-amber-700 text-[10px] font-black px-3 py-1 rounded-full uppercase flex items-center gap-1">
                      <Clock size={12} /> Pendiente
                    </span>
                    <span className="text-xs font-bold text-gray-400">
                      {c.fecha}
                    </span>
                  </div>
                  <h3 className="text-lg font-black text-gray-800">
                    {c.nutricionistaNombre}
                  </h3>
                  <p className="text-sm font-bold text-indigo-600 mb-4">
                    📍 {c.farmaciaNombre}
                  </p>
                  <div className="flex justify-between items-center bg-gray-50 p-3 rounded-xl mb-6 flex-1">
                    <div className="text-center">
                      <p className="text-[10px] font-black text-gray-400 uppercase">
                        Nuevas
                      </p>
                      <p className="font-black text-gray-700">{c.nuevas}</p>
                    </div>
                    <div className="text-center">
                      <p className="text-[10px] font-black text-gray-400 uppercase">
                        Revisiones
                      </p>
                      <p className="font-black text-gray-700">{c.revisiones}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => handleValidarConsulta(c.id)}
                    className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 rounded-xl flex justify-center items-center gap-2 mt-auto"
                  >
                    <ShieldCheck size={18} /> Validar y Computar
                  </button>
                </div>
              ))}

            {pestañaActual === "pedidos" &&
              pendientes.map((p) => {
                const totales = calcularTotalesPedido(p.lineas);
                const agrupado = agruparLineasPorProducto(p.lineas);
                return (
                  <div
                    key={p.id}
                    className="bg-white p-6 rounded-[2rem] border-2 border-dashed border-sky-200 hover:border-sky-400 transition-all flex flex-col"
                  >
                    <div className="flex justify-between items-start mb-4">
                      <span className="bg-amber-100 text-amber-700 text-[10px] font-black px-3 py-1 rounded-full uppercase flex items-center gap-1">
                        <Clock size={12} /> Envío Pendiente
                      </span>
                      <span className="text-xs font-bold text-gray-400">
                        {p.fechaPedido}
                      </span>
                    </div>
                    <h3 className="text-lg font-black text-gray-800">
                      Pedido #{p.id}
                    </h3>
                    <p className="text-sm font-bold text-sky-600 mb-4">
                      Farmacia: {p.farmaciaNombre}
                    </p>

                    <div className="bg-gray-50 p-4 rounded-xl mb-6 flex-1 border border-gray-100">
                      <p className="text-xs font-black text-gray-500 uppercase mb-2 border-b border-gray-200 pb-2">
                        Desglose de Productos
                      </p>
                      <div className="space-y-3 mb-4 overflow-y-auto max-h-32 custom-scrollbar">
                        {agrupado.map(([nombreProd, cants], idx) => {
                          const totalLinea =
                            cants.real + cants.bonificados + cants.virtual;
                          return (
                            <div
                              key={idx}
                              className="pb-2 border-b border-gray-200 last:border-0 last:pb-0"
                            >
                              <p className="text-xs font-black text-gray-800">
                                {nombreProd}
                              </p>
                              <div className="text-[10px] ml-1 mt-1 space-y-0.5">
                                {cants.real > 0 && (
                                  <p className="text-gray-600">
                                    {cants.real}x (Dinero Real)
                                  </p>
                                )}
                                {cants.bonificados > 0 && (
                                  <p className="text-emerald-600 font-bold">
                                    {cants.bonificados}x (Bonificados/Gratis)
                                  </p>
                                )}
                                {cants.virtual > 0 && (
                                  <p className="text-purple-600 font-bold">
                                    {cants.virtual}x (Saldo Virtual)
                                  </p>
                                )}
                              </div>
                              <p className="text-[10px] font-black text-sky-600 mt-1">
                                TOTAL {nombreProd}: {totalLinea} uds.
                              </p>
                            </div>
                          );
                        })}
                      </div>

                      <div className="space-y-1 pt-2 border-t border-gray-200">
                        <div className="flex justify-between items-center">
                          <span className="text-xs font-black text-purple-600 uppercase flex items-center gap-1">
                            <Wallet size={12} /> Virtual Usado
                          </span>
                          <span className="text-sm font-black text-purple-700">
                            {totales.totalVirtual.toFixed(2)}€
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-xs font-black text-gray-800 uppercase flex items-center gap-1">
                            <Banknote size={12} /> Total Real
                          </span>
                          <span className="text-lg font-black text-sky-700">
                            {totales.totalReal.toFixed(2)}€
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* BOTÓN CON NUEVA LÓGICA DE INTERCEPCIÓN */}
                    <button
                      onClick={() => iniciarProcesoEnvio(p)}
                      className="w-full bg-sky-600 hover:bg-sky-700 text-white font-bold py-3 rounded-xl flex justify-center items-center gap-2 mt-auto"
                    >
                      <Package size={18} /> Marcar como Enviado
                    </button>
                  </div>
                );
              })}

            {pestañaActual === "suministros" &&
              pendientes.map((s) => (
                <div
                  key={s.id}
                  className="bg-white p-6 rounded-[2rem] border-2 border-dashed border-emerald-200 hover:border-emerald-400 transition-all flex flex-col"
                >
                  <div className="flex justify-between items-start mb-4">
                    <span className="bg-amber-100 text-amber-700 text-[10px] font-black px-3 py-1 rounded-full uppercase flex items-center gap-1">
                      <Clock size={12} /> Nueva Petición
                    </span>
                    <span className="text-xs font-bold text-gray-400">
                      {new Date(s.fechaPeticion).toLocaleDateString()}
                    </span>
                  </div>
                  <h3 className="text-lg font-black text-gray-800 mb-1">
                    {s.nutricionistaNombre}
                  </h3>

                  <div className="bg-gray-50 p-4 rounded-xl mb-6 flex-1 border border-gray-100">
                    <p className="text-xs font-black text-gray-500 uppercase mb-2 border-b border-gray-200 pb-2">
                      Materiales Solicitados
                    </p>
                    <ul className="space-y-1 text-sm font-bold text-gray-700 max-h-24 overflow-y-auto custom-scrollbar">
                      {s.materiales?.map((m, i) => (
                        <li key={i} className="flex justify-between">
                          <span>{m.nombre}</span>
                          <span className="text-xs text-gray-400">
                            ({m.cantidadEstandar} uds)
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="flex gap-2 mt-auto">
                    <button
                      onClick={() => handleEstadoSuministro(s.id, "APROBADO")}
                      className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 rounded-xl flex justify-center items-center gap-2 shadow-lg shadow-emerald-100"
                    >
                      <CheckCircle size={18} /> Aprobar
                    </button>
                    <button
                      onClick={() => handleEstadoSuministro(s.id, "CANCELADO")}
                      className="px-4 bg-red-50 hover:bg-red-100 text-red-600 font-bold rounded-xl flex justify-center items-center"
                    >
                      <XCircle size={18} />
                    </button>
                  </div>
                </div>
              ))}
          </div>
        )}
      </div>

      <div className="bg-white p-6 md:p-8 rounded-[2.5rem] shadow-sm border border-gray-100">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
          <div>
            <h3 className="text-xl font-black text-gray-800">
              Historial de {pestañaActual}
            </h3>
            <p className="text-sm text-gray-500 font-medium">
              Registro de operaciones ya procesadas
            </p>
          </div>
          <div className="flex items-center bg-gray-50 px-4 py-2 rounded-xl border border-gray-200 w-full md:w-auto">
            <Search size={18} className="text-gray-400 mr-2" />
            <input
              type="text"
              placeholder="Filtrar por nombre o fecha..."
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              className="bg-transparent outline-none text-sm w-full font-medium"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[600px]">
            <thead>
              <tr className="border-b-2 border-gray-100">
                <th className="pb-3 text-xs font-black text-gray-400 uppercase tracking-widest">
                  Fecha
                </th>
                <th className="pb-3 text-xs font-black text-gray-400 uppercase tracking-widest">
                  Identificador / Usuario
                </th>
                <th className="pb-3 text-xs font-black text-gray-400 uppercase tracking-widest text-center">
                  Estado
                </th>
                <th className="pb-3 text-xs font-black text-gray-400 uppercase tracking-widest text-right">
                  Acción
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {historialFiltrado.length === 0 ? (
                <tr>
                  <td
                    colSpan="4"
                    className="py-8 text-center text-gray-400 font-medium"
                  >
                    No hay registros que coincidan.
                  </td>
                </tr>
              ) : (
                historialFiltrado.map((item) => (
                  <tr
                    key={item.id}
                    className="hover:bg-gray-50/50 transition-colors group"
                  >
                    <td className="py-4 text-sm font-bold text-gray-600">
                      {pestañaActual === "suministros"
                        ? new Date(item.fechaPeticion).toLocaleDateString()
                        : item.fecha || item.fechaPedido}
                    </td>
                    <td className="py-4 text-sm font-bold text-gray-800">
                      {item.nutricionistaNombre || item.farmaciaNombre}
                    </td>
                    <td className="py-4 text-center">
                      <span
                        className={`text-[10px] font-black px-3 py-1 rounded-md uppercase tracking-widest ${
                          item.estado === "VALIDADA" ||
                          item.estado === "ENVIADO" ||
                          item.estado === "LIQUIDADO" ||
                          item.estado === "APROBADO"
                            ? "bg-emerald-100 text-emerald-700"
                            : item.estado === "CANCELADO" ||
                                item.estado === "RECHAZADA"
                              ? "bg-red-100 text-red-700"
                              : "bg-amber-100 text-amber-700"
                        }`}
                      >
                        {item.estado.replace("_", " ")}
                      </span>
                    </td>
                    <td className="py-4 text-right">
                      <button
                        onClick={() => setDetalleSeleccionado(item)}
                        className="bg-white border border-gray-200 text-gray-600 hover:bg-gray-900 hover:text-white px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-colors shadow-sm"
                      >
                        Detalles
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default VistaValidaciones;
