import React from "react";
import { TrendingUp, Car } from "lucide-react";

const PanelCabeceraNutri = ({ perfil, datosResumen, horasContrato }) => (
  <div className="flex-1 bg-gradient-to-r from-[#006633] to-[#68b54e] rounded-3xl p-8 text-white shadow-lg shadow-[#367933]/20 relative overflow-hidden">
    <div className="relative z-10">
      <h2 className="text-3xl font-black mb-2 flex items-center gap-3">
        <TrendingUp size={32} className="text-[#bed000]" /> Hola,{" "}
        {perfil.nombre}
      </h2>
      <p className="text-white/80 font-medium mb-8">
        Tu rendimiento acumulado en {datosResumen.mes} (Contrato:{" "}
        {horasContrato}h/semana)
      </p>
      <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
        <div>
          <p className="text-[#bed000] text-xs font-bold uppercase tracking-wide mb-1">
            Nuevas
          </p>
          <p className="text-3xl font-black">{datosResumen.totalNuevas}</p>
        </div>
        <div>
          <p className="text-[#bed000] text-xs font-bold uppercase tracking-wide mb-1">
            Revisiones
          </p>
          <p className="text-3xl font-black">{datosResumen.totalRevisiones}</p>
        </div>
        <div>
          <p className="text-[#bed000] text-xs font-bold uppercase tracking-wide mb-1">
            Servicios
          </p>
          <p className="text-3xl font-black">
            {datosResumen.facturacionConsultas.toFixed(2)}€
          </p>
        </div>
        <div>
          <p className="text-[#bed000] text-xs font-bold uppercase tracking-wide mb-1">
            Productos
          </p>
          <p className="text-3xl font-black">
            {datosResumen.facturacionProductos.toFixed(2)}€
          </p>
        </div>
        <div className="bg-white/10 p-3 rounded-2xl border border-white/20 backdrop-blur-sm">
          <p className="text-[#bed000] text-xs font-black uppercase tracking-widest mb-1 flex items-center gap-1">
            <Car size={14} /> Distancia
          </p>
          <p className="text-3xl font-black text-white">
            {datosResumen.totalKilometros}{" "}
            <span className="text-lg font-bold opacity-70">km</span>
          </p>
        </div>
      </div>
    </div>
  </div>
);

export default PanelCabeceraNutri;
