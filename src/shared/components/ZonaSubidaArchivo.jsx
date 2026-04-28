import React, { useRef, useEffect } from "react";
import { CloudUpload, FileCheck, Loader2, X, Check } from "lucide-react";
import { Button } from "@/shared/components/ui/Button";
import {
  Empty,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
  EmptyDescription,
} from "@/shared/components/ui/Empty";

const ZonaSubidaArchivo = ({
  archivo,
  setArchivo,
  subiendo,
  exito = false,
  handleSubir,
  accept = ".pdf,.doc,.docx,.jpg,.png",
  textoBotonSubir = "Subir Archivo",
}) => {
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (!archivo && fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }, [archivo]);

  const triggerFileInput = () => {
    if (fileInputRef.current) fileInputRef.current.click();
  };

  return (
    <div className="w-full">
      <input
        ref={fileInputRef}
        type="file"
        required
        onChange={(e) => setArchivo(e.target.files[0])}
        accept={accept}
        className="hidden"
      />

      {!archivo ? (
        <Empty
          className="h-[230px] flex flex-col justify-center border border-dashed border-neutral/20 w-full bg-neutral/5 rounded-2xl transition-all hover:bg-neutral/10 cursor-pointer"
          onClick={triggerFileInput}
        >
          <EmptyHeader className="flex flex-col items-center justify-center space-y-3">
            <EmptyMedia
              variant="icon"
              className="bg-primary/10 text-primary mb-0"
            >
              <CloudUpload size={24} />
            </EmptyMedia>
            <EmptyTitle className="text-base text-secondary font-bold m-0">
              Archivo sin seleccionar
            </EmptyTitle>
            <EmptyDescription className="text-neutral/50 font-medium m-0 h-[20px]">
              Selecciona el archivo que deseas subir
            </EmptyDescription>
            <div className="pt-2 flex items-center justify-center h-10 w-full">
              <Button
                type="button"
                variant="outline"
                onClick={(e) => {
                  e.stopPropagation();
                  triggerFileInput();
                }}
                className="h-10 rounded-xl bg-surface border-neutral/20 text-secondary font-medium shadow-sm hover:bg-neutral/5"
              >
                Seleccionar Archivos
              </Button>
            </div>
          </EmptyHeader>
        </Empty>
      ) : (
        <Empty className="h-[230px] flex flex-col justify-center border border-primary/20 w-full bg-primary/5 rounded-2xl animate-in zoom-in-95 duration-300">
          <EmptyHeader className="flex flex-col items-center justify-center space-y-3">
            <EmptyMedia
              variant="icon"
              className="bg-primary/10 text-primary mb-0 shadow-sm"
            >
              <FileCheck size={24} />
            </EmptyMedia>
            <EmptyTitle className="text-base text-secondary font-bold m-0">
              Archivo listo para subir
            </EmptyTitle>
            <EmptyDescription
              className="text-primary font-bold m-0 h-[20px] truncate max-w-[250px]"
              title={archivo.name}
            >
              {archivo.name}
            </EmptyDescription>

            <div className="pt-2 flex items-center gap-3 w-full justify-center h-10">
              <Button
                type="button"
                onClick={handleSubir}
                disabled={subiendo}
                className="h-10 rounded-xl bg-primary hover:bg-primary-hover disabled:bg-neutral/30 text-surface font-bold transition-colors shadow-sm w-auto"
              >
                {subiendo ? (
                  <Loader2 className="animate-spin mr-2" size={16} />
                ) : exito ? (
                  <Check className="mr-2" size={16} />
                ) : null}
                {subiendo ? "Subiendo..." : exito ? "¡Exito!" : textoBotonSubir}
              </Button>

              <Button
                type="button"
                variant="outline"
                onClick={triggerFileInput}
                className="h-10 rounded-xl font-medium border-neutral/20 text-secondary hover:bg-neutral/10 w-auto bg-surface shadow-sm"
              >
                Sustituir
              </Button>

              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={(e) => {
                  e.preventDefault();
                  setArchivo(null);
                }}
                className="h-10 w-10 rounded-xl text-destructive bg-destructive/10 hover:bg-destructive/20 hover:text-destructive transition-colors flex-shrink-0"
                title="Cancelar selección"
              >
                <X size={18} />
              </Button>
            </div>
          </EmptyHeader>
        </Empty>
      )}
    </div>
  );
};

export default ZonaSubidaArchivo;
