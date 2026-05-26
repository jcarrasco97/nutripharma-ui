import React from "react";
import { Wallet } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/shared/components/ui/Sheet";
import HistorialMovimientosSaldo from "./HistorialMovimientosSaldo";

const MovimientosSaldoSheet = ({ farmacia, onClose }) => (
  <Sheet open={!!farmacia} onOpenChange={(v) => !v && onClose()}>
    <SheetContent side="right" className="w-full sm:max-w-2xl overflow-y-auto p-6">
      <SheetHeader className="mb-6">
        <div className="flex items-center gap-3">
          <div className="bg-primary/10 p-2.5 rounded-lg">
            <Wallet size={20} className="text-primary" />
          </div>
          <div>
            <SheetTitle className="text-base font-bold leading-tight">
              Movimientos de saldo
            </SheetTitle>
            <SheetDescription className="text-sm text-neutral/60 mt-0.5">
              {farmacia?.nombre}
            </SheetDescription>
          </div>
        </div>

        {farmacia && (
          <div className="mt-4 bg-neutral/5 rounded-xl px-4 py-3 flex items-center justify-between">
            <span className="text-sm text-neutral/60 font-medium">Saldo actual</span>
            <span className="text-xl font-black text-primary">
              {Number(farmacia.saldoVirtual ?? 0).toFixed(2)}€
            </span>
          </div>
        )}
      </SheetHeader>

      <HistorialMovimientosSaldo
        farmaciaId={farmacia?.id}
        esFarmacia={false}
      />
    </SheetContent>
  </Sheet>
);

export default MovimientosSaldoSheet;
