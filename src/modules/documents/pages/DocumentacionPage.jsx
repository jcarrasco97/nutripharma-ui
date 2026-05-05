import React, { useState } from "react";
import { UploadCloud, FileText, ReceiptText } from "lucide-react";

import { Tabs, TabsList, TabsTrigger } from "@/shared/components/ui/Tabs";
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

const DocumentacionPage = () => {
  const hook = useDocumentacion();

  const [tabActivo, setTabActivo] = useState("documentos");
  const [sheetAbierto, setSheetAbierto] = useState(false);
  const [updateCounter, setUpdateCounter] = useState(0);

  // ── 1. Botón de Acción Principal (Ahora usa size="lg") ──
  const botonSubir = (
    <Button
      onClick={() => setSheetAbierto(true)}
      className="w-full xl:w-auto bg-primary hover:bg-primary-hover text-surface font-bold gap-2 whitespace-nowrap transition-all active:scale-[0.98]"
    >
      <UploadCloud size={16} />
      {tabActivo === "documentos" ? "Subir Documento" : "Subir Factura"}
    </Button>
  );

  // ── 2. Segmented Control (Fondo blanco, activo en verde corporativo) ──
  const selectorVista = (
    <Tabs value={tabActivo} onValueChange={setTabActivo} className="w-full md:w-auto">
      <TabsList className="h-10 p-1 bg-surface border border-neutral/10 rounded-md flex w-full md:w-max">
        <TabsTrigger
          value="documentos"
          className="flex-1 md:flex-none px-4 text-sm font-medium rounded-md transition-all data-[state=active]:bg-primary/10 data-[state=active]:text-primary text-neutral/50 hover:text-secondary"
        >
          Documentos
        </TabsTrigger>
        <TabsTrigger
          value="facturas"
          className="flex-1 md:flex-none px-4 text-sm font-medium rounded-md transition-all data-[state=active]:bg-primary/10 data-[state=active]:text-primary text-neutral/50 hover:text-secondary"
        >
          Facturas
        </TabsTrigger>
      </TabsList>
    </Tabs>
  );

  return (
    <div className="space-y-6 animate-fade-in pb-10">

      {/* ── 3. Tablas con el Selector Integrado en su Toolbar ── */}

      {tabActivo === "documentos" && (
        <DataTableDocumentos
          documentos={hook.documentosFiltrados}
          isAdmin={hook.isAdmin}
          handleBorrar={hook.handleBorrar}
          handleDescargar={hook.handleDescargar}
          borrandoId={hook.borrandoId}
          descargandoId={hook.descargandoId}
          cargando={hook.cargando}
          toolbarStart={selectorVista}
          toolbarEnd={botonSubir} // <--- CAMBIADO A toolbarEnd
        />
      )}

      {tabActivo === "facturas" && (
        <DataTableFacturas
          esAdmin={hook.isAdmin}
          forceUpdate={updateCounter}
          toolbarStart={selectorVista}
          toolbarEnd={botonSubir} // <--- CAMBIADO A toolbarEnd
        />
      )}

      {/* ── 4. Sheet de subida (Se mantiene intacto) ── */}
      <Sheet open={sheetAbierto} onOpenChange={setSheetAbierto}>
        {tabActivo === "documentos" ? (
          <SheetContent
            side="right"
            className="w-full sm:max-w-2xl flex flex-col p-0 h-full data-[state=open]:animate-in data-[state=closed]:animate-out slide-in-from-right-1/2 duration-300"
          >
            <SheetHeader className="px-6 pt-6 pb-4 border-b border-neutral/10 shrink-0 bg-primary">
              <div className="flex items-center gap-3">
                <div className="bg-surface/20 p-2.5 rounded-md">
                  <UploadCloud size={18} className="text-surface" />
                </div>
                <div>
                  <SheetTitle className="text-surface text-base font-bold">
                    Subir Documento
                  </SheetTitle>
                  <p className="text-surface/70 text-xs font-medium mt-0.5">
                    Sube PDFs, Word o Imágenes directamente a la nube
                    corporativa.
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
                handleSubir={(e) => {
                  hook.handleSubir(e);
                }}
              />
            </ScrollArea>
          </SheetContent>
        ) : (
          <SheetContent
            side="right"
            className="w-full sm:max-w-2xl flex flex-col p-0 h-full data-[state=open]:animate-in data-[state=closed]:animate-out slide-in-from-right-1/2 duration-300"
          >
            <SheetHeader className="px-6 pt-6 pb-4 border-b border-neutral/10 shrink-0 bg-secondary">
              <div className="flex items-center gap-3">
                <div className="bg-surface/20 p-2.5 rounded-md">
                  <ReceiptText size={18} className="text-surface" />
                </div>
                <div>
                  <SheetTitle className="text-surface text-base font-bold">
                    Subir Factura de Gastos / Km
                  </SheetTitle>
                  <p className="text-surface/70 text-xs font-medium mt-0.5">
                    El sistema renombrará tu archivo automáticamente:
                    fecha_Km_Nombre_Apellidos
                  </p>
                </div>
              </div>
            </SheetHeader>

            <ScrollArea className="flex-1 px-6 py-6">
              <SubidaFacturas
                onSubidaExitosa={() => {
                  setUpdateCounter((c) => c + 1);
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