import React from "react";
import { UploadCloud, ShieldCheck, Loader2 } from "lucide-react";
import { Card, CardHeader, CardContent } from "@/shared/components/ui/Card";
import { Button } from "@/shared/components/ui/Button";
import { Input } from "@/shared/components/ui/Input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/components/ui/Select";
import { Field, FieldLabel, FieldContent } from "@/shared/components/ui/Field";

const PanelSubidaDocumentos = ({
  formulario,
  setFormulario,
  destinatarios,
  subiendo,
  handleSubir,
}) => {
  return (
    <Card className="bg-surface p-8 rounded-[2.5rem] shadow-sm border border-neutral/10">
      <CardHeader className="p-0 flex flex-row items-center gap-4 mb-6 space-y-0">
        <div className="bg-primary p-4 rounded-3xl text-surface shadow-lg shadow-primary/20">
          <UploadCloud size={28} />
        </div>
        <div>
          <h2 className="text-2xl font-black text-secondary">
            Subir Documento
          </h2>
          <p className="text-neutral font-medium">
            Sube PDFs, Word o Imágenes directamente a la nube corporativa.
          </p>
        </div>
      </CardHeader>

      <CardContent className="p-0">
        <form
          onSubmit={handleSubir}
          className="grid grid-cols-1 md:grid-cols-2 gap-6 items-end"
        >
          <div className="space-y-4">
            <Field>
              <FieldLabel className="text-xs font-bold text-neutral uppercase tracking-widest mb-1">
                Destinatarios *
              </FieldLabel>
              <FieldContent>
                <Select
                  value={formulario.alcance}
                  onValueChange={(value) =>
                    setFormulario({
                      ...formulario,
                      alcance: value,
                      propietarioEmail: "",
                    })
                  }
                >
                  <SelectTrigger className="w-full bg-neutral/5 border-neutral/10 rounded-xl text-sm font-medium text-secondary">
                    <SelectValue placeholder="Seleccionar alcance" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="GLOBAL_TODOS">Toda la empresa (General)</SelectItem>
                    <SelectItem value="GLOBAL_NUTRICIONISTAS">Todas las Nutricionistas</SelectItem>
                    <SelectItem value="GLOBAL_FARMACIAS">Todas las Farmacias</SelectItem>
                    <SelectItem value="INDIVIDUAL">Envío Individual (Privado)</SelectItem>
                  </SelectContent>
                </Select>
              </FieldContent>
            </Field>

            {formulario.alcance === "INDIVIDUAL" && (
              <Field className="animate-fade-in">
                <FieldLabel className="text-xs font-bold text-neutral uppercase tracking-widest mb-1">
                  Seleccionar Usuario *
                </FieldLabel>
                <FieldContent>
                  <Select
                    required
                    value={formulario.propietarioEmail}
                    onValueChange={(value) =>
                      setFormulario({
                        ...formulario,
                        propietarioEmail: value,
                      })
                    }
                  >
                    <SelectTrigger className="w-full bg-neutral/5 border-neutral/10 rounded-xl text-sm font-bold text-secondary">
                      <SelectValue placeholder="-- Elige un usuario --" />
                    </SelectTrigger>
                    <SelectContent>
                      {destinatarios.map((user, idx) => (
                        <SelectItem key={idx} value={user.email}>
                          {user.nombreCompleto} ({user.email})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FieldContent>
              </Field>
            )}
          </div>

          <div className="space-y-4">
            <Field>
              <FieldLabel className="text-xs font-bold text-neutral uppercase tracking-widest mb-1">
                Seleccionar Archivo *
              </FieldLabel>
              <FieldContent>
                <Input
                  id="fileInput"
                  type="file"
                  required
                  onChange={(e) =>
                    setFormulario({ ...formulario, archivo: e.target.files[0] })
                  }
                  accept=".pdf,.doc,.docx,.jpg,.png"
                  className="w-full h-auto text-sm text-neutral file:mr-4 file:py-3 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-accent/20 file:text-primary hover:file:bg-accent/40 transition-colors bg-transparent border-none p-0 shadow-none"
                />
              </FieldContent>
            </Field>
          </div>

          <div className="md:col-span-2 pt-4 border-t border-neutral/10 flex justify-end">
            <Button
              type="submit"
              disabled={subiendo}
              className="bg-primary hover:bg-primary-hover disabled:bg-neutral/30 text-surface font-black px-8 py-6 rounded-xl flex items-center gap-2 transition-colors shadow-lg shadow-primary/20"
            >
              {subiendo ? (
                <Loader2 className="animate-spin" size={18} />
              ) : (
                <ShieldCheck size={18} />
              )}
              {subiendo ? "Subiendo a la nube..." : "Guardar Documento"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default PanelSubidaDocumentos;
