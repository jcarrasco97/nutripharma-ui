import React from "react";
import { Edit, Trash2, Store, PackagePlus, Users } from "lucide-react";

const ListadoAdministracion = ({
  pestana,
  nutricionistas,
  farmacias,
  productos,
  setItemEditando,
  handleEliminar,
  handleToggleStock,
  abrirModalAsignaciones,
}) => {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      {/* NUTRICIONISTAS */}
      {pestana === "nutricionistas" && (
        <div className="divide-y divide-gray-100">
          {nutricionistas.length === 0 ? (
            <p className="p-8 text-center text-gray-400 font-bold">
              No hay nutricionistas.
            </p>
          ) : (
            nutricionistas.map((n) => (
              <div
                key={n.id}
                className="p-4 flex justify-between items-start md:items-center hover:bg-[#f4f7f4] group flex-col md:flex-row gap-4 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className="bg-[#062e3a] text-white w-10 h-10 rounded-full flex items-center justify-center font-bold shrink-0">
                    {n.nombre.charAt(0)}
                    {n.apellidos ? n.apellidos.charAt(0) : ""}
                  </div>
                  <div>
                    <p className="font-black text-[#062e3a] flex items-center gap-2">
                      {n.nombre} {n.apellidos}
                      <span className="bg-[#062e3a]/10 text-[#062e3a] text-[10px] font-black px-2 py-0.5 rounded-md uppercase">
                        {n.horasContratoMensual}h / mes
                      </span>
                    </p>
                    <p className="text-xs text-[#342c1e]/70 font-medium mb-1">
                      {n.email} • Tel: {n.telefono}
                    </p>
                    <div className="flex flex-wrap gap-1 mt-1">
                      <button
                        onClick={() =>
                          abrirModalAsignaciones(n, "nutricionista")
                        }
                        className={`text-[10px] font-black px-2 py-0.5 rounded-md uppercase transition-colors cursor-pointer hover:shadow-sm ${n.asignaciones?.length > 0 ? "bg-[#b1cb0c]/20 text-[#367933] hover:bg-[#b1cb0c]/40" : "bg-red-50 text-red-500 hover:bg-red-100"}`}
                      >
                        {n.asignaciones?.length > 0
                          ? `${n.asignaciones.length} Farmacias Asignadas (Ver)`
                          : "Sin Asignaciones"}
                      </button>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3 opacity-100 md:opacity-0 group-hover:opacity-100 transition-opacity w-full md:w-auto justify-end">
                  <button
                    onClick={() => setItemEditando(n)}
                    className="p-2 text-[#367933] bg-[#b1cb0c]/20 rounded-lg hover:bg-[#b1cb0c]/40 transition-colors"
                    title="Editar"
                  >
                    <Edit size={16} />
                  </button>
                  <button
                    onClick={() => handleEliminar(n.id, "nutricionista")}
                    className="p-2 text-red-600 bg-red-50 rounded-lg hover:bg-red-100 transition-colors"
                    title="Eliminar"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* FARMACIAS */}
      {pestana === "farmacias" && (
        <div className="divide-y divide-gray-100">
          {farmacias.length === 0 ? (
            <p className="p-8 text-center text-gray-400 font-bold">
              No hay farmacias.
            </p>
          ) : (
            farmacias.map((f) => {
              const nutrisCount = nutricionistas.filter((n) =>
                n.asignaciones?.some((a) => a.farmaciaId === f.id),
              ).length;
              return (
                <div
                  key={f.id}
                  className="p-4 flex justify-between items-start md:items-center hover:bg-[#f4f7f4] group flex-col md:flex-row gap-4 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className="bg-[#b1cb0c]/20 text-[#367933] p-3 rounded-xl shrink-0">
                      <Store size={24} />
                    </div>
                    <div>
                      <p className="font-black text-[#062e3a] flex flex-wrap items-center gap-2">
                        {f.nombre}
                        <span
                          className={`text-[9px] px-2 py-0.5 rounded uppercase font-black ${f.esProvinciaLocal ? "bg-[#062e3a]/10 text-[#062e3a]" : "bg-[#342c1e]/10 text-[#342c1e]"}`}
                        >
                          {f.esProvinciaLocal
                            ? "Almería (PVF)"
                            : "Externa (PVP)"}
                        </span>
                        <span className="bg-[#b1cb0c]/20 text-[#367933] text-[9px] px-2 py-0.5 rounded uppercase font-black">
                          Comisión: {f.porcentajeComision}%
                        </span>
                      </p>
                      <p className="text-xs text-[#342c1e]/70 font-medium mt-1">
                        {f.direccion} • CIF: {f.cif}
                      </p>
                      <button
                        onClick={() => abrirModalAsignaciones(f, "farmacia")}
                        className={`mt-1 text-[9px] font-black px-2 py-0.5 rounded-md uppercase transition-colors cursor-pointer hover:shadow-sm flex items-center w-fit gap-1 ${nutrisCount > 0 ? "bg-[#062e3a]/10 text-[#062e3a] hover:bg-[#062e3a]/20" : "bg-gray-100 text-gray-400 hover:bg-gray-200"}`}
                      >
                        <Users size={10} />{" "}
                        {nutrisCount > 0
                          ? `${nutrisCount} Nutricionistas asig.`
                          : "Sin Nutricionistas"}
                      </button>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 opacity-100 md:opacity-0 group-hover:opacity-100 transition-opacity w-full md:w-auto justify-end">
                    <button
                      onClick={() => setItemEditando(f)}
                      className="p-2 text-[#367933] bg-[#b1cb0c]/20 rounded-lg hover:bg-[#b1cb0c]/40 transition-colors"
                      title="Editar"
                    >
                      <Edit size={16} />
                    </button>
                    <button
                      onClick={() => handleEliminar(f.id, "farmacia")}
                      className="p-2 text-red-600 bg-red-50 rounded-lg hover:bg-red-100 transition-colors"
                      title="Eliminar"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}

      {/* PRODUCTOS (Con Toggle iOS) */}
      {pestana === "productos" && (
        <div className="divide-y divide-gray-100">
          {productos.length === 0 ? (
            <p className="p-8 text-center text-gray-400 font-bold">
              No hay productos.
            </p>
          ) : (
            productos.map((p) => (
              <div
                key={p.id}
                className={`p-4 flex justify-between items-start md:items-center hover:bg-[#f4f7f4] group flex-col md:flex-row gap-4 transition-all ${!p.hayExistencias ? "bg-gray-50/50" : ""}`}
              >
                <div className="flex items-center gap-4">
                  <div
                    className={`p-3 rounded-xl shrink-0 transition-colors ${p.hayExistencias ? "bg-[#b1cb0c]/20 text-[#367933]" : "bg-gray-200 text-gray-400 grayscale"}`}
                  >
                    <PackagePlus size={24} />
                  </div>
                  <div>
                    <p
                      className={`font-black transition-all ${p.hayExistencias ? "text-[#062e3a]" : "text-gray-400 line-through decoration-gray-300"}`}
                    >
                      {p.nombreProducto}{" "}
                      <span className="ml-2 text-[10px] bg-[#342c1e]/10 text-[#342c1e] px-2 rounded font-bold no-underline">
                        {p.referencia}
                      </span>
                    </p>
                    <p className="text-xs text-[#342c1e]/70 font-medium mt-1">
                      PVF: {p.pvf}€ • PVP: {p.pvp}€
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-4 w-full md:w-auto justify-end">
                  {/* IPHONE TOGGLE SWITCH */}
                  <label
                    className="relative inline-flex items-center cursor-pointer"
                    title={
                      p.hayExistencias ? "Marcar Sin Stock" : "Marcar Con Stock"
                    }
                  >
                    <input
                      type="checkbox"
                      className="sr-only peer"
                      checked={p.hayExistencias}
                      onChange={() => handleToggleStock(p.id)}
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#367933]"></div>
                  </label>

                  <div className="flex items-center gap-2 opacity-100 md:opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => setItemEditando(p)}
                      className="p-2 text-[#367933] bg-[#b1cb0c]/20 rounded-lg hover:bg-[#b1cb0c]/40 transition-colors"
                      title="Editar"
                    >
                      <Edit size={16} />
                    </button>
                    <button
                      onClick={() => handleEliminar(p.id, "producto")}
                      className="p-2 text-red-600 bg-red-50 rounded-lg hover:bg-red-100 transition-colors"
                      title="Eliminar"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default ListadoAdministracion;
