import React, { useRef, useEffect } from "react";
import { CloudUpload, FileCheck, Loader2, X, Check } from "lucide-react";
import { Button } from "@/shared/components/ui/Button";
import { Empty, EmptyHeader, EmptyMedia, EmptyTitle, EmptyDescription } from "@/shared/components/ui/Empty";

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

    // NUEVO: Efecto que limpia el input nativo cuando el estado 'archivo' vuelve a null
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
                <Empty className="h-[230px] flex flex-col justify-center border border-dashed border-neutral/20 w-full bg-neutral/5 rounded-2xl transition-all hover:bg-neutral/10 cursor-pointer" onClick={triggerFileInput}>
                    <EmptyHeader className="flex flex-col items-center justify-center space-y-3">
                        <EmptyMedia variant="icon" className="bg-primary/10 text-primary mb-0">
                            <CloudUpload size={24} />
                        </EmptyMedia>
                        <EmptyTitle className="text-base text-secondary font-bold m-0">
                            Archivo sin seleccionar
                        </EmptyTitle>
                        <EmptyDescription className="text-neutral/60 m-0 h-[20px]">
                            Selecciona el archivo que deseas subir
                        </EmptyDescription>
                        <div className="pt-2 flex items-center justify-center h-10 w-full">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={(e) => { e.stopPropagation(); triggerFileInput(); }}
                                className="bg-surface text-secondary font-normal"
                            >
                                Seleccionar Archivos
                            </Button>
                        </div>
                    </EmptyHeader>
                </Empty>
            ) : (
                <Empty className="h-[230px] flex flex-col justify-center border border-primary/20 w-full bg-primary/5 rounded-2xl animate-in zoom-in-95 duration-300">
                    <EmptyHeader className="flex flex-col items-center justify-center space-y-3">
                        <EmptyMedia variant="icon" className="bg-primary/10 text-primary mb-0">
                            <FileCheck size={24} />
                        </EmptyMedia>
                        <EmptyTitle className="text-base text-secondary font-bold m-0">
                            Archivo listo para subir
                        </EmptyTitle>
                        <EmptyDescription className="text-primary font-medium m-0 h-[20px] truncate max-w-[250px]" title={archivo.name}>
                            {archivo.name}
                        </EmptyDescription>

                        <div className="pt-2 flex items-center gap-3 w-full justify-center h-10">
                            <Button
                                type="button"
                                onClick={handleSubir}
                                disabled={subiendo}
                                className="bg-primary hover:bg-primary-hover disabled:bg-neutral/30 text-surface font-normal transition-colors shadow-sm w-auto"
                            >
                                {subiendo ? <Loader2 className="animate-spin mr-2" size={16} /> : exito ? <Check className="mr-2" size={16} /> : null}
                                {subiendo ? "Subiendo..." : exito ? "¡Exito!" : textoBotonSubir}
                            </Button>

                            <Button
                                type="button"
                                variant="outline"
                                onClick={triggerFileInput}
                                className="font-normal border-neutral/20 text-secondary hover:bg-neutral/10 w-auto"
                            >
                                Sustituir
                            </Button>

                            <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                onClick={(e) => {
                                    e.preventDefault();
                                    setArchivo(null); // Esto disparará el useEffect de arriba
                                }}
                                className="text-red-500 bg-red-50 hover:bg-red-100 hover:text-red-700 transition-colors flex-shrink-0"
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