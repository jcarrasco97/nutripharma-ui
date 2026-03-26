import React from "react";
import {
  Edit,
  Trash2,
  Store,
  PackagePlus,
  CheckCircle,
  XCircle,
} from "lucide-react";

const ListadoAdministracion = ({
  pestana,
  nutricionistas,
  farmacias,
  productos,
  setItemEditando,
  handleEliminar,
  handleToggleStock,
}) => {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
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
                    <p className="font-black text-[#062e3a]">
                      {n.nombre} {n.apellidos}
                    </p>
                    <p className="text-xs text-[#342c1e]/70 font-medium mb-1">
                      {n.email} • DNI: {n.dni}
                    </p>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {n.asignaciones?.length > 0 ? (
                        <span className="bg-[#b1cb0c]/20 text-[#367933] text-[10px] font-black px-2 py-0.5 rounded-md uppercase">
                          {n.asignaciones.length} Farmacias Asignadas
                        </span>
                      ) : (
                        <span className="bg-red-50 text-red-500 text-[10px] font-black px-2 py-0.5 rounded-md uppercase">
                          Sin Asignaciones
                        </span>
                      )}
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

      {pestana === "farmacias" && (
        <div className="divide-y divide-gray-100">
          {farmacias.length === 0 ? (
            <p className="p-8 text-center text-gray-400 font-bold">
              No hay farmacias.
            </p>
          ) : (
            farmacias.map((f) => (
              <div
                key={f.id}
                className="p-4 flex justify-between items-start md:items-center hover:bg-[#f4f7f4] group flex-col md:flex-row gap-4 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className="bg-[#b1cb0c]/20 text-[#367933] p-3 rounded-xl shrink-0">
                    <Store size={24} />
                  </div>
                  <div>
                    <p className="font-black text-[#062e3a] flex items-center gap-2">
                      {f.nombre}
                      <span
                        className={`text-[9px] px-2 py-0.5 rounded uppercase font-black ${f.esProvinciaLocal ? "bg-[#062e3a]/10 text-[#062e3a]" : "bg-[#342c1e]/10 text-[#342c1e]"}`}
                      >
                        {f.esProvinciaLocal ? "Almería (PVF)" : "Externa (PVP)"}
                      </span>
                    </p>
                    <p className="text-xs text-[#342c1e]/70 font-medium mt-1">
                      {f.direccion} • CIF: {f.cif}
                    </p>
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
            ))
          )}
        </div>
      )}

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
                className={`p-4 flex justify-between items-start md:items-center hover:bg-[#f4f7f4] group flex-col md:flex-row gap-4 transition-all ${!p.hayExistencias ? "opacity-60 grayscale bg-gray-50" : ""}`}
              >
                <div className="flex items-center gap-4">
                  <div
                    className={`p-3 rounded-xl shrink-0 ${p.hayExistencias ? "bg-[#b1cb0c]/20 text-[#367933]" : "bg-gray-200 text-gray-500"}`}
                  >
                    <PackagePlus size={24} />
                  </div>
                  <div>
                    <p
                      className={`font-black ${p.hayExistencias ? "text-[#062e3a]" : "text-gray-500 line-through decoration-gray-400"}`}
                    >
                      {p.nombreProducto}{" "}
                      <span className="ml-2 text-[10px] bg-[#342c1e]/10 text-[#342c1e] px-2 rounded font-bold no-underline">
                        {p.referencia}
                      </span>
                    </p>
                    <p className="text-xs text-[#342c1e]/70 font-medium mt-1">
                      PVF: {p.pvf}€ • PVP: {p.pvp}€
                      {!p.hayExistencias && (
                        <span className="ml-2 text-red-500 font-bold uppercase text-[9px] bg-red-50 px-2 py-0.5 rounded">
                          Sin Stock
                        </span>
                      )}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2 opacity-100 md:opacity-0 group-hover:opacity-100 transition-opacity w-full md:w-auto justify-end">
                  <button
                    onClick={() => handleToggleStock(p.id)}
                    className={`p-2 rounded-lg transition-colors ${p.hayExistencias ? "text-[#367933] bg-[#b1cb0c]/20 hover:bg-[#b1cb0c]/40" : "text-[#342c1e] bg-gray-200 hover:bg-gray-300"}`}
                    title={
                      p.hayExistencias ? "Marcar Sin Stock" : "Marcar Con Stock"
                    }
                  >
                    {p.hayExistencias ? (
                      <CheckCircle size={16} />
                    ) : (
                      <XCircle size={16} />
                    )}
                  </button>
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
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default ListadoAdministracion;
