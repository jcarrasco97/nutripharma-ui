import React from "react";
import { X } from "lucide-react";

const ModalVerEvidencia = ({ urlEvidencia, onClose }) => {
  if (!urlEvidencia) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-[#062e3a]/90 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-4xl max-h-[90vh] flex flex-col items-center justify-center">
        {/* Botón Cerrar flotante */}
        <button
          onClick={onClose}
          className="absolute -top-12 right-0 md:-right-12 text-white/70 hover:text-white transition-colors bg-black/20 p-2 rounded-full hover:bg-black/40"
          title="Cerrar imagen"
        >
          <X size={32} />
        </button>

        {/* La Foto de la Evidencia */}
        <img
          src={urlEvidencia}
          alt="Evidencia del Turno"
          className="max-w-full max-h-[85vh] object-contain rounded-xl shadow-2xl"
        />
      </div>
    </div>
  );
};

export default ModalVerEvidencia;
