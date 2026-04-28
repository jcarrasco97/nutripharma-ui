import React from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/Select";
import { Field, FieldLabel, FieldContent } from "@/shared/components/ui/Field";
import ZonaSubidaArchivo from "@/shared/components/ZonaSubidaArchivo";

const PanelSubidaDocumentos = ({
  formulario,
  setFormulario,
  destinatarios,
  subiendo,
  handleSubir,
}) => {
  return (
    <form onSubmit={handleSubir} className="flex flex-col gap-6">
      <div className="flex flex-col gap-4">
        <Field>
          <FieldLabel className="text-xs font-bold text-neutral/50 uppercase tracking-widest">
            Alcance del documento *
          </FieldLabel>
          <FieldContent>
            <Select
              value={formulario.alcance}
              onValueChange={(val) =>
                setFormulario({
                  ...formulario,
                  alcance: val,
                  propietarioEmail: "",
                })
              }
            >
              <SelectTrigger className="w-full h-10 bg-surface border-neutral/10 rounded-xl text-sm font-medium text-secondary shadow-sm">
                <SelectValue placeholder="Selecciona a quién va dirigido" />
              </SelectTrigger>
              <SelectContent className="rounded-xl shadow-lg border-neutral/10">
                <SelectItem
                  value="GLOBAL_TODOS"
                  className="font-medium text-secondary"
                >
                  Para Todos
                </SelectItem>
                <SelectItem
                  value="GLOBAL_NUTRICIONISTAS"
                  className="font-medium text-secondary"
                >
                  Solo Nutricionistas
                </SelectItem>
                <SelectItem
                  value="GLOBAL_FARMACIAS"
                  className="font-medium text-secondary"
                >
                  Solo Farmacias
                </SelectItem>
                <SelectItem
                  value="INDIVIDUAL"
                  className="font-medium text-secondary"
                >
                  Usuario Individual
                </SelectItem>
              </SelectContent>
            </Select>
          </FieldContent>
        </Field>

        {formulario.alcance === "INDIVIDUAL" && (
          <Field className="animate-in fade-in slide-in-from-top-2 duration-300">
            <FieldLabel className="text-xs font-bold text-neutral/50 uppercase tracking-widest">
              Seleccionar destinatario *
            </FieldLabel>
            <FieldContent>
              <Select
                value={formulario.propietarioEmail}
                onValueChange={(val) =>
                  setFormulario({ ...formulario, propietarioEmail: val })
                }
              >
                <SelectTrigger className="w-full h-10 bg-surface border-neutral/10 rounded-xl text-sm font-medium text-secondary shadow-sm">
                  <SelectValue placeholder="Busca un correo..." />
                </SelectTrigger>
                <SelectContent className="rounded-xl shadow-lg border-neutral/10">
                  {destinatarios && destinatarios.length > 0 ? (
                    destinatarios.map((dest) => (
                      <SelectItem
                        key={dest.email}
                        value={dest.email}
                        className="font-medium text-secondary"
                      >
                        {dest.nombreCompleto} ({dest.email})
                      </SelectItem>
                    ))
                  ) : (
                    <SelectItem value="no-data" disabled>
                      No hay usuarios disponibles
                    </SelectItem>
                  )}
                </SelectContent>
              </Select>
            </FieldContent>
          </Field>
        )}
      </div>

      <ZonaSubidaArchivo
        archivo={formulario.archivo}
        setArchivo={(file) => setFormulario({ ...formulario, archivo: file })}
        subiendo={subiendo}
        handleSubir={handleSubir}
        textoBotonSubir="Subir Documento"
        accept=".pdf,.doc,.docx,.jpg,.png"
      />
    </form>
  );
};

export default PanelSubidaDocumentos;
