import React, { useState } from "react";
import { UploadCloud } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/components/ui/Select";
import { Field, FieldLabel, FieldContent } from "@/shared/components/ui/Field";
import PanelSubida from "@/shared/components/PanelSubida";
import ZonaSubidaArchivo from "@/shared/components/ZonaSubidaArchivo";

const PanelSubidaDocumentos = ({
  formulario,
  setFormulario,
  destinatarios,
  subiendo,
  handleSubir,
}) => {
  const [open, setOpen] = useState(false);

  return (
    <PanelSubida
      open={open}
      onOpenChange={setOpen}
      icono={<UploadCloud size={20} />}
      titulo="Subir Documento"
      descripcion="Sube PDFs, Word o Imágenes directamente a la nube corporativa."
    >
      <form onSubmit={handleSubir} className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch mt-4">

        {/* PARTE IZQUIERDA: Filtros */}
        <div className="flex flex-col gap-5 border-r border-neutral/10 pr-6">
          <Field>
            <FieldLabel className="text-xs font-bold text-neutral uppercase tracking-widest mb-1">
              Alcance del Documento *
            </FieldLabel>
            <FieldContent>
              <Select
                value={formulario.alcance}
                onValueChange={(val) => setFormulario({ ...formulario, alcance: val })}
              >
                <SelectTrigger className="w-full bg-neutral/5 border-neutral/10 rounded-xl text-sm font-medium text-secondary">
                  <SelectValue placeholder="Selecciona a quién va dirigido" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="GLOBAL_TODOS">Para Todos</SelectItem>
                  <SelectItem value="GLOBAL_NUTRICIONISTAS">Solo Nutricionistas</SelectItem>
                  <SelectItem value="GLOBAL_FARMACIAS">Solo Farmacias</SelectItem>
                  <SelectItem value="INDIVIDUAL">Usuario Individual</SelectItem>
                </SelectContent>
              </Select>
            </FieldContent>
          </Field>

          {formulario.alcance === "INDIVIDUAL" && (
            <Field className="animate-in fade-in slide-in-from-top-2 duration-300">
              <FieldLabel className="text-xs font-bold text-neutral uppercase tracking-widest mb-1">
                Seleccionar Destinatario *
              </FieldLabel>
              <FieldContent>
                <Select
                  value={formulario.propietarioEmail}
                  onValueChange={(val) => setFormulario({ ...formulario, propietarioEmail: val })}
                >
                  <SelectTrigger className="w-full bg-neutral/5 border-neutral/10 rounded-xl text-sm font-medium text-secondary">
                    <SelectValue placeholder="Busca un correo..." />
                  </SelectTrigger>
                  <SelectContent>
                    {destinatarios && destinatarios.length > 0 ? (
                      destinatarios.map((dest) => (
                        <SelectItem key={dest.email} value={dest.email}>
                          {dest.nombreCompleto} ({dest.email})
                        </SelectItem>
                      ))
                    ) : (
                      <SelectItem value="no-data" disabled>No hay usuarios disponibles</SelectItem>
                    )}
                  </SelectContent>
                </Select>
              </FieldContent>
            </Field>
          )}
        </div>

        {/* PARTE DERECHA: Zona de Subida */}
        <div className="flex flex-col justify-center items-center h-full">
          <ZonaSubidaArchivo
            archivo={formulario.archivo}
            setArchivo={(file) => setFormulario({ ...formulario, archivo: file })}
            subiendo={subiendo}
            handleSubir={handleSubir}
            textoBotonSubir="Subir Documento"
            accept=".pdf,.doc,.docx,.jpg,.png"
          />
        </div>
      </form>
    </PanelSubida>
  );
};

export default PanelSubidaDocumentos;