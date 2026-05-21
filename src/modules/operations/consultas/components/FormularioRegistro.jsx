import React from "react";
import {
  AlertTriangle,
  CheckCircle,
  Camera,
  Eye,
  RefreshCw,
  Trash2,
} from "lucide-react";
import { Input } from "@/shared/components/ui/Input";
import { Label } from "@/shared/components/ui/Label";
import { Button } from "@/shared/components/ui/Button";
import { Textarea } from "@/shared/components/ui/Textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/Select";

const FormularioRegistro = ({
  farmacias,
  formulario,
  onChange,
  onPreSubmit,
  handleArchivoChange,
  previewUrl,
  horasOcupadasHoy = [],
  onVerPreview,
}) => {
  const opcionesHora = [];
  for (let h = 7; h <= 22; h++) {
    const hora = h.toString().padStart(2, "0");
    opcionesHora.push(`${hora}:00`, `${hora}:30`);
  }

  const estaBloqueado = (hora) => {
    return horasOcupadasHoy.some((h) => hora >= h.inicio && hora < h.fin);
  };

  const duracionValida = () => {
    if (!formulario.horaInicio || !formulario.horaFin) return false;
    return formulario.horaInicio < formulario.horaFin;
  };

  return (
    <div className="space-y-6">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          onPreSubmit();
        }}
        className="space-y-6"
      >
        {/* FARMACIA Y FECHA */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="md:col-span-2">
            <Label className="text-xs font-bold text-neutral/50 uppercase tracking-wider mb-2 block">
              Farmacia
            </Label>
            <Select
              name="farmaciaId"
              value={formulario.farmaciaId?.toString()}
              onValueChange={(val) =>
                onChange({ target: { name: "farmaciaId", value: val } })
              }
              required
            >
              <SelectTrigger className="h-10 bg-surface border-neutral/10 text-secondary rounded-md">
                <SelectValue placeholder="Seleccione una farmacia" />
              </SelectTrigger>
              <SelectContent>
                {farmacias.length === 0 ? (
                  <SelectItem value="none" disabled>
                    Sin farmacias asignadas
                  </SelectItem>
                ) : (
                  farmacias.map((f) => (
                    <SelectItem key={f.id} value={f.id.toString()}>
                      {f.nombre}
                    </SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>
          </div>
          <div className="md:col-span-1">
            <Label className="text-xs font-bold text-neutral/50 uppercase tracking-wider mb-2 block">
              Fecha
            </Label>
            <Input
              type="date"
              name="fecha"
              value={formulario.fecha}
              onChange={onChange}
              className="h-10 bg-surface border-neutral/10 rounded-md text-secondary"
              required
            />
          </div>
        </div>

        {/* ENTRADA Y SALIDA */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label className="text-xs font-bold text-neutral/50 uppercase tracking-wider mb-2 block">
              Entrada
            </Label>
            <Select
              name="horaInicio"
              value={formulario.horaInicio}
              onValueChange={(val) =>
                onChange({ target: { name: "horaInicio", value: val } })
              }
            >
              <SelectTrigger className="h-10 bg-surface border-neutral/10 text-secondary rounded-md">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {opcionesHora.map((h) => (
                  <SelectItem
                    key={`ini-${h}`}
                    value={h}
                    disabled={estaBloqueado(h)}
                  >
                    {h} {estaBloqueado(h) ? " (Ocupado)" : ""}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label className="text-xs font-bold text-neutral/50 uppercase tracking-wider mb-2 block">
              Salida
            </Label>
            <Select
              name="horaFin"
              value={formulario.horaFin}
              onValueChange={(val) =>
                onChange({ target: { name: "horaFin", value: val } })
              }
            >
              <SelectTrigger className="h-10 bg-surface border-neutral/10 text-secondary rounded-md">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {opcionesHora.map((h) => (
                  <SelectItem
                    key={`fin-${h}`}
                    value={h}
                    disabled={estaBloqueado(h)}
                  >
                    {h} {estaBloqueado(h) ? " (Ocupado)" : ""}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {!duracionValida() && formulario.horaInicio && formulario.horaFin && (
          <div className="flex items-start gap-1.5 text-red-500 text-[10px] font-black uppercase tracking-widest -mt-2">
            <AlertTriangle size={14} /> La salida debe ser posterior a la
            entrada.
          </div>
        )}

        {/* MÉTRICAS (2x2) */}
        <div className="grid grid-cols-2 gap-4">
          {[
            { id: "nuevas", label: "Nuevas" },
            { id: "revisiones", label: "Revisiones" },
            { id: "promociones", label: "Promocionales" },
            { id: "personalFarmacia", label: "Personal" },
          ].map((item) => (
            <div key={item.id} className="relative">
              <Label className="text-xs font-bold text-neutral/50 uppercase tracking-wider mb-2 block">
                {item.label}
              </Label>
              <Input
                type="number"
                inputMode="numeric"
                pattern="[0-9]*"
                name={item.id}
                value={formulario[item.id]}
                onChange={onChange}
                onFocus={(e) => e.target.select()}
                className="h-10 bg-surface border-neutral/10 rounded-md text-secondary"
              />
            </div>
          ))}
        </div>

        {/* OBSERVACIONES */}
        <div>
          <Label className="text-xs font-bold text-neutral/50 uppercase tracking-wider mb-2 block">
            Observaciones (Opcional)
          </Label>
          <Textarea
            name="observacionesJornada"
            value={formulario.observacionesJornada}
            onChange={onChange}
            rows="2"
            placeholder="Añade notas de la jornada..."
            className="bg-surface border-neutral/10 rounded-md text-secondary resize-none font-bold"
          />
        </div>

        {/* EVIDENCIA FOTOGRÁFICA */}
        <div className="flex flex-col gap-2 pt-2 border-t border-neutral/10">
          <span className="text-xs font-bold text-neutral/50 uppercase tracking-wider flex items-center gap-1.5 mb-2 block">
            <Camera size={14} /> Evidencia (Opcional)
          </span>

          {!previewUrl ? (
            <Button
              variant="outline"
              className="w-full h-10 rounded-md cursor-pointer text-xs font-bold uppercase tracking-wider bg-neutral/5 hover:bg-neutral/10 text-secondary border border-neutral/10"
              asChild
            >
              <label>
                Añadir Foto
                <input
                  type="file"
                  className="hidden"
                  accept="image/*"
                  onChange={handleArchivoChange}
                />
              </label>
            </Button>
          ) : (
            <div className="flex gap-2 w-full">
              <Button
                type="button"
                variant="outline"
                onClick={onVerPreview}
                className="flex-1 h-10 rounded-md text-xs font-bold uppercase tracking-wider"
              >
                <Eye size={14} /> Ver
              </Button>
              <Button
                variant="outline"
                className="flex-1 h-10 rounded-md cursor-pointer text-xs font-bold uppercase tracking-wider"
                asChild
              >
                <label>
                  <RefreshCw size={14} /> Sustituir
                  <input
                    type="file"
                    className="hidden"
                    accept="image/*"
                    onChange={handleArchivoChange}
                  />
                </label>
              </Button>
              <Button
                type="button"
                variant="destructive"
                onClick={() => handleArchivoChange({ target: { files: [] } })}
                className="flex-1 h-10 rounded-md text-xs font-bold uppercase tracking-wider"
              >
                <Trash2 size={14} /> Borrar
              </Button>
            </div>
          )}
        </div>

        {/* BOTÓN SUBMIT */}
        <Button
          type="submit"
          disabled={farmacias.length === 0 || !duracionValida()}
          className="w-full h-10 bg-primary hover:bg-primary-hover text-surface font-bold rounded-md transition-all active:scale-[0.98] flex justify-center items-center gap-2 mt-4"
        >
          <CheckCircle size={18} /> Enviar
        </Button>
      </form>
    </div>
  );
};

export default FormularioRegistro;
