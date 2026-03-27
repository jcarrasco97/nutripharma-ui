import React from "react";
import {
  Plus,
  Mail,
  Lock,
  User,
  FileText,
  Clock,
  MapPin,
  Loader2,
  Car,
} from "lucide-react";

const FormularioAdministracion = ({
  pestana,
  formData,
  setFormData,
  farmacias,
  enviando,
  handleChange,
  handleCrear,
  handleToggleFarmacia,
  handleCambiarKilometros,
}) => {
  return (
    <div className="bg-[#062e3a] rounded-3xl p-6 text-white shadow-xl h-fit xl:sticky xl:top-6 border border-[#342c1e]/30">
      <div className="flex items-center gap-3 mb-6">
        <div className="bg-[#b1cb0c]/20 p-2 rounded-xl">
          <Plus size={20} className="text-[#bed000]" />
        </div>
        <h3 className="text-xl font-black text-white">Crear Registro</h3>
      </div>

      <form onSubmit={handleCrear} className="space-y-4">
        {pestana !== "productos" && (
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-[#bed000] uppercase border-b border-[#342c1e]/50 pb-2 tracking-widest">
              1. Credenciales
            </h4>
            <div className="relative">
              <Mail
                size={16}
                className="absolute left-3 top-3.5 text-gray-400"
              />
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                placeholder="Correo electrónico"
                className="w-full bg-[#062e3a]/50 border border-[#342c1e]/30 rounded-xl pl-10 pr-4 py-3 text-sm text-white focus:ring-2 focus:ring-[#b1cb0c] outline-none transition-all"
              />
            </div>
            <div className="relative">
              <Lock
                size={16}
                className="absolute left-3 top-3.5 text-gray-400"
              />
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                placeholder="Contraseña temporal"
                className="w-full bg-[#062e3a]/50 border border-[#342c1e]/30 rounded-xl pl-10 pr-4 py-3 text-sm text-white focus:ring-2 focus:ring-[#b1cb0c] outline-none transition-all"
              />
            </div>
          </div>
        )}

        <div className="space-y-3 pt-2">
          <h4 className="text-xs font-bold text-[#bed000] uppercase border-b border-[#342c1e]/50 pb-2 tracking-widest">
            {pestana === "productos"
              ? "Datos del Producto"
              : "2. Perfil Laboral"}
          </h4>

          {pestana !== "productos" && (
            <div className="relative">
              <User
                size={16}
                className="absolute left-3 top-3.5 text-gray-400"
              />
              <input
                type="text"
                name="nombre"
                value={formData.nombre}
                onChange={handleChange}
                required
                placeholder={
                  pestana === "nutricionistas"
                    ? "Nombre de la empleada"
                    : "Nombre de la Farmacia"
                }
                className="w-full bg-[#062e3a]/50 border border-[#342c1e]/30 rounded-xl pl-10 pr-4 py-3 text-sm text-white focus:ring-2 focus:ring-[#b1cb0c] outline-none transition-all"
              />
            </div>
          )}

          {pestana === "nutricionistas" && (
            <>
              <input
                type="text"
                name="apellidos"
                value={formData.apellidos}
                onChange={handleChange}
                required
                placeholder="Apellidos"
                className="w-full bg-[#062e3a]/50 border border-[#342c1e]/30 rounded-xl px-4 py-3 text-sm text-white focus:ring-2 focus:ring-[#b1cb0c] outline-none transition-all"
              />
              <div className="relative">
                <FileText // (Puedes cambiar el icono por <Phone size={16} ... /> si lo importas de lucide-react)
                  size={16}
                  className="absolute left-3 top-3.5 text-gray-400"
                />
                <input
                  type="text"
                  name="telefono"
                  value={formData.telefono}
                  onChange={handleChange}
                  required
                  placeholder="Teléfono corporativo"
                  className="w-full bg-[#062e3a]/50 border border-[#342c1e]/30 rounded-xl pl-10 pr-4 py-3 text-sm text-white focus:ring-2 focus:ring-[#b1cb0c] outline-none transition-all"
                />
              </div>
              <div className="relative">
                <Clock
                  size={16}
                  className="absolute left-3 top-3.5 text-gray-400"
                />
                <input
                  type="number"
                  name="horasContratoMensual"
                  value={formData.horasContratoMensual}
                  onChange={handleChange}
                  required
                  min="1"
                  max="160"
                  placeholder="Horas mensuales"
                  className="w-full bg-[#062e3a]/50 border border-[#342c1e]/30 rounded-xl pl-10 pr-4 py-3 text-sm text-white focus:ring-2 focus:ring-[#b1cb0c] outline-none transition-all"
                />
              </div>

              <div className="space-y-3 mt-4">
                <h4 className="text-xs font-bold text-[#bed000] uppercase border-b border-[#342c1e]/50 pb-2 tracking-widest">
                  3. Asignación y Distancia
                </h4>
                <div className="max-h-56 overflow-y-auto space-y-2 p-2 bg-white/5 rounded-xl custom-scrollbar border border-white/10">
                  {farmacias.map((farmacia) => {
                    const asignacionInfo = formData.asignaciones.find(
                      (a) => a.farmaciaId === farmacia.id,
                    );
                    const isChecked = !!asignacionInfo;
                    return (
                      <div
                        key={farmacia.id}
                        className={`flex flex-col p-2 rounded-lg transition-colors ${isChecked ? "bg-[#b1cb0c]/20 border border-[#b1cb0c]/50" : "bg-transparent border border-transparent"}`}
                      >
                        <label className="flex items-center gap-3 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={(e) =>
                              handleToggleFarmacia(
                                farmacia.id,
                                e.target.checked,
                                false,
                              )
                            }
                            className="w-4 h-4 rounded text-[#b1cb0c] bg-[#062e3a] border-gray-600 focus:ring-[#b1cb0c]"
                          />
                          <span className="text-sm font-bold text-gray-200">
                            {farmacia.nombre}
                          </span>
                        </label>
                        {isChecked && (
                          <div className="mt-2 pl-7 flex items-center gap-2 animate-fade-in">
                            <Car size={14} className="text-gray-400" />
                            <input
                              type="number"
                              min="0"
                              value={asignacionInfo.kilometros}
                              onChange={(e) =>
                                handleCambiarKilometros(
                                  farmacia.id,
                                  e.target.value,
                                  false,
                                )
                              }
                              className="w-16 p-1 text-sm bg-[#062e3a] text-white border border-[#342c1e] rounded-md focus:ring-2 focus:ring-[#b1cb0c] outline-none text-center"
                              placeholder="Km"
                              required
                            />
                            <span className="text-xs font-bold text-[#b1cb0c]/80">
                              Km totales
                            </span>
                          </div>
                        )}
                      </div>
                    );
                  })}
                  {farmacias.length === 0 && (
                    <p className="text-xs text-gray-400 text-center py-2">
                      No hay farmacias disponibles.
                    </p>
                  )}
                </div>
              </div>
            </>
          )}

          {pestana === "farmacias" && (
            <>
              <div className="relative">
                <input
                  type="text"
                  name="cif"
                  value={formData.cif}
                  onChange={handleChange}
                  required
                  placeholder="CIF de la Farmacia"
                  className="w-full bg-[#062e3a]/50 border border-[#342c1e]/30 rounded-xl px-4 py-3 text-sm text-white focus:ring-2 focus:ring-[#b1cb0c] outline-none transition-all"
                />
              </div>
              <input
                type="text"
                name="direccion"
                value={formData.direccion}
                onChange={handleChange}
                required
                placeholder="Dirección completa"
                className="w-full bg-[#062e3a]/50 border border-[#342c1e]/30 rounded-xl px-4 py-3 text-sm text-white focus:ring-2 focus:ring-[#b1cb0c] outline-none transition-all"
              />
              <div className="pt-4">
                <label className="flex items-center gap-3 p-4 bg-[#b1cb0c]/10 border border-[#b1cb0c]/30 rounded-xl cursor-pointer transition-all">
                  <input
                    type="checkbox"
                    checked={formData.esProvinciaLocal}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        esProvinciaLocal: e.target.checked,
                      })
                    }
                    className="w-5 h-5 rounded text-[#367933] focus:ring-[#367933]"
                  />
                  <div className="flex flex-col">
                    <span className="text-sm font-bold text-white flex items-center gap-2">
                      <MapPin size={14} className="text-[#bed000]" /> Almería
                      (PVF)
                    </span>
                  </div>
                </label>
              </div>
              <div className="relative mt-2">
                <label className="block text-[10px] font-black text-gray-400 uppercase mb-1 tracking-widest">
                  Comisión para la Farmacia
                </label>
                <input
                  type="number"
                  name="porcentajeComision"
                  value={formData.porcentajeComision}
                  onChange={handleChange}
                  required
                  min="0"
                  max="100"
                  step="0.1"
                  placeholder="Comisión (%)"
                  className="w-full bg-[#062e3a]/50 border border-[#342c1e]/30 rounded-xl px-4 py-3 text-sm text-white font-bold focus:ring-2 focus:ring-[#b1cb0c] outline-none transition-all"
                />
                <span className="absolute right-4 top-7 text-gray-400 font-bold">
                  %
                </span>
              </div>
            </>
          )}

          {pestana === "productos" && (
            <>
              <input
                type="text"
                name="nombreProducto"
                value={formData.nombreProducto}
                onChange={handleChange}
                required
                placeholder="Nombre (Ej: Batido Vainilla)"
                className="w-full bg-[#062e3a]/50 border border-[#342c1e]/30 rounded-xl px-4 py-3 text-sm text-white focus:ring-2 focus:ring-[#b1cb0c] outline-none transition-all"
              />
              <div className="flex gap-2">
                <input
                  type="text"
                  name="acronimo"
                  value={formData.acronimo}
                  onChange={handleChange}
                  required
                  placeholder="Acrónimo"
                  className="w-full bg-[#062e3a]/50 border border-[#342c1e]/30 rounded-xl px-4 py-3 text-sm text-white focus:ring-2 focus:ring-[#b1cb0c] outline-none transition-all"
                />
                <select
                  name="categoria"
                  value={formData.categoria}
                  onChange={handleChange}
                  className="w-full bg-[#062e3a]/50 border border-[#342c1e]/30 rounded-xl px-4 py-3 text-sm text-white focus:ring-2 focus:ring-[#b1cb0c] outline-none transition-all"
                >
                  <option value="PEQUENO">PEQUEÑO</option>
                  <option value="GRANDE">GRANDE</option>
                </select>
              </div>
              <input
                type="text"
                name="referencia"
                value={formData.referencia}
                onChange={handleChange}
                required
                placeholder="Referencia / SKU"
                className="w-full bg-[#062e3a]/50 border border-[#342c1e]/30 rounded-xl px-4 py-3 text-sm text-white focus:ring-2 focus:ring-[#b1cb0c] outline-none transition-all"
              />
              <div className="flex gap-2">
                <input
                  type="number"
                  step="0.01"
                  name="pvf"
                  value={formData.pvf}
                  onChange={handleChange}
                  required
                  placeholder="PVF (€)"
                  className="w-full bg-[#062e3a]/50 border border-[#342c1e]/30 rounded-xl px-4 py-3 text-sm text-white focus:ring-2 focus:ring-[#b1cb0c] outline-none transition-all"
                />
                <input
                  type="number"
                  step="0.01"
                  name="pvp"
                  value={formData.pvp}
                  onChange={handleChange}
                  required
                  placeholder="PVP (€)"
                  className="w-full bg-[#062e3a]/50 border border-[#342c1e]/30 rounded-xl px-4 py-3 text-sm text-white focus:ring-2 focus:ring-[#b1cb0c] outline-none transition-all"
                />
              </div>
            </>
          )}
        </div>

        <button
          type="submit"
          disabled={enviando}
          className="w-full bg-[#367933] hover:bg-[#006633] text-white font-bold py-3 rounded-xl mt-4 flex justify-center items-center shadow-lg shadow-[#367933]/20 transition-all active:scale-[0.98]"
        >
          {enviando ? (
            <Loader2 className="animate-spin" size={20} />
          ) : (
            "Registrar Datos"
          )}
        </button>
      </form>
    </div>
  );
};

export default FormularioAdministracion;
