import React, { useState, useRef } from "react";
import { X, FileText, Download, BarChart3, Loader2, CheckCircle2, FileSpreadsheet } from "lucide-react";
import { dashboardService } from "../../services/dashboardService";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend } from "recharts";
import html2canvas from "html2canvas";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/shared/components/ui/Select";
import { Button } from "@/shared/components/ui/Button";

// ── Tooltips personalizados (sin cambios) ────────────────────────────────────

const CustomTooltipProductos = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-surface p-4 rounded-md shadow-lg border border-neutral/10 min-w-[200px]">
        <p className="font-semibold text-secondary mb-3 border-b border-neutral/10 pb-2">{label}</p>
        <p className="text-sm mb-1 text-neutral/60">Unidades: <span className="font-bold text-secondary">{data.cantidadVendida}</span></p>
        <p className="text-sm mb-1 text-primary font-medium">Total PVF: {data.ingresosGeneradosPvf?.toFixed(2)} €</p>
        <p className="text-sm mb-2 text-secondary font-medium">Total PVP: {data.ingresosPotencialesPvp?.toFixed(2)} €</p>
        <p className="text-xs text-neutral/40 border-t border-neutral/10 pt-2">PVF/ud: {data.precioVentaFarmacia?.toFixed(2)}€ | PVP/ud: {data.precioVentaPublico?.toFixed(2)}€</p>
      </div>
    );
  }
  return null;
};

const CustomTooltipClinico = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-surface p-4 rounded-md shadow-lg border border-neutral/10 min-w-[220px]">
        <p className="font-semibold text-secondary mb-3 border-b border-neutral/10 pb-2">{label}</p>
        <div className="space-y-1 mb-3">
          <p className="text-xs font-medium text-neutral/40 uppercase tracking-wider">Volumen de Trabajo</p>
          <p className="text-sm">Nuevas: <span className="font-bold">{data.nuevas}</span></p>
          <p className="text-sm">Revisiones: <span className="font-bold">{data.revisiones}</span></p>
          <p className="text-sm text-blue-600">Promo: <span className="font-bold">{data.promocionales}</span></p>
          <p className="text-sm text-purple-600">Personal: <span className="font-bold">{data.personal}</span></p>
        </div>
        <div className="border-t border-neutral/10 pt-2">
          <p className="text-xs font-medium text-primary uppercase tracking-wider">Ingreso Generado</p>
          <p className="text-lg font-bold text-primary">{data.ingresosGenerados?.toFixed(2)} €</p>
        </div>
      </div>
    );
  }
  return null;
};

// ── Componente principal ─────────────────────────────────────────────────────

const ModalGeneradorInformes = ({ isOpen, onClose, farmacias = [], nutricionistas = [], modoPagina = false }) => {
  const [filtros, setFiltros] = useState({
    tipo: "PRODUCTOS",
    anioInicio: new Date().getFullYear(),
    anioFin: new Date().getFullYear(),
    mes: "",
    farmaciaId: "",
    nutricionistaId: "",
    incluirPromo: true,
    incluirPers: true
  });

  const [previewData, setPreviewData] = useState([]);
  const [fullReport, setFullReport] = useState(null);
  const [loadingPreview, setLoadingPreview] = useState(false);
  const [loadingPdf, setLoadingPdf] = useState(false);
  const [loadingExcel, setLoadingExcel] = useState(false);
  const chartRef = useRef(null);

  if (!isOpen && !modoPagina) return null;

  const handlePreview = async () => {
    setLoadingPreview(true);
    try {
      let res = null;
      if (filtros.tipo === "PRODUCTOS") {
        res = await dashboardService.obtenerRendimientoProductos(filtros.anioInicio, filtros.anioFin, filtros.mes || null, filtros.farmaciaId || null, filtros.nutricionistaId || null);
      } else if (filtros.tipo === "FACTURACION") {
        res = await dashboardService.obtenerFacturacionAdmin(filtros.anioInicio, filtros.anioFin, filtros.farmaciaId || null, filtros.nutricionistaId || null);
      } else if (filtros.tipo === "CLINICO") {
        res = await dashboardService.obtenerRendimientoClinico(filtros.anioInicio, filtros.anioFin, filtros.mes || null, filtros.nutricionistaId || null);
      }
      setFullReport(res);
      setPreviewData(res?.totalesRango || []);
    } catch (error) {
      console.error(error);
      alert("Error al cargar la previsualización.");
    } finally {
      setLoadingPreview(false);
    }
  };

  const setYearData = (anio) => {
    if (!fullReport) return;
    if (anio === "TOTAL") {
      setPreviewData(fullReport.totalesRango || []);
    } else {
      const desglose = fullReport.desglosesPorAnio?.find(d => d.anio === parseInt(anio));
      if (desglose) setPreviewData(desglose.datos || []);
    }
  };

  const captureChartAsBase64 = async () => {
    const container = chartRef.current;
    if (!container) return null;
    try {
      const canvas = await html2canvas(container, {
        backgroundColor: "#ffffff",
        scale: 2,
        logging: false,
        useCORS: true,
        onclone: (clonedDoc) => {
          const el = clonedDoc.querySelector('[ref="chartRef"]');
          if (el) el.style.display = "block";
        }
      });
      return canvas.toDataURL("image/png", 1.0);
    } catch (error) {
      console.error("Error capturando la gráfica:", error);
      return null;
    }
  };

  const handleDownloadPdf = async () => {
    setLoadingPdf(true);
    try {
      const base64Image = await captureChartAsBase64();
      const payload = {
        anioInicio: parseInt(filtros.anioInicio),
        anioFin: parseInt(filtros.anioFin),
        mes: filtros.mes ? parseInt(filtros.mes) : null,
        farmaciaId: filtros.farmaciaId ? parseInt(filtros.farmaciaId) : null,
        nutricionistaId: filtros.nutricionistaId ? parseInt(filtros.nutricionistaId) : null,
        tipoInforme: filtros.tipo,
        graficaBase64: base64Image,
        incluirPromocionales: filtros.incluirPromo,
        incluirPersonal: filtros.incluirPers
      };

      let blob;
      let filename = `informe_${filtros.tipo.toLowerCase()}_${filtros.anioInicio}.pdf`;

      if (filtros.tipo === "PRODUCTOS") blob = await dashboardService.descargarInformeProductosPdf(payload);
      else if (filtros.tipo === "FACTURACION") blob = await dashboardService.descargarInformeFacturacionPdf(payload);
      else if (filtros.tipo === "CLINICO") blob = await dashboardService.descargarInformeClinicoPdf(payload);

      const link = document.createElement('a');
      link.href = window.URL.createObjectURL(new Blob([blob]));
      link.setAttribute('download', filename);
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
    } catch (error) {
      console.error(error);
      alert("Error al descargar el PDF.");
    } finally {
      setLoadingPdf(false);
    }
  };

  const handleDownloadExcel = async () => {
    setLoadingExcel(true);
    try {
      const payload = {
        anioInicio: parseInt(filtros.anioInicio),
        anioFin: parseInt(filtros.anioFin),
        mes: filtros.mes ? parseInt(filtros.mes) : null,
        farmaciaId: filtros.farmaciaId ? parseInt(filtros.farmaciaId) : null,
        nutricionistaId: filtros.nutricionistaId ? parseInt(filtros.nutricionistaId) : null,
        tipoInforme: filtros.tipo,
        incluirPromocionales: filtros.incluirPromo,
        incluirPersonal: filtros.incluirPers
      };

      let blob;
      let filename = `informe_${filtros.tipo.toLowerCase()}_${filtros.anioInicio}.xlsx`;

      if (filtros.tipo === "PRODUCTOS") blob = await dashboardService.descargarInformeProductosExcel(payload);
      else if (filtros.tipo === "FACTURACION") blob = await dashboardService.descargarInformeFacturacionExcel(payload);
      else if (filtros.tipo === "CLINICO") blob = await dashboardService.descargarInformeClinicoExcel(payload);

      const link = document.createElement('a');
      link.href = window.URL.createObjectURL(new Blob([blob]));
      link.setAttribute('download', filename);
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
    } catch (error) {
      console.error(error);
      alert("Error al descargar el Excel.");
    } finally {
      setLoadingExcel(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFiltros(prev => {
      const next = { ...prev, [name]: type === 'checkbox' ? checked : value };
      if (parseInt(next.anioInicio) > parseInt(next.anioFin)) {
        next.anioFin = next.anioInicio;
      }
      return next;
    });
  };

  // Helper para los Select de Shadcn — preserva la lógica de handleChange
  const handleSelectChange = (name) => (val) => {
    setFiltros(prev => {
      const next = { ...prev, [name]: val === "__none__" ? "" : val };
      if (parseInt(next.anioInicio) > parseInt(next.anioFin)) {
        next.anioFin = next.anioInicio;
      }
      return next;
    });
  };

  const ANOS = [...Array(5)].map((_, i) => String(new Date().getFullYear() - i));
  const MESES = Array.from({ length: 12 }, (_, i) => i + 1);

  const content = (
    <>
      {/* HEADER */}
      <div className="bg-secondary px-5 py-4 text-white flex justify-between items-center shrink-0">
        <div className="flex items-center gap-3">
          <FileText size={18} className="text-[#b1cb0c]" />
          <div>
            <h2 className="text-sm font-semibold text-surface leading-tight">Centro de Análisis y Reportes</h2>
            <p className="text-[10px] text-surface/50 uppercase tracking-wider mt-0.5">Generador Multidimensional</p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="text-surface/40 hover:text-surface transition-colors p-1"
        >
          <X size={18} />
        </button>
      </div>

      {/* BODY */}
      <div className="flex flex-col md:flex-row flex-1 overflow-hidden">

        {/* PANEL LATERAL IZQUIERDO */}
        <div className="w-full md:w-72 bg-neutral/[0.02] p-5 border-r border-neutral/10 overflow-y-auto shrink-0">
          <div className="space-y-5">

            {/* Tipo de análisis */}
            <div>
              <label className="block text-[10px] font-medium text-neutral/50 uppercase tracking-wider mb-1.5">
                Dimensión del Análisis
              </label>
              <Select
                value={filtros.tipo}
                onValueChange={handleSelectChange("tipo")}
              >
                <SelectTrigger size="default" className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="PRODUCTOS">Rendimiento de Productos</SelectItem>
                  <SelectItem value="FACTURACION">Facturación Global (Mensual)</SelectItem>
                  <SelectItem value="CLINICO">Análisis Clínico (Por Farmacia)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Rango de años */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[10px] font-medium text-neutral/50 uppercase tracking-wider mb-1.5">
                  Desde (Año)
                </label>
                <Select
                  value={String(filtros.anioInicio)}
                  onValueChange={handleSelectChange("anioInicio")}
                >
                  <SelectTrigger size="default" className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {ANOS.map(a => (
                      <SelectItem key={a} value={a}>{a}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="block text-[10px] font-medium text-neutral/50 uppercase tracking-wider mb-1.5">
                  Hasta (Año)
                </label>
                <Select
                  value={String(filtros.anioFin)}
                  onValueChange={handleSelectChange("anioFin")}
                  disabled={filtros.tipo === "FACTURACION"}
                >
                  <SelectTrigger size="default" className="w-full disabled:opacity-30">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {ANOS.map(a => (
                      <SelectItem key={a} value={a}>{a}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Filtro de mes */}
            {filtros.tipo !== "FACTURACION" && (
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
                    {MESES.map(m => (
                      <SelectItem key={m} value={String(m)}>
                        {new Date(2000, m - 1).toLocaleString('es-ES', { month: 'long' }).toUpperCase()}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            {/* Entidades */}
            <div className="space-y-3">
              <label className="block text-[10px] font-medium text-neutral/50 uppercase tracking-wider mb-1.5">
                Entidades
              </label>
              <Select
                value={filtros.nutricionistaId || "__none__"}
                onValueChange={handleSelectChange("nutricionistaId")}
              >
                <SelectTrigger size="default" className="w-full">
                  <SelectValue placeholder="Cualquier Nutricionista" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="__none__">Cualquier Nutricionista</SelectItem>
                  {nutricionistas.map(n => (
                    <SelectItem key={n.id} value={String(n.id)}>
                      {n.nombre} {n.apellidos}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {filtros.tipo !== "CLINICO" && (
                <Select
                  value={filtros.farmaciaId || "__none__"}
                  onValueChange={handleSelectChange("farmaciaId")}
                >
                  <SelectTrigger size="default" className="w-full">
                    <SelectValue placeholder="Cualquier Farmacia" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="__none__">Cualquier Farmacia</SelectItem>
                    {farmacias.map(f => (
                      <SelectItem key={f.id} value={String(f.id)}>
                        {f.nombre}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            </div>

            {/* Checkboxes CLINICO */}
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

            {/* Botón Cargar Análisis */}
            <Button
              variant="outline"
              className="w-full h-10 gap-2 border-primary/20 text-primary hover:bg-primary/5"
              onClick={handlePreview}
              disabled={loadingPreview}
            >
              {loadingPreview ? <Loader2 className="animate-spin" size={15} /> : <BarChart3 size={15} />}
              Cargar Análisis
            </Button>
          </div>
        </div>

        {/* PANEL DERECHO */}
        <div className="flex-1 bg-surface p-5 flex flex-col overflow-hidden">
          <div className="flex justify-between items-center mb-4 gap-3 flex-wrap">
            <div className="flex flex-col items-start gap-2">
              <h3 className="text-sm font-semibold text-secondary">Previsualización Operativa</h3>
              {fullReport?.desglosesPorAnio?.length > 1 && (
                <select
                  onChange={(e) => setYearData(e.target.value)}
                  className="h-8 px-2 border border-primary/20 rounded-md text-xs font-medium bg-surface text-secondary outline-none focus:border-primary"
                >
                  <option value="TOTAL">Total del Rango ({filtros.anioInicio} - {filtros.anioFin})</option>
                  {fullReport.desglosesPorAnio.map(d => (
                    <option key={d.anio} value={d.anio}>Desglose Año {d.anio}</option>
                  ))}
                </select>
              )}
            </div>
            {previewData.length > 0 && (
              <span className="bg-primary/10 text-primary rounded-md text-[10px] font-medium px-2 py-0.5">
                {previewData.length} registros encontrados
              </span>
            )}
          </div>

          <div ref={chartRef} className="flex-1 min-h-[400px] flex items-center justify-center">
            {loadingPreview ? (
              <Loader2 className="animate-spin text-neutral/20" size={48} />
            ) : previewData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                {filtros.tipo === "PRODUCTOS" ? (
                  <BarChart data={previewData} layout="vertical" margin={{ top: 0, right: 30, left: 20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f0f0f0" />
                    <XAxis type="number" />
                    <YAxis dataKey="productoNombre" type="category" width={140} tick={{ fontSize: 10, fontWeight: 'bold' }} />
                    <Tooltip content={<CustomTooltipProductos />} cursor={{ fill: '#f4f7f4' }} />
                    <Bar dataKey="cantidadVendida" fill="#367933" radius={[0, 4, 4, 0]} barSize={20} isAnimationActive={false} />
                  </BarChart>
                ) : filtros.tipo === "FACTURACION" ? (
                  <BarChart data={previewData} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                    <XAxis dataKey="mesTexto" tick={{ fontSize: 12, fontWeight: 'bold' }} />
                    <YAxis tickFormatter={(val) => `${val}€`} />
                    <Tooltip cursor={{ fill: '#f4f7f4' }} />
                    <Legend wrapperStyle={{ paddingTop: '20px', fontWeight: 'bold' }} />
                    <Bar dataKey="ingresosConsultas" name="Servicios" stackId="a" fill="#b1cb0c" isAnimationActive={false} />
                    <Bar dataKey="ingresosPedidos" name="Ventas" stackId="a" fill="#062e3a" radius={[4, 4, 0, 0]} isAnimationActive={false} />
                  </BarChart>
                ) : (
                  <BarChart data={previewData} margin={{ top: 20, right: 30, left: 20, bottom: 70 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                    <XAxis dataKey="farmaciaNombre" />
                    <YAxis />
                    <Tooltip content={<CustomTooltipClinico />} cursor={{ fill: '#f4f7f4' }} />
                    <Legend verticalAlign="bottom" wrapperStyle={{ paddingTop: '20px' }} />
                    <Bar dataKey="nuevas" name="Nuevas" stackId="a" fill="#062e3a" isAnimationActive={false} />
                    <Bar dataKey="revisiones" name="Revisiones" stackId="a" fill="#367933" isAnimationActive={false} />
                    {filtros.incluirPromo && <Bar dataKey="promocionales" name="Promocionales" stackId="a" fill="#4B9CD3" isAnimationActive={false} />}
                    {filtros.incluirPers && <Bar dataKey="personal" name="Personal" stackId="a" fill="#8E44AD" isAnimationActive={false} radius={[4, 4, 0, 0]} />}
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

      {/* FOOTER */}
      <div className="px-5 py-4 bg-neutral/[0.02] border-t border-neutral/10 flex justify-between items-center shrink-0">
        <div className="flex items-center gap-2 text-neutral/40">
          <CheckCircle2 size={14} />
          <span className="text-[10px] font-medium uppercase tracking-wider">
            Cumple con normativas de auditoría interna
          </span>
        </div>
        <div className="flex items-center gap-3">
          <Button
            onClick={handleDownloadExcel}
            disabled={loadingExcel || previewData.length === 0}
            className="h-10 px-6 gap-2 bg-[#217346] text-white hover:bg-[#1e603b] rounded-md font-medium"
          >
            {loadingExcel ? <Loader2 className="animate-spin" size={15} /> : <FileSpreadsheet size={15} />}
            Exportar a Excel
          </Button>
          <Button
            onClick={handleDownloadPdf}
            disabled={loadingPdf || previewData.length === 0}
            className="h-10 px-6 gap-2 bg-primary text-surface hover:bg-primary-hover rounded-md font-medium"
          >
            {loadingPdf ? <Loader2 className="animate-spin" size={15} /> : <Download size={15} />}
            Emitir Informe PDF
          </Button>
        </div>
      </div>
    </>
  );

  if (modoPagina) {
    return (
      <div className="bg-surface rounded-md border border-neutral/10 w-full flex flex-col overflow-hidden min-h-[80vh]">
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