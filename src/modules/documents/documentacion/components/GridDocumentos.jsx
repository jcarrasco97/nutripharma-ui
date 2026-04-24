import React from "react";
import { FileCheck, Trash2, Download, Loader2 } from "lucide-react";
import { Card, CardContent } from "@/shared/components/ui/Card";
import { Button } from "@/shared/components/ui/Button";
import { Badge } from "@/shared/components/ui/Badge";

const GridDocumentos = ({
  documentosFiltrados,
  isAdmin,
  handleBorrar,
  borrandoId,
  handleDescargar,
  descargandoId,
}) => {
  const formatearAlcance = (doc) => {
    switch (doc.alcance) {
      case "GLOBAL_TODOS":
        return (
          <Badge variant="accent" className="bg-accent/20 text-primary border-none px-2 py-1 text-[10px] uppercase">
            Para Todos
          </Badge>
        );
      case "GLOBAL_NUTRICIONISTAS":
        return (
          <Badge variant="outline" className="bg-emerald-100 text-emerald-700 border-none px-2 py-1 text-[10px] uppercase">
            Solo Nutricionistas
          </Badge>
        );
      case "GLOBAL_FARMACIAS":
        return (
          <Badge variant="outline" className="bg-amber-100 text-amber-700 border-none px-2 py-1 text-[10px] uppercase">
            Solo Farmacias
          </Badge>
        );
      case "INDIVIDUAL":
        return (
          <Badge variant="outline" className="bg-secondary/10 text-secondary border-none px-2 py-1 text-[10px] uppercase">
            {isAdmin ? `Para: ${doc.propietarioEmail}` : "Personal"}
          </Badge>
        );
      default:
        return doc.alcance;
    }
  };

  if (documentosFiltrados.length === 0) {
    return (
      <div className="text-center py-16">
        <FileCheck size={48} className="mx-auto text-neutral/30 mb-4" />
        <p className="text-neutral/70 font-bold">No se encontraron documentos.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
      {documentosFiltrados.map((doc) => (
        <Card
          key={doc.id}
          className="p-6 hover:border-accent/50 hover:shadow-lg transition-all flex flex-col justify-between group relative overflow-hidden bg-surface rounded-[2rem] border-2 border-neutral/5"
        >
          {isAdmin && (
            <Button
              variant="destructive"
              size="icon"
              onClick={() => handleBorrar(doc.id)}
              disabled={borrandoId === doc.id}
              title="Eliminar documento"
              className="absolute top-4 right-4 bg-red-50 text-red-600 hover:bg-red-600 hover:text-surface"
            >
              {borrandoId === doc.id ? (
                <Loader2 className="animate-spin" size={16} />
              ) : (
                <Trash2 size={16} />
              )}
            </Button>
          )}

          <CardContent className="p-0">
            <div className="flex justify-between items-start mb-4 pr-10">
              {formatearAlcance(doc)}
            </div>
            <h3
              className="font-black text-secondary mb-2 truncate text-lg"
              title={doc.nombreOriginal}
            >
              {doc.nombreOriginal}
            </h3>
            <p className="text-xs text-neutral font-bold flex items-center gap-1">
              <span className="uppercase">{doc.fechaSubida}</span>
            </p>
          </CardContent>

          <Button
            variant="outline"
            onClick={() => handleDescargar(doc.id, doc.nombreOriginal)}
            disabled={descargandoId === doc.id}
            className="mt-6 w-full bg-neutral/5 hover:bg-primary hover:text-surface text-secondary font-black py-6 rounded-xl flex items-center justify-center gap-2 transition-all border-transparent group-hover:border-primary"
          >
            {descargandoId === doc.id ? (
              <Loader2 className="animate-spin" size={16} />
            ) : (
              <Download size={16} />
            )}
            {descargandoId === doc.id ? "Descargando..." : "Descargar"}
          </Button>
        </Card>
      ))}
    </div>
  );
};

export default GridDocumentos;
