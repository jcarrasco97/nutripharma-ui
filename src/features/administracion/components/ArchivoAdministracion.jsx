import React from "react";
import { Archive, RefreshCw, Store, PackagePlus } from "lucide-react";

const ArchivoAdministracion = ({
  pestana,
  mostrarBajas,
  setMostrarBajas,
  nutricionistasBajas,
  farmaciasBajas,
  productosBajas,
  handleRestaurar,
}) => {
  return (
    <div className="bg-gray-50 border border-gray-200 rounded-2xl p-4 mt-6">
      <div className="text-center mb-2">
        <button
          onClick={() => setMostrarBajas(!mostrarBajas)}
          className="inline-flex items-center gap-2 text-sm font-bold text-[#342c1e]/60 hover:text-[#062e3a] transition-colors"
        >
          <Archive size={16} />{" "}
          {mostrarBajas ? "Ocultar Archivo Histórico" : "Ver Archivo Histórico"}
        </button>
      </div>

      {mostrarBajas && (
        <div className="mt-4 border-t-2 border-dashed border-gray-200 pt-4">
          <h4 className="text-xs font-black uppercase text-[#342c1e]/50 mb-4 px-2 tracking-widest">
            Registros Inactivos (Solo Lectura)
          </h4>

          {pestana === "nutricionistas" && (
            <div className="space-y-2">
              {nutricionistasBajas.length === 0 ? (
                <p className="text-sm text-[#342c1e]/50 italic px-2 font-bold">
                  No hay bajas.
                </p>
              ) : (
                nutricionistasBajas.map((n) => (
                  <div
                    key={n.id}
                    className="p-3 bg-gray-200/50 rounded-xl flex items-center justify-between group"
                  >
                    <div className="flex items-center gap-3 grayscale opacity-75">
                      <div className="bg-gray-300 text-gray-500 w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs shrink-0">
                        {n.nombre.charAt(0)}
                      </div>
                      <div>
                        <p className="font-bold text-gray-600 text-sm line-through">
                          {n.nombre} {n.apellidos}
                        </p>
                        <p className="text-[10px] text-gray-500 font-medium">
                          {n.email} • DNI: {n.dni}
                        </p>
                        <div className="mt-1 flex items-center gap-1 text-[9px] font-bold text-red-500 bg-red-50 px-2 py-0.5 rounded w-fit uppercase">
                          <Archive size={10} /> Baja el{" "}
                          {new Date(n.fechaBaja).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={() => handleRestaurar(n.id, "nutricionista")}
                      className="p-2 text-[#367933] bg-[#b1cb0c]/20 rounded-lg hover:bg-[#b1cb0c]/40 opacity-0 group-hover:opacity-100 transition-all"
                      title="Restaurar"
                    >
                      <RefreshCw size={16} />
                    </button>
                  </div>
                ))
              )}
            </div>
          )}

          {pestana === "farmacias" && (
            <div className="space-y-2">
              {farmaciasBajas.length === 0 ? (
                <p className="text-sm text-[#342c1e]/50 italic px-2 font-bold">
                  No hay bajas.
                </p>
              ) : (
                farmaciasBajas.map((f) => (
                  <div
                    key={f.id}
                    className="p-3 bg-gray-200/50 rounded-xl flex items-center justify-between group"
                  >
                    <div className="flex items-center gap-3 grayscale opacity-75">
                      <div className="bg-gray-300 text-gray-500 p-2 rounded-lg shrink-0">
                        <Store size={16} />
                      </div>
                      <div>
                        <p className="font-bold text-gray-600 text-sm line-through">
                          {f.nombre}
                        </p>
                        <p className="text-[10px] text-gray-500 font-medium">
                          {f.email} • CIF: {f.cif}
                        </p>
                        <div className="mt-1 flex items-center gap-1 text-[9px] font-bold text-red-500 bg-red-50 px-2 py-0.5 rounded w-fit uppercase">
                          <Archive size={10} /> Baja el{" "}
                          {new Date(f.fechaBaja).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={() => handleRestaurar(f.id, "farmacia")}
                      className="p-2 text-[#367933] bg-[#b1cb0c]/20 rounded-lg hover:bg-[#b1cb0c]/40 opacity-0 group-hover:opacity-100 transition-all"
                      title="Restaurar"
                    >
                      <RefreshCw size={16} />
                    </button>
                  </div>
                ))
              )}
            </div>
          )}

          {pestana === "productos" && (
            <div className="space-y-2">
              {productosBajas.length === 0 ? (
                <p className="text-sm text-[#342c1e]/50 italic px-2 font-bold">
                  No hay bajas.
                </p>
              ) : (
                productosBajas.map((p) => (
                  <div
                    key={p.id}
                    className="p-3 bg-gray-200/50 rounded-xl flex items-center justify-between group"
                  >
                    <div className="flex items-center gap-3 grayscale opacity-75">
                      <div className="bg-gray-300 text-gray-500 p-2 rounded-lg shrink-0">
                        <PackagePlus size={16} />
                      </div>
                      <div>
                        <p className="font-bold text-gray-600 text-sm line-through">
                          {p.nombreProducto}
                        </p>
                        <p className="text-[10px] text-gray-500 font-medium">
                          Ref: {p.referencia} • PVF: {p.pvf}€
                        </p>
                        <div className="mt-1 flex items-center gap-1 text-[9px] font-bold text-red-500 bg-red-50 px-2 py-0.5 rounded w-fit uppercase">
                          <Archive size={10} /> Baja el{" "}
                          {new Date(p.fechaBaja).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={() => handleRestaurar(p.id, "producto")}
                      className="p-2 text-[#367933] bg-[#b1cb0c]/20 rounded-lg hover:bg-[#b1cb0c]/40 opacity-0 group-hover:opacity-100 transition-all"
                      title="Restaurar"
                    >
                      <RefreshCw size={16} />
                    </button>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ArchivoAdministracion;
