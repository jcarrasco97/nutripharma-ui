import React, { useState, useRef } from "react";
import { X, FileText, Download, BarChart3, Loader2, CheckCircle2 } from "lucide-react";
import { dashboardService } from "../../services/dashboardService";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend } from "recharts";
import html2canvas from "html2canvas";

const CustomTooltipProductos = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-white p-4 rounded-xl shadow-lg border border-gray-100 min-w-[200px]">
        <p className="font-black text-[#062e3a] mb-3 border-b pb-2">{label}</p>
        <p className="text-sm mb-1 text-gray-600">Unidades: <span className="font-black text-black">{data.cantidadVendida}</span></p>
        <p className="text-sm mb-1 text-[#367933] font-bold">Total PVF: {data.ingresosGeneradosPvf?.toFixed(2)} €</p>
        <p className="text-sm mb-2 text-[#062e3a] font-bold">Total PVP: {data.ingresosPotencialesPvp?.toFixed(2)} €</p>
        <p className="text-xs text-gray-400 border-t pt-2">PVF/ud: {data.precioVentaFarmacia?.toFixed(2)}€ | PVP/ud: {data.precioVentaPublico?.toFixed(2)}€</p>
      </div>
    );
  }
  return null;
};

const CustomTooltipClinico = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-white p-4 rounded-xl shadow-lg border border-gray-100 min-w-[220px]">
        <p className="font-black text-[#062e3a] mb-3 border-b pb-2">{label}</p>
        <div className="space-y-1 mb-3">
          <p className="text-xs font-bold text-gray-400 uppercase">Volumen de Trabajo</p>
          <p className="text-sm">Nuevas: <span className="font-black">{data.nuevas}</span></p>
          <p className="text-sm">Revisiones: <span className="font-black">{data.revisiones}</span></p>
          <p className="text-sm text-blue-600">Promo: <span className="font-black">{data.promocionales}</span></p>
          <p className="text-sm text-purple-600">Personal: <span className="font-black">{data.personal}</span></p>
        </div>
        <div className="border-t pt-2">
          <p className="text-xs font-bold text-[#367933] uppercase">Ingreso Generado</p>
          <p className="text-lg font-black text-[#367933]">{data.ingresosGenerados?.toFixed(2)} €</p>
        </div>
      </div>
    );
  }
  return null;
};

const ModalGeneradorInformes = ({ isOpen, onClose, farmacias = [], nutricionistas = [] }) => {
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
  const chartRef = useRef(null);

  if (!isOpen) return null;

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
      // Configuramos html2canvas para alta calidad
      const canvas = await html2canvas(container, {
        backgroundColor: "#ffffff",
        scale: 2, // Doble resolución para que no se vea pixelado en el PDF
        logging: false,
        useCORS: true, // Por si hay imágenes externas
        onclone: (clonedDoc) => {
          // Aseguramos que el clon sea visible para la captura
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

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-[#062e3a]/60 backdrop-blur-sm">
      <div className="bg-white rounded-[2.5rem] shadow-2xl max-w-6xl w-full max-h-[90vh] flex flex-col overflow-hidden">

        <div className="bg-[#062e3a] p-6 text-white flex justify-between items-center shrink-0">
          <div className="flex items-center gap-3">
            <div className="bg-white/10 p-2 rounded-xl"><FileText size={24} className="text-[#bed000]" /></div>
            <div>
              <h2 className="text-xl font-black">Centro de Análisis y Reportes</h2>
              <p className="text-white/60 text-xs font-bold uppercase tracking-widest mt-1">Generador Multidimensional</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-colors text-white/70 hover:text-white"><X size={24} /></button>
        </div>

        <div className="flex flex-col md:flex-row flex-1 overflow-hidden">
          <div className="w-full md:w-80 bg-gray-50 p-6 border-r border-gray-100 overflow-y-auto shrink-0 custom-scrollbar">
            <div className="space-y-6">
              <div>
                <label className="block text-[10px] font-black text-[#342c1e] uppercase tracking-widest mb-2">Dimensión del Análisis</label>
                <select name="tipo" value={filtros.tipo} onChange={handleChange} className="w-full p-3 bg-white border border-gray-200 rounded-xl text-sm font-bold text-[#062e3a] outline-none focus:border-[#367933]">
                  <option value="PRODUCTOS">Rendimiento de Productos</option>
                  <option value="FACTURACION">Facturación Global (Mensual)</option>
                  <option value="CLINICO">Análisis Clínico (Por Farmacia)</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-black text-[#342c1e] uppercase tracking-widest mb-2">Desde (Año)</label>
                  <select name="anioInicio" value={filtros.anioInicio} onChange={handleChange} className="w-full p-3 bg-white border border-gray-200 rounded-xl text-sm font-bold text-[#062e3a]">
                    {[...Array(5)].map((_, i) => <option key={i} value={new Date().getFullYear() - i}>{new Date().getFullYear() - i}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-black text-[#342c1e] uppercase tracking-widest mb-2">Hasta (Año)</label>
                  <select name="anioFin" value={filtros.anioFin} onChange={handleChange} disabled={filtros.tipo === "FACTURACION"} className="w-full p-3 bg-white border border-gray-200 rounded-xl text-sm font-bold text-[#062e3a] disabled:opacity-30">
                    {[...Array(5)].map((_, i) => <option key={i} value={new Date().getFullYear() - i}>{new Date().getFullYear() - i}</option>)}
                  </select>
                </div>
              </div>

              {filtros.tipo !== "FACTURACION" && (
                <div>
                  <label className="block text-[10px] font-black text-[#342c1e] uppercase tracking-widest mb-2">Filtro de Mes</label>
                  <select name="mes" value={filtros.mes} onChange={handleChange} className="w-full p-3 bg-white border border-gray-200 rounded-xl text-sm font-bold text-[#062e3a]">
                    <option value="">Año Completo</option>
                    {Array.from({ length: 12 }, (_, i) => i + 1).map(m => <option key={m} value={m}>{new Date(2000, m - 1).toLocaleString('es-ES', { month: 'long' }).toUpperCase()}</option>)}
                  </select>
                </div>
              )}

              <div className="space-y-1">
                <label className="block text-[10px] font-black text-[#342c1e] uppercase tracking-widest mb-2">Entidades</label>
                <select name="nutricionistaId" value={filtros.nutricionistaId} onChange={handleChange} className="w-full p-3 bg-white border border-gray-200 rounded-xl text-sm font-bold text-[#062e3a] mb-2">
                  <option value="">Cualquier Nutricionista</option>
                  {nutricionistas.map(n => <option key={n.id} value={n.id}>{n.nombre} {n.apellidos}</option>)}
                </select>
                {filtros.tipo !== "CLINICO" && (
                  <select name="farmaciaId" value={filtros.farmaciaId} onChange={handleChange} className="w-full p-3 bg-white border border-gray-200 rounded-xl text-sm font-bold text-[#062e3a]">
                    <option value="">Cualquier Farmacia</option>
                    {farmacias.map(f => <option key={f.id} value={f.id}>{f.nombre}</option>)}
                  </select>
                )}
              </div>

              {filtros.tipo === "CLINICO" && (
                <div className="bg-white p-4 rounded-2xl border border-gray-100 space-y-3">
                  <label className="block text-[10px] font-black text-[#342c1e] uppercase tracking-widest">Métricas de Volumen</label>
                  <label className="flex items-center gap-3 cursor-pointer group">
                    <input type="checkbox" name="incluirPromo" checked={filtros.incluirPromo} onChange={handleChange} className="w-4 h-4 rounded border-gray-300 text-[#367933] focus:ring-[#367933]" />
                    <span className="text-xs font-bold text-gray-600 group-hover:text-[#062e3a]">Consultas Promocionales</span>
                  </label>
                  <label className="flex items-center gap-3 cursor-pointer group">
                    <input type="checkbox" name="incluirPers" checked={filtros.incluirPers} onChange={handleChange} className="w-4 h-4 rounded border-gray-300 text-[#367933] focus:ring-[#367933]" />
                    <span className="text-xs font-bold text-gray-600 group-hover:text-[#062e3a]">Consultas Personal</span>
                  </label>
                </div>
              )}

              <button onClick={handlePreview} disabled={loadingPreview} className="w-full mt-4 py-4 bg-[#b1cb0c]/20 text-[#367933] font-black rounded-2xl hover:bg-[#b1cb0c]/30 flex justify-center items-center gap-2 border border-[#b1cb0c]/30 transition-all active:scale-95">
                {loadingPreview ? <Loader2 className="animate-spin" size={18} /> : <BarChart3 size={18} />} Cargar Análisis
              </button>
            </div>
          </div>

          <div className="flex-1 p-8 flex flex-col bg-white overflow-hidden">
            <div className="flex justify-between items-end mb-6">
              <div className="flex flex-col items-start gap-2">
                <h3 className="text-xl font-black text-[#062e3a]">Previsualización Operativa</h3>
                {fullReport?.desglosesPorAnio?.length > 1 && (
                  <select onChange={(e) => setYearData(e.target.value)} className="p-2 border border-[#367933]/30 rounded-xl text-xs font-bold bg-[#f4f7f4] text-[#062e3a] outline-none">
                    <option value="TOTAL">Total del Rango ({filtros.anioInicio} - {filtros.anioFin})</option>
                    {fullReport.desglosesPorAnio.map(d => (
                      <option key={d.anio} value={d.anio}>Desglose Año {d.anio}</option>
                    ))}
                  </select>
                )}
              </div>
              {previewData.length > 0 && <span className="text-[10px] font-black text-[#367933] bg-[#b1cb0c]/20 px-3 py-1 rounded-full uppercase">{previewData.length} registros encontrados</span>}
            </div>

            <div ref={chartRef} className="flex-1 min-h-[400px] flex items-center justify-center">
              {loadingPreview ? <Loader2 className="animate-spin text-gray-200" size={64} /> : previewData.length > 0 ? (
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
                    <BarChart
                      data={previewData}
                      margin={{ top: 20, right: 30, left: 20, bottom: 70 }} // <--- Aumentar el bottom
                    >
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
                  <div className="bg-gray-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 border border-gray-100">
                    <BarChart3 size={32} className="text-gray-300" />
                  </div>
                  <p className="font-bold text-gray-400">Selecciona los parámetros y el tipo de informe para generar la vista previa operativa.</p>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="p-6 bg-gray-50 border-t border-gray-100 flex justify-between items-center shrink-0">
          <div className="flex items-center gap-2 text-gray-400">
            <CheckCircle2 size={16} />
            <span className="text-[10px] font-bold uppercase tracking-wider">Cumple con normativas de auditoría interna</span>
          </div>
          <button
            onClick={handleDownloadPdf}
            disabled={loadingPdf || previewData.length === 0}
            className="py-4 px-10 bg-[#367933] text-white font-black rounded-2xl hover:bg-[#006633] flex items-center gap-3 transition-all disabled:bg-gray-300 shadow-xl shadow-[#367933]/20 active:scale-95"
          >
            {loadingPdf ? <Loader2 className="animate-spin" size={20} /> : <Download size={20} />}
            Emitir Informe Oficial PDF
          </button>
        </div>
      </div>
    </div>
  );
};
export default ModalGeneradorInformes;