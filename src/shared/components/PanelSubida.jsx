import React from "react";
import { ChevronDown, UploadCloud } from "lucide-react";
import { Card, CardContent } from "@/shared/components/ui/Card";
import { Collapsible, CollapsibleTrigger, CollapsibleContent } from "@/shared/components/ui/Collapsible";
import { Empty, EmptyHeader, EmptyMedia, EmptyTitle, EmptyDescription } from "@/shared/components/ui/Empty";

const PanelSubida = ({
    open,
    onOpenChange,
    icono,
    titulo,
    descripcion,
    archivo,
    onArchivoChange,
    accionPrincipal,
    children,
}) => {
    return (
        <Collapsible open={open} onOpenChange={onOpenChange}>
            <Card className="rounded-xl overflow-hidden">
                <CollapsibleTrigger asChild>
                    <button
                        type="button"
                        className="w-full flex items-center justify-between gap-4 px-6 py-4 text-left hover:bg-neutral/5 transition-colors"
                    >
                        <div className="flex items-center gap-3">
                            <div className="bg-neutral/5 p-2.5 rounded-xl text-primary">
                                {icono}
                            </div>
                            <div>
                                <h2 className="text-base font-bold text-secondary">{titulo}</h2>
                                {descripcion && (
                                    <p className="text-xs font-medium text-neutral/70">{descripcion}</p>
                                )}
                            </div>
                        </div>
                        <ChevronDown
                            size={16}
                            className={`text-neutral/50 flex-shrink-0 transition-transform duration-300 ${open ? "rotate-180" : ""}`}
                        />
                    </button>
                </CollapsibleTrigger>

                <CollapsibleContent>
                    <CardContent className="px-6 pb-6 pt-0">
                        {children}
                    </CardContent>
                </CollapsibleContent>
            </Card>
        </Collapsible>
    );
};

export default PanelSubida;