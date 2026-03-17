import React, { useState, useEffect } from "react";
import { FileText, Download, Loader2, Calendar } from "lucide-react";
import { documentosService } from "../../services/documentosService";

const VistaDocumentacion = () => {
  const [documentos, setDocumentos] = useState([]);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    const cargarDatos = async () => {
      try {
        const datos = await documentosService.listarTodos();
        setDocumentos(datos);
      } catch (error) {
        console.error("Error al cargar documentos:", error);
      } finally {
        setCargando(false);
      }
    };
    cargarDatos();
  }, []);

  if (cargando)
    return (
      <div className="flex justify-center p-8">
        <Loader2 className="animate-spin text-sky-500" size={48} />
      </div>
    );

  return (
    <div className="animate-fade-in space-y-6">
      <div className="bg-sky-600 rounded-2xl p-8 text-white shadow-sm flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold mb-2">Biblioteca de Documentos</h2>
          <p className="text-sky-100">
            Descarga los protocolos, folletos y manuales actualizados de
            NutriPharma.
          </p>
        </div>
        <FileText
          size={48}
          className="text-sky-300 opacity-50 hidden md:block"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {documentos.length === 0 ? (
          <div className="col-span-full bg-white p-8 rounded-2xl border border-gray-100 text-center text-gray-500">
            No hay documentos subidos en este momento.
          </div>
        ) : (
          documentos.map((doc) => (
            <div
              key={doc.id}
              className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all flex flex-col justify-between group"
            >
              <div>
                <div className="flex justify-between items-start mb-4">
                  <div className="bg-sky-100 p-3 rounded-xl text-sky-600 group-hover:bg-sky-600 group-hover:text-white transition-colors">
                    <FileText size={24} />
                  </div>
                  <span className="text-xs text-gray-400 font-medium flex items-center gap-1">
                    <Calendar size={12} /> {doc.fechaSubida}
                  </span>
                </div>
                <h3 className="font-bold text-gray-800 text-lg line-clamp-2 mb-2">
                  {doc.titulo}
                </h3>
                <p className="text-sm text-gray-500 line-clamp-3 mb-6">
                  {doc.descripcion}
                </p>
              </div>

              <a
                href={doc.urlDescarga}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full bg-gray-50 hover:bg-gray-100 text-gray-700 font-bold py-2.5 rounded-xl flex items-center justify-center transition-colors border border-gray-200"
              >
                <Download size={18} className="mr-2" /> Descargar PDF
              </a>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default VistaDocumentacion;
