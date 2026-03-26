import React from "react";
import { Wallet, ShoppingBag, Package } from "lucide-react";

const FarmaciaCabeceraSaldo = ({ perfil, cambiarVista }) => (
  <div className="bg-gradient-to-r from-[#006633] to-[#68b54e] rounded-3xl p-8 text-white shadow-lg flex flex-col md:flex-row justify-between items-center gap-6 relative overflow-hidden">
    <div className="relative z-10 w-full md:w-auto">
      <h2 className="text-2xl font-black mb-1 opacity-90">Bienvenido,</h2>
      <h3 className="text-3xl font-black mb-6">{perfil.nombre}</h3>
      <p className="text-[#bed000] text-sm font-bold uppercase tracking-wide mb-1 flex items-center gap-2">
        <Wallet size={16} /> Saldo Virtual Disponible
      </p>
      <p className="text-5xl font-black text-white">
        {(perfil.saldoVirtual || 0).toFixed(2)}€
      </p>
    </div>

    <div className="relative z-10 w-full md:w-auto flex flex-col gap-3">
      <button
        onClick={() => cambiarVista("pedidos")}
        className="bg-white text-[#367933] hover:bg-[#f4f7f4] font-black py-4 px-8 rounded-2xl flex items-center justify-center gap-3 transition-all shadow-xl hover:scale-105"
      >
        <ShoppingBag size={24} /> Hacer Nuevo Pedido
      </button>
      <p className="text-center text-[#bed000] text-xs font-medium">
        Supera los 80€ para aplicar tu saldo
      </p>
    </div>
    <Package
      size={250}
      className="absolute -right-10 -bottom-20 text-white opacity-10"
    />
  </div>
);

export default FarmaciaCabeceraSaldo;
