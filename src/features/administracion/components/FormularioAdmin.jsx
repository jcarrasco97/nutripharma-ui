import React from "react";
import { Plus, Mail, Lock, User, Loader2 } from "lucide-react";

const FormularioAdmin = ({ formData, handleChange, handleCrear, enviando }) => {
  return (
    <div className="bg-white rounded-3xl border border-gray-100 p-6 shadow-sm h-fit xl:sticky xl:top-6">
      <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-100">
        <div className="bg-[#b1cb0c]/20 p-2 rounded-xl">
          <Plus size={20} className="text-[#367933]" />
        </div>
        <h3 className="text-lg font-black text-[#062e3a]">Dar de Alta Admin</h3>
      </div>

      <form onSubmit={handleCrear} className="space-y-4">
        <div className="relative">
          <Mail size={16} className="absolute left-4 top-3.5 text-gray-400" />
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            placeholder="Correo corporativo"
            className="w-full bg-[#f4f7f4] border border-gray-200 rounded-xl pl-11 pr-4 py-3 text-sm focus:ring-2 focus:ring-[#b1cb0c] outline-none text-[#062e3a]"
          />
        </div>
        <div className="relative">
          <Lock size={16} className="absolute left-4 top-3.5 text-gray-400" />
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
            placeholder="Contraseña inicial"
            className="w-full bg-[#f4f7f4] border border-gray-200 rounded-xl pl-11 pr-4 py-3 text-sm focus:ring-2 focus:ring-[#b1cb0c] outline-none text-[#062e3a]"
          />
        </div>
        <div className="relative">
          <User size={16} className="absolute left-4 top-3.5 text-gray-400" />
          <input
            type="text"
            name="nombre"
            value={formData.nombre}
            onChange={handleChange}
            required
            placeholder="Nombre"
            className="w-full bg-[#f4f7f4] border border-gray-200 rounded-xl pl-11 pr-4 py-3 text-sm focus:ring-2 focus:ring-[#b1cb0c] outline-none text-[#062e3a]"
          />
        </div>
        <input
          type="text"
          name="apellidos"
          value={formData.apellidos}
          onChange={handleChange}
          required
          placeholder="Apellidos"
          className="w-full bg-[#f4f7f4] border border-gray-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-[#b1cb0c] outline-none text-[#062e3a]"
        />

        <button
          type="submit"
          disabled={enviando}
          className="w-full bg-[#367933] hover:bg-[#006633] text-white font-black py-4 rounded-xl mt-6 flex justify-center items-center shadow-lg shadow-[#367933]/20 transition-transform hover:scale-[1.02]"
        >
          {enviando ? (
            <Loader2 className="animate-spin" size={20} />
          ) : (
            "Generar Credenciales"
          )}
        </button>
      </form>
    </div>
  );
};

export default FormularioAdmin;
