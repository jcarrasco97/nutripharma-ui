import React from "react";
import { Wallet, Banknote, Check, Info } from "lucide-react";

const TarjetaMonedero = ({ saldoRestante, umbralAlcanzado, totalReal }) => (
  <div
    className={`relative overflow-hidden rounded-[2.5rem] p-8 text-white shadow-xl ${umbralAlcanzado ? "bg-gradient-to-r from-[#006633] to-[#68b54e]" : "bg-gradient-to-r from-[#062e3a] to-[#342c1e]"}`}
  >
    <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-6">
      <div className="flex items-center gap-5">
        <div className="bg-white/20 p-4 rounded-[1.5rem] backdrop-blur-md">
          <Wallet size={36} />
        </div>
        <div>
          <p className="text-[#bed000] text-xs font-black uppercase tracking-widest mb-1">
            Monedero Farmacia
          </p>
          <p className="text-5xl font-black">{saldoRestante.toFixed(2)}€</p>
        </div>
      </div>
      {umbralAlcanzado ? (
        <div className="bg-[#b1cb0c]/20 border border-[#b1cb0c]/30 px-6 py-3 rounded-2xl flex items-center gap-3">
          <Check className="text-[#b1cb0c]" size={20} strokeWidth={4} />
          <p className="text-sm font-black uppercase text-[#b1cb0c]">
            Saldo Desbloqueado
          </p>
        </div>
      ) : (
        <div className="text-right">
          <div className="bg-white/10 px-6 py-3 rounded-2xl mb-2">
            <p className="text-xs font-bold text-white/80">
              Faltan{" "}
              <span className="text-white font-black">
                {(80 - totalReal).toFixed(2)}€
              </span>{" "}
              para usar saldo
            </p>
          </div>
          <div className="w-48 bg-white/10 h-1.5 rounded-full">
            <div
              className="bg-[#b1cb0c] h-full rounded-full transition-all"
              style={{ width: `${(totalReal / 80) * 100}%` }}
            ></div>
          </div>
        </div>
      )}
    </div>
    <Banknote
      size={200}
      className="absolute -right-10 -bottom-20 text-white opacity-10 rotate-12"
    />
  </div>
);

export default TarjetaMonedero;
