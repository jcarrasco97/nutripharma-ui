import React from "react";
import { UploadCloud, ShieldCheck, Loader2 } from "lucide-react";

const PanelSubidaDocumentos = ({
  formulario,
  setFormulario,
  destinatarios,
  subiendo,
  handleSubir,
}) => {
  return (
    <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-100">
      <div className="flex items-center gap-4 mb-6">
        <div className="bg-[#367933] p-4 rounded-3xl text-white shadow-lg shadow-[#367933]/20">
          <UploadCloud size={28} />
        </div>
        <div>
          <h2 className="text-2xl font-black text-[#062e3a]">
            Subir Documento
          </h2>
          <p className="text-[#342c1e] font-medium">
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
            <label className="block text-xs font-bold text-[#342c1e] uppercase tracking-widest mb-1">
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
              className="w-full bg-[#f4f7f4] border border-gray-200 rounded-xl px-4 py-3 text-sm font-medium focus:border-[#b1cb0c] outline-none text-[#062e3a]"
            >
              <option value="GLOBAL_TODOS">Toda la empresa (General)</option>
              <option value="GLOBAL_NUTRICIONISTAS">
                Todas las Nutricionistas
              </option>
              <option value="GLOBAL_FARMACIAS">Todas las Farmacias</option>
              <option value="INDIVIDUAL">Envío Individual (Privado)</option>
            </select>
          </div>

          {formulario.alcance === "INDIVIDUAL" && (
            <div className="animate-fade-in">
              <label className="block text-xs font-bold text-[#342c1e] uppercase tracking-widest mb-1">
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
                className="w-full bg-[#f4f7f4] border border-gray-200 rounded-xl px-4 py-3 text-sm font-bold text-[#062e3a] focus:border-[#b1cb0c] outline-none"
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
            <label className="block text-xs font-bold text-[#342c1e] uppercase tracking-widest mb-1">
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
              className="w-full text-sm text-[#342c1e] file:mr-4 file:py-3 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-[#b1cb0c]/20 file:text-[#367933] hover:file:bg-[#b1cb0c]/40 transition-colors"
            />
          </div>
        </div>

        <div className="md:col-span-2 pt-4 border-t border-gray-50 flex justify-end">
          <button
            type="submit"
            disabled={subiendo}
            className="bg-[#367933] hover:bg-[#006633] disabled:bg-gray-300 text-white font-black px-8 py-3 rounded-xl flex items-center gap-2 transition-colors shadow-lg shadow-[#367933]/20"
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
  );
};

export default PanelSubidaDocumentos;
