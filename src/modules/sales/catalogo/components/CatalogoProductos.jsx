import React from "react";
import { Gift, Wallet, Check } from "lucide-react";

// ─── Stepper compacto h-8 ────────────────────────────────────────────────────
const Stepper = ({ value, onDec, onInc, accent = false, disabled = false }) => (
  <div
    className={`inline-flex items-center h-8 rounded-md border overflow-hidden
      ${accent ? "border-primary/30" : "border-neutral/20"}
      ${disabled ? "opacity-40 pointer-events-none" : ""}
    `}
  >
    <button
      type="button"
      onClick={onDec}
      className={`h-8 w-9 flex items-center justify-center text-base font-medium transition-colors
        ${accent
          ? "text-primary/60 hover:bg-primary/10 hover:text-primary"
          : "text-neutral/40 hover:bg-red-50 hover:text-destructive"
        }
      `}
    >
      −
    </button>
    <span
      className={`h-8 w-10 flex items-center justify-center text-sm font-bold border-x
        ${accent
          ? "border-primary/20 text-primary bg-primary/5"
          : "border-neutral/15 text-secondary bg-surface"
        }
      `}
    >
      {value}
    </span>
    <button
      type="button"
      onClick={onInc}
      className={`h-8 w-9 flex items-center justify-center text-base font-medium transition-colors
        ${accent
          ? "text-primary/60 hover:bg-primary/10 hover:text-primary"
          : "text-neutral/40 hover:bg-primary/5 hover:text-primary"
        }
      `}
    >
      +
    </button>
  </div>
);

// ─── Filtros segmented-control ───────────────────────────────────────────────
const FILTROS = [
  { key: "por_defecto",  label: "Todos"    },
  { key: "recomendados", label: "Recomend."},
  { key: "mas_vendidos", label: "Top"      },
  { key: "precio_asc",   label: "Precio ↑" },
  { key: "precio_desc",  label: "Precio ↓" },
  { key: "alfabetico",   label: "A-Z"      },
];

// ─── Badge regalo ────────────────────────────────────────────────────────────
const BadgeRegalo = ({ n }) => (
  <span className="inline-flex items-center gap-0.5 text-[10px] font-bold text-primary bg-primary/8 border border-primary/15 px-1.5 py-0.5 rounded whitespace-nowrap">
    <Gift size={9} /> +{n}
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
  const getQtyReal  = (id) =>
    (carrito ?? []).filter((c) => c.productoId === id && !c.pagadoConSaldo)
      .reduce((s, c) => s + c.cantidad, 0);
  const getQtySaldo = (id) =>
    (carrito ?? []).filter((c) => c.productoId === id && c.pagadoConSaldo)
      .reduce((s, c) => s + c.cantidad, 0);
  const getRegalos  = (id) =>
    (carrito ?? []).filter((c) => c.productoId === id)
      .reduce((s, c) => s + c.bonificados, 0);

  const handleInc = (prod, isSaldo) => {
    const qty = isSaldo ? getQtySaldo(prod.id) : getQtyReal(prod.id);
    if (qty === 0) agregarAlCarrito(prod, isSaldo);
    else           modificarCantidad(prod.id, 1, isSaldo);
  };

  const progreso = Math.min((totalReal / 80) * 100, 100);

  return (
    <div className="flex flex-col gap-0">

      {/* ── FILTROS: Segmented Controls ── */}
      <div className="flex items-center gap-1.5 flex-wrap mb-3">
        {FILTROS.map((f) => {
          const activo = ordenProductos === f.key;
          return (
            <button
              key={f.key}
              onClick={() => setOrdenProductos(f.key)}
              className={`h-7 px-3 rounded-full text-xs font-semibold transition-all whitespace-nowrap
                ${activo
                  ? "bg-secondary text-white"
                  : "bg-surface border border-neutral/15 text-neutral/60 hover:border-secondary/30 hover:text-secondary"
                }
              `}
            >
              {f.label}
            </button>
          );
        })}
      </div>

      {/* ── BARRA: Monedero + Farmacia ── */}
      <div className="flex items-center justify-between gap-4 px-4 py-2.5 rounded-md border border-neutral/10 bg-surface mb-2">
        <div className="flex items-center gap-3 min-w-0">
          <Wallet size={15} className="text-primary shrink-0" />
          <div className="min-w-0">
            <p className="text-xs font-bold text-secondary">
              Monedero:{" "}
              <span className={umbralAlcanzado ? "text-primary" : "text-neutral/50"}>
                {(farmaciaActual?.saldoVirtual ?? 0).toFixed(2)}€
              </span>
            </p>
            {!esAdmin && !umbralAlcanzado && totalReal > 0 && (
              <div className="flex items-center gap-2 mt-1">
                <div className="w-28 h-1 rounded-full bg-neutral/10 overflow-hidden">
                  <div className="h-full bg-primary rounded-full transition-all duration-500"
                    style={{ width: `${progreso}%` }} />
                </div>
                <span className="text-[10px] text-neutral/40 font-medium">
                  {totalReal.toFixed(0)}/80€
                </span>
              </div>
            )}
            {umbralAlcanzado && (
              <span className="flex items-center gap-1 text-[10px] font-bold text-primary mt-0.5">
                <Check size={9} strokeWidth={3} /> Saldo desbloqueado
              </span>
            )}
          </div>
        </div>

        {!esFarmacia && (
          <select
            value={farmaciaSeleccionada}
            onChange={(e) => setFarmaciaSeleccionada(e.target.value)}
            className="h-9 pl-3 pr-8 rounded-md border border-neutral/15 bg-surface text-xs font-medium text-secondary appearance-none outline-none focus:border-primary/40 cursor-pointer shrink-0"
          >
            <option value="" disabled>Seleccionar...</option>
            {farmacias.map((f) => (
              <option key={f.id} value={f.id.toString()}>{f.nombre}</option>
            ))}
          </select>
        )}
        {esFarmacia && (
          <span className="text-xs font-semibold text-secondary shrink-0">
            {farmaciaActual?.nombre ?? "—"}
          </span>
        )}
      </div>

      {/* ══════════════════════════════════════════════════════════════════════
          TABLA (solo md+)
          Grid 12 cols: [nombre:4] [precio:2] [real:2] [saldo:2] [total:2]
         ══════════════════════════════════════════════════════════════════════ */}

      {/* Cabecera: bg-neutral/5, sin separadores verticales */}
      <div className="hidden md:grid md:grid-cols-12 bg-neutral/5 border-y border-neutral/10 sticky top-0 z-10 text-[10px] font-bold uppercase tracking-wider text-neutral/40">
        <div className="col-span-4 px-4 py-2">Producto</div>
        <div className="col-span-2 px-3 py-2">Precio ud.</div>
        <div className="col-span-2 px-3 py-2 text-center">Compra real</div>
        <div className="col-span-2 px-3 py-2 text-center">
          {umbralAlcanzado ? <span className="text-primary/60">Con saldo</span> : ""}
        </div>
        <div className="col-span-2 px-3 py-2 text-right">Total</div>
      </div>

      {/* Filas */}
      <div className="divide-y divide-neutral/8">
        {productos.filter((p) => p.hayExistencias).map((prod) => {
          const precio   = getPrecioAplicado(prod);
          const qtyReal  = getQtyReal(prod.id);
          const qtySaldo = getQtySaldo(prod.id);
          const regalos  = getRegalos(prod.id);
          const totalUds = qtyReal + qtySaldo + regalos;
          const subtotal = qtyReal * precio;
          const activo   = qtyReal > 0 || qtySaldo > 0;

          return (
            <div
              key={prod.id}
              className={`transition-colors ${
                activo
                  ? "bg-primary/[0.025] border-l-2 border-l-primary"
                  : "bg-surface hover:bg-neutral/[0.02] border-l-2 border-l-transparent"
              }`}
            >

              {/* ── DESKTOP (md+): fila grid, sin separadores verticales ── */}
              <div className="hidden md:grid md:grid-cols-12 items-center min-h-[44px]">

                {/* Col 1: Producto */}
                <div className="col-span-4 px-4 py-2 min-w-0">
                  <p className={`text-sm leading-snug truncate ${activo ? "font-semibold text-secondary" : "font-medium text-secondary"}`}>
                    {prod.nombreProducto}
                  </p>
                  {prod.acronimo && (
                    <span className="text-[10px] text-neutral/30 font-bold uppercase">{prod.acronimo}</span>
                  )}
                </div>

                {/* Col 2: Precio unitario */}
                <div className="col-span-2 px-3 py-2">
                  <span className="text-sm font-medium text-secondary">{precio.toFixed(2)}€</span>
                </div>

                {/* Col 3: Stepper Compra Real */}
                <div className="col-span-2 px-3 py-2 flex justify-center">
                  <Stepper
                    value={qtyReal}
                    onDec={() => modificarCantidad(prod.id, -1, false)}
                    onInc={() => handleInc(prod, false)}
                    disabled={!farmaciaSeleccionada}
                  />
                </div>

                {/* Col 4: Stepper Saldo (condicional) */}
                <div className="col-span-2 px-3 py-2 flex justify-center">
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

                {/* Col 5: Total (uds + regalo + subtotal€) */}
                <div className="col-span-2 px-4 py-2 text-right">
                  {totalUds > 0 ? (
                    <>
                      <div className="flex items-center justify-end gap-1.5">
                        <span className="text-sm font-bold text-secondary">{totalUds} uds</span>
                        {regalos > 0 && <BadgeRegalo n={regalos} />}
                      </div>
                      <span className="text-[11px] font-semibold text-primary">{subtotal.toFixed(2)}€</span>
                    </>
                  ) : (
                    <span className="text-neutral/20 text-xs">—</span>
                  )}
                </div>
              </div>

              {/* ── MOBILE (<md): tarjeta 3 bloques ── */}
              <div className="md:hidden">

                {/* Bloque 1 — Cabecera: Nombre + Precio */}
                <div className="flex items-start justify-between gap-2 px-4 pt-3 pb-1">
                  <p className={`text-sm leading-snug flex-1 min-w-0 ${activo ? "font-semibold text-secondary" : "font-medium text-secondary"}`}>
                    {prod.nombreProducto}
                  </p>
                  <span className="text-sm font-bold text-secondary whitespace-nowrap shrink-0">
                    {precio.toFixed(2)}€
                  </span>
                </div>

                {/* Bloque 2 — Controles apilados */}
                <div className="px-4 py-2 space-y-2">
                  {/* Compra Real */}
                  <div className="flex items-center justify-between rounded-md bg-neutral/[0.03] border border-neutral/10 px-3 py-2">
                    <span className="text-xs font-bold text-neutral/60">Compra Real</span>
                    <Stepper
                      value={qtyReal}
                      onDec={() => modificarCantidad(prod.id, -1, false)}
                      onInc={() => handleInc(prod, false)}
                      disabled={!farmaciaSeleccionada}
                    />
                  </div>
                  {/* Con Saldo (condicional) */}
                  {umbralAlcanzado && (
                    <div className="flex items-center justify-between rounded-md bg-primary/[0.04] border border-primary/15 px-3 py-2">
                      <span className="text-xs font-bold text-primary flex items-center gap-1.5">
                        <Wallet size={12} /> Con Saldo
                      </span>
                      <Stepper
                        value={qtySaldo}
                        onDec={() => modificarCantidad(prod.id, -1, true)}
                        onInc={() => handleInc(prod, true)}
                        accent
                        disabled={!farmaciaSeleccionada || (qtySaldo === 0 && saldoRestante < precio)}
                      />
                    </div>
                  )}
                </div>

                {/* Bloque 3 — Pie-ticket: Total (solo si hay unidades) */}
                {totalUds > 0 && (
                  <div className="flex items-center justify-between px-4 py-2 border-t border-neutral/10 bg-neutral/5">
                    <span className="text-xs font-bold text-secondary flex items-center gap-1.5">
                      Total: {totalUds} uds
                      {regalos > 0 && <BadgeRegalo n={regalos} />}
                    </span>
                    <span className="text-xs font-bold text-primary">{subtotal.toFixed(2)}€</span>
                  </div>
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