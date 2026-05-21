import React from "react";
import { TrendingUp, CalendarDays, Clock } from "lucide-react";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/shared/components/ui/Select";

const PanelCabeceraNutri = ({
  perfil,
  horasContrato,
  mesesDisponibles = [],
  mesFiltro,
  setMesFiltro,
  datosResumen,
}) => {
  const formatoMesCorto = (key) => {
    if (!key) return "";
    const [year, month] = key.split("-");
    const nombre = new Date(year, month - 1).toLocaleString("es-ES", {
      month: "short",
    });
    return `${nombre.charAt(0).toUpperCase() + nombre.slice(1).replace(".", "")} ${year}`;
  };

  return (
    <div className="bg-surface rounded-md border border-neutral/10 p-5">
      {/* FILA SUPERIOR */}
      <div className="flex items-start justify-between gap-4 pb-4 mb-4 border-b border-neutral/10 flex-wrap">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <TrendingUp size={18} className="text-primary" />
            <h2 className="text-lg font-semibold text-secondary">
              Hola, {perfil.nombre}
            </h2>
          </div>
          <div className="flex items-center gap-2 text-xs text-neutral/50">
            <Clock size={13} />
            Contrato activo:
            <span className="bg-primary/10 text-primary font-medium px-2 py-0.5 rounded-md text-[11px]">
              {horasContrato} h/semana
            </span>
          </div>
        </div>

        {/* Selector de mes — Select de Shadcn */}
        {mesesDisponibles.length > 0 && (
          <Select value={mesFiltro} onValueChange={setMesFiltro}>
            <SelectTrigger size="default" className="w-[150px]">
              <CalendarDays size={14} className="text-neutral/40 mr-1 shrink-0" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {mesesDisponibles.map((m) => (
                <SelectItem key={m} value={m}>
                  {formatoMesCorto(m)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
      </div>

      {/* GRID DE 4 KPIs */}
      {datosResumen && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="bg-neutral/[0.03] border border-neutral/10 rounded-md px-4 py-3">
            <p className="text-[10px] font-medium uppercase tracking-wider text-neutral/40 mb-1">
              Nuevas
            </p>
            <p className="text-xl font-semibold text-primary">
              {datosResumen.totalNuevas}
            </p>
          </div>
          <div className="bg-neutral/[0.03] border border-neutral/10 rounded-md px-4 py-3">
            <p className="text-[10px] font-medium uppercase tracking-wider text-neutral/40 mb-1">
              Revisiones
            </p>
            <p className="text-xl font-semibold text-secondary">
              {datosResumen.totalRevisiones}
            </p>
          </div>
          <div className="bg-neutral/[0.03] border border-neutral/10 rounded-md px-4 py-3">
            <p className="text-[10px] font-medium uppercase tracking-wider text-neutral/40 mb-1">
              Servicios
            </p>
            <p className="text-xl font-semibold text-secondary">
              {datosResumen.facturacionConsultas.toFixed(2)}€
            </p>
          </div>
          <div className="bg-neutral/[0.03] border border-neutral/10 rounded-md px-4 py-3">
            <p className="text-[10px] font-medium uppercase tracking-wider text-neutral/40 mb-1">
              Productos
            </p>
            <p className="text-xl font-semibold text-secondary">
              {datosResumen.facturacionProductos.toFixed(2)}€
            </p>
            <p className="text-xs text-neutral/40 mt-0.5">
              {datosResumen.totalKilometros} km recorridos
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default PanelCabeceraNutri;
