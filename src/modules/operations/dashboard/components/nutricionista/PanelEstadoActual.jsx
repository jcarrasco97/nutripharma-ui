import React from "react";
import { Check, Clock, AlertCircle } from "lucide-react";

const PanelEstadoActual = ({
  facturacionTotal,
  facturacionProductos,
  porcentajeLogrado,
  nivelAlcanzado,
  proximoObjetivo,
  nombreProximoObj,
  METAS,
}) => (
  <div>
    <h4 className="text-sm font-bold text-[#342c1e] uppercase tracking-wider mb-6">
      Estado Actual
    </h4>
    <div className="space-y-6">
      <div>
        <div className="flex justify-between text-sm mb-2">
          <span className="font-bold text-[#062e3a]">
            Facturación Total Generada
          </span>
          <span className="font-black text-[#062e3a]">
            {facturacionTotal.toFixed(2)}€
          </span>
        </div>
        <div className="w-full bg-gray-100 h-4 rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-1000 ${nivelAlcanzado !== "Ninguno" ? "bg-[#367933]" : "bg-[#b1cb0c]"}`}
            style={{ width: `${porcentajeLogrado}%` }}
          ></div>
        </div>
        {proximoObjetivo && (
          <p className="text-xs text-[#342c1e] mt-2 text-right">
            Meta para {nombreProximoObj}:{" "}
            {proximoObjetivo.facturacion.toFixed(2)}€
          </p>
        )}
      </div>

      <div className="bg-[#f4f7f4]/50 border border-gray-100 rounded-2xl p-5">
        <p className="text-sm font-bold text-[#062e3a] mb-3">
          Requisitos Mínimos (Doble Condición)
        </p>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm text-[#342c1e] flex items-center gap-2">
              {proximoObjetivo &&
              facturacionTotal >= proximoObjetivo.facturacion ? (
                <Check size={16} className="text-[#367933]" />
              ) : (
                <Clock size={16} className="text-[#b1cb0c]" />
              )}
              Facturación Total
            </span>
            <span className="font-bold text-sm text-[#062e3a]">
              {facturacionTotal.toFixed(0)}€ /{" "}
              {proximoObjetivo
                ? proximoObjetivo.facturacion.toFixed(0)
                : METAS.OB3.facturacion.toFixed(0)}
              €
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-[#342c1e] flex items-center gap-2">
              {proximoObjetivo &&
              facturacionProductos >= proximoObjetivo.productos ? (
                <Check size={16} className="text-[#367933]" />
              ) : (
                <AlertCircle size={16} className="text-[#b1cb0c]" />
              )}
              Venta de Productos
            </span>
            <span className="font-bold text-sm text-[#062e3a]">
              {facturacionProductos.toFixed(0)}€ /{" "}
              {proximoObjetivo
                ? proximoObjetivo.productos.toFixed(0)
                : METAS.OB3.productos.toFixed(0)}
              €
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
);

export default PanelEstadoActual;
