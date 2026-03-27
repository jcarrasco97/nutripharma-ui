import React from "react";
import { X, Store, User, Car } from "lucide-react";

const ModalVerAsignaciones = ({
  modalAsignaciones,
  cerrarModalAsignaciones,
  nutricionistas,
}) => {
  if (!modalAsignaciones.visible || !modalAsignaciones.item) return null;

  const { tipo, item } = modalAsignaciones;

  // Si abrimos una farmacia, calculamos qué nutris la tienen asignada
  const nutrisAsignados =
    tipo === "farmacia"
      ? nutricionistas.filter((n) =>
          n.asignaciones?.some((a) => a.farmaciaId === item.id),
        )
      : [];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#062e3a]/70 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-3xl shadow-2xl max-w-sm w-full overflow-hidden animate-scale-in">
        <div className="p-6 bg-[#062e3a] text-white flex justify-between items-center">
          <h3 className="text-lg font-black flex items-center gap-2">
            {tipo === "nutricionista" ? (
              <Store className="text-[#bed000]" size={20} />
            ) : (
              <User className="text-[#bed000]" size={20} />
            )}
            {tipo === "nutricionista"
              ? "Farmacias Asignadas"
              : "Nutricionistas"}
          </h3>
          <button
            onClick={cerrarModalAsignaciones}
            className="text-white/70 hover:text-white transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        <div className="p-6 max-h-[60vh] overflow-y-auto custom-scrollbar bg-gray-50">
          <div className="mb-4 text-center">
            <p className="text-sm font-bold text-[#062e3a]">
              {item.nombre} {item.apellidos || ""}
            </p>
            <p className="text-xs text-gray-500">
              {tipo === "nutricionista" ? "Ruta asignada" : "Personal asignado"}
            </p>
          </div>

          <div className="space-y-2">
            {tipo === "nutricionista" &&
              (item.asignaciones?.length === 0 ? (
                <p className="text-center text-sm text-gray-400 font-bold py-4">
                  No tiene farmacias asignadas.
                </p>
              ) : (
                item.asignaciones.map((asig, idx) => (
                  <div
                    key={idx}
                    className="bg-white p-3 rounded-xl border border-gray-200 flex justify-between items-center shadow-sm"
                  >
                    <span className="font-bold text-[#062e3a] text-sm">
                      {asig.farmaciaNombre}
                    </span>
                    <span className="text-xs font-black text-[#367933] bg-[#b1cb0c]/20 px-2 py-1 rounded-md flex items-center gap-1">
                      <Car size={12} /> {asig.kilometros} km
                    </span>
                  </div>
                ))
              ))}

            {tipo === "farmacia" &&
              (nutrisAsignados.length === 0 ? (
                <p className="text-center text-sm text-gray-400 font-bold py-4">
                  Ninguna nutricionista cubre esta farmacia.
                </p>
              ) : (
                nutrisAsignados.map((n) => (
                  <div
                    key={n.id}
                    className="bg-white p-3 rounded-xl border border-gray-200 flex items-center gap-3 shadow-sm"
                  >
                    <div className="bg-[#062e3a]/10 text-[#062e3a] w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs shrink-0">
                      {n.nombre.charAt(0)}
                      {n.apellidos ? n.apellidos.charAt(0) : ""}
                    </div>
                    <span className="font-bold text-[#062e3a] text-sm">
                      {n.nombre} {n.apellidos}
                    </span>
                  </div>
                ))
              ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModalVerAsignaciones;
