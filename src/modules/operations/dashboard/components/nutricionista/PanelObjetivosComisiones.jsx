import React from "react";
import { Award, Clock, AlertCircle, Check } from "lucide-react";

const PanelObjetivosComisiones = ({
  facturacionTotal,
  facturacionProductos,
  porcentajeLogrado,
  nivelAlcanzado,
  proximoObjetivo,
  nombreProximoObj,
  comisionFinal,
  METAS,
}) => (
  <div className="bg-surface rounded-md border border-neutral/10 overflow-hidden">

    {/* HEADER */}
    <div className="flex items-center justify-between gap-4 p-4 border-b border-neutral/10 flex-wrap">
      <div className="flex items-center gap-2">
        <Award size={16} className="text-neutral/40" />
        <div>
          <p className="text-sm font-medium text-secondary">Tus objetivos y comisiones</p>
          <p className="text-xs text-neutral/40">Proyección del mes actual</p>
        </div>
      </div>
      <div className="bg-neutral/[0.03] border border-neutral/10 rounded-md px-4 py-2 text-right">
        <p className="text-[10px] font-medium uppercase tracking-wider text-neutral/40">
          Comisión estimada
        </p>
        <p className="text-lg font-semibold text-primary">
          {comisionFinal?.toFixed(2) || "0.00"}€
        </p>
      </div>
    </div>

    <div className="p-4 space-y-4">

      {/* BARRA DE PROGRESO */}
      <div>
        <div className="flex justify-between text-sm mb-2">
          <span className="text-sm font-medium text-secondary">
            Facturación total generada
          </span>
          <span className="text-sm font-semibold text-secondary">
            {facturacionTotal.toFixed(2)}€
          </span>
        </div>
        <div className="w-full bg-neutral/10 h-1.5 rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-700 ${
              nivelAlcanzado !== "Ninguno" ? "bg-primary" : "bg-primary/50"
            }`}
            style={{ width: `${porcentajeLogrado}%` }}
          />
        </div>
        {proximoObjetivo && (
          <p className="text-xs text-neutral/40 mt-1.5 text-right">
            Meta para {nombreProximoObj}: {proximoObjetivo.facturacion.toFixed(0)}€
          </p>
        )}
      </div>

      {/* REQUISITOS MÍNIMOS */}
      <div className="bg-neutral/[0.02] border border-neutral/10 rounded-md p-3 space-y-2">
        <p className="text-xs font-bold uppercase tracking-wider text-neutral/50 mb-2">
          Requisitos mínimos (doble condición)
        </p>
        <div className="flex items-center justify-between">
          <span className="text-sm text-secondary flex items-center gap-2">
            {proximoObjetivo && facturacionTotal >= proximoObjetivo.facturacion
              ? <Check size={14} className="text-primary" />
              : <Clock size={14} className="text-neutral/40" />
            }
            Facturación total
          </span>
          <span className="text-sm font-medium text-secondary">
            {facturacionTotal.toFixed(0)}€ /{" "}
            {proximoObjetivo
              ? proximoObjetivo.facturacion.toFixed(0)
              : METAS.OB3.facturacion.toFixed(0)}€
          </span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm text-secondary flex items-center gap-2">
            {proximoObjetivo && facturacionProductos >= proximoObjetivo.productos
              ? <Check size={14} className="text-primary" />
              : <AlertCircle size={14} className="text-neutral/40" />
            }
            Venta de productos
          </span>
          <span className="text-sm font-medium text-secondary">
            {facturacionProductos.toFixed(0)}€ /{" "}
            {proximoObjetivo
              ? proximoObjetivo.productos.toFixed(0)
              : METAS.OB3.productos.toFixed(0)}€
          </span>
        </div>
      </div>

      {/* TRAMOS DE INCENTIVOS */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { key: "OB1", label: "Objetivo 1", meta: METAS.OB1, showAward: false },
          { key: "OB2", label: "Objetivo 2", meta: METAS.OB2, showAward: false },
          { key: "OB3", label: "Objetivo 3", meta: METAS.OB3, showAward: true },
        ].map(({ key, label, meta, showAward }) => {
          const alcanzado = nivelAlcanzado === key;
          const superado =
            (["OB2", "OB3"].includes(nivelAlcanzado) && key === "OB1") ||
            (nivelAlcanzado === "OB3" && key === "OB2");
          return (
            <div
              key={key}
              className={`border rounded-md p-3 transition-all ${
                alcanzado
                  ? "border-primary/30 bg-primary/[0.03]"
                  : superado
                    ? "border-neutral/10 bg-neutral/[0.02] opacity-50"
                    : "border-neutral/10 bg-surface opacity-40"
              }`}
            >
              <div className="flex items-center gap-1 mb-1">
                <p className="text-xs font-medium text-secondary">{label}</p>
                {showAward && <Award size={12} className="text-neutral/40" />}
              </div>
              <p className="text-base font-semibold text-primary">
                +{meta.incentivo.toFixed(0)}€
              </p>
              <p className="text-[10px] text-neutral/50 mt-1">
                {meta.facturacion.toFixed(0)}€ · {meta.productos.toFixed(0)}€
              </p>
              {meta.exceso > 0 && (
                <p className="text-[10px] text-neutral/40">
                  +{meta.exceso * 100}% exceso
                </p>
              )}
            </div>
          );
        })}
      </div>
    </div>
  </div>
);

export default PanelObjetivosComisiones;
