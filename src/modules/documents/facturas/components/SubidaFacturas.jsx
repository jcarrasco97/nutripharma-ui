import React, { useState } from "react";
import { UploadCloud, ReceiptText, Check } from "lucide-react";
import { facturasService } from "../services/facturasService";
import { obtenerUltimos6Meses } from "@/shared/utils/mesesHelper";

const SubidaFacturas = ({ onSubidaExitosa }) => {
  const [archivo, setArchivo] = useState(null);
  const [mesCorresponde, setMesCorresponde] = useState(obtenerUltimos6Meses()[0]);
  const [subiendo, setSubiendo] = useState(false);
  const [exito, setExito] = useState(false);

  const meses = obtenerUltimos6Meses();

  const handleSubir = async () => {
    if (!archivo) return;
    setSubiendo(true);
    setExito(false);

    try {
      const formData = new FormData();
      formData.append("archivo", archivo);
      formData.append("mesCorresponde", mesCorresponde);

      await facturasService.subirFactura(formData);
      setExito(true);
      setArchivo(null);
      setTimeout(() => setExito(false), 3000);
      if (onSubidaExitosa) onSubidaExitosa();
    } catch (error) {
      console.error(error);
      alert("Error al subir la factura");
    } finally {
      setSubiendo(false);
    }
  };

  return (
    <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-100 flex flex-col gap-6">
      <div className="flex items-center gap-4 border-b border-gray-100 pb-4">
        <div className="bg-[#f4f7f4] p-3 rounded-2xl text-[#367933]">
          <ReceiptText size={24} />
        </div>
        <div>
          <h2 className="text-xl font-black text-[#062e3a]">Subir Factura de Gastos / Km</h2>
          <p className="text-sm font-medium text-[#342c1e]/70">El sistema renombrará tu archivo automáticamente para cumplir con el estándar: fecha_Km_Nombre_Apellidos</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-end">
        <div>
          <label className="block text-sm font-bold text-[#062e3a] mb-2">Mes al que corresponde la factura</label>
          <select
            value={mesCorresponde}
            onChange={(e) => setMesCorresponde(e.target.value)}
            className="w-full bg-[#f4f7f4] border-2 border-transparent focus:border-[#b1cb0c] rounded-2xl px-4 py-3 text-[#062e3a] font-bold outline-none"
          >
            {meses.map(m => (
              <option key={m} value={m}>{m}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-bold text-[#062e3a] mb-2">Seleccionar Archivo (PDF, JPG, PNG)</label>
          <input
            type="file"
            accept=".pdf,.jpg,.jpeg,.png"
            onChange={(e) => setArchivo(e.target.files[0])}
            className="w-full bg-[#f4f7f4] border-2 border-transparent focus:border-[#b1cb0c] rounded-2xl px-4 py-2.5 text-[#062e3a] font-bold outline-none file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-bold file:bg-[#062e3a] file:text-white hover:file:bg-[#062e3a]/90 file:cursor-pointer"
          />
        </div>
      </div>

      <button
        onClick={handleSubir}
        disabled={!archivo || subiendo}
        className="mt-2 w-full md:w-auto px-10 py-4 bg-[#367933] text-white font-black rounded-2xl hover:bg-[#006633] transition-colors flex items-center justify-center gap-2 self-start disabled:opacity-50"
      >
        {subiendo ? "Subiendo..." : (exito ? <><Check size={20} /> ¡Subida Exitosa!</> : <><UploadCloud size={20} /> Subir Gasto</>)}
      </button>
    </div>
  );
};

export default SubidaFacturas;
