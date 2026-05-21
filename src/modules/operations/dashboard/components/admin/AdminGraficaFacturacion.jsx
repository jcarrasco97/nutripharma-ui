import React, { useState, useMemo } from "react";
import { TrendingUp, ChevronLeft, ChevronRight } from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend,
  LabelList,
} from "recharts";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/shared/components/ui/Chart";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/shared/components/ui/Select";

const AdminGraficaFacturacion = ({
  anio,
  setAnio,
  facturacion,
  listadoFarmacias = [],
  listadoNutricionistas = [],
  filtroFarmacia,
  setFiltroFarmacia,
  filtroNutri,
  setFiltroNutri,
}) => {
  const [showConsultas, setShowConsultas] = useState(true);
  const [showPedidos, setShowPedidos] = useState(true);

  // ── MEJORA 1: KPIs calculados a partir de la prop facturacion ──────────────
  const kpis = useMemo(() => {
    if (!facturacion?.length) return null;
    const totalConsultas = facturacion.reduce((s, m) => s + (m.ingresosConsultas || 0), 0);
    const totalProductos = facturacion.reduce((s, m) => s + (m.ingresosPedidos || 0), 0);
    const totalAnio = totalConsultas + totalProductos;
    const mejorMes = facturacion.reduce((best, m) => {
      const t = (m.ingresosConsultas || 0) + (m.ingresosPedidos || 0);
      return t > best.total ? { mes: m.mesTexto, total: t } : best;
    }, { mes: "—", total: 0 });
    const pctConsultas = totalAnio > 0 ? Math.round((totalConsultas / totalAnio) * 100) : 0;
    return { totalAnio, totalConsultas, totalProductos, mejorMes, pctConsultas };
  }, [facturacion]);

  return (
    <div className="bg-surface rounded-md border border-neutral/10 p-5">
      {/* Cabecera compacta */}
      <div className="flex items-center justify-between gap-4 mb-4 flex-wrap">
        {/* Icono + Título */}
        <div className="flex items-center gap-2">
          <TrendingUp size={18} className="text-secondary" />
          <div>
            <h2 className="text-sm font-semibold text-secondary leading-tight">
              Facturación Global
            </h2>
            <p className="text-xs text-neutral/50 leading-tight">
              Ingresos por Consultas y Venta de Productos
            </p>
          </div>
        </div>

        {/* Controles derechos */}
        <div className="flex items-center gap-3 flex-wrap">
          {/* Filtro farmacia */}
          <Select
            value={filtroFarmacia || "__all__"}
            onValueChange={(val) => setFiltroFarmacia(val === "__all__" ? "" : val)}
          >
            <SelectTrigger size="default" className="w-[180px]">
              <SelectValue placeholder="Todas las Farmacias" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="__all__">Todas las Farmacias</SelectItem>
              {listadoFarmacias.map((f) => (
                <SelectItem key={f.id} value={String(f.id)}>
                  {f.nombre}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Filtro nutricionista */}
          <Select
            value={filtroNutri || "__all__"}
            onValueChange={(val) => setFiltroNutri(val === "__all__" ? "" : val)}
          >
            <SelectTrigger size="default" className="w-[180px]">
              <SelectValue placeholder="Todas las Nutricionistas" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="__all__">Todas las Nutricionistas</SelectItem>
              {listadoNutricionistas.map((n) => (
                <SelectItem key={n.id} value={String(n.id)}>
                  {n.nombre} {n.apellidos}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Toggles Consultas / Productos */}
          <div className="flex items-center gap-1 bg-neutral/5 border border-neutral/10 rounded-md p-0.5">
            <button
              onClick={() => setShowConsultas(!showConsultas)}
              className={`px-3 h-8 rounded-md text-xs font-medium transition-all flex items-center gap-1.5
                ${showConsultas
                  ? "bg-surface text-primary shadow-sm"
                  : "text-neutral/40 hover:text-secondary"
                }`}
            >
              <span className={`w-2 h-2 rounded-full ${showConsultas ? "bg-[#b1cb0c]" : "bg-neutral/30"}`} />
              Consultas
            </button>
            <button
              onClick={() => setShowPedidos(!showPedidos)}
              className={`px-3 h-8 rounded-md text-xs font-medium transition-all flex items-center gap-1.5
                ${showPedidos
                  ? "bg-surface text-secondary shadow-sm"
                  : "text-neutral/40 hover:text-secondary"
                }`}
            >
              <span className={`w-2 h-2 rounded-full ${showPedidos ? "bg-secondary" : "bg-neutral/30"}`} />
              Productos
            </button>
          </div>

          {/* Selector de año */}
          <div className="flex items-center gap-2 bg-neutral/5 border border-neutral/10 rounded-md px-3 h-10">
            <button
              onClick={() => setAnio(anio - 1)}
              className="hover:text-primary text-secondary transition-colors"
            >
              <ChevronLeft size={16} />
            </button>
            <span className="text-sm font-medium text-secondary min-w-[2.5rem] text-center">
              {anio}
            </span>
            <button
              onClick={() => setAnio(anio + 1)}
              className="hover:text-primary text-secondary transition-colors"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* ── MEJORA 1: Fila de KPIs ────────────────────────────────────────────── */}
      {kpis && kpis.totalAnio > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
          {/* Total acumulado */}
          <div className="bg-neutral/[0.03] border border-neutral/10 rounded-md px-4 py-3">
            <p className="text-[10px] font-medium uppercase tracking-wider text-neutral/40 mb-1">
              Total acumulado
            </p>
            <p className="text-lg font-semibold text-secondary tabular-nums">
              {kpis.totalAnio.toLocaleString("es-ES")}€
            </p>
          </div>

          {/* Consultas */}
          <div className="bg-neutral/[0.03] border border-neutral/10 rounded-md px-4 py-3">
            <p className="text-[10px] font-medium uppercase tracking-wider text-neutral/40 mb-1">
              Consultas
            </p>
            <p className="text-lg font-semibold text-primary tabular-nums">
              {kpis.totalConsultas.toLocaleString("es-ES")}€
            </p>
            <p className="text-[10px] text-neutral/40 mt-0.5">
              {kpis.pctConsultas}% del total
            </p>
          </div>

          {/* Productos */}
          <div className="bg-neutral/[0.03] border border-neutral/10 rounded-md px-4 py-3">
            <p className="text-[10px] font-medium uppercase tracking-wider text-neutral/40 mb-1">
              Productos
            </p>
            <p className="text-lg font-semibold text-secondary tabular-nums">
              {kpis.totalProductos.toLocaleString("es-ES")}€
            </p>
          </div>

          {/* Mejor mes */}
          <div className="bg-neutral/[0.03] border border-neutral/10 rounded-md px-4 py-3">
            <p className="text-[10px] font-medium uppercase tracking-wider text-neutral/40 mb-1">
              Mejor mes
            </p>
            <p className="text-lg font-semibold text-secondary tabular-nums">
              {kpis.mejorMes.mes}
            </p>
            <p className="text-[10px] text-neutral/40 mt-0.5">
              {kpis.mejorMes.total.toLocaleString("es-ES")}€
            </p>
          </div>
        </div>
      )}

      {/* Gráfica — ChartContainer gestiona las dimensiones */}
      <ChartContainer
        config={{
          consultas: { color: "#b1cb0c", label: "Consultas" },
          productos: { color: "#062e3a", label: "Productos" },
        }}
        className="h-[360px] w-full"
      >
        <BarChart
          data={facturacion}
          margin={{ top: 24, right: 30, left: 0, bottom: 0 }}
        >
          <CartesianGrid
            strokeDasharray="3 3"
            vertical={false}
            stroke="var(--color-border, #f3f4f6)"
          />
          <XAxis
            dataKey="mesTexto"
            axisLine={false}
            tickLine={false}
            tick={{ fill: "#342c1e", fontWeight: "500", fontSize: 12 }}
          />
          <YAxis
            axisLine={false}
            tickLine={false}
            tick={{ fill: "#342c1e", fontWeight: "500", fontSize: 12 }}
            tickFormatter={(value) => `${value}€`}
            width={60}
          />

          {/* ── MEJORA 2: Tooltip personalizado con ChartTooltipContent ────────── */}
          <ChartTooltip
            cursor={{ fill: "var(--color-neutral, #f4f7f4)", opacity: 0.08 }}
            content={
              <ChartTooltipContent
                hideLabel={false}
                labelKey="mesTexto"
                nameKey="name"
                indicator="dot"
              />
            }
          />

          <Legend
            wrapperStyle={{
              paddingTop: "16px",
              fontSize: "12px",
              color: "var(--color-text-secondary)",
            }}
          />

          {showConsultas && (
            <Bar
              dataKey="ingresosConsultas"
              name="Consultas (Servicios)"
              stackId="a"
              fill="#b1cb0c"
              radius={showPedidos ? [0, 0, 4, 4] : [4, 4, 4, 4]}
            />
          )}

          {showPedidos && (
            <Bar
              dataKey="ingresosPedidos"
              name="Venta Productos"
              stackId="a"
              fill="#062e3a"
              radius={showConsultas ? [4, 4, 0, 0] : [4, 4, 4, 4]}
            >
              {/* ── MEJORA 3: Label con el total del mes (solo cuando ambas barras activas) */}
              {showPedidos && showConsultas && (
                <LabelList
                  dataKey="ingresosPedidos"
                  position="top"
                  formatter={(val, entry) =>
                    val > 0
                      ? `${(val + (entry?.ingresosConsultas || 0)).toLocaleString("es-ES")}€`
                      : ""
                  }
                  style={{ fontSize: 10, fill: "#062e3a", fontWeight: 500 }}
                />
              )}
            </Bar>
          )}
        </BarChart>
      </ChartContainer>
    </div>
  );
};

export default AdminGraficaFacturacion;
