import React from "react";
import { X, Clock, ShieldCheck } from "lucide-react";

const ModalVerEvidencia = ({ urlEvidencia, fechaConsulta, evidenciaFecha, onClose }) => {
  if (!urlEvidencia) return null;

  // Formateadores de fecha nativos de JS para no depender de librerías externas
  const formatFecha = (isoString) => {
    if (!isoString) return "Desconocida";
    return new Date(isoString).toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric' });
  };
  const formatFechaHora = (isoString) => {
    if (!isoString) return "Pendiente";
    return new Date(isoString).toLocaleString('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-[#062e3a]/90 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-4xl max-h-[90vh] flex flex-col items-center justify-center">
        {/* Botón Cerrar flotante */}
        <button
          onClick={onClose}
          className="absolute -top-12 right-0 md:-right-12 text-white/70 hover:text-white transition-colors bg-black/20 p-2 rounded-full hover:bg-black/40 z-10"
          title="Cerrar imagen"
        >
          <X size={32} />
        </button>

        {/* La Foto de la Evidencia */}
        <img
          src={urlEvidencia}
          alt="Evidencia del Turno"
          className="max-w-full max-h-[75vh] object-contain rounded-xl shadow-2xl"
        />

        {/* 👇 Panel de Certificación Temporal 👇 */}
        <div className="mt-4 bg-white p-4 rounded-xl shadow-lg w-full max-w-md border border-[#bed000] flex flex-col gap-2">
          <div className="flex items-center gap-2 text-[#367933] border-b border-gray-100 pb-2">
            <ShieldCheck size={18} />
            <h4 className="text-sm font-black uppercase tracking-widest">Trazabilidad de la Prueba</h4>
          </div>
          
          <div className="flex justify-between items-center text-sm font-bold mt-1">
            <span className="text-gray-500 flex items-center gap-1"><Clock size={14}/> Fecha de Jornada:</span>
            <span className="text-[#062e3a]">{formatFecha(fechaConsulta)}</span>
          </div>
          
          <div className="flex justify-between items-center text-sm font-bold">
            <span className="text-gray-500 flex items-center gap-1"><Clock size={14}/> Momento de Subida:</span>
            <span className="text-[#b1cb0c]">{formatFechaHora(evidenciaFecha)}</span>
          </div>
        </div>

      </div>
    </div>
  );
};

export default ModalVerEvidencia;