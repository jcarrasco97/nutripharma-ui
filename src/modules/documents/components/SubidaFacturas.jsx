import React, { useState } from "react";
import { ReceiptText } from "lucide-react";
import { facturasService } from "../services/facturasService";
import { obtenerUltimos6Meses } from "@/shared/utils/mesesHelper";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/components/ui/Select";
import { Field, FieldLabel, FieldContent } from "@/shared/components/ui/Field";
import PanelSubida from "@/shared/components/PanelSubida";
import ZonaSubidaArchivo from "@/shared/components/ZonaSubidaArchivo";
import { toast } from "sonner";

const SubidaFacturas = ({ onSubidaExitosa }) => {
  const [archivo, setArchivo] = useState(null);
  const [mesCorresponde, setMesCorresponde] = useState(obtenerUltimos6Meses()[0]);
  const [subiendo, setSubiendo] = useState(false);
  const [exito, setExito] = useState(false);
  const [open, setOpen] = useState(false);

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
    <PanelSubida
      open={open}
      onOpenChange={setOpen}
      icono={<ReceiptText size={18} />}
      titulo="Subir Factura de Gastos / Km"
      descripcion="El sistema renombrará tu archivo automáticamente: fecha_Km_Nombre_Apellidos"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch mt-4">

        {/* IZQUIERDA: Filtro de Mes */}
        <div className="flex flex-col gap-5 border-r border-neutral/10 pr-6">
          <Field>
            <FieldLabel className="text-xs font-bold text-neutral uppercase tracking-widest mb-1">
              Mes correspondiente
            </FieldLabel>
            <FieldContent>
              <Select value={mesCorresponde} onValueChange={setMesCorresponde}>
                <SelectTrigger className="w-full bg-neutral/5 border-neutral/10 rounded-xl text-sm font-medium text-secondary">
                  <SelectValue placeholder="Seleccionar mes" />
                </SelectTrigger>
                <SelectContent>
                  {meses.map(m => (
                    <SelectItem key={m} value={m}>{m}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </FieldContent>
          </Field>
        </div>

        {/* DERECHA: Zona de Subida */}
        <div className="flex flex-col justify-center items-center h-full">
          <Field className="w-full">
            <FieldLabel className="text-xs font-bold text-neutral uppercase tracking-widest mb-1">
              Archivo (PDF, JPG, PNG)
            </FieldLabel>
            <FieldContent>
              <ZonaSubidaArchivo
                archivo={archivo}
                setArchivo={setArchivo}
                subiendo={subiendo}
                exito={exito}
                handleSubir={handleSubir}
                textoBotonSubir="Subir Gasto"
                accept=".pdf,.jpg,.jpeg,.png"
              />
            </FieldContent>
          </Field>
        </div>
      </div>
    </PanelSubida>
  );
};

export default SubidaFacturas;