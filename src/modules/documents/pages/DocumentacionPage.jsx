import React, { useState } from "react";
import { FileText, Loader2, Download, Trash2 } from "lucide-react";
import { Badge } from "@/shared/components/ui/Badge";
import { Button } from "@/shared/components/ui/Button";
import PanelRepositorio from "@/shared/components/PanelRepositorio";

import { useDocumentacion } from "../hooks/useDocumentacion";
import PanelSubidaDocumentos from "../components/PanelSubidaDocumentos";
import SubidaFacturas from "../components/SubidaFacturas";
import ListadoFacturas from "../components/ListadoFacturas";

// Estas dos funciones van fuera del componente, justo antes del const DocumentacionPage
const obtenerColorAlcance = () => 'bg-primary text-surface';

const obtenerLabelAlcance = (doc, isAdmin) => {
  switch (doc.alcance) {
    case "GLOBAL_TODOS": return "Para todos";
    case "GLOBAL_NUTRICIONISTAS": return "Solo nutricionistas";
    case "GLOBAL_FARMACIAS": return "Solo farmacias";
    case "INDIVIDUAL": return isAdmin ? `Para: ${doc.propietarioEmail}` : "Personal";
    default: return doc.alcance;
  }
};

const DocumentacionPage = () => {
  const hook = useDocumentacion();
  const [updateCounter, setUpdateCounter] = useState(0);

  if (hook.cargando) {
    return (
      <div className="flex justify-center p-20">
        <Loader2 className="animate-spin text-primary" size={48} />
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-in pb-10">
      {/* 1. Panel de subida */}
      {hook.isAdmin && <PanelSubidaDocumentos {...hook} />}
      {!hook.isAdmin && !hook.esFarmacia && (
        <SubidaFacturas onSubidaExitosa={() => setUpdateCounter(c => c + 1)} />
      )}

      {/* 2. Repositorios en grid de dos columnas */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Panel izquierdo: documentos generales */}
        <PanelRepositorio
          icono={<FileText size={20} />}
          titulo="Repositorio Documental"
          headerClassName="bg-primary text-surface"
          filtroPrincipal={hook.filtroMes}
          setFiltroPrincipal={hook.setFiltroMes}
          opcionesFiltro={[
            ...(hook.mesesDisponibles ?? []).map((m) => ({
              value: m,
              label: m === "Todos" ? "Todas las fechas" : m,
            })),
          ]}
          placeholderFiltro="Todas las fechas"
          filtroBusqueda={hook.filtroTexto}
          setFiltroBusqueda={hook.setFiltroTexto}
          placeholderBusqueda="Buscar documento..."
          items={hook.documentosFiltrados}
          cargando={hook.cargando}
          emptyIcon={<FileText size={32} className="text-neutral/30" />}
          emptyTitulo="No se encontraron documentos."
          renderItem={(doc) => (
            <div
              key={doc.id}
              className="border border-neutral/10 bg-neutral/5 p-4 rounded-xl flex justify-between items-center gap-4 hover:border-primary/20 transition-colors"
            >
              <div className="min-w-0 flex-1">
                <Badge className={`border-none px-2 py-0.5 text-[10px] font-black uppercase mb-1.5 inline-block ${obtenerColorAlcance(doc.alcance)}`}>
                  {obtenerLabelAlcance(doc, hook.isAdmin)}
                </Badge>
                <p className="font-bold text-secondary truncate text-sm" title={doc.nombreOriginal}>
                  {doc.nombreOriginal}
                </p>
                <div className="flex text-xs text-neutral/60 font-medium mt-0.5 gap-3">
                  <span>Subido: {new Date(doc.fechaSubida).toLocaleDateString()}</span>
                  <span className="font-bold text-primary">
                    {doc.subidoPor ? doc.subidoPor : "admin@nutripharma.com"}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-1 flex-shrink-0">
                {hook.isAdmin && (
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => hook.handleBorrar(doc.id)}
                    disabled={hook.borrandoId === doc.id}
                    className="rounded-lg text-red-500 hover:bg-red-50 hover:text-red-600"
                    title="Eliminar documento"
                  >
                    {hook.borrandoId === doc.id
                      ? <Loader2 size={16} className="animate-spin" />
                      : <Trash2 size={16} />
                    }
                  </Button>
                )}
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => hook.handleDescargar(doc.id, doc.nombreOriginal)}
                  disabled={hook.descargandoId === doc.id}
                  className="rounded-lg"
                  title="Descargar documento"
                >
                  {hook.descargandoId === doc.id
                    ? <Loader2 size={16} className="animate-spin" />
                    : <Download size={16} />
                  }
                </Button>
              </div>
            </div>
          )}
        />

        {/* Panel derecho: facturas nutricionistas */}
        {(hook.isAdmin || (!hook.isAdmin && !hook.esFarmacia)) && (
          <ListadoFacturas
            esAdmin={hook.isAdmin}
            forceUpdate={updateCounter}
          />
        )}
      </div>
    </div>
  );
};

export default DocumentacionPage;