import React, { useState, useEffect } from "react";
import {
  Edit, X, Save, Mail, Lock, User, Clock, MapPin,
  Car, Store, Phone, Package, Type, Hash, Tag, Euro, Percent, FileText
} from "lucide-react";

const ModalEdicionAdministracion = ({
  itemEditando,
  setItemEditando,
  pestana,
  handleActualizar,
  farmacias,
  handleToggleFarmacia,
  handleCambiarKilometros,
}) => {
  const [confirmPassword, setConfirmPassword] = useState("");

  // Limpiamos la confirmación si cambiamos de registro
  useEffect(() => {
    setConfirmPassword("");
  }, [itemEditando?.id]);

  if (!itemEditando) return null;

  const passwordMismatch = itemEditando.password && itemEditando.password !== confirmPassword;

  const formValido = () => {
    if (pestana !== "productos" && itemEditando.password && itemEditando.password !== confirmPassword) {
      return false;
    }
    return true;
  };

  const onSubmitWrapper = (e) => {
    e.preventDefault();
    if (!formValido()) return;
    handleActualizar(e, confirmPassword);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#062e3a]/70 backdrop-blur-sm">
      <div className="bg-[#062e3a] rounded-3xl shadow-2xl max-w-md w-full overflow-hidden animate-scale-in border border-[#342c1e]/30">
        <div className="p-6 text-white flex justify-between items-center border-b border-[#342c1e]/30">
          <h3 className="text-xl font-black flex items-center gap-2">
            <Edit size={20} className="text-[#bed000]" /> Edición Completa
          </h3>
          <button
            onClick={() => setItemEditando(null)}
            className="text-white/70 hover:text-[#bed000] transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        <form onSubmit={onSubmitWrapper} className="p-6 space-y-4 max-h-[75vh] overflow-y-auto custom-scrollbar">

          {/* CREDENCIALES (Solo Nutris y Farmacias) */}
          {pestana !== "productos" && (
            <div className="space-y-3">
              <h4 className="text-xs font-bold text-[#bed000] uppercase border-b border-[#342c1e]/50 pb-2 tracking-widest">
                1. Credenciales de Acceso
              </h4>
              <div className="relative">
                <Mail size={16} className="absolute left-3 top-3.5 text-gray-400" />
                <input
                  type="email"
                  value={itemEditando.email || ""}
                  onChange={(e) => setItemEditando({ ...itemEditando, email: e.target.value })}
                  required
                  placeholder="Correo electrónico"
                  className="w-full bg-[#062e3a]/50 border border-[#342c1e]/30 rounded-xl pl-10 pr-4 py-3 text-sm text-white focus:ring-2 focus:ring-[#b1cb0c] outline-none transition-all"
                />
              </div>
              <div className="relative">
                <Lock size={16} className="absolute left-3 top-3.5 text-gray-400" />
                <input
                  type="password"
                  value={itemEditando.password || ""}
                  onChange={(e) => setItemEditando({ ...itemEditando, password: e.target.value })}
                  placeholder="Nueva contraseña (dejar en blanco para no cambiar)"
                  className="w-full bg-[#062e3a]/50 border border-[#342c1e]/30 rounded-xl pl-10 pr-4 py-3 text-sm text-white focus:ring-2 focus:ring-[#b1cb0c] outline-none transition-all"
                />
              </div>
              {itemEditando.password && (
                <div className="relative animate-fade-in">
                  <Lock size={16} className={`absolute left-3 top-3.5 ${passwordMismatch ? 'text-red-400' : 'text-gray-400'}`} />
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    placeholder="Confirmar nueva contraseña"
                    className={`w-full bg-[#062e3a]/50 border ${passwordMismatch ? 'border-red-500 focus:ring-red-500' : 'border-[#342c1e]/30 focus:ring-[#b1cb0c]'} rounded-xl pl-10 pr-4 py-3 text-sm text-white focus:ring-2 outline-none transition-all`}
                  />
                  {passwordMismatch && <p className="text-xs text-red-500 pl-2 mt-1">Las contraseñas no coinciden</p>}
                </div>
              )}
            </div>
          )}

          {/* DATOS ESPECÍFICOS */}
          <div className="space-y-3 pt-2">
            <h4 className="text-xs font-bold text-[#bed000] uppercase border-b border-[#342c1e]/50 pb-2 tracking-widest">
              {pestana === "productos" ? "Datos del Producto" : "2. Perfil Laboral"}
            </h4>

            {pestana === "nutricionistas" && (
              <>
                <div className="relative">
                  <User size={16} className="absolute left-3 top-3.5 text-gray-400" />
                  <input
                    type="text"
                    value={itemEditando.nombre}
                    onChange={(e) => setItemEditando({ ...itemEditando, nombre: e.target.value })}
                    required
                    placeholder="Nombre"
                    className="w-full bg-[#062e3a]/50 border border-[#342c1e]/30 rounded-xl pl-10 pr-4 py-3 text-sm text-white focus:ring-2 focus:ring-[#b1cb0c] outline-none transition-all"
                  />
                </div>
                <div className="relative">
                  <User size={16} className="absolute left-3 top-3.5 text-gray-400" />
                  <input
                    type="text"
                    value={itemEditando.apellidos}
                    onChange={(e) => setItemEditando({ ...itemEditando, apellidos: e.target.value })}
                    required
                    placeholder="Apellidos"
                    className="w-full bg-[#062e3a]/50 border border-[#342c1e]/30 rounded-xl pl-10 pr-4 py-3 text-sm text-white focus:ring-2 focus:ring-[#b1cb0c] outline-none transition-all"
                  />
                </div>
                <div className="relative">
                  <Phone size={16} className="absolute left-3 top-3.5 text-gray-400" />
                  <input
                    type="text"
                    value={itemEditando.telefono || ""}
                    onChange={(e) => setItemEditando({ ...itemEditando, telefono: e.target.value })}
                    placeholder="Teléfono corporativo"
                    className="w-full bg-[#062e3a]/50 border border-[#342c1e]/30 rounded-xl pl-10 pr-4 py-3 text-sm text-white focus:ring-2 focus:ring-[#b1cb0c] outline-none transition-all"
                  />
                </div>
                <div className="relative">
                  <Clock size={16} className="absolute left-3 top-3.5 text-gray-400" />
                  <input
                    type="number"
                    value={itemEditando.horasContratoMensual}
                    onChange={(e) => setItemEditando({ ...itemEditando, horasContratoMensual: e.target.value })}
                    required
                    placeholder="Horas mensuales"
                    className="w-full bg-[#062e3a]/50 border border-[#342c1e]/30 rounded-xl pl-10 pr-4 py-3 text-sm text-white focus:ring-2 focus:ring-[#b1cb0c] outline-none transition-all"
                  />
                </div>

                <div className="space-y-3 mt-4 pt-4 border-t border-[#342c1e]/50">
                  <h4 className="text-xs font-bold text-[#bed000] uppercase pb-2 tracking-widest">
                    3. Asignación y Distancia
                  </h4>
                  <div className="max-h-56 overflow-y-auto space-y-2 p-2 bg-white/5 rounded-xl custom-scrollbar border border-white/10">
                    {[...farmacias]
                      .sort((a, b) => {
                        const hasA = itemEditando.asignaciones?.some((asig) => asig.farmaciaId === a.id);
                        const hasB = itemEditando.asignaciones?.some((asig) => asig.farmaciaId === b.id);
                        if (hasA && !hasB) return -1;
                        if (!hasA && hasB) return 1;
                        return a.nombre.localeCompare(b.nombre);
                      })
                      .map((farmacia) => {
                        const asignacionInfo = itemEditando.asignaciones?.find((a) => a.farmaciaId === farmacia.id);
                        const isChecked = !!asignacionInfo;
                        return (
                          <div key={farmacia.id} className={`flex flex-col p-2 rounded-lg transition-colors ${isChecked ? "bg-[#b1cb0c]/20 border border-[#b1cb0c]/50" : "bg-transparent border border-transparent"}`}>
                            <label className="flex items-center gap-3 cursor-pointer">
                              <input
                                type="checkbox"
                                checked={isChecked}
                                onChange={(e) => handleToggleFarmacia(farmacia.id, e.target.checked, true)}
                                className="w-4 h-4 rounded text-[#b1cb0c] bg-[#062e3a] border-gray-600 focus:ring-[#b1cb0c]"
                              />
                              <span className="text-sm font-bold text-gray-200">{farmacia.nombre}</span>
                            </label>
                            {isChecked && (
                              <div className="mt-2 pl-7 flex items-center gap-2 animate-fade-in">
                                <Car size={14} className="text-gray-400" />
                                <input
                                  type="number"
                                  min="0"
                                  value={asignacionInfo.kilometros}
                                  onChange={(e) => handleCambiarKilometros(farmacia.id, e.target.value, true)}
                                  className="w-16 p-1 text-sm bg-[#062e3a] text-white border border-[#342c1e] rounded-md focus:ring-2 focus:ring-[#b1cb0c] outline-none text-center"
                                  placeholder="Km"
                                  required
                                />
                                <span className="text-xs font-bold text-[#b1cb0c]/80">Km totales</span>
                              </div>
                            )}
                          </div>
                        );
                      })}
                  </div>
                </div>
              </>
            )}

            {pestana === "farmacias" && (
              <>
                <div className="relative">
                  <Store size={16} className="absolute left-3 top-3.5 text-gray-400" />
                  <input
                    type="text"
                    value={itemEditando.nombre}
                    onChange={(e) => setItemEditando({ ...itemEditando, nombre: e.target.value })}
                    required
                    placeholder="Nombre Farmacia"
                    className="w-full bg-[#062e3a]/50 border border-[#342c1e]/30 rounded-xl pl-10 pr-4 py-3 text-sm text-white focus:ring-2 focus:ring-[#b1cb0c] outline-none transition-all"
                  />
                </div>
                <div className="relative">
                  <FileText size={16} className="absolute left-3 top-3.5 text-gray-400" />
                  <input
                    type="text"
                    value={itemEditando.cif}
                    onChange={(e) => setItemEditando({ ...itemEditando, cif: e.target.value })}
                    required
                    placeholder="CIF"
                    className="w-full bg-[#062e3a]/50 border border-[#342c1e]/30 rounded-xl pl-10 pr-4 py-3 text-sm text-white focus:ring-2 focus:ring-[#b1cb0c] outline-none transition-all"
                  />
                </div>
                <div className="relative">
                  <MapPin size={16} className="absolute left-3 top-3.5 text-gray-400" />
                  <input
                    type="text"
                    value={itemEditando.direccion}
                    onChange={(e) => setItemEditando({ ...itemEditando, direccion: e.target.value })}
                    required
                    placeholder="Dirección completa"
                    className="w-full bg-[#062e3a]/50 border border-[#342c1e]/30 rounded-xl pl-10 pr-4 py-3 text-sm text-white focus:ring-2 focus:ring-[#b1cb0c] outline-none transition-all"
                  />
                </div>
                <div className="pt-2">
                  <label className="flex items-center gap-3 p-4 bg-[#b1cb0c]/10 border border-[#b1cb0c]/30 rounded-xl cursor-pointer transition-all">
                    <input
                      type="checkbox"
                      checked={itemEditando.esProvinciaLocal !== false}
                      onChange={(e) => setItemEditando({ ...itemEditando, esProvinciaLocal: e.target.checked })}
                      className="w-5 h-5 rounded text-[#367933] focus:ring-[#367933]"
                    />
                    <span className="text-sm font-bold text-white flex items-center gap-2">
                      <MapPin size={14} className="text-[#bed000]" /> Almería (PVF)
                    </span>
                  </label>
                </div>
                <div className="relative mt-2">
                  <label className="block text-[10px] font-black text-gray-400 uppercase mb-1 tracking-widest">
                    Comisión para la Farmacia
                  </label>
                  <div className="relative">
                    <Percent size={16} className="absolute left-3 top-3.5 text-gray-400" />
                    <input
                      type="number"
                      value={itemEditando.porcentajeComision || 30}
                      onChange={(e) => setItemEditando({ ...itemEditando, porcentajeComision: e.target.value })}
                      required
                      min="0" max="100" step="0.1"
                      className="w-full bg-[#062e3a]/50 border border-[#342c1e]/30 rounded-xl pl-10 pr-4 py-3 text-sm text-white font-bold focus:ring-2 focus:ring-[#b1cb0c] outline-none transition-all"
                    />
                  </div>
                </div>
              </>
            )}

            {pestana === "productos" && (
              <>
                <div className="relative">
                  <Package size={16} className="absolute left-3 top-3.5 text-gray-400" />
                  <input
                    type="text"
                    value={itemEditando.nombreProducto}
                    onChange={(e) => setItemEditando({ ...itemEditando, nombreProducto: e.target.value })}
                    required
                    placeholder="Nombre Producto"
                    className="w-full bg-[#062e3a]/50 border border-[#342c1e]/30 rounded-xl pl-10 pr-4 py-3 text-sm text-white focus:ring-2 focus:ring-[#b1cb0c] outline-none transition-all"
                  />
                </div>
                <div className="flex gap-2">
                  <div className="relative w-full">
                    <Type size={16} className="absolute left-3 top-3.5 text-gray-400" />
                    <input
                      type="text"
                      value={itemEditando.acronimo || ""}
                      onChange={(e) => setItemEditando({ ...itemEditando, acronimo: e.target.value })}
                      required
                      placeholder="Acrónimo"
                      className="w-full bg-[#062e3a]/50 border border-[#342c1e]/30 rounded-xl pl-10 pr-4 py-3 text-sm text-white focus:ring-2 focus:ring-[#b1cb0c] outline-none transition-all"
                    />
                  </div>
                  <div className="relative w-full">
                    <Tag size={16} className="absolute left-3 top-3.5 text-gray-400" />
                    <select
                      value={itemEditando.categoria || "PEQUENO"}
                      onChange={(e) => setItemEditando({ ...itemEditando, categoria: e.target.value })}
                      className="w-full bg-[#062e3a]/50 border border-[#342c1e]/30 rounded-xl pl-10 pr-4 py-3 text-sm text-white focus:ring-2 focus:ring-[#b1cb0c] outline-none transition-all appearance-none"
                    >
                      <option value="PEQUENO">PEQUEÑO</option>
                      <option value="GRANDE">GRANDE</option>
                    </select>
                  </div>
                </div>
                <div className="relative">
                  <Hash size={16} className="absolute left-3 top-3.5 text-gray-400" />
                  <input
                    type="text"
                    value={itemEditando.referencia || ""}
                    onChange={(e) => setItemEditando({ ...itemEditando, referencia: e.target.value })}
                    required
                    placeholder="Referencia / SKU"
                    className="w-full bg-[#062e3a]/50 border border-[#342c1e]/30 rounded-xl pl-10 pr-4 py-3 text-sm text-white focus:ring-2 focus:ring-[#b1cb0c] outline-none transition-all"
                  />
                </div>
                <div className="flex gap-2">
                  <div className="relative w-full">
                    <Euro size={16} className="absolute left-3 top-3.5 text-gray-400" />
                    <input
                      type="number"
                      step="0.01"
                      value={itemEditando.pvf}
                      onChange={(e) => setItemEditando({ ...itemEditando, pvf: e.target.value })}
                      required
                      placeholder="PVF"
                      className="w-full bg-[#062e3a]/50 border border-[#342c1e]/30 rounded-xl pl-10 pr-4 py-3 text-sm text-white focus:ring-2 focus:ring-[#b1cb0c] outline-none transition-all"
                    />
                  </div>
                  <div className="relative w-full">
                    <Euro size={16} className="absolute left-3 top-3.5 text-gray-400" />
                    <input
                      type="number"
                      step="0.01"
                      value={itemEditando.pvp}
                      onChange={(e) => setItemEditando({ ...itemEditando, pvp: e.target.value })}
                      required
                      placeholder="PVP"
                      className="w-full bg-[#062e3a]/50 border border-[#342c1e]/30 rounded-xl pl-10 pr-4 py-3 text-sm text-white focus:ring-2 focus:ring-[#b1cb0c] outline-none transition-all"
                    />
                  </div>
                </div>
              </>
            )}
          </div>

          <button
            type="submit"
            disabled={!formValido()}
            className={`w-full font-bold py-3 rounded-xl mt-6 flex items-center justify-center gap-2 shadow-lg transition-all active:scale-[0.98]
              ${!formValido() ? "bg-gray-600 text-gray-300 cursor-not-allowed" : "bg-[#367933] hover:bg-[#006633] text-white shadow-[#367933]/20"}`}
          >
            <Save size={18} /> Guardar Cambios
          </button>
        </form>
      </div>
    </div>
  );
};

export default ModalEdicionAdministracion;