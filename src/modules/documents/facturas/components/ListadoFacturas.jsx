import React, { useState, useEffect, useCallback } from "react";
import { Download, FileSpreadsheet, Loader2, Search, Trash2 } from "lucide-react";
import { facturasService } from "../services/facturasService";
import { obtenerUltimos6Meses } from "@/shared/utils/mesesHelper";
import { Card, CardHeader, CardContent } from "@/shared/components/ui/Card";
import { Button } from "@/shared/components/ui/Button";
import { Input } from "@/shared/components/ui/Input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/components/ui/Select";
import { Badge } from "@/shared/components/ui/Badge";

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
      let data = [];
      if (esAdmin) {
        data = await facturasService.obtenerTodas();
      } else {
        data = await facturasService.obtenerMisFacturas();
      }
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

  const filtradas = facturas.filter(f => {
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
      alert("Error al intentar borrar la factura del servidor.");
    } finally {
      setBorrandoId(null);
    }
  };

  return (
    <Card className="bg-surface p-8 rounded-[2.5rem] shadow-sm border border-neutral/10">
      <CardHeader className="p-0 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6 pb-4 border-b border-neutral/10">
        <div className="flex items-center gap-4">
          <div className="bg-accent/20 p-3 rounded-2xl text-accent-light">
            <FileSpreadsheet size={24} />
          </div>
          <h2 className="text-xl font-black text-secondary">
            {esAdmin ? "Auditoría de Gastos / Kilometraje" : "Historial de mis Gastos / Kilometraje"}
          </h2>
        </div>
      </CardHeader>

      <CardContent className="p-0">
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="min-w-[200px]">
            <Select value={filtroMes} onValueChange={setFiltroMes}>
              <SelectTrigger className="bg-neutral/5 border-2 border-transparent focus:border-accent rounded-2xl px-4 py-6 text-secondary font-bold outline-none w-full">
                <SelectValue placeholder="Todos los Meses" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="TODOS">Todos los Meses</SelectItem>
                {meses.map(m => <SelectItem key={m} value={m}>{m}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>

          {esAdmin && (
            <div className="relative flex-1">
              <Search size={20} className="absolute left-4 top-4 text-primary" />
              <Input
                type="text"
                placeholder="Buscar Nutricionista por nombre..."
                value={filtroNutri}
                onChange={(e) => setFiltroNutri(e.target.value)}
                className="w-full bg-neutral/5 border-2 border-transparent rounded-2xl pl-12 pr-4 py-6 text-sm text-secondary font-bold focus-visible:border-accent focus-visible:ring-0"
              />
            </div>
          )}
        </div>

        {cargando ? (
          <div className="flex justify-center p-10"><Loader2 className="animate-spin text-primary" size={30} /></div>
        ) : filtradas.length === 0 ? (
          <p className="text-center text-neutral/60 py-10 font-medium">No se han encontrado facturas.</p>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {filtradas.map(f => (
              <div key={f.id} className="border border-neutral/10 bg-neutral/5 p-5 rounded-2xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4 hover:border-accent transition-colors">
                <div>
                  <Badge variant="accent" className="bg-accent text-secondary px-3 py-1 rounded-full text-[10px] font-black uppercase mb-2 inline-block shadow-sm">{f.mesCorresponde}</Badge>
                  <p className="font-bold text-secondary truncate w-64 md:w-48" title={f.nombreArchivo}>{f.nombreArchivo}</p>
                  <div className="flex text-xs text-neutral/60 font-medium mt-1 gap-3">
                    <span>Subido: {new Date(f.fechaSubida).toLocaleDateString()}</span>
                    {esAdmin && <span className="font-bold text-primary">{f.nutricionista?.nombre} {f.nutricionista?.apellidos}</span>}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {esAdmin && (
                    <Button
                      variant="destructive"
                      size="icon"
                      onClick={() => handleBorrarFactura(f.id)}
                      disabled={borrandoId === f.id}
                      className="rounded-xl flex-shrink-0"
                      title="Eliminar Factura"
                    >
                      {borrandoId === f.id ? <Loader2 size={18} className="animate-spin" /> : <Trash2 size={18} />}
                    </Button>
                  )}
                  <Button
                    variant="secondary"
                    size="icon"
                    onClick={() => facturasService.descargarFactura(f.id, f.nombreArchivo)}
                    className="bg-secondary text-surface hover:bg-secondary/90 rounded-xl flex-shrink-0"
                    title="Descargar Factura"
                  >
                    <Download size={18} />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ListadoFacturas;
