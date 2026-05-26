import React, { useEffect, useState } from "react";
import { Loader2, TrendingUp, TrendingDown, RefreshCcw, Wrench, RotateCcw } from "lucide-react";
import { farmaciaService } from "@/modules/organization/farmacias";

const TIPO_CONFIG = {
  INGRESO: {
    label: "Ingreso",
    icon: TrendingUp,
    badgeClass: "bg-green-100 text-green-800",
    importeClass: "text-green-700 font-black",
    signo: "+",
  },
  GASTO: {
    label: "Gasto",
    icon: TrendingDown,
    badgeClass: "bg-red-100 text-red-700",
    importeClass: "text-red-600 font-black",
    signo: "−",
  },
  DEVOLUCION: {
    label: "Devolución",
    icon: RefreshCcw,
    badgeClass: "bg-sky-100 text-sky-800",
    importeClass: "text-sky-700 font-black",
    signo: "+",
  },
  REVERSION: {
    label: "Reversión",
    icon: RotateCcw,
    badgeClass: "bg-orange-100 text-orange-800",
    importeClass: "text-orange-700 font-black",
    signo: "−",
  },
  AJUSTE_MANUAL: {
    label: "Ajuste",
    icon: Wrench,
    badgeClass: "bg-indigo-100 text-indigo-800",
    importeClass: "text-indigo-700 font-black",
    signo: null, // calculado por el signo del importe
  },
};

const formatFecha = (iso) => {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("es-ES", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const formatImporte = (importe, tipo) => {
  const cfg = TIPO_CONFIG[tipo] ?? {};
  const abs = Math.abs(Number(importe)).toFixed(2);
  if (tipo === "AJUSTE_MANUAL") {
    const signo = Number(importe) >= 0 ? "+" : "−";
    return `${signo}${abs}€`;
  }
  return `${cfg.signo}${abs}€`;
};

const HistorialMovimientosSaldo = ({ farmaciaId, esFarmacia = false }) => {
  const [movimientos, setMovimientos] = useState([]);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    if (!farmaciaId) return;
    setCargando(true);
    const fetch = esFarmacia
      ? farmaciaService.obtenerMisMovimientos()
      : farmaciaService.obtenerMovimientos(farmaciaId);
    fetch
      .then(setMovimientos)
      .catch(() => setMovimientos([]))
      .finally(() => setCargando(false));
  }, [farmaciaId, esFarmacia]);

  if (cargando) {
    return (
      <div className="flex justify-center py-12">
        <Loader2 className="animate-spin text-primary" size={32} />
      </div>
    );
  }

  if (movimientos.length === 0) {
    return (
      <div className="text-center py-12 text-neutral/40 text-sm font-medium">
        Sin movimientos registrados.
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-neutral/10 text-neutral/50 text-xs uppercase tracking-wide">
            <th className="text-left py-2 pr-4 font-semibold">Fecha</th>
            <th className="text-left py-2 pr-4 font-semibold">Tipo</th>
            <th className="text-right py-2 pr-4 font-semibold">Importe</th>
            <th className="text-right py-2 pr-4 font-semibold">Saldo</th>
            <th className="text-left py-2 pr-4 font-semibold">Referencia</th>
            <th className="text-left py-2 font-semibold">Nota</th>
          </tr>
        </thead>
        <tbody>
          {movimientos.map((m) => {
            const cfg = TIPO_CONFIG[m.tipo] ?? {};
            const Icon = cfg.icon ?? TrendingUp;
            const esAjuste = m.tipo === "AJUSTE_MANUAL";

            return (
              <tr
                key={m.id}
                className={`border-b border-neutral/5 hover:bg-neutral/5 transition-colors ${
                  esAjuste ? "border-l-4 border-l-indigo-300 bg-indigo-50/30" : ""
                }`}
              >
                <td className="py-2.5 pr-4 text-neutral/60 whitespace-nowrap text-xs">
                  {formatFecha(m.fecha)}
                </td>
                <td className="py-2.5 pr-4">
                  <span
                    className={`inline-flex items-center gap-1.5 text-[11px] font-bold px-2.5 py-1 rounded-full whitespace-nowrap ${cfg.badgeClass}`}
                  >
                    <Icon size={11} />
                    {cfg.label}
                  </span>
                </td>
                <td className={`py-2.5 pr-4 text-right whitespace-nowrap ${cfg.importeClass ?? ""}`}>
                  {formatImporte(m.importe, m.tipo)}
                </td>
                <td className="py-2.5 pr-4 text-right text-secondary font-semibold whitespace-nowrap">
                  {Number(m.saldoResultante).toFixed(2)}€
                </td>
                <td className="py-2.5 pr-4 text-neutral/60 text-xs whitespace-nowrap">
                  {m.referenciaTipo && m.referenciaId
                    ? `${m.referenciaTipo === "CONSULTA" ? "Consulta" : "Pedido"} #${m.referenciaId}`
                    : "—"}
                </td>
                <td className="py-2.5 text-neutral/50 text-xs max-w-[200px] truncate">
                  {m.nota || "—"}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default HistorialMovimientosSaldo;
