import React, { useState, useRef, useMemo } from "react";
import {
  X, FileText, Download, BarChart3, Loader2, CheckCircle2, FileSpreadsheet,
} from "lucide-react";
import { dashboardService } from "../../services/dashboardService";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend,
} from "recharts";
import html2canvas from "html2canvas";
import {
  Select, SelectTrigger, SelectValue, SelectContent, SelectItem,
} from "@/shared/components/ui/Select";
import { Button } from "@/shared/components/ui/Button";

// ── Tooltips ─────────────────────────────────────────────────────────────────

const CustomTooltipProductos = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  const d = payload[0].payload;
  return (
    <div className="bg-surface p-4 rounded-md shadow-lg border border-neutral/10 min-w-[200px]">
      <p className="font-semibold text-secondary mb-3 border-b border-neutral/10 pb-2">{label}</p>
      <p className="text-sm mb-1 text-neutral/60">Unidades: <span className="font-bold text-secondary">{d.cantidadVendida}</span></p>
      <p className="text-sm mb-1 text-primary font-medium">Total PVF: {Number(d.ingresosGeneradosPvf).toFixed(2)} €</p>
      <p className="text-sm mb-2 text-secondary font-medium">Total PVP: {Number(d.ingresosPotencialesPvp).toFixed(2)} €</p>
      <p className="text-xs text-neutral/40 border-t border-neutral/10 pt-2">
        PVF/ud: {Number(d.precioVentaFarmacia).toFixed(2)} € | PVP/ud: {Number(d.precioVentaPublico).toFixed(2)} €
      </p>
    </div>
  );
};

const CustomTooltipFacturacion = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  const consultas = payload.find(p => p.dataKey === "ingresosConsultas");
  const pedidos = payload.find(p => p.dataKey === "ingresosPedidos");
  return (
    <div className="bg-surface p-4 rounded-md shadow-lg border border-neutral/10 min-w-[200px]">
      <p className="font-semibold text-secondary mb-3 border-b border-neutral/10 pb-2">{label}</p>
      <p className="text-sm mb-1 font-medium" style={{ color: "#b1cb0c" }}>
        Consultas: {Number(consultas?.value || 0).toFixed(2)} €
      </p>
      <p className="text-sm mb-2 font-medium text-secondary">
        Productos: {Number(pedidos?.value || 0).toFixed(2)} €
      </p>
      <p className="text-sm font-bold text-primary border-t border-neutral/10 pt-2">
        Total: {(Number(consultas?.value || 0) + Number(pedidos?.value || 0)).toFixed(2)} €
      </p>
    </div>
  );
};

const CustomTooltipClinico = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  const d = payload[0].payload;
  return (
    <div className="bg-surface p-4 rounded-md shadow-lg border border-neutral/10 min-w-[220px]">
      <p className="font-semibold text-secondary mb-3 border-b border-neutral/10 pb-2">{label}</p>
      <div className="space-y-1 mb-3">
        <p className="text-xs font-medium text-neutral/40 uppercase tracking-wider">Volumen de Trabajo</p>
        <p className="text-sm">Nuevas: <span className="font-bold">{d.nuevas}</span></p>
        <p className="text-sm">Revisiones: <span className="font-bold">{d.revisiones}</span></p>
        <p className="text-sm text-blue-600">Promo: <span className="font-bold">{d.promocionales}</span></p>
        <p className="text-sm text-purple-600">Personal: <span className="font-bold">{d.personal}</span></p>
      </div>
      <div className="border-t border-neutral/10 pt-2">
        <p className="text-xs font-medium text-primary uppercase tracking-wider">Ingreso Estimado</p>
        <p className="text-lg font-bold text-primary">{Number(d.ingresosGenerados).toFixed(2)} €</p>
      </div>
    </div>
  );
};

const CustomTooltipVentasFarmacia = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  const d = payload[0].payload;
  const total = (d.totalConsultas || 0) + (d.totalPedidos || 0);
  return (
    <div className="bg-surface p-4 rounded-md shadow-lg border border-neutral/10 min-w-[220px]">
      <p className="font-semibold text-secondary mb-3 border-b border-neutral/10 pb-2">{label}</p>
      <p className="text-sm mb-1 font-medium" style={{ color: "#b1cb0c" }}>
        Consultas: {(d.totalConsultas || 0).toFixed(2)} €
      </p>
      <p className="text-sm mb-2 font-medium text-secondary">
        Productos: {(d.totalPedidos || 0).toFixed(2)} €
      </p>
      <div className="border-t border-neutral/10 pt-2">
        <p className="text-sm font-bold text-primary">Total: {total.toFixed(2)} €</p>
      </div>
    </div>
  );
};

// ── Configuración por tipo ────────────────────────────────────────────────────

const TIPOS_INFORME = [
  { value: "PRODUCTOS",       label: "Rendimiento de Productos" },
  { value: "FACTURACION",     label: "Facturación Global" },
  { value: "CLINICO",         label: "Análisis Clínico por Farmacia" },
  { value: "VENTAS_FARMACIA", label: "Ventas por Centro" },
];

const TIPO_CFG = {
  PRODUCTOS:       { hasMes: true,  hasFarmacia: true,  hasExcel: true,  recordLabel: "productos encontrados" },
  FACTURACION:     { hasMes: false, hasFarmacia: true,  hasExcel: true,  recordLabel: "meses desglosados" },
  CLINICO:         { hasMes: true,  hasFarmacia: true,  hasExcel: true,  recordLabel: "farmacias analizadas" },
  VENTAS_FARMACIA: { hasMes: false, hasFarmacia: false, hasExcel: true,  recordLabel: "centros con actividad" },
};

const ANOS = [...Array(6)].map((_, i) => String(new Date().getFullYear() - i));
const MESES_NOMBRES = Array.from({ length: 12 }, (_, i) =>
  new Date(2000, i).toLocaleString("es-ES", { month: "long" }).toUpperCase()
);

// ── Componente principal ──────────────────────────────────────────────────────

const ModalGeneradorInformes = ({
  isOpen,
  onClose,
  farmacias = [],
  nutricionistas = [],
  modoPagina = false,
}) => {
  const [filtros, setFiltros] = useState({
    tipo: "PRODUCTOS",
    anioInicio: new Date().getFullYear(),
    anioFin: new Date().getFullYear(),
    mes: "",
    farmaciaId: "",
    nutricionistaId: "",
    incluirPromo: true,
    incluirPers: true,
  });
  const [previewData, setPreviewData] = useState([]);
  const [fullReport, setFullReport] = useState(null);
  const [loadingPreview, setLoadingPreview] = useState(false);
  const [loadingPdf, setLoadingPdf] = useState(false);
  const [loadingExcel, setLoadingExcel] = useState(false);
  const chartRef = useRef(null);

  // Filtrado en cascada dentro del propio componente
  const farmaciasDisponibles = useMemo(() => {
    if (!filtros.nutricionistaId) return farmacias;
    const nutri = nutricionistas.find(n => String(n.id) === String(filtros.nutricionistaId));
    if (!nutri?.asignaciones?.length) return farmacias;
    const ids = nutri.asignaciones.map(a => String(a.farmaciaId));
    return farmacias.filter(f => ids.includes(String(f.id)));
  }, [filtros.nutricionistaId, farmacias, nutricionistas]);

  const nutrisDisponibles = useMemo(() => {
    if (!filtros.farmaciaId) return nutricionistas;
    return nutricionistas.filter(n =>
      n.asignaciones?.some(a => String(a.farmaciaId) === String(filtros.farmaciaId))
    );
  }, [filtros.farmaciaId, nutricionistas]);

  if (!isOpen && !modoPagina) return null;

  const cfg = TIPO_CFG[filtros.tipo] || TIPO_CFG.PRODUCTOS;

  const handleTipoChange = (tipo) => {
    setFiltros(prev => ({
      ...prev,
      tipo,
      mes: "",
      farmaciaId: TIPO_CFG[tipo]?.hasFarmacia ? prev.farmaciaId : "",
    }));
    setPreviewData([]);
    setFullReport(null);
  };

  const handleSelectChange = (name) => (val) => {
    setFiltros(prev => {
      const next = { ...prev, [name]: val === "__none__" ? "" : val };
      if (parseInt(next.anioInicio) > parseInt(next.anioFin)) next.anioFin = next.anioInicio;
      return next;
    });
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFiltros(prev => {
      const next = { ...prev, [name]: type === "checkbox" ? checked : value };
      if (parseInt(next.anioInicio) > parseInt(next.anioFin)) next.anioFin = next.anioInicio;
      return next;
    });
  };

  const handlePreview = async () => {
    setLoadingPreview(true);
    try {
      let res = null;
      if (filtros.tipo === "PRODUCTOS") {
        res = await dashboardService.obtenerRendimientoProductos(
          filtros.anioInicio, filtros.anioFin,
          filtros.mes || null, filtros.farmaciaId || null, filtros.nutricionistaId || null
        );
        setFullReport(res);
        setPreviewData(res?.totalesRango || []);
      } else if (filtros.tipo === "FACTURACION") {
        res = await dashboardService.obtenerFacturacionAdmin(
          filtros.anioInicio, filtros.anioFin,
          filtros.farmaciaId || null, filtros.nutricionistaId || null
        );
        setFullReport(res);
        setPreviewData(res?.totalesRango || []);
      } else if (filtros.tipo === "CLINICO") {
        res = await dashboardService.obtenerRendimientoClinico(
          filtros.anioInicio, filtros.anioFin,
          filtros.mes || null, filtros.farmaciaId || null, filtros.nutricionistaId || null
        );
        setFullReport(res);
        setPreviewData(res?.totalesRango || []);
      } else if (filtros.tipo === "VENTAS_FARMACIA") {
        res = await dashboardService.obtenerVentasFarmacia(
          filtros.anioInicio, filtros.anioFin,
          filtros.nutricionistaId || null
        );
        setFullReport(res);
        const summary = (res || []).map(item => ({
          farmaciaNombre: item.farmaciaNombre,
          totalConsultas: (item.reporte?.totalesRango || []).reduce(
            (s, m) => s + Number(m.ingresosConsultas || 0), 0
          ),
          totalPedidos: (item.reporte?.totalesRango || []).reduce(
            (s, m) => s + Number(m.ingresosPedidos || 0), 0
          ),
        }));
        setPreviewData(summary);
      }
    } catch (err) {
      console.error(err);
      alert("Error al cargar la previsualización.");
    } finally {
      setLoadingPreview(false);
    }
  };

  const setYearData = (anio) => {
    if (!fullReport || filtros.tipo === "VENTAS_FARMACIA") return;
    if (anio === "TOTAL") {
      setPreviewData(fullReport.totalesRango || []);
    } else {
      const d = fullReport.desglosesPorAnio?.find(d => d.anio === parseInt(anio));
      if (d) setPreviewData(d.datos || []);
    }
  };

  const captureChartAsBase64 = async () => {
    if (!chartRef.current) return null;
    try {
      const canvas = await html2canvas(chartRef.current, {
        backgroundColor: "#ffffff", scale: 2, logging: false, useCORS: true,
      });
      return canvas.toDataURL("image/png", 1.0);
    } catch (e) {
      console.error("Error capturando gráfica:", e);
      return null;
    }
  };

  const buildPayload = (withChart = false, base64 = null) => ({
    anioInicio: parseInt(filtros.anioInicio),
    anioFin: parseInt(filtros.anioFin),
    mes: filtros.mes ? parseInt(filtros.mes) : null,
    farmaciaId: filtros.farmaciaId ? parseInt(filtros.farmaciaId) : null,
    nutricionistaId: filtros.nutricionistaId ? parseInt(filtros.nutricionistaId) : null,
    tipoInforme: filtros.tipo,
    graficaBase64: withChart ? base64 : null,
    incluirPromocionales: filtros.incluirPromo,
    incluirPersonal: filtros.incluirPers,
  });

  const triggerDownload = (blob, filename) => {
    const link = document.createElement("a");
    link.href = window.URL.createObjectURL(new Blob([blob]));
    link.setAttribute("download", filename);
    document.body.appendChild(link);
    link.click();
    link.parentNode.removeChild(link);
  };

  const handleDownloadPdf = async () => {
    setLoadingPdf(true);
    try {
      const base64 = filtros.tipo !== "VENTAS_FARMACIA" ? await captureChartAsBase64() : null;
      const payload = buildPayload(true, base64);
      const filename = filtros.tipo === "VENTAS_FARMACIA"
        ? `informe_ventas_centros_${filtros.anioInicio}.pdf`
        : `informe_${filtros.tipo.toLowerCase()}_${filtros.anioInicio}.pdf`;

      let blob;
      if (filtros.tipo === "PRODUCTOS")        blob = await dashboardService.descargarInformeProductosPdf(payload);
      else if (filtros.tipo === "FACTURACION") blob = await dashboardService.descargarInformeFacturacionPdf(payload);
      else if (filtros.tipo === "CLINICO")     blob = await dashboardService.descargarInformeClinicoPdf(payload);
      else if (filtros.tipo === "VENTAS_FARMACIA") blob = await dashboardService.descargarInformeVentasFarmaciaPdf(payload);

      triggerDownload(blob, filename);
    } catch (err) {
      console.error(err);
      alert("Error al descargar el PDF.");
    } finally {
      setLoadingPdf(false);
    }
  };

  const handleDownloadExcel = async () => {
    if (!cfg.hasExcel) return;
    setLoadingExcel(true);
    try {
      const payload = buildPayload(false);
      const filename = `informe_${filtros.tipo.toLowerCase()}_${filtros.anioInicio}.xlsx`;

      let blob;
      if (filtros.tipo === "PRODUCTOS")             blob = await dashboardService.descargarInformeProductosExcel(payload);
      else if (filtros.tipo === "FACTURACION")      blob = await dashboardService.descargarInformeFacturacionExcel(payload);
      else if (filtros.tipo === "CLINICO")          blob = await dashboardService.descargarInformeClinicoExcel(payload);
      else if (filtros.tipo === "VENTAS_FARMACIA")  blob = await dashboardService.descargarInformeVentasFarmaciaExcel(payload);

      triggerDownload(blob, filename);
    } catch (err) {
      console.error(err);
      alert("Error al descargar el Excel.");
    } finally {
      setLoadingExcel(false);
    }
  };

  // ── JSX ────────────────────────────────────────────────────────────────────

  const content = (
    <>
      {/* CABECERA */}
      <div className="bg-secondary px-5 py-4 text-white flex justify-between items-center shrink-0">
        <div className="flex items-center gap-3">
          <FileText size={18} className="text-[#b1cb0c]" />
          <div>
            <h2 className="text-sm font-semibold text-surface leading-tight">
              Centro de Análisis y Reportes
            </h2>
            <p className="text-[10px] text-surface/50 uppercase tracking-wider mt-0.5">
              Generador Multidimensional de Informes
            </p>
          </div>
        </div>
        {!modoPagina && (
          <button
            onClick={onClose}
            className="text-surface/40 hover:text-surface transition-colors p-1"
          >
            <X size={18} />
          </button>
        )}
      </div>

      {/* CUERPO */}
      <div className="flex flex-col md:flex-row flex-1 overflow-hidden">

        {/* PANEL LATERAL */}
        <div className="w-full md:w-72 bg-neutral/[0.02] p-5 border-r border-neutral/10 overflow-y-auto shrink-0">
          <div className="space-y-5">

            {/* Tipo de análisis */}
            <div>
              <label className="block text-[10px] font-medium text-neutral/50 uppercase tracking-wider mb-1.5">
                Dimensión del Análisis
              </label>
              <Select value={filtros.tipo} onValueChange={handleTipoChange}>
                <SelectTrigger size="default" className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {TIPOS_INFORME.map(t => (
                    <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Rango de años */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[10px] font-medium text-neutral/50 uppercase tracking-wider mb-1.5">
                  Desde
                </label>
                <Select
                  value={String(filtros.anioInicio)}
                  onValueChange={handleSelectChange("anioInicio")}
                >
                  <SelectTrigger size="default" className="w-full"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {ANOS.map(a => <SelectItem key={a} value={a}>{a}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="block text-[10px] font-medium text-neutral/50 uppercase tracking-wider mb-1.5">
                  Hasta
                </label>
                <Select
                  value={String(filtros.anioFin)}
                  onValueChange={handleSelectChange("anioFin")}
                >
                  <SelectTrigger size="default" className="w-full"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {ANOS.map(a => <SelectItem key={a} value={a}>{a}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Filtro mes — solo tipos que lo admiten */}
            {cfg.hasMes && (
              <div>
                <label className="block text-[10px] font-medium text-neutral/50 uppercase tracking-wider mb-1.5">
                  Filtro de Mes
                </label>
                <Select
                  value={filtros.mes || "__none__"}
                  onValueChange={handleSelectChange("mes")}
                >
                  <SelectTrigger size="default" className="w-full">
                    <SelectValue placeholder="Año Completo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="__none__">Año Completo</SelectItem>
                    {MESES_NOMBRES.map((m, i) => (
                      <SelectItem key={i + 1} value={String(i + 1)}>{m}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            {/* Entidades con cascada */}
            <div className="space-y-3">
              <label className="block text-[10px] font-medium text-neutral/50 uppercase tracking-wider">
                Entidades
              </label>

              <Select
                value={filtros.nutricionistaId || "__none__"}
                onValueChange={handleSelectChange("nutricionistaId")}
              >
                <SelectTrigger size="default" className="w-full">
                  <SelectValue placeholder="Todos los Nutricionistas" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="__none__">Todos los Nutricionistas</SelectItem>
                  {nutrisDisponibles.map(n => (
                    <SelectItem key={n.id} value={String(n.id)}>
                      {n.nombre} {n.apellidos}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {cfg.hasFarmacia && (
                <Select
                  value={filtros.farmaciaId || "__none__"}
                  onValueChange={handleSelectChange("farmaciaId")}
                >
                  <SelectTrigger size="default" className="w-full">
                    <SelectValue placeholder="Todas las Farmacias" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="__none__">Todas las Farmacias</SelectItem>
                    {farmaciasDisponibles.map(f => (
                      <SelectItem key={f.id} value={String(f.id)}>
                        {f.nombre}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}

              {filtros.tipo === "VENTAS_FARMACIA" && (
                <p className="text-[10px] text-neutral/40 italic leading-tight">
                  Muestra todos los centros. Filtra por nutricionista para ver solo sus centros asignados.
                </p>
              )}
            </div>

            {/* Métricas extra para CLINICO */}
            {filtros.tipo === "CLINICO" && (
              <div className="bg-surface border border-neutral/10 rounded-md p-3 space-y-3">
                <label className="block text-[10px] font-medium text-neutral/50 uppercase tracking-wider">
                  Métricas de Volumen
                </label>
                <label className="flex items-center gap-3 cursor-pointer group">
                  <input
                    type="checkbox"
                    name="incluirPromo"
                    checked={filtros.incluirPromo}
                    onChange={handleChange}
                    className="w-4 h-4 rounded border-neutral/20 text-primary focus:ring-primary"
                  />
                  <span className="text-xs font-medium text-neutral/60 group-hover:text-secondary transition-colors">
                    Consultas Promocionales
                  </span>
                </label>
                <label className="flex items-center gap-3 cursor-pointer group">
                  <input
                    type="checkbox"
                    name="incluirPers"
                    checked={filtros.incluirPers}
                    onChange={handleChange}
                    className="w-4 h-4 rounded border-neutral/20 text-primary focus:ring-primary"
                  />
                  <span className="text-xs font-medium text-neutral/60 group-hover:text-secondary transition-colors">
                    Consultas Personal
                  </span>
                </label>
              </div>
            )}

            {/* Botón cargar */}
            <Button
              variant="outline"
              className="w-full h-10 gap-2 border-primary/20 text-primary hover:bg-primary/5"
              onClick={handlePreview}
              disabled={loadingPreview}
            >
              {loadingPreview
                ? <Loader2 className="animate-spin" size={15} />
                : <BarChart3 size={15} />
              }
              Cargar Análisis
            </Button>
          </div>
        </div>

        {/* PANEL DERECHO — previsualización */}
        <div className="flex-1 bg-surface p-5 flex flex-col overflow-hidden">
          <div className="flex justify-between items-center mb-4 gap-3 flex-wrap">
            <div className="flex flex-col items-start gap-2">
              <h3 className="text-sm font-semibold text-secondary">Previsualización Operativa</h3>
              {fullReport?.desglosesPorAnio?.length > 1 && filtros.tipo !== "VENTAS_FARMACIA" && (
                <select
                  onChange={(e) => setYearData(e.target.value)}
                  className="h-8 px-2 border border-primary/20 rounded-md text-xs font-medium bg-surface text-secondary outline-none focus:border-primary"
                >
                  <option value="TOTAL">
                    Total del Rango ({filtros.anioInicio}–{filtros.anioFin})
                  </option>
                  {fullReport.desglosesPorAnio.map(d => (
                    <option key={d.anio} value={d.anio}>Desglose Año {d.anio}</option>
                  ))}
                </select>
              )}
            </div>
            {previewData.length > 0 && (
              <span className="bg-primary/10 text-primary rounded-md text-[10px] font-medium px-2 py-0.5">
                {previewData.length} {cfg.recordLabel}
              </span>
            )}
          </div>

          <div ref={chartRef} className="flex-1 min-h-[400px] flex items-center justify-center">
            {loadingPreview ? (
              <Loader2 className="animate-spin text-neutral/20" size={48} />
            ) : previewData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                {filtros.tipo === "PRODUCTOS" ? (
                  <BarChart
                    data={previewData}
                    layout="vertical"
                    margin={{ top: 0, right: 30, left: 20, bottom: 0 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f0f0f0" />
                    <XAxis type="number" />
                    <YAxis
                      dataKey="productoNombre"
                      type="category"
                      width={140}
                      tick={{ fontSize: 10, fontWeight: "bold" }}
                    />
                    <Tooltip content={<CustomTooltipProductos />} cursor={{ fill: "#f4f7f4" }} />
                    <Bar
                      dataKey="cantidadVendida"
                      fill="#367933"
                      radius={[0, 4, 4, 0]}
                      barSize={20}
                      isAnimationActive={false}
                    />
                  </BarChart>
                ) : filtros.tipo === "FACTURACION" ? (
                  <BarChart
                    data={previewData}
                    margin={{ top: 20, right: 30, left: 0, bottom: 0 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                    <XAxis dataKey="mesTexto" tick={{ fontSize: 12, fontWeight: "bold" }} />
                    <YAxis tickFormatter={(v) => `${v}€`} />
                    <Tooltip content={<CustomTooltipFacturacion />} cursor={{ fill: "#f4f7f4" }} />
                    <Legend wrapperStyle={{ paddingTop: "20px", fontWeight: "bold" }} />
                    <Bar
                      dataKey="ingresosConsultas"
                      name="Consultas"
                      stackId="a"
                      fill="#b1cb0c"
                      isAnimationActive={false}
                    />
                    <Bar
                      dataKey="ingresosPedidos"
                      name="Productos"
                      stackId="a"
                      fill="#062e3a"
                      radius={[4, 4, 0, 0]}
                      isAnimationActive={false}
                    />
                  </BarChart>
                ) : filtros.tipo === "CLINICO" ? (
                  <BarChart
                    data={previewData}
                    margin={{ top: 20, right: 30, left: 20, bottom: 70 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                    <XAxis
                      dataKey="farmaciaNombre"
                      tick={{ fontSize: 10 }}
                      interval={0}
                    />
                    <YAxis />
                    <Tooltip content={<CustomTooltipClinico />} cursor={{ fill: "#f4f7f4" }} />
                    <Legend verticalAlign="bottom" wrapperStyle={{ paddingTop: "20px" }} />
                    <Bar dataKey="nuevas" name="Nuevas" stackId="a" fill="#062e3a" isAnimationActive={false} />
                    <Bar dataKey="revisiones" name="Revisiones" stackId="a" fill="#367933" isAnimationActive={false} />
                    {filtros.incluirPromo && (
                      <Bar dataKey="promocionales" name="Promo" stackId="a" fill="#4B9CD3" isAnimationActive={false} />
                    )}
                    {filtros.incluirPers && (
                      <Bar dataKey="personal" name="Personal" stackId="a" fill="#8E44AD" radius={[4, 4, 0, 0]} isAnimationActive={false} />
                    )}
                  </BarChart>
                ) : (
                  // VENTAS_FARMACIA — horizontal: farmacias en eje Y
                  <BarChart
                    data={previewData}
                    layout="vertical"
                    margin={{ top: 5, right: 60, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f0f0f0" />
                    <XAxis type="number" tickFormatter={(v) => `${v}€`} />
                    <YAxis
                      dataKey="farmaciaNombre"
                      type="category"
                      width={180}
                      tick={{ fontSize: 10 }}
                    />
                    <Tooltip content={<CustomTooltipVentasFarmacia />} cursor={{ fill: "#f4f7f4" }} />
                    <Legend verticalAlign="top" wrapperStyle={{ paddingBottom: "10px", fontWeight: "bold" }} />
                    <Bar
                      dataKey="totalConsultas"
                      name="Consultas"
                      stackId="a"
                      fill="#b1cb0c"
                      isAnimationActive={false}
                    />
                    <Bar
                      dataKey="totalPedidos"
                      name="Productos"
                      stackId="a"
                      fill="#062e3a"
                      radius={[0, 4, 4, 0]}
                      isAnimationActive={false}
                    />
                  </BarChart>
                )}
              </ResponsiveContainer>
            ) : (
              <div className="text-center max-w-xs">
                <div className="w-12 h-12 rounded-md bg-neutral/5 border border-neutral/10 flex items-center justify-center mx-auto mb-4">
                  <BarChart3 size={22} className="text-neutral/30" />
                </div>
                <p className="text-sm text-neutral/40">
                  Selecciona los parámetros y el tipo de informe para generar la vista previa operativa.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* PIE */}
      <div className="px-5 py-4 bg-neutral/[0.02] border-t border-neutral/10 flex justify-between items-center shrink-0">
        <div className="flex items-center gap-2 text-neutral/40">
          <CheckCircle2 size={14} />
          <span className="text-[10px] font-medium uppercase tracking-wider">
            Cumple con normativas de auditoría interna
          </span>
        </div>
        <div className="flex items-center gap-3">
          {cfg.hasExcel && (
            <Button
              onClick={handleDownloadExcel}
              disabled={loadingExcel || previewData.length === 0}
              className="h-10 px-6 gap-2 bg-[#217346] text-white hover:bg-[#1e603b] rounded-md font-medium"
            >
              {loadingExcel
                ? <Loader2 className="animate-spin" size={15} />
                : <FileSpreadsheet size={15} />
              }
              Exportar a Excel
            </Button>
          )}
          <Button
            onClick={handleDownloadPdf}
            disabled={loadingPdf || previewData.length === 0}
            className="h-10 px-6 gap-2 bg-primary text-surface hover:bg-primary-hover rounded-md font-medium"
          >
            {loadingPdf
              ? <Loader2 className="animate-spin" size={15} />
              : <Download size={15} />
            }
            Emitir Informe PDF
          </Button>
        </div>
      </div>
    </>
  );

  if (modoPagina) {
    return (
      <div className="w-full flex flex-col overflow-hidden min-h-[80vh]">
        {content}
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-[#062e3a]/60 backdrop-blur-sm">
      <div className="bg-surface rounded-md border border-neutral/10 shadow-lg max-w-6xl w-full max-h-[90vh] flex flex-col overflow-hidden">
        {content}
      </div>
    </div>
  );
};

export default ModalGeneradorInformes;
