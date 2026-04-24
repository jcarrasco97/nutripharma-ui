import React, { useState } from "react";
import { UploadCloud, ReceiptText, Check } from "lucide-react";
import { facturasService } from "../services/facturasService";
import { obtenerUltimos6Meses } from "@/shared/utils/mesesHelper";
import { Card, CardHeader, CardContent } from "@/shared/components/ui/Card";
import { Button } from "@/shared/components/ui/Button";
import { Input } from "@/shared/components/ui/Input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/components/ui/Select";
import { Field, FieldLabel, FieldContent } from "@/shared/components/ui/Field";

const SubidaFacturas = ({ onSubidaExitosa }) => {
  const [archivo, setArchivo] = useState(null);
  const [mesCorresponde, setMesCorresponde] = useState(obtenerUltimos6Meses()[0]);
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
    } catch (error) {
      console.error(error);
      alert("Error al subir la factura");
    } finally {
      setSubiendo(false);
    }
  };

  return (
    <Card className="bg-surface p-8 rounded-[2.5rem] shadow-sm border border-neutral/10 flex flex-col gap-6">
      <CardHeader className="p-0 flex flex-row items-center gap-4 border-b border-neutral/10 pb-4 space-y-0">
        <div className="bg-neutral/5 p-3 rounded-2xl text-primary">
          <ReceiptText size={24} />
        </div>
        <div>
          <h2 className="text-xl font-black text-secondary">Subir Factura de Gastos / Km</h2>
          <p className="text-sm font-medium text-neutral/70">El sistema renombrará tu archivo automáticamente para cumplir con el estándar: fecha_Km_Nombre_Apellidos</p>
        </div>
      </CardHeader>

      <CardContent className="p-0">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-end mb-6">
          <Field>
            <FieldLabel className="text-sm font-bold text-secondary mb-2">Mes al que corresponde la factura</FieldLabel>
            <FieldContent>
              <Select value={mesCorresponde} onValueChange={setMesCorresponde}>
                <SelectTrigger className="w-full bg-neutral/5 border-2 border-transparent focus:border-accent rounded-2xl px-4 py-6 text-secondary font-bold outline-none">
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

          <Field>
            <FieldLabel className="text-sm font-bold text-secondary mb-2">Seleccionar Archivo (PDF, JPG, PNG)</FieldLabel>
            <FieldContent>
              <Input
                type="file"
                accept=".pdf,.jpg,.jpeg,.png"
                onChange={(e) => setArchivo(e.target.files[0])}
                className="w-full bg-neutral/5 border-2 border-transparent focus-visible:border-accent focus-visible:ring-0 rounded-2xl px-4 py-3 h-auto text-secondary font-bold outline-none file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-bold file:bg-secondary file:text-surface hover:file:bg-secondary/90 file:cursor-pointer"
              />
            </FieldContent>
          </Field>
        </div>

        <Button
          onClick={handleSubir}
          disabled={!archivo || subiendo}
          className="w-full md:w-auto px-10 py-6 bg-primary text-surface font-black rounded-2xl hover:bg-primary-hover transition-colors flex items-center justify-center gap-2 self-start disabled:opacity-50"
        >
          {subiendo ? "Subiendo..." : (exito ? <><Check size={20} /> ¡Subida Exitosa!</> : <><UploadCloud size={20} /> Subir Gasto</>)}
        </Button>
      </CardContent>
    </Card>
  );
};

export default SubidaFacturas;
