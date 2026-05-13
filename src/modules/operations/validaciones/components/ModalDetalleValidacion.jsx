import React, { useMemo } from "react";
import {
  Eye, X, AlertTriangle, Loader2, ShieldCheck, Wallet, Banknote,
  Camera, Clock, Package, Gift, Database, ChevronLeft, ChevronRight, Edit3, XCircle
} from "lucide-react";
import { Dialog, DialogContent, DialogTitle } from "@/shared/components/ui/Dialog";
import { Badge } from "@/shared/components/ui/Badge";
import { Button } from "@/shared/components/ui/Button";

const ModalDetalleValidacion = ({
  detalle,
  pestañaActual,
  formEdicion,
  setFormEdicion,
  enviando,
  onCerrar,
  onCancelarConsulta,
  onEditarYValidar,
  onVerFoto,
  onBorrarEvidencia,
  onIniciarEnvio,
  onEstadoSuministro,
  onCancelarPedido,
  indexActual,
  totalPendientes,
  hayAnterior,
  haySiguiente,
  onAnterior,
  onSiguiente,
  modoLectura = false,
}) => {
  // Control de seguridad para editar consultas ya consolidadas
  const [modoEdicionForzada, setModoEdicionForzada] = React.useState(false);

  // Si cambiamos de tarjeta, volvemos a bloquear la edición por seguridad
  React.useEffect(() => {
    setModoEdicionForzada(false);
  }, [detalle]);

  const lineasPedidoAgrupadas = useMemo(() => {
    if (pestañaActual !== "pedidos" || !detalle || !detalle.lineas) {
      return { agrupadas: [], totales: { euros: 0, virtual: 0 } };
    }

    const mapa = {};
    let tEuros = 0;
    let tVirtual = 0;

    detalle.lineas.forEach((linea) => {
      const nombre = linea.productoNombre || "Producto Desconocido";
      const precioUd = linea.precioUnitario || linea.precioAplicado || 0;

      if (!mapa[nombre]) {
        mapa[nombre] = {
          nombre,
          udsCompradas: 0,
          udsRegalo: 0,
          udsVirtuales: 0,
          subEuros: 0,
          subVirtual: 0,
        };
      }

      if (linea.bonificados) mapa[nombre].udsRegalo += linea.bonificados;

      if (linea.pagadoConSaldo) {
        mapa[nombre].udsVirtuales += linea.cantidad;
        mapa[nombre].subVirtual += linea.cantidad * precioUd;
        tVirtual += linea.cantidad * precioUd;
      } else {
        mapa[nombre].udsCompradas += linea.cantidad;
        mapa[nombre].subEuros += linea.cantidad * precioUd;
        tEuros += linea.cantidad * precioUd;
      }
    });

    return {
      agrupadas: Object.values(mapa),
      totales: { euros: tEuros, virtual: tVirtual },
    };
  }, [detalle, pestañaActual]);

  const formatFecha = (isoString) => {
    if (!isoString) return "Desconocida";
    return new Date(isoString).toLocaleDateString("es-ES", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };
  const formatFechaHora = (isoString) => {
    if (!isoString) return "Pendiente";
    return new Date(isoString).toLocaleString("es-ES", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Dialog controla visibilidad via open={!!detalle}

  // Lógica para saber si debemos mostrar el Footer (Solo si hay acciones que hacer)
  const mostrarFooter = detalle && (
    (pestañaActual === "consultas" &&
      ["PENDIENTE_VALIDACION", "CON_INCIDENCIA", "VALIDADA"].includes(detalle.estado)) ||
    (pestañaActual === "pedidos" && detalle.estado === "PENDIENTE_ENVIO") ||
    (pestañaActual === "suministros" && detalle.estado === "SOLICITADO"));
  // Solo mostramos navegación en elementos pendientes, no en el historial de solo lectura
  const mostrarNavegacion = detalle && !modoLectura && totalPendientes > 0 &&
    ["PENDIENTE_VALIDACION", "CON_INCIDENCIA", "PENDIENTE_ENVIO", "SOLICITADO"].includes(detalle.estado);

  return (
    <Dialog open={!!detalle} onOpenChange={(open) => { if (!open) onCerrar(); }}>
      <DialogContent className="p-0 overflow-hidden max-w-md sm:max-w-lg border border-neutral/10 bg-surface flex flex-col max-h-[85vh] gap-0" showCloseButton={false}>
        <DialogTitle className="sr-only">Detalle de validación</DialogTitle>

        {/* ── HEADER ── */}
        <div className="bg-secondary px-4 py-3 flex justify-between items-center shrink-0">
          <div className="flex items-center gap-2">
            <Eye size={15} className="text-accent" />
            <span className="text-surface text-sm font-semibold">Informe</span>
          </div>

          {detalle && mostrarNavegacion && (
            <div className="flex items-center gap-2 bg-surface/10 px-2.5 py-1 rounded-md">
              <button type="button" onClick={onAnterior} disabled={!hayAnterior || enviando} className="text-surface/60 hover:text-surface disabled:opacity-30 transition-colors">
                <ChevronLeft size={15} />
              </button>
              <span className="text-[11px] font-semibold text-surface/80 tabular-nums">{indexActual + 1} / {totalPendientes}</span>
              <button type="button" onClick={onSiguiente} disabled={!haySiguiente || enviando} className="text-surface/60 hover:text-surface disabled:opacity-30 transition-colors">
                <ChevronRight size={15} />
              </button>
            </div>
          )}

          <button onClick={onCerrar} className="text-surface/40 hover:text-surface transition-colors">
            <X size={16} />
          </button>
        </div>

        <div className="px-5 py-5 overflow-y-auto custom-scrollbar bg-surface flex-1">
          {/* VISTA CONSULTAS */}
          {pestañaActual === "consultas" && detalle && (
            <div className="space-y-3">
              {/* Cabecera de la jornada */}
              <div className="bg-surface border border-neutral/10 p-4 rounded-md flex justify-between items-center">
                <div>
                  <p className="text-[10px] font-bold text-primary uppercase tracking-widest mb-0.5">
                    Jornada
                  </p>
                  <p className="font-bold text-secondary text-base">
                    {detalle.fecha}
                  </p>
                  <p className="text-xs font-medium text-neutral/50 mt-0.5">
                    {detalle.horaInicio?.substring(0, 5)} – {detalle.horaFin?.substring(0, 5)}
                  </p>
                </div>
                <Badge
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-md uppercase tracking-wider border-none ${
                    detalle.estado === "VALIDADA"
                      ? "bg-primary/10 text-primary"
                      : detalle.estado === "CANCELADA"
                        ? "bg-destructive/10 text-destructive"
                        : "bg-amber-100 text-amber-700"
                  }`}
                >
                  {detalle.estado.replace("_", " ")}
                </Badge>
              </div>

              {/* Datos del nutricionista y farmacia */}
              <div className="bg-surface border border-neutral/10 p-4 rounded-md space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-medium text-neutral/50">Nutricionista</span>
                  <span className="text-sm font-semibold text-secondary">{detalle.nutricionistaNombre}</span>
                </div>
                <div className="flex justify-between items-center border-t border-neutral/5 pt-2">
                  <span className="text-xs font-medium text-neutral/50">Farmacia</span>
                  <span className="text-sm font-semibold text-secondary">{detalle.farmaciaNombre}</span>
                </div>
              </div>

              {detalle.fechaCreacion && (
                <div className="flex items-center gap-2 bg-neutral/5 border border-neutral/10 rounded-md px-3 py-2">
                  <Database size={12} className="text-neutral/40 shrink-0" />
                  <p className="text-[11px] font-medium text-neutral/50">
                    Registrado: <span className="font-semibold text-secondary">{detalle.fechaCreacion}</span>
                  </p>
                </div>
              )}

              {/* Campos numéricos de validación */}
              <div className="grid grid-cols-2 gap-2">
                {Object.keys(formEdicion).map((campo) => (
                  <div key={campo} className="bg-surface border border-neutral/10 p-3 rounded-md">
                    <p className="text-[10px] text-neutral/40 uppercase font-bold mb-2 tracking-wider">
                      {campo.replace("personalFarmacia", "Personal").replace("promociones", "Promo")}
                    </p>
                    <input
                      type="number"
                      min="0"
                      value={formEdicion[campo]}
                      onChange={(e) => setFormEdicion({ ...formEdicion, [campo]: Number(e.target.value) })}
                      disabled={
                        detalle.estado === "CANCELADA" ||
                        modoLectura ||
                        (["VALIDADA", "LIQUIDADA"].includes(detalle.estado) && !modoEdicionForzada)
                      }
                      className="w-full bg-neutral/5 border border-neutral/10 rounded-md px-3 py-2 text-xl font-bold text-primary focus:ring-2 focus:ring-primary/30 outline-none disabled:bg-transparent disabled:border-transparent transition-colors"
                    />
                  </div>
                ))}
              </div>

              {detalle.mensajeIncidencia && (
                <div className="text-sm text-amber-700 bg-amber-50 p-3 rounded-md border border-amber-200">
                  <p className="text-[10px] font-bold uppercase mb-1 flex items-center gap-1">
                    <AlertTriangle size={12} /> Mensaje de Incidencia
                  </p>
                  <p className="font-medium text-xs">{detalle.mensajeIncidencia}</p>
                </div>
              )}

              {detalle.observacionesJornada && (
                <div>
                  <p className="text-[10px] font-bold text-neutral/40 uppercase mb-1.5 tracking-wider">Notas de la Jornada</p>
                  <p className="text-sm bg-neutral/5 text-secondary p-3 rounded-md border border-neutral/10 font-medium">
                    {detalle.observacionesJornada}
                  </p>
                </div>
              )}

              {/* Evidencia fotográfica */}
              <div className="bg-surface border border-neutral/10 p-4 rounded-md">
                <div className="flex items-center gap-1.5 mb-3 pb-2 border-b border-neutral/5">
                  <ShieldCheck size={13} className="text-primary" />
                  <p className="text-[10px] font-bold text-neutral/40 uppercase tracking-wider">Certificación de Prueba</p>
                </div>
                {detalle.evidenciaUrl ? (
                  <div className="space-y-3">
                    <div className="flex justify-between items-center text-xs font-medium text-neutral/50">
                      <span className="flex items-center gap-1"><Clock size={11} /> Subida:</span>
                      <span className="text-secondary font-semibold bg-neutral/5 px-2 py-0.5 rounded border border-neutral/10">{detalle.evidenciaFecha}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onVerFoto(detalle.id)}
                        className="flex-1 gap-1.5 rounded-md border-neutral/20 text-secondary hover:text-primary hover:border-primary/30 font-semibold text-xs"
                      >
                        <Eye size={13} /> Ver Foto
                      </Button>
                      {detalle.estado !== "CANCELADA" && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onBorrarEvidencia(detalle.id)}
                          disabled={enviando}
                          className="text-destructive hover:text-destructive hover:bg-destructive/10 rounded-md"
                          title="Rechazar y borrar foto"
                        >
                          <XCircle size={14} />
                        </Button>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 text-xs font-medium text-amber-600 bg-amber-50 p-2.5 rounded-md border border-amber-200">
                    <Camera size={13} /> Sin evidencia adjunta
                  </div>
                )}
              </div>

              {/* Botones inline de validación (cuando el estado lo permite) */}
              {["BORRADOR", "PENDIENTE_VALIDACION", "CON_INCIDENCIA"].includes(detalle.estado) && (
                <div className="flex gap-2 pt-2 border-t border-neutral/10">
                  <Button
                    variant="outline"
                    onClick={() => onCancelarConsulta(detalle.id)}
                    disabled={enviando}
                    className="flex-1 gap-1.5 rounded-md border-destructive/30 text-destructive hover:bg-destructive/10 hover:border-destructive/50 font-semibold text-sm"
                  >
                    <XCircle size={15} /> Denegar
                  </Button>
                  <Button
                    onClick={() => onEditarYValidar(detalle.id, formEdicion)}
                    disabled={enviando}
                    className="flex-1 gap-1.5 rounded-md bg-primary hover:bg-primary-hover text-surface font-semibold text-sm"
                  >
                    <ShieldCheck size={15} /> Validar y Cerrar
                  </Button>
                </div>
              )}
            </div>
          )}

          {/* VISTA PEDIDOS */}
          {pestañaActual === "pedidos" && detalle && (
            <div className="space-y-3">
              <div className="bg-surface border border-neutral/10 p-4 rounded-md flex flex-col gap-3">
                <div className="flex justify-between items-center pb-2 border-b border-neutral/5">
                  <span className="text-xs font-semibold text-primary">Pedido #{detalle.id}</span>
                  <Badge className="text-[10px] font-bold px-2 py-0.5 rounded-md uppercase tracking-wider border-none bg-secondary/10 text-secondary">
                    {detalle.estado}
                  </Badge>
                </div>
                <div className="space-y-1.5">
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-medium text-neutral/50">Fecha</span>
                    <span className="font-semibold text-secondary text-sm">{detalle.fechaPedido || detalle.fecha}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-medium text-neutral/50">Realizado por</span>
                    <span className="font-semibold text-primary bg-primary/10 px-2 py-0.5 rounded text-xs">{detalle.creadoPorNombre || "Desconocido"}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-medium text-neutral/50">Destino</span>
                    <span className="font-semibold text-secondary text-sm">{detalle.farmaciaNombre}</span>
                  </div>
                </div>
              </div>

              <div className="border border-neutral/10 rounded-md overflow-hidden">
                <p className="bg-neutral/5 text-[10px] font-bold text-neutral/50 uppercase px-4 py-2.5 border-b border-neutral/10 tracking-wider flex items-center gap-2">
                  <Package size={12} /> Desglose de Unidades
                </p>
                <div className="divide-y divide-neutral/5 bg-surface">
                  {lineasPedidoAgrupadas.agrupadas.map((prod, idx) => {
                    const totalArticulosProd = prod.udsCompradas + prod.udsRegalo + prod.udsVirtuales;
                    return (
                      <div key={idx} className="px-4 py-3">
                        <div className="flex justify-between items-center mb-1.5">
                          <p className="font-semibold text-secondary text-sm leading-tight pr-4">{prod.nombre}</p>
                          <div className="text-center">
                            <p className="text-[10px] font-bold text-neutral/40 uppercase leading-none mb-0.5">Total</p>
                            <p className="text-2xl font-bold text-secondary bg-neutral/5 px-3 py-0.5 rounded-md border border-neutral/10 tabular-nums">{totalArticulosProd}</p>
                          </div>
                        </div>
                        <ul className="text-xs space-y-0.5 font-medium text-neutral/60">
                          {prod.udsCompradas > 0 && <li className="flex justify-between"><span>• {prod.udsCompradas}x Real</span><span>{prod.subEuros.toFixed(2)}€</span></li>}
                          {prod.udsRegalo > 0 && <li className="flex items-center gap-1 text-accent"><Gift size={10} /> {prod.udsRegalo}x Regalo/Bonif.</li>}
                          {prod.udsVirtuales > 0 && <li className="flex justify-between text-primary"><span className="flex items-center gap-1"><Wallet size={10} /> {prod.udsVirtuales}x Saldo</span><span>{prod.subVirtual.toFixed(2)}€</span></li>}
                        </ul>
                      </div>
                    );
                  })}
                </div>
                <div className="space-y-1.5 px-4 py-3 border-t border-neutral/10 bg-neutral/5">
                  {lineasPedidoAgrupadas.totales.virtual > 0 && (
                    <div className="flex justify-between items-center pb-1.5 border-b border-neutral/10">
                      <span className="text-[10px] font-bold text-primary uppercase flex items-center gap-1 tracking-wider"><Wallet size={11} /> Saldo Consumido</span>
                      <span className="text-sm font-bold text-primary">{lineasPedidoAgrupadas.totales.virtual.toFixed(2)}€</span>
                    </div>
                  )}
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-bold text-secondary uppercase flex items-center gap-1 tracking-wider"><Banknote size={14} /> Total Abonado</span>
                    <span className="text-2xl font-bold text-secondary tabular-nums">{(detalle.totalPedido || lineasPedidoAgrupadas.totales.euros).toFixed(2)}€</span>
                  </div>
                </div>
              </div>

              {detalle.repartos && detalle.repartos.length > 0 && (
                <div className="border border-neutral/10 rounded-md overflow-hidden">
                  <p className="bg-neutral/5 text-[10px] font-bold text-neutral/50 uppercase px-4 py-2.5 border-b border-neutral/10 tracking-wider">Reparto de Comisión</p>
                  <div className="divide-y divide-neutral/5 bg-surface">
                    {detalle.repartos.map((r, i) => (
                      <div key={i} className="flex justify-between items-center px-4 py-2.5 text-sm font-semibold text-secondary">
                        <span className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-accent"></div>{r.nutricionistaNombre}</span>
                        <span className="text-primary bg-primary/10 px-2.5 py-0.5 rounded text-xs">{r.porcentaje}%</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* VISTA SUMINISTROS */}
          {pestañaActual === "suministros" && detalle && (
            <div className="space-y-3">
              <div className="bg-surface border border-neutral/10 p-4 rounded-md flex justify-between items-center">
                <div>
                  <p className="text-[10px] font-bold text-primary uppercase tracking-widest mb-0.5">Petición Suministros</p>
                  <p className="font-semibold text-secondary text-base leading-tight">{detalle.nutricionistaNombre}</p>
                  {detalle.fechaPeticion && <p className="text-[11px] font-medium text-neutral/50 mt-0.5">{formatFechaHora(detalle.fechaPeticion)}</p>}
                </div>
                <Badge className={`text-[10px] font-bold px-2 py-0.5 rounded-md uppercase tracking-wider border-none shrink-0 ${detalle.estado === "APROBADO" ? "bg-primary/10 text-primary" : detalle.estado === "CANCELADO" || detalle.estado === "RECHAZADO" ? "bg-destructive/10 text-destructive" : "bg-amber-100 text-amber-700"}`}>
                  {detalle.estado}
                </Badge>
              </div>

              <div className="border border-neutral/10 rounded-md overflow-hidden">
                <p className="bg-neutral/5 text-[10px] font-bold text-neutral/50 uppercase px-4 py-2.5 border-b border-neutral/10 tracking-wider">Materiales Solicitados</p>
                <div className="divide-y divide-neutral/5 bg-surface">
                  {detalle.materiales?.map((m, i) => (
                    <div key={i} className="flex justify-between items-center px-4 py-2.5">
                      <span className="text-sm font-semibold text-secondary">{m.nombre}</span>
                      <Badge className="text-[10px] font-bold border-none bg-primary/10 text-primary rounded-md">{m.cantidadEstandar} uds</Badge>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* ── FOOTER CONTEXTUAL ── */}
        {detalle && mostrarFooter && (
          <div className="bg-surface border-t border-neutral/10 px-5 py-4 shrink-0 flex gap-2 justify-between items-center">
            {pestañaActual === "consultas" && detalle.estado === "VALIDADA" && (
              !modoEdicionForzada ? (
                <Button variant="outline" size="sm" onClick={() => { if (window.confirm("🚨 MODO EDICIÓN AVANZADA:\n\n¿Seguro que deseas alterar una jornada ya validada? Si modificas las cifras, el sistema recalculará automáticamente y alterará el saldo de la farmacia en tiempo real.")) { setModoEdicionForzada(true); } }} className="gap-1.5 rounded-md border-amber-300 text-amber-600 hover:bg-amber-50 font-semibold text-sm">
                  <Edit3 size={14} /> Corregir Consolidados
                </Button>
              ) : (
                <>
                  <Button variant="ghost" size="sm" onClick={() => setModoEdicionForzada(false)} disabled={enviando} className="gap-1.5 rounded-md text-neutral/60 font-semibold text-sm"><X size={14} /> Cancelar</Button>
                  <Button size="sm" onClick={onEditarYValidar} disabled={enviando} className="gap-1.5 rounded-md bg-primary hover:bg-primary-hover text-surface font-semibold text-sm">
                    {enviando ? <Loader2 className="animate-spin" size={14} /> : <ShieldCheck size={14} />} Aplicar
                  </Button>
                </>
              )
            )}
            {pestañaActual === "pedidos" && detalle.estado === "PENDIENTE_ENVIO" && (
              <>
                <Button variant="outline" size="sm" onClick={() => onCancelarPedido(detalle.id)} disabled={enviando} className="gap-1.5 rounded-md border-destructive/30 text-destructive hover:bg-destructive/10 font-semibold text-sm"><XCircle size={14} /> Anular</Button>
                <Button size="sm" onClick={onIniciarEnvio} disabled={enviando} className="flex-1 gap-1.5 rounded-md bg-primary hover:bg-primary-hover text-surface font-semibold text-sm"><Package size={14} /> Confirmar Envío</Button>
              </>
            )}
            {pestañaActual === "suministros" && detalle.estado === "SOLICITADO" && (
              <>
                <Button variant="outline" size="sm" onClick={() => onEstadoSuministro(detalle.id, "CANCELADO")} disabled={enviando} className="gap-1.5 rounded-md border-destructive/30 text-destructive hover:bg-destructive/10 font-semibold text-sm"><XCircle size={14} /> Denegar</Button>
                <Button size="sm" onClick={() => onEstadoSuministro(detalle.id, "APROBADO")} disabled={enviando} className="flex-1 gap-1.5 rounded-md bg-primary hover:bg-primary-hover text-surface font-semibold text-sm"><ShieldCheck size={14} /> Aprobar Envío</Button>
              </>
            )}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default ModalDetalleValidacion;


