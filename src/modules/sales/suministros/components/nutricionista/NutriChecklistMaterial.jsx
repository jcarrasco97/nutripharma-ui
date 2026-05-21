import React from "react";
import { CheckCircle2, Clock, Send, Loader2 } from "lucide-react";
import { Button } from "@/shared/components/ui/Button";

const NutriChecklistMaterial = ({ materiales, seleccionados, onCheckbox, onSolicitar, enviando }) => (
  <div className="space-y-4">
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
      {materiales.map((mat) => {
        const isSelected = seleccionados.includes(mat.id);
        const isDisabled = !mat.disponible;

        return (
          <div
            key={mat.id}
            onClick={() => !isDisabled && onCheckbox(mat.id)}
            className={`relative p-4 rounded-md border transition-all flex gap-3 items-start select-none ${
              isDisabled
                ? "opacity-50 cursor-not-allowed bg-neutral/5"
                : isSelected
                ? "bg-primary/5 border-primary shadow-sm cursor-pointer"
                : "bg-surface border-neutral/10 hover:border-neutral/30 cursor-pointer"
            }`}
          >
            {/* Checkbox visual decorativo */}
            <div
              className={`w-5 h-5 rounded-md border flex items-center justify-center mt-0.5 shrink-0 transition-colors ${
                isSelected
                  ? "bg-primary border-primary text-surface"
                  : "border-neutral/30 bg-surface"
              }`}
            >
              {isSelected && <CheckCircle2 size={14} />}
            </div>

            <div className="flex-1 min-w-0">
              <p className="font-semibold text-secondary text-sm leading-tight">{mat.nombre}</p>
              <p className="text-xs font-medium text-neutral/50 mt-1">
                Cantidad estándar: {mat.cantidadEstandar} uds.
              </p>
            </div>

            {isDisabled && (
              <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider bg-amber-100 text-amber-700 px-2 py-0.5 rounded-md shrink-0">
                <Clock size={10} /> En curso
              </span>
            )}
          </div>
        );
      })}
    </div>

    {seleccionados.length > 0 && (
      <div className="bg-neutral/5 border border-neutral/10 rounded-md px-4 py-2.5 flex items-center justify-between">
        <p className="text-xs font-medium text-neutral/60">
          <span className="font-bold text-primary">{seleccionados.length}</span>{" "}
          {seleccionados.length === 1 ? "material seleccionado" : "materiales seleccionados"}
        </p>
      </div>
    )}

    <Button
      onClick={onSolicitar}
      disabled={seleccionados.length === 0 || enviando}
      isLoading={enviando}
      className="w-full gap-1.5 rounded-md bg-primary hover:bg-primary-hover text-surface font-semibold h-10 shadow-md shadow-primary/20"
    >
      <Send size={15} />
      Enviar Petición ({seleccionados.length})
    </Button>
  </div>
);

export default NutriChecklistMaterial;