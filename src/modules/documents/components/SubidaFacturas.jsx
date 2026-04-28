import React, { useState } from "react";
import { facturasService } from "../services/facturasService";
import { obtenerUltimos6Meses } from "@/shared/utils/mesesHelper";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/Select";
import { Field, FieldLabel, FieldContent } from "@/shared/components/ui/Field";
import ZonaSubidaArchivo from "@/shared/components/ZonaSubidaArchivo";
import { toast } from "sonner";

const SubidaFacturas = ({ onSubidaExitosa }) => {
  const [archivo, setArchivo] = useState(null);
  const [mesCorresponde, setMesCorresponde] = useState(
    obtenerUltimos6Meses()[0],
  );
  const [subiendo, setSubiendo] = useState(false);
  const [exito, setExito] = useState(false);

  const meses = obtenerUltimos6Meses();

  const handleSubir = async () => {
    if (!archivo) return;
    setSubiendo(true);
    setExito(false);
    try {
      const formData = new FormData();
      formData.append("archivo", archivo);
      formData.append("mesCorresponde", mesCorresponde);
      await facturasService.subirFactura(formData);
      setExito(true);
      setArchivo(null);
      setTimeout(() => setExito(false), 3000);
      if (onSubidaExitosa) onSubidaExitosa();
      toast.success("Factura subida correctamente.");
    } catch (error) {
      console.error(error);
      toast.error("Error al subir la factura.");
    } finally {
      setSubiendo(false);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <Field>
        <FieldLabel className="text-xs font-bold text-neutral/50 uppercase tracking-widest">
          Mes correspondiente
        </FieldLabel>
        <FieldContent>
          <Select value={mesCorresponde} onValueChange={setMesCorresponde}>
            <SelectTrigger className="w-full h-10 bg-surface border-neutral/10 rounded-xl text-sm font-medium text-secondary shadow-sm">
              <SelectValue placeholder="Seleccionar mes" />
            </SelectTrigger>
            <SelectContent className="rounded-xl shadow-lg border-neutral/10">
              {meses.map((m) => (
                <SelectItem
                  key={m}
                  value={m}
                  className="font-medium text-secondary"
                >
                  {m}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </FieldContent>
      </Field>

      <ZonaSubidaArchivo
        archivo={archivo}
        setArchivo={setArchivo}
        subiendo={subiendo}
        exito={exito}
        handleSubir={handleSubir}
        textoBotonSubir="Subir Gasto"
        accept=".pdf,.jpg,.jpeg,.png"
      />
    </div>
  );
};

export default SubidaFacturas;
