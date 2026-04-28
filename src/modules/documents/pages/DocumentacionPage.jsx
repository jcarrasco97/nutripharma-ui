import React, { useState } from "react";
import { UploadCloud, FileText, ReceiptText } from "lucide-react";

import { Tabs, TabsList, TabsTrigger } from "@/shared/components/ui/Tabs";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/shared/components/ui/Card";
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

  // ── Botón estandarizado que inyectaremos en la Toolbar de la tabla ──
  const botonSubir = (
    <Button
      onClick={() => setSheetAbierto(true)}
      // Quitamos el w-full md:w-auto y lo dejamos como w-full xl:w-auto (igual que en Admin)
      className="w-full xl:w-auto h-11 bg-primary hover:bg-primary-hover text-surface font-bold gap-2 whitespace-nowrap rounded-xl shadow-sm px-5 transition-all active:scale-[0.98]"
    >
      <UploadCloud size={16} />
      {tabActivo === "documentos" ? "Subir Documento" : "Subir Factura"}
    </Button>
  );

  return (
    <div className="space-y-6 animate-fade-in pb-10">
      {/* ── 1. Fila superior: Tabs + Botón Subir ── */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-neutral/10 pb-4">
        <Tabs
          value={tabActivo}
          onValueChange={setTabActivo}
          className="w-full md:w-auto overflow-x-auto custom-scrollbar"
        >
          {/* Bajamos de h-11 a h-10 */}
          <TabsList className="h-10 p-1 bg-neutral/5 border border-neutral/10 rounded-xl w-max flex shadow-sm">
            <TabsTrigger
              value="documentos"
              className="gap-2 px-5 text-sm font-bold rounded-lg transition-all duration-200 data-[state=active]:bg-primary data-[state=active]:text-surface data-[state=active]:shadow-sm"
            >
              <FileText size={16} />
              Documentos
            </TabsTrigger>
            <TabsTrigger
              value="facturas"
              className="gap-2 px-5 text-sm font-bold rounded-lg transition-all duration-200 data-[state=active]:bg-primary data-[state=active]:text-surface data-[state=active]:shadow-sm"
            >
              <ReceiptText size={16} />
              Facturas
            </TabsTrigger>
          </TabsList>
        </Tabs>

        {/* Bajamos de h-11 a h-10 */}
        <Button
          onClick={() => setSheetAbierto(true)}
          className="w-full md:w-auto h-10 bg-primary hover:bg-primary-hover text-surface font-bold gap-2 whitespace-nowrap rounded-xl shadow-sm px-5 transition-all active:scale-[0.98]"
        >
          <UploadCloud size={16} />
          {tabActivo === "documentos" ? "Subir Documento" : "Subir Factura"}
        </Button>
      </div>

      {/* ── 2. Contenedor Unificado (Card) ── */}
      <Card className="overflow-hidden shadow-sm border-neutral/10">
        <CardContent className="p-6">
          {tabActivo === "documentos" && (
            <DataTableDocumentos
              documentos={hook.documentosFiltrados}
              isAdmin={hook.isAdmin}
              handleBorrar={hook.handleBorrar}
              handleDescargar={hook.handleDescargar}
              borrandoId={hook.borrandoId}
              descargandoId={hook.descargandoId}
              cargando={hook.cargando}
              botonSubir={botonSubir} // Pasamos el botón a la toolbar
            />
          )}

          {tabActivo === "facturas" && (
            <DataTableFacturas
              esAdmin={hook.isAdmin}
              forceUpdate={updateCounter}
              botonSubir={botonSubir} // Pasamos el botón a la toolbar
            />
          )}
        </CardContent>
      </Card>

      {/* ── 3. Sheet de subida (Extra ancho y animado) ── */}
      <Sheet open={sheetAbierto} onOpenChange={setSheetAbierto}>
        {tabActivo === "documentos" ? (
          <SheetContent
            side="right"
            className="w-full sm:max-w-2xl flex flex-col p-0 h-full data-[state=open]:animate-in data-[state=closed]:animate-out slide-in-from-right-1/2 duration-300"
          >
            <SheetHeader className="px-6 pt-6 pb-4 border-b border-neutral/10 shrink-0 bg-primary">
              <div className="flex items-center gap-3">
                <div className="bg-surface/20 p-2.5 rounded-xl">
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
                <div className="bg-surface/20 p-2.5 rounded-xl">
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
