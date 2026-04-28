import React from "react";
import { Store, User, Car, X } from "lucide-react";
import {
  Sheet, SheetContent, SheetHeader, SheetTitle,
} from "@/shared/components/ui/Sheet";
import { Badge } from "@/shared/components/ui/Badge";
import { ScrollArea } from "@/shared/components/ui/ScrollArea";
import {
  Empty, EmptyHeader, EmptyMedia, EmptyTitle,
} from "@/shared/components/ui/Empty";

const ModalVerAsignaciones = ({
  modalAsignaciones,
  cerrarModalAsignaciones,
  nutricionistas,
}) => {
  if (!modalAsignaciones.visible || !modalAsignaciones.item) return null;

  const { tipo, item } = modalAsignaciones;

  const nutrisAsignados =
    tipo === "farmacia"
      ? nutricionistas.filter((n) =>
          n.asignaciones?.some((a) => a.farmaciaId === item.id)
        )
      : [];

  return (
    <Sheet open={modalAsignaciones.visible} onOpenChange={cerrarModalAsignaciones}>
      <SheetContent side="right" className="sm:max-w-sm flex flex-col p-0">
        <SheetHeader className="bg-secondary text-surface px-6 pt-6 pb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-surface/20 p-2 rounded-xl">
                {tipo === "nutricionista" ? (
                  <Store size={18} className="text-surface" />
                ) : (
                  <User size={18} className="text-surface" />
                )}
              </div>
              <div>
                <SheetTitle className="text-surface text-base font-bold">
                  {tipo === "nutricionista" ? "Farmacias Asignadas" : "Nutricionistas"}
                </SheetTitle>
                <p className="text-surface/70 text-xs font-medium mt-0.5">
                  {item.nombre} {item.apellidos || ""}
                </p>
              </div>
            </div>
            <button
              onClick={cerrarModalAsignaciones}
              className="text-surface/70 hover:text-surface transition-colors"
            >
              <X size={20} />
            </button>
          </div>
        </SheetHeader>

        <ScrollArea className="flex-1 px-6 py-4">
          <div className="space-y-2">
            {tipo === "nutricionista" && (
              item.asignaciones?.length === 0 ? (
                <Empty className="py-8">
                  <EmptyHeader>
                    <EmptyMedia variant="icon"><Store size={22} /></EmptyMedia>
                    <EmptyTitle className="text-sm">Sin farmacias asignadas</EmptyTitle>
                  </EmptyHeader>
                </Empty>
              ) : (
                item.asignaciones?.map((asig, idx) => (
                  <div
                    key={idx}
                    className="bg-neutral/5 border border-neutral/10 p-3 rounded-xl flex justify-between items-center"
                  >
                    <span className="font-bold text-secondary text-sm">{asig.farmaciaNombre}</span>
                    <Badge className="bg-accent/20 text-primary border-none font-bold flex items-center gap-1">
                      <Car size={11} /> {asig.kilometros} km
                    </Badge>
                  </div>
                ))
              )
            )}

            {tipo === "farmacia" && (
              nutrisAsignados.length === 0 ? (
                <Empty className="py-8">
                  <EmptyHeader>
                    <EmptyMedia variant="icon"><User size={22} /></EmptyMedia>
                    <EmptyTitle className="text-sm">Sin nutricionistas asignadas</EmptyTitle>
                  </EmptyHeader>
                </Empty>
              ) : (
                nutrisAsignados.map((n) => (
                  <div
                    key={n.id}
                    className="bg-neutral/5 border border-neutral/10 p-3 rounded-xl flex items-center gap-3"
                  >
                    <div className="w-8 h-8 bg-secondary/10 text-secondary rounded-full flex items-center justify-center font-bold text-xs shrink-0">
                      {n.nombre.charAt(0)}{n.apellidos?.charAt(0) || ""}
                    </div>
                    <span className="font-bold text-secondary text-sm">{n.nombre} {n.apellidos}</span>
                  </div>
                ))
              )
            )}
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
};

export default ModalVerAsignaciones;
