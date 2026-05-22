import React, { useState } from "react";
import { UploadCloud, ReceiptText } from "lucide-react";

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/shared/components/ui/Sheet";
import { ScrollArea } from "@/shared/components/ui/ScrollArea";
import { Button } from "@/shared/components/ui/Button";

import { useDocumentacion } from "../hooks/useDocumentacion";
import PanelSubidaDocumentos from "../components/PanelSubidaDocumentos";
import SubidaFacturas from "../components/SubidaFacturas";
import DataTableDocumentos from "../components/DataTableDocumentos";
import DataTableFacturas from "../components/DataTableFacturas";

const TODAS_LAS_TABS = [
  { id: "documentos", label: "Documentos" },
  { id: "facturas",   label: "Facturas" },
];

const DocumentacionPage = () => {
  const hook = useDocumentacion();

  const [tabActivo, setTabActivo] = useState("documentos");
  const [sheetAbierto, setSheetAbierto] = useState(false);
  const [updateCounter, setUpdateCounter] = useState(0);

  // Tabs visibles según rol — Farmacia solo ve "Documentos"
  const tabsVisibles = hook.esFarmacia
    ? TODAS_LAS_TABS.filter(t => t.id === "documentos")
    : TODAS_LAS_TABS;

  // Botón de subida: solo admin (documentos) o nutricionista (facturas)
  const mostrarBotonSubir =
    (hook.isAdmin && tabActivo === "documentos") ||
    (hook.isNutricionista && tabActivo === "facturas");

  const botonSubir = mostrarBotonSubir ? (
    <Button
      onClick={() => setSheetAbierto(true)}
      className="bg-primary hover:bg-primary-hover text-surface font-medium gap-2 whitespace-nowrap transition-all active:scale-[0.98]"
    >
      <UploadCloud size={16} />
      {hook.isAdmin ? "Subir Documento" : "Subir Factura"}
    </Button>
  ) : null;

  return (
    <div className="space-y-4 animate-fade-in pb-10 -mt-2 md:-mt-4">

      {/* TABS — patrón underline igual que AdministracionPage */}
      <div className="flex gap-2">
        {tabsVisibles.map((tab) => {
          const isActive = tabActivo === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setTabActivo(tab.id)}
              className={`pb-2 text-[14px] font-medium transition-colors whitespace-nowrap border-b-2 px-1 outline-none ${
                isActive
                  ? "border-primary text-primary"
                  : "border-transparent text-neutral/50 hover:text-secondary hover:border-neutral/30"
              }`}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* TABLA DOCUMENTOS */}
      {tabActivo === "documentos" && (
        <DataTableDocumentos
          documentos={hook.documentosFiltrados}
          isAdmin={hook.isAdmin}
          handleBorrar={hook.handleBorrar}
          handleDescargar={hook.handleDescargar}
          borrandoId={hook.borrandoId}
          descargandoId={hook.descargandoId}
          cargando={hook.cargando}
          toolbarEnd={botonSubir}
        />
      )}

      {/* TABLA FACTURAS */}
      {tabActivo === "facturas" && (
        <DataTableFacturas
          esAdmin={hook.isAdmin}
          forceUpdate={updateCounter}
          toolbarEnd={botonSubir}
        />
      )}

      {/* SHEET DE SUBIDA */}
      <Sheet open={sheetAbierto} onOpenChange={setSheetAbierto}>
        {hook.isAdmin ? (
          <SheetContent
            side="right"
            className="w-full sm:max-w-2xl flex flex-col p-0 h-full"
          >
            <SheetHeader className="px-6 pt-6 pb-4 border-b border-neutral/10 shrink-0 bg-primary">
              <div className="flex items-center gap-3">
                <div className="bg-surface/20 p-2.5 rounded-md">
                  <UploadCloud size={18} className="text-surface" />
                </div>
                <div>
                  <SheetTitle className="text-surface text-base font-medium">
                    Subir Documento
                  </SheetTitle>
                  <p className="text-surface/70 text-xs mt-0.5">
                    PDFs, Word o Imágenes directamente a la nube corporativa.
                  </p>
                </div>
              </div>
            </SheetHeader>
            <ScrollArea className="flex-1 px-6 py-6">
              <PanelSubidaDocumentos
                formulario={hook.formulario}
                setFormulario={hook.setFormulario}
                destinatarios={hook.destinatarios}
                subiendo={hook.subiendo}
                handleSubir={(e) => { hook.handleSubir(e); }}
              />
            </ScrollArea>
          </SheetContent>
        ) : (
          <SheetContent
            side="right"
            className="w-full sm:max-w-2xl flex flex-col p-0 h-full"
          >
            <SheetHeader className="px-6 pt-6 pb-4 border-b border-neutral/10 shrink-0 bg-secondary">
              <div className="flex items-center gap-3">
                <div className="bg-surface/20 p-2.5 rounded-md">
                  <ReceiptText size={18} className="text-surface" />
                </div>
                <div>
                  <SheetTitle className="text-surface text-base font-medium">
                    Subir Factura de Gastos / Km
                  </SheetTitle>
                  <p className="text-surface/70 text-xs mt-0.5">
                    El sistema renombrará tu archivo: fecha_Km_Nombre_Apellidos
                  </p>
                </div>
              </div>
            </SheetHeader>
            <ScrollArea className="flex-1 px-6 py-6">
              <SubidaFacturas
                onSubidaExitosa={() => {
                  setUpdateCounter(c => c + 1);
                  setSheetAbierto(false);
                }}
              />
            </ScrollArea>
          </SheetContent>
        )}
      </Sheet>
    </div>
  );
};

export default DocumentacionPage;