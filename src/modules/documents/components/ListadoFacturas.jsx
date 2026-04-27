import React, { useState, useEffect, useCallback } from "react";
import { Download, FileSpreadsheet, Loader2, Trash2, FileText } from "lucide-react";
import { facturasService } from "../services/facturasService";
import { obtenerUltimos6Meses } from "@/shared/utils/mesesHelper";
import { Button } from "@/shared/components/ui/Button";
import { Badge } from "@/shared/components/ui/Badge";
import PanelRepositorio from "@/shared/components/PanelRepositorio";
import { toast } from "sonner";

const ListadoFacturas = ({ esAdmin, forceUpdate }) => {
  const [facturas, setFacturas] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [filtroMes, setFiltroMes] = useState("TODOS");
  const [filtroNutri, setFiltroNutri] = useState("");
  const [borrandoId, setBorrandoId] = useState(null);

  const meses = obtenerUltimos6Meses();

  const cargarListado = useCallback(async () => {
    setCargando(true);
    try {
      const data = esAdmin
        ? await facturasService.obtenerTodas()
        : await facturasService.obtenerMisFacturas();
      setFacturas(Array.isArray(data) ? data : []);
    } catch (e) {
      console.error(e);
      setFacturas([]);
    } finally {
      setCargando(false);
    }
  }, [esAdmin]);

  useEffect(() => {
    cargarListado();
  }, [cargarListado, forceUpdate]);

  const filtradas = facturas.filter((f) => {
    if (filtroMes !== "TODOS" && f.mesCorresponde !== filtroMes) return false;
    if (esAdmin && filtroNutri) {
      const nom = `${f.nutricionista?.nombre} ${f.nutricionista?.apellidos}`.toLowerCase();
      if (!nom.includes(filtroNutri.toLowerCase())) return false;
    }
    return true;
  });

  const handleBorrarFactura = async (id) => {
    const confirmado = window.confirm(
      "¿Estás seguro de que deseas eliminar esta factura permanentemente? Esta acción no se puede deshacer y borrará el archivo de la nube."
    );
    if (!confirmado) return;
    setBorrandoId(id);
    try {
      await facturasService.eliminarFactura(id);
      setFacturas((prev) => prev.filter((f) => f.id !== id));
    } catch (e) {
      console.error(e);
      toast.error("Error al intentar borrar la factura del servidor.");
    } finally {
      setBorrandoId(null);
    }
  };

  const opcionesMes = [
    { value: "TODOS", label: "Todos los meses" },
    ...meses.map((m) => ({ value: m, label: m })),
  ];

  return (
    <PanelRepositorio
      icono={<FileSpreadsheet size={20} />}
      titulo={esAdmin ? "Auditoría de Gastos / Kilometraje" : "Historial de mis Gastos / Kilometraje"}
      headerClassName="bg-secondary text-surface" // <-- AQUÍ EL CAMBIO DEL HEADER
      filtroPrincipal={filtroMes}
      setFiltroPrincipal={setFiltroMes}
      opcionesFiltro={opcionesMes}
      placeholderFiltro="Todos los meses"
      filtroBusqueda={esAdmin ? filtroNutri : undefined}
      setFiltroBusqueda={esAdmin ? setFiltroNutri : undefined}
      placeholderBusqueda="Buscar nutricionista..."
      items={filtradas}
      cargando={cargando}
      emptyIcon={<FileText size={32} className="text-neutral/30" />}
      emptyTitulo="No se han encontrado facturas."
      renderItem={(f) => (
        <div
          key={f.id}
          className="border border-neutral/10 bg-neutral/5 p-4 rounded-xl flex justify-between items-center gap-4 hover:border-secondary/20 transition-colors"
        >
          <div className="min-w-0 flex-1">
            {/* <-- AQUÍ EL CAMBIO DEL BADGE A SECONDARY --> */}
            <Badge className="bg-secondary text-surface px-2 py-0.5 rounded-full text-[10px] font-black uppercase mb-1.5 inline-block">
              {f.mesCorresponde}
            </Badge>
            <p className="font-bold text-secondary truncate text-sm" title={f.nombreArchivo}>
              {f.nombreArchivo}
            </p>
            <div className="flex text-xs text-neutral/60 font-medium mt-0.5 gap-3">
              <span>Subido: {new Date(f.fechaSubida).toLocaleDateString()}</span>
              {esAdmin && (
                <span className="font-bold text-secondary">
                  {f.nutricionista?.nombre} {f.nutricionista?.apellidos}
                </span>
              )}
            </div>
          </div>
          <div className="flex items-center gap-1 flex-shrink-0">
            {esAdmin && (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => handleBorrarFactura(f.id)}
                disabled={borrandoId === f.id}
                className="rounded-lg text-red-500 hover:bg-red-50 hover:text-red-600"
                title="Eliminar factura"
              >
                {borrandoId === f.id
                  ? <Loader2 size={16} className="animate-spin" />
                  : <Trash2 size={16} />
                }
              </Button>
            )}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => facturasService.descargarFactura(f.id, f.nombreArchivo)}
              className="rounded-lg"
              title="Descargar factura"
            >
              <Download size={16} />
            </Button>
          </div>
        </div>
      )}
    />
  );
};

export default ListadoFacturas;