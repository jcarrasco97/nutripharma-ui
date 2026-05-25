import React, { useState } from "react";
import { ShoppingCart, Gift, Wallet, Loader2, X, MessageSquarePlus, Check } from "lucide-react";
import { Button } from "@/shared/components/ui/Button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/shared/components/ui/Dialog";
import { Textarea } from "@/shared/components/ui/Textarea";

/**
 * CestaPedidos — Responsiva
 *
 * Mobile (<xl): barra fija bottom-0 con resumen + "Ver Cesta" (Dialog) + "Procesar"
 * Desktop (xl+): sidebar sticky con lista completa + totales + botón
 */
const CestaPedidos = ({
  carrito,
  modificarCantidad,
  totalReal,
  totalVirtual,
  umbralAlcanzado,
  farmaciaSeleccionada,
  enviando,
  handleRealizarPedido,
  esAdmin,
  getPrecioAplicado,
  observacionesPedido,
  setObservacionesPedido,
  limiteMonedero,
}) => {
  const [modalAbierto, setModalAbierto] = useState(false);
  const [modalNotas, setModalNotas] = useState(false);

  // ── Agrupación ────────────────────────────────────────────────────────────
  const itemsAgrupados = Object.values(
    carrito.reduce((acc, item) => {
      if (!acc[item.productoId]) {
        acc[item.productoId] = {
          productoId: item.productoId,
          nombre: item.productoInfo.nombreProducto,
          precio: getPrecioAplicado(item.productoInfo),
          cantidadReal: 0,
          cantidadSaldo: 0,
          bonificados: 0,
        };
      }
      if (item.pagadoConSaldo) {
        acc[item.productoId].cantidadSaldo += item.cantidad;
      } else {
        acc[item.productoId].cantidadReal += item.cantidad;
        acc[item.productoId].bonificados  += item.bonificados;
      }
      return acc;
    }, {})
  ).filter((i) => i.cantidadReal > 0 || i.cantidadSaldo > 0);

  const totalItems  = carrito.reduce((s, i) => s + i.cantidad, 0);
  const cestaVacia  = itemsAgrupados.length === 0;
  const ctaDisabled = cestaVacia || !farmaciaSeleccionada;
  const tieneNota   = observacionesPedido?.trim()?.length > 0;

  // ── Lista de items (reutilizada en sidebar y modal) ──────────────────────
  const ItemList = () => (
    <div className="divide-y divide-neutral/8">
      {cestaVacia ? (
        <div className="flex flex-col items-center justify-center py-10 text-center">
          <ShoppingCart size={28} className="text-neutral/20 mb-2" />
          <p className="text-sm text-neutral/40 font-medium">Cesta vacía</p>
        </div>
      ) : itemsAgrupados.map((item) => (
        <div key={item.productoId} className="flex items-start justify-between gap-3 py-3">
          {/* Izquierda: nombre + tags */}
          <div className="flex flex-col gap-2 flex-1 min-w-0">
            <p className="text-sm font-medium text-secondary leading-snug truncate">
              {item.nombre}
            </p>
            <div className="flex items-center gap-1.5 flex-wrap">
              {item.cantidadReal > 0 && (
                <span className="text-[10px] font-medium text-neutral/50">{item.cantidadReal}× real</span>
              )}
              {item.bonificados > 0 && (
                <span className="inline-flex items-center gap-0.5 text-[10px] font-medium text-primary">
                  <Gift size={10} /> +{item.bonificados}
                </span>
              )}
              {item.cantidadSaldo > 0 && (
                <span className="inline-flex items-center gap-0.5 text-[10px] font-medium text-blue-500 bg-blue-50 border border-blue-200 px-1.5 py-0.5 rounded">
                  <Wallet size={9} /> {item.cantidadSaldo}× saldo
                </span>
              )}
            </div>
          </div>

          {/* Derecha: total uds */}
          <div className="text-right shrink-0">
            <span className="text-[9px] uppercase tracking-wider text-neutral/40 block">Total</span>
            <span className="text-xl font-medium text-secondary tabular-nums">
              {item.cantidadReal + item.cantidadSaldo + item.bonificados}
            </span>
          </div>
        </div>
      ))}
    </div>
  );

  // ── Bloque de Totales (reutilizado) ──────────────────────────────────────
  const Totales = () => (
    <div className="space-y-1.5 pt-3 border-t border-neutral/10">
      {totalVirtual > 0 && (
        <div className="flex justify-between text-xs font-medium text-primary">
          <span className="flex items-center gap-1"><Wallet size={11} /> Saldo descontado</span>
          <span>−{totalVirtual.toFixed(2)}€</span>
        </div>
      )}
      <div className="flex justify-between items-end">
        <div>
          <p className="text-[10px] font-bold text-neutral/40 uppercase tracking-wider">
            Total a pagar
          </p>
          {!umbralAlcanzado && totalReal > 0 && !esAdmin && (
            <p className="text-[10px] text-amber-600 font-medium mt-0.5">Mín. {limiteMonedero}€</p>
          )}
        </div>
        <p className="text-xl font-bold text-secondary">{totalReal.toFixed(2)}€</p>
      </div>
    </div>
  );

  // ── Botón sutil de observaciones ─────────────────────────────────────────
  const BotonNotas = ({ className = "" }) => (
    <button
      type="button"
      onClick={() => setModalNotas(true)}
      className={`inline-flex items-center gap-1.5 text-[11px] font-medium transition-colors rounded-md px-2.5 py-1.5 ${
        tieneNota
          ? "text-primary bg-primary/10 hover:bg-primary/15"
          : "text-neutral/50 hover:text-secondary hover:bg-neutral/5"
      } ${className}`}
      title={tieneNota ? "Editar observaciones" : "Añadir observaciones"}
    >
      {tieneNota ? <Check size={12} /> : <MessageSquarePlus size={12} />}
      {tieneNota ? "Nota añadida" : "Añadir nota"}
    </button>
  );

  return (
    <>
      {/* ══════════════════════════════════════════════════════════
          DESKTOP (xl+): Sidebar sticky
         ══════════════════════════════════════════════════════════ */}
      <div className="hidden xl:flex flex-col gap-4">
        <div className="bg-surface rounded-lg border border-neutral/10 p-5 sticky top-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-4 pb-3 border-b border-neutral/10">
            <div className="flex items-center gap-2">
              <ShoppingCart size={16} className="text-primary" />
              <h3 className="text-sm font-bold text-secondary">Mi Cesta</h3>
            </div>
            {totalItems > 0 && (
              <span className="text-[10px] font-bold text-white bg-secondary px-2 py-0.5 rounded-md">
                {totalItems} items
              </span>
            )}
          </div>

          {/* Lista */}
          <div className="max-h-[50vh] overflow-y-auto pr-1 custom-scrollbar">
            <ItemList />
          </div>

          {/* Totales */}
          {!cestaVacia && <Totales />}

          {/* Nota + CTA */}
          {!cestaVacia && (
            <div className="flex items-center justify-between mt-3">
              <BotonNotas />
            </div>
          )}
          <Button
            onClick={handleRealizarPedido}
            disabled={ctaDisabled}
            className="w-full h-11 mt-3 rounded-md bg-primary text-white hover:bg-primary-hover font-bold text-sm"
          >
            {enviando
              ? <Loader2 size={16} className="animate-spin" />
              : esAdmin ? "Procesar Proxy" : "Procesar Pedido"
            }
          </Button>
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════════
          MOBILE (<xl): Barra fija inferior
         ══════════════════════════════════════════════════════════ */}
      <div className="xl:hidden fixed bottom-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-md border-t border-neutral/10">
        <div className="px-4 py-3 flex items-center gap-3">
          {/* Izquierda: Totales */}
          <div className="flex-1 min-w-0">
            <p className="text-base font-bold text-secondary leading-none">
              Total: {totalReal.toFixed(2)}€
            </p>
            {totalVirtual > 0 && (
              <p className="text-[11px] text-primary font-medium mt-0.5 flex items-center gap-1">
                <Wallet size={10} /> Saldo descontado: −{totalVirtual.toFixed(2)}€
              </p>
            )}
          </div>

          {/* Derecha: Botones */}
          <div className="flex items-center gap-2 shrink-0">
            {!cestaVacia && <BotonNotas />}
            {!cestaVacia && (
              <Button
                variant="outline"
                onClick={() => setModalAbierto(true)}
                className="h-10 rounded-md border-neutral/20 text-secondary text-xs font-medium"
              >
                Ver cesta
              </Button>
            )}
            <Button
              onClick={handleRealizarPedido}
              disabled={ctaDisabled}
              className="h-10 rounded-md bg-primary text-white hover:bg-primary-hover font-bold text-sm px-5"
            >
              {enviando
                ? <Loader2 size={14} className="animate-spin" />
                : "Procesar"
              }
            </Button>
          </div>
        </div>
      </div>

      {/* ── Modal de desglose (mobile) ── */}
      <Dialog open={modalAbierto} onOpenChange={setModalAbierto}>
        <DialogContent aria-describedby={undefined} className="max-w-sm rounded-xl border border-neutral/10 bg-surface p-0 gap-0">
          <div className="flex items-center justify-between px-5 py-4 border-b border-neutral/10">
            <DialogHeader className="p-0">
              <DialogTitle className="text-sm font-bold text-secondary flex items-center gap-2">
                <ShoppingCart size={15} className="text-primary" /> Resumen
              </DialogTitle>
              <DialogDescription className="sr-only">
                Desglose de los productos en tu cesta antes de confirmar el pedido.
              </DialogDescription>
            </DialogHeader>
          </div>

          <div className="px-5 py-4 max-h-[60vh] overflow-y-auto">
            <ItemList />
          </div>

          <div className="px-5 py-4 border-t border-neutral/10 space-y-3">
            <Totales />
            <Button
              onClick={() => { setModalAbierto(false); handleRealizarPedido(); }}
              disabled={ctaDisabled}
              className="w-full h-11 rounded-md bg-primary text-white hover:bg-primary-hover font-bold text-sm"
            >
              {enviando ? <Loader2 size={16} className="animate-spin" /> : "Confirmar Pedido"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* ── Modal de Observaciones ── */}
      <Dialog open={modalNotas} onOpenChange={setModalNotas}>
        <DialogContent aria-describedby={undefined} className="max-w-sm rounded-xl border border-neutral/10 bg-surface p-0 gap-0">
          <DialogHeader className="px-5 pt-5 pb-3">
            <DialogTitle className="text-sm font-bold text-secondary flex items-center gap-2">
              <MessageSquarePlus size={15} className="text-primary" /> Observaciones del pedido
            </DialogTitle>
            <DialogDescription className="text-xs text-neutral/50 mt-1">
              Añade una nota opcional que se adjuntará al pedido.
            </DialogDescription>
          </DialogHeader>
          <div className="px-5 pb-2">
            <Textarea
              value={observacionesPedido || ""}
              onChange={(e) => setObservacionesPedido(e.target.value)}
              placeholder="Ej: Urgente, entregar antes del viernes..."
              className="min-h-[100px] text-sm resize-none border-neutral/15 focus-visible:ring-primary/30"
              maxLength={500}
            />
            <p className="text-[10px] text-neutral/40 text-right mt-1">
              {(observacionesPedido || "").length}/500
            </p>
          </div>
          <div className="px-5 pb-5">
            <Button
              onClick={() => setModalNotas(false)}
              className="w-full h-10 rounded-md bg-primary text-white hover:bg-primary-hover font-bold text-sm"
            >
              Guardar nota
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default CestaPedidos;