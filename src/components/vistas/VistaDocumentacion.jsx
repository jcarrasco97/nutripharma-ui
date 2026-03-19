import React, { useState, useEffect } from "react";
import {
  FileText,
  UploadCloud,
  Download,
  Loader2,
  FileCheck,
  ShieldCheck,
  Search,
  Filter,
  Trash2,
} from "lucide-react";
import { jwtDecode } from "jwt-decode";
import { documentosService } from "../../services/documentosService";

const VistaDocumentacion = () => {
  const [documentos, setDocumentos] = useState([]);
  const [destinatarios, setDestinatarios] = useState([]); // Lista para el desplegable
  const [cargando, setCargando] = useState(true);
  const [subiendo, setSubiendo] = useState(false);
  const [descargandoId, setDescargandoId] = useState(null);
  const [borrandoId, setBorrandoId] = useState(null);

  // Filtros
  const [filtroTexto, setFiltroTexto] = useState("");
  const [filtroMes, setFiltroMes] = useState("Todos");

  const token = localStorage.getItem("token");
  const isAdmin = token ? jwtDecode(token).roles.includes("ROLE_ADMIN") : false;

  // Formulario simplificado (sin título ni descripción)
  const [formulario, setFormulario] = useState({
    alcance: "GLOBAL_TODOS",
    propietarioEmail: "",
    archivo: null,
  });

  const cargarDatos = async () => {
    setCargando(true);
    try {
      const docs = await documentosService.listar();
      setDocumentos(docs);

      // Si es Admin, cargamos la lista de destinatarios para el desplegable
      if (isAdmin) {
        const dest = await documentosService.obtenerDestinatarios();
        setDestinatarios(dest);
      }
    } catch (error) {
      console.error("Error al cargar datos:", error);
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    cargarDatos();
  }, []);

  const handleSubir = async (e) => {
    e.preventDefault();
    if (!formulario.archivo) return alert("Por favor, selecciona un archivo.");
    if (formulario.alcance === "INDIVIDUAL" && !formulario.propietarioEmail) {
      return alert("Por favor, selecciona un destinatario.");
    }

    setSubiendo(true);
    try {
      const formData = new FormData();
      formData.append("alcance", formulario.alcance);
      if (formulario.alcance === "INDIVIDUAL") {
        formData.append("propietarioEmail", formulario.propietarioEmail);
      }
      formData.append("archivo", formulario.archivo);

      await documentosService.subir(formData);

      alert("Documento subido con éxito.");
      setFormulario({
        alcance: "GLOBAL_TODOS",
        propietarioEmail: "",
        archivo: null,
      });
      document.getElementById("fileInput").value = "";
      cargarDatos();
    } catch (error) {
      console.error("Error al subir:", error);
      alert("Error al subir el documento.");
    } finally {
      setSubiendo(false);
    }
  };

  const handleDescargar = async (id, nombreOriginal) => {
    setDescargandoId(id);
    try {
      await documentosService.descargar(id, nombreOriginal);
    } catch (error) {
      alert("Error al descargar el archivo.");
      console.error(error);
    } finally {
      setDescargandoId(null);
    }
  };

  const handleBorrar = async (id) => {
    if (
      !window.confirm(
        "¿Estás seguro de que deseas eliminar este documento? Se borrará permanentemente de la base de datos y de la nube.",
      )
    )
      return;

    setBorrandoId(id);
    try {
      await documentosService.eliminar(id);
      alert("Documento eliminado correctamente.");
      cargarDatos(); // Recargar lista tras borrar
    } catch (error) {
      alert("Error al eliminar el documento.");
      console.error(error);
    } finally {
      setBorrandoId(null);
    }
  };

  const formatearAlcance = (doc) => {
    switch (doc.alcance) {
      case "GLOBAL_TODOS":
        return (
          <span className="bg-indigo-100 text-indigo-700 px-2 py-1 rounded-md text-[10px] font-black uppercase">
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
        // Si somos admin mostramos el nombre del destinatario. Si no, solo dice "Personal"
        return (
          <span className="bg-sky-100 text-sky-700 px-2 py-1 rounded-md text-[10px] font-black uppercase">
            {isAdmin ? `Para: ${doc.propietarioEmail}` : "Personal"}
          </span>
        );
      default:
        return doc.alcance;
    }
  };

  // --- LÓGICA DE FILTROS ---
  const mesesDisponibles = [
    "Todos",
    ...new Set(documentos.map((d) => d.fechaSubida.substring(0, 7))),
  ].sort((a, b) => b.localeCompare(a));

  const documentosFiltrados = documentos
    .filter((d) => filtroMes === "Todos" || d.fechaSubida.startsWith(filtroMes))
    .filter((d) =>
      d.nombreOriginal.toLowerCase().includes(filtroTexto.toLowerCase()),
    );

  if (cargando)
    return (
      <div className="flex justify-center p-20">
        <Loader2 className="animate-spin text-sky-500" size={48} />
      </div>
    );

  return (
    <div className="space-y-8 animate-fade-in pb-10">
      {/* PANEL DE SUBIDA (Solo Admin) */}
      {isAdmin && (
        <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-100">
          <div className="flex items-center gap-4 mb-6">
            <div className="bg-indigo-600 p-4 rounded-3xl text-white shadow-lg shadow-indigo-100">
              <UploadCloud size={28} />
            </div>
            <div>
              <h2 className="text-2xl font-black text-gray-800">
                Subir Documento
              </h2>
              <p className="text-gray-500 font-medium">
                Sube PDFs, Word o Imágenes directamente a la nube corporativa.
              </p>
            </div>
          </div>

          <form
            onSubmit={handleSubir}
            className="grid grid-cols-1 md:grid-cols-2 gap-6 items-end"
          >
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-1">
                  Destinatarios *
                </label>
                <select
                  value={formulario.alcance}
                  onChange={(e) =>
                    setFormulario({
                      ...formulario,
                      alcance: e.target.value,
                      propietarioEmail: "",
                    })
                  }
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm font-medium focus:border-indigo-500 outline-none"
                >
                  <option value="GLOBAL_TODOS">
                    Toda la empresa (General)
                  </option>
                  <option value="GLOBAL_NUTRICIONISTAS">
                    Todas las Nutricionistas
                  </option>
                  <option value="GLOBAL_FARMACIAS">Todas las Farmacias</option>
                  <option value="INDIVIDUAL">Envío Individual (Privado)</option>
                </select>
              </div>

              {formulario.alcance === "INDIVIDUAL" && (
                <div className="animate-fade-in">
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-1">
                    Seleccionar Usuario *
                  </label>
                  <select
                    required
                    value={formulario.propietarioEmail}
                    onChange={(e) =>
                      setFormulario({
                        ...formulario,
                        propietarioEmail: e.target.value,
                      })
                    }
                    className="w-full bg-sky-50 border border-sky-200 rounded-xl px-4 py-3 text-sm font-bold text-sky-900 focus:border-sky-500 outline-none"
                  >
                    <option value="" disabled>
                      -- Elige un usuario --
                    </option>
                    {destinatarios.map((user, idx) => (
                      <option key={idx} value={user.email}>
                        {user.nombreCompleto} ({user.email})
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-1">
                  Seleccionar Archivo *
                </label>
                <input
                  id="fileInput"
                  type="file"
                  required
                  onChange={(e) =>
                    setFormulario({ ...formulario, archivo: e.target.files[0] })
                  }
                  accept=".pdf,.doc,.docx,.jpg,.png"
                  className="w-full text-sm text-gray-500 file:mr-4 file:py-3 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100 transition-colors"
                />
              </div>
            </div>

            <div className="md:col-span-2 pt-4 border-t border-gray-50 flex justify-end">
              <button
                type="submit"
                disabled={subiendo}
                className="bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-300 text-white font-black px-8 py-3 rounded-xl flex items-center gap-2 transition-colors shadow-lg shadow-indigo-100"
              >
                {subiendo ? (
                  <Loader2 className="animate-spin" size={18} />
                ) : (
                  <ShieldCheck size={18} />
                )}
                {subiendo ? "Subiendo a la nube..." : "Guardar Documento"}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* REPOSITORIO DE DOCUMENTOS (Visible para todos) */}
      <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-100">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8 pb-4 border-b border-gray-100">
          <div className="flex items-center gap-4">
            <div className="bg-gray-100 p-3 rounded-2xl text-gray-600">
              <FileText size={24} />
            </div>
            <div>
              <h2 className="text-xl font-black text-gray-800">
                Repositorio Documental
              </h2>
            </div>
          </div>
        </div>

        {/* --- FILTROS --- */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search
              size={16}
              className="absolute left-3 top-3.5 text-gray-400"
            />
            <input
              type="text"
              placeholder="Buscar por nombre de archivo..."
              value={filtroTexto}
              onChange={(e) => setFiltroTexto(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:bg-white focus:border-indigo-500 outline-none transition-colors"
            />
          </div>

          <div className="relative w-full md:w-64">
            <Filter
              size={16}
              className="absolute left-3 top-3.5 text-gray-400"
            />
            <select
              value={filtroMes}
              onChange={(e) => setFiltroMes(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:bg-white focus:border-indigo-500 outline-none transition-colors appearance-none"
            >
              {mesesDisponibles.map((mes) => (
                <option key={mes} value={mes}>
                  {mes === "Todos" ? "Todas las fechas" : mes}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* --- GRID DE DOCUMENTOS --- */}
        {documentosFiltrados.length === 0 ? (
          <div className="text-center py-16">
            <FileCheck size={48} className="mx-auto text-gray-300 mb-4" />
            <p className="text-gray-500 font-bold">
              No se encontraron documentos.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {documentosFiltrados.map((doc) => (
              <div
                key={doc.id}
                className="border-2 border-gray-50 rounded-[2rem] p-6 hover:border-gray-200 hover:shadow-lg transition-all flex flex-col justify-between group relative overflow-hidden bg-white"
              >
                {/* Botón Borrar (Solo Admin) */}
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
                    className="font-black text-gray-800 mb-2 truncate text-lg"
                    title={doc.nombreOriginal}
                  >
                    {doc.nombreOriginal}
                  </h3>
                  <p className="text-xs text-gray-400 font-bold flex items-center gap-1">
                    <span className="uppercase">{doc.fechaSubida}</span>
                  </p>
                </div>

                <button
                  onClick={() => handleDescargar(doc.id, doc.nombreOriginal)}
                  disabled={descargandoId === doc.id}
                  className="mt-6 w-full bg-gray-50 hover:bg-gray-900 hover:text-white text-gray-700 font-black py-3 rounded-xl flex items-center justify-center gap-2 transition-all border border-transparent group-hover:border-gray-900"
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
        )}
      </div>
    </div>
  );
};

export default VistaDocumentacion;
