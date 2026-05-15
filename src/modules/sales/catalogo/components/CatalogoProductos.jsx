import React, { useEffect } from "react";
import { Gift, Wallet, Store } from "lucide-react";
import { Progress } from "@/shared/components/ui/Progress";
import { toast } from "sonner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/Select";

// ─── Stepper Aislado (Basado en la imagen de referencia) ─────────────────────
const Stepper = ({ value, onDec, onInc, accent = false, disabled = false }) => (
  <div className={`flex items-center gap-3 ${disabled ? "opacity-40 pointer-events-none" : ""}`}>
    <button
      type="button"
      onClick={onDec}
      className={`h-8 w-8 flex items-center justify-center rounded-lg border text-lg transition-colors
        ${accent
          ? "border-primary/40 text-primary hover:bg-primary/10"
          : "border-neutral/20 text-secondary hover:bg-neutral/5"
        }
      `}
    >
      −
    </button>
    <span className={`min-w-[1rem] text-center text-sm font-bold ${accent ? "text-primary" : "text-secondary"}`}>
      {value}
    </span>
    <button
      type="button"
      onClick={onInc}
      className={`h-8 w-8 flex items-center justify-center rounded-lg border text-lg transition-colors
        ${accent
          ? "border-primary/40 text-primary hover:bg-primary/10"
          : "border-neutral/20 text-secondary hover:bg-neutral/5"
        }
      `}
    >
      +
    </button>
  </div>
);

// ─── Filtros segmented-control ───────────────────────────────────────────────
const FILTROS = [
  { key: "por_defecto", label: "Todos" },
  { key: "recomendados", label: "Recomend." },
  { key: "mas_vendidos", label: "Top" },
  { key: "precio_asc", label: "Precio ↑" },
  { key: "precio_desc", label: "Precio ↓" },
  { key: "alfabetico", label: "A-Z" },
];

// ─── Badge regalo ────────────────────────────────────────────────────────────
const BadgeRegalo = ({ n }) => (
  <span className="inline-flex items-center gap-0.5 text-[10px] font-bold text-primary bg-primary/10 px-1.5 py-0.5 rounded">
    <Gift size={10} />{n}
  </span>
);

// ─────────────────────────────────────────────────────────────────────────────
const CatalogoProductos = ({
  productos,
  ordenProductos,
  setOrdenProductos,
  farmaciaActual,
  esAdmin,
  esFarmacia,
  farmacias,
  farmaciaSeleccionada,
  setFarmaciaSeleccionada,
  agregarAlCarrito,
  modificarCantidad,
  umbralAlcanzado,
  saldoRestante,
  getPrecioAplicado,
  totalReal,
  carrito,
}) => {

  // Helpers
  const getQtyReal = (id) =>
    (carrito ?? []).filter((c) => c.productoId === id && !c.pagadoConSaldo)
      .reduce((s, c) => s + c.cantidad, 0);
  const getQtySaldo = (id) =>
    (carrito ?? []).filter((c) => c.productoId === id && c.pagadoConSaldo)
      .reduce((s, c) => s + c.cantidad, 0);
  const getRegalos = (id) =>
    (carrito ?? []).filter((c) => c.productoId === id)
      .reduce((s, c) => s + c.bonificados, 0);

  const handleInc = (prod, isSaldo) => {
    const qty = isSaldo ? getQtySaldo(prod.id) : getQtyReal(prod.id);
    if (qty === 0) agregarAlCarrito(prod, isSaldo);
    else modificarCantidad(prod.id, 1, isSaldo);
  };

  const progreso = Math.min((totalReal / 80) * 100, 100);

  // ─── Disparador del Toaster ───
  useEffect(() => {
    if (umbralAlcanzado && totalReal > 0) {
      toast.success("Saldo desbloqueado", {
        description: "Ya puedes usar el monedero en este pedido.",
      });
    }
  }, [umbralAlcanzado]);

  return (
    <div className="flex flex-col gap-4">

      {/* ── 1. BARRA: Monedero + Farmacia (Auto-wrap inteligente) ── */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 sm:p-5 rounded-xl bg-secondary text-white shadow-md border border-white/5">

        {/* IZQUIERDA: Icono + Monedero + Progreso */}
        <div className="flex items-center gap-3 sm:gap-4 shrink-0 max-w-full">
          {/* Caja del Icono */}
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white/10">
            <Wallet size={22} className="text-white" />
          </div>

          <div className="flex flex-col justify-center min-w-0 items-start">
            {/* Contenedor w-fit que abraza el ancho exacto del texto */}
            <div className="w-fit max-w-full">

              {/* Título e Importe */}
              <div className="flex items-baseline gap-1.5 sm:gap-2 flex-wrap">
                <span className="text-sm font-bold text-white/70 transition-colors whitespace-nowrap">
                  Monedero:
                </span>
                <span className={`text-xl sm:text-2xl font-black tracking-tight transition-colors whitespace-nowrap ${umbralAlcanzado ? "text-[#bed000]" : "text-white"}`}>
                  {(saldoRestante ?? 0).toFixed(2)}€
                </span>
              </div>

              {/* Barra de progreso y Meta (Desaparece al llegar a 80€) */}
              {!umbralAlcanzado && (
                <div className="flex items-center gap-3 mt-1.5 w-full animate-fade-in">
                  <Progress
                    value={progreso}
                    className="h-1.5 flex-1 bg-white/10 [&>div]:bg-[#bed000]"
                  />
                  <span className="text-xs font-bold text-white/50 shrink-0">
                    80€
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* DERECHA: Selector Farmacia */}
        {!esFarmacia && (
          <div className="flex items-center justify-end gap-3 sm:gap-4 shrink-0 max-w-full sm:ml-auto">

            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white/10">
              <Store size={22} className="text-white/80" />
            </div>

            {/* Usamos tu componente Select. 
                onValueChange en lugar de onChange para Radix UI */}
            <Select
              value={farmaciaSeleccionada}
              onValueChange={setFarmaciaSeleccionada}
            >
              {/* MAGIA AQUÍ: Le pasamos w-fit. Tailwind Merge borrará el w-full global.
                  Añadimos max-w para que si la farmacia tiene un nombre larguísimo, no rompa la tarjeta */}
              <SelectTrigger
                className="h-11 w-fit max-w-[180px] sm:max-w-xs rounded-lg border-white/20 bg-white/10 text-white font-semibold focus:border-[#bed000] focus:ring-1 focus:ring-[#bed000]/30 transition-colors"
              >
                <SelectValue placeholder="Seleccionar farmacia..." />
              </SelectTrigger>
              <SelectContent>
                {farmacias.map((f) => (
                  <SelectItem key={f.id} value={f.id.toString()}>
                    {f.nombre}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}
      </div>

      {/* ── 2. FILTROS: Segmented Controls ── */}
      <div className="flex items-center gap-2 flex-wrap mb-2">
        {FILTROS.map((f) => {
          const activo = ordenProductos === f.key;
          return (
            <button
              key={f.key}
              onClick={() => setOrdenProductos(f.key)}
              className={`h-8 px-4 rounded-full text-xs font-bold transition-all whitespace-nowrap
              ${activo
                  ? "bg-secondary text-white"
                  : "bg-surface border border-neutral/15 text-neutral/60 hover:border-neutral/30 hover:text-secondary"
                }
            `}
            >
              {f.label}
            </button>
          );
        })}
      </div>

      {/* ── 3. CARDS DE PRODUCTO ── */}
      <div className="flex flex-col gap-3">
        {productos.filter((p) => p.hayExistencias).map((prod) => {
          const precio = getPrecioAplicado(prod);
          const qtyReal = getQtyReal(prod.id);
          const qtySaldo = getQtySaldo(prod.id);
          const regalos = getRegalos(prod.id);
          const totalUds = qtyReal + qtySaldo + regalos;
          const activo = qtyReal > 0 || qtySaldo > 0;

          return (
            <div
              key={prod.id}
              className={`flex justify-between items-stretch rounded-xl shadow-sm border transition-colors p-4 group sm:p-5 ${activo
                ? "border-primary/40 bg-primary/5"
                : "border-neutral/10 bg-surface hover:border-primary/40 hover:shadow-md"
                }`}
            >
              {/* Izquierda: Info y Controles */}
              <div className="flex flex-col gap-4">

                {/* Nombre | Precio */}
                <div className="flex items-center gap-2.5 flex-wrap">
                  <span className={`text-sm ${activo ? "font-bold text-secondary" : "font-semibold text-secondary"}`}>
                    {prod.nombreProducto}
                  </span>
                  {prod.acronimo && (
                    <span className="text-[10px] bg-neutral/10 text-neutral/50 font-bold px-1.5 py-0.5 rounded uppercase">
                      {prod.acronimo}
                    </span>
                  )}
                  <span className="text-neutral/20 text-sm">|</span>
                  <span className="text-sm font-bold text-secondary">
                    {precio.toFixed(2)} €
                  </span>
                </div>

                {/* Steppers */}
                <div className="flex items-center gap-6">
                  <Stepper
                    value={qtyReal}
                    onDec={() => modificarCantidad(prod.id, -1, false)}
                    onInc={() => handleInc(prod, false)}
                    disabled={!farmaciaSeleccionada}
                  />

                  {umbralAlcanzado && (
                    <Stepper
                      value={qtySaldo}
                      onDec={() => modificarCantidad(prod.id, -1, true)}
                      onInc={() => handleInc(prod, true)}
                      accent
                      disabled={!farmaciaSeleccionada || (qtySaldo === 0 && saldoRestante < precio)}
                    />
                  )}
                </div>
              </div>

              {/* Derecha: Resumen Total */}
              <div className="flex flex-col items-end justify-between pl-4 shrink-0">
                <span className="text-xs font-medium text-neutral/40">Total:</span>

                {totalUds > 0 ? (
                  <div className="flex items-center gap-1.5">
                    <span className="text-lg font-bold text-secondary tabular-nums">{totalUds}</span>
                    {regalos > 0 && <BadgeRegalo n={regalos} />}
                    <span className="text-xs font-medium text-neutral/50">uds</span>
                  </div>
                ) : (
                  <span className="text-sm font-bold text-neutral/20">0 uds</span>
                )}
              </div>

            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CatalogoProductos;