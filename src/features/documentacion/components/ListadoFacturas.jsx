import React, { useState, useEffect, useCallback } from "react";
import { Download, FileSpreadsheet, Loader2, Search, Trash2 } from "lucide-react";
import { facturasService } from "../services/facturasService";
import { obtenerUltimos6Meses } from "../utils/mesesHelper";

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
    <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-100">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6 pb-4 border-b border-gray-100">
        <div className="flex items-center gap-4">
          <div className="bg-[#b1cb0c]/20 p-3 rounded-2xl text-[#bed000]">
            <FileSpreadsheet size={24} />
          </div>
          <h2 className="text-xl font-black text-[#062e3a]">
            {esAdmin ? "Auditoría de Gastos / Kilometraje" : "Historial de mis Gastos / Kilometraje"}
          </h2>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <select 
          value={filtroMes} 
          onChange={(e) => setFiltroMes(e.target.value)}
          className="bg-[#f4f7f4] border-2 border-transparent focus:border-[#b1cb0c] rounded-2xl px-4 py-3 text-[#062e3a] font-bold outline-none min-w-[200px]"
        >
          <option value="TODOS">Todos los Meses</option>
          {meses.map(m => <option key={m} value={m}>{m}</option>)}
        </select>
        
        {esAdmin && (
          <div className="relative flex-1">
            <Search size={20} className="absolute left-4 top-3.5 text-[#367933]" />
            <input 
              type="text" 
              placeholder="Buscar Nutricionista por nombre..." 
              value={filtroNutri}
              onChange={(e) => setFiltroNutri(e.target.value)}
              className="w-full bg-[#f4f7f4] border-2 border-transparent rounded-2xl pl-12 pr-4 py-3 text-sm text-[#062e3a] font-bold outline-none focus:border-[#b1cb0c]"
            />
          </div>
        )}
      </div>

      {cargando ? (
        <div className="flex justify-center p-10"><Loader2 className="animate-spin text-[#367933]" size={30}/></div>
      ) : filtradas.length === 0 ? (
        <p className="text-center text-gray-500 py-10 font-medium">No se han encontrado facturas.</p>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {filtradas.map(f => (
            <div key={f.id} className="border border-gray-100 bg-[#f4f7f4]/50 p-5 rounded-2xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4 hover:border-[#b1cb0c] transition-colors">
              <div>
                <span className="bg-[#b1cb0c] text-[#062e3a] px-3 py-1 rounded-full text-[10px] font-black uppercase mb-2 inline-block shadow-sm">{f.mesCorresponde}</span>
                <p className="font-bold text-[#062e3a] truncate w-64 md:w-48" title={f.nombreArchivo}>{f.nombreArchivo}</p>
                <div className="flex text-xs text-[#342c1e]/60 font-medium mt-1 gap-3">
                  <span>Subido: {new Date(f.fechaSubida).toLocaleDateString()}</span>
                  {esAdmin && <span className="font-bold text-[#367933]">{f.nutricionista?.nombre} {f.nutricionista?.apellidos}</span>}
                </div>
              </div>
              <div className="flex items-center gap-2">
                {esAdmin && (
                  <button 
                    onClick={() => handleBorrarFactura(f.id)}
                    disabled={borrandoId === f.id}
                    className="p-3 bg-red-50 text-red-600 rounded-xl hover:bg-red-600 hover:text-white transition-colors active:scale-95 flex-shrink-0 disabled:opacity-50"
                    title="Eliminar Factura"
                  >
                    {borrandoId === f.id ? <Loader2 size={18} className="animate-spin" /> : <Trash2 size={18} />}
                  </button>
                )}
                <button 
                  onClick={() => facturasService.descargarFactura(f.id, f.nombreArchivo)}
                  className="p-3 bg-[#062e3a] text-white rounded-xl hover:bg-[#041d25] transition-colors active:scale-95 flex-shrink-0"
                  title="Descargar Factura"
                >
                  <Download size={18} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ListadoFacturas;
