import React, { useState, useEffect } from "react";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/shared/components/ui/AlertDialog";
import { Input } from "@/shared/components/ui/Input";
import { Label } from "@/shared/components/ui/Label";
import { farmaciaService } from "@/modules/organization/farmacias";

const AjusteSaldoDialog = ({ farmacia, onClose, onExito }) => {
  const [nuevoSaldo, setNuevoSaldo] = useState("");
  const [nota, setNota] = useState("");
  const [enviando, setEnviando] = useState(false);

  useEffect(() => {
    if (farmacia) {
      setNuevoSaldo(Number(farmacia.saldoVirtual ?? 0).toFixed(2));
      setNota("");
    }
  }, [farmacia]);

  if (!farmacia) return null;

  const saldoActual = Number(farmacia.saldoVirtual ?? 0);
  const nuevoNum = parseFloat(nuevoSaldo);
  const diferencia = isNaN(nuevoNum) ? null : nuevoNum - saldoActual;
  const esValido = !isNaN(nuevoNum) && nuevoNum >= 0;

  const colorDiferencia =
    diferencia === null
      ? "text-neutral/40"
      : diferencia > 0
      ? "text-green-600"
      : diferencia < 0
      ? "text-red-600"
      : "text-neutral/40";

  const handleConfirmar = async (e) => {
    e.preventDefault();
    if (!esValido || enviando) return;
    setEnviando(true);
    try {
      const farmaciaActualizada = await farmaciaService.ajustarSaldo(
        farmacia.id,
        nuevoNum,
        nota || null,
      );
      onExito?.(farmaciaActualizada);
      onClose();
    } catch {
      // el error se muestra en el toast global si existe, si no, silencioso
    } finally {
      setEnviando(false);
    }
  };

  return (
    <AlertDialog open={!!farmacia} onOpenChange={(v) => !v && onClose()}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Ajustar saldo virtual</AlertDialogTitle>
          <AlertDialogDescription>
            Ajuste manual del saldo de{" "}
            <span className="font-bold text-secondary">{farmacia.nombre}</span>.
            Se registrará un movimiento de tipo <em>Ajuste Manual</em> en el historial.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <div className="space-y-4 py-2">
          <div className="flex items-center justify-between bg-neutral/5 rounded-lg px-4 py-3">
            <span className="text-sm text-neutral/60 font-medium">Saldo actual</span>
            <span className="text-base font-black text-secondary">
              {saldoActual.toFixed(2)}€
            </span>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="nuevo-saldo" className="text-sm font-semibold">
              Nuevo saldo (€)
            </Label>
            <Input
              id="nuevo-saldo"
              type="number"
              min="0"
              step="0.01"
              value={nuevoSaldo}
              onChange={(e) => setNuevoSaldo(e.target.value)}
              className="text-right font-bold text-base"
              placeholder="0.00"
            />
            {diferencia !== null && (
              <p className={`text-xs font-bold text-right ${colorDiferencia}`}>
                {diferencia > 0 ? "+" : ""}
                {diferencia.toFixed(2)}€ respecto al saldo actual
              </p>
            )}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="nota-ajuste" className="text-sm font-semibold">
              Motivo del ajuste{" "}
              <span className="font-normal text-neutral/40">(opcional, interno)</span>
            </Label>
            <Input
              id="nota-ajuste"
              value={nota}
              onChange={(e) => setNota(e.target.value)}
              placeholder="Ej: Corrección por error de sistema"
              maxLength={500}
            />
          </div>
        </div>

        <AlertDialogFooter>
          <AlertDialogCancel onClick={onClose} disabled={enviando}>
            Cancelar
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={handleConfirmar}
            disabled={!esValido || diferencia === 0 || enviando}
            className="bg-primary hover:bg-primary/90 text-white"
          >
            {enviando ? "Guardando…" : "Confirmar ajuste"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default AjusteSaldoDialog;
