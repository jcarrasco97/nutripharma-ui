import React from "react";
import { FileCheck, Trash2, Download, Loader2 } from "lucide-react";

const GridDocumentos = ({
  documentosFiltrados,
  isAdmin,
  handleBorrar,
  borrandoId,
  handleDescargar,
  descargandoId,
}) => {
  const formatearAlcance = (doc) => {
    switch (doc.alcance) {
      case "GLOBAL_TODOS":
        return (
          <span className="bg-[#b1cb0c]/20 text-[#367933] px-2 py-1 rounded-md text-[10px] font-black uppercase">
            Para Todos
          </span>
        );
      case "GLOBAL_NUTRICIONISTAS":
        return (
          <span className="bg-emerald-100 text-emerald-700 px-2 py-1 rounded-md text-[10px] font-black uppercase">
            Solo Nutricionistas
          </span>
        );
      case "GLOBAL_FARMACIAS":
        return (
          <span className="bg-amber-100 text-amber-700 px-2 py-1 rounded-md text-[10px] font-black uppercase">
            Solo Farmacias
          </span>
        );
      case "INDIVIDUAL":
        return (
          <span className="bg-[#062e3a]/10 text-[#062e3a] px-2 py-1 rounded-md text-[10px] font-black uppercase">
            {isAdmin ? `Para: ${doc.propietarioEmail}` : "Personal"}
          </span>
        );
      default:
        return doc.alcance;
    }
  };

  if (documentosFiltrados.length === 0) {
    return (
      <div className="text-center py-16">
        <FileCheck size={48} className="mx-auto text-gray-300 mb-4" />
        <p className="text-gray-500 font-bold">No se encontraron documentos.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
      {documentosFiltrados.map((doc) => (
        <div
          key={doc.id}
          className="border-2 border-gray-50 rounded-[2rem] p-6 hover:border-[#b1cb0c]/50 hover:shadow-lg transition-all flex flex-col justify-between group relative overflow-hidden bg-white"
        >
          {isAdmin && (
            <button
              onClick={() => handleBorrar(doc.id)}
              disabled={borrandoId === doc.id}
              title="Eliminar documento"
              className="absolute top-4 right-4 p-2 bg-red-50 text-red-600 hover:bg-red-600 hover:text-white rounded-lg transition-colors"
            >
              {borrandoId === doc.id ? (
                <Loader2 className="animate-spin" size={16} />
              ) : (
                <Trash2 size={16} />
              )}
            </button>
          )}

          <div>
            <div className="flex justify-between items-start mb-4 pr-10">
              {formatearAlcance(doc)}
            </div>
            <h3
              className="font-black text-[#062e3a] mb-2 truncate text-lg"
              title={doc.nombreOriginal}
            >
              {doc.nombreOriginal}
            </h3>
            <p className="text-xs text-[#342c1e] font-bold flex items-center gap-1">
              <span className="uppercase">{doc.fechaSubida}</span>
            </p>
          </div>

          <button
            onClick={() => handleDescargar(doc.id, doc.nombreOriginal)}
            disabled={descargandoId === doc.id}
            className="mt-6 w-full bg-[#f4f7f4] hover:bg-[#367933] hover:text-white text-[#062e3a] font-black py-3 rounded-xl flex items-center justify-center gap-2 transition-all border border-transparent group-hover:border-[#367933]"
          >
            {descargandoId === doc.id ? (
              <Loader2 className="animate-spin" size={16} />
            ) : (
              <Download size={16} />
            )}
            {descargandoId === doc.id ? "Descargando..." : "Descargar"}
          </button>
        </div>
      ))}
    </div>
  );
};

export default GridDocumentos;
