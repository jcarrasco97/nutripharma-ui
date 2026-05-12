import React, { useState, useEffect, useRef } from "react";
import { ChevronDown, ChevronUp, GripVertical, ListOrdered, X } from "lucide-react";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/shared/components/ui/Sheet";
import { Button } from "@/shared/components/ui/Button";
import { ScrollArea } from "@/shared/components/ui/ScrollArea";

const SheetOrganizarPorDefecto = ({ abierto, onClose, productos }) => {
    const [lista, setLista] = useState([]);
    const dragItem = useRef();
    const dragOverItem = useRef();

    useEffect(() => {
        if (abierto) {
            const saved = JSON.parse(
                localStorage.getItem("orden_recomendados_nutripharma") || "[]"
            );
            const activos = productos.filter((p) => !p.fechaBaja);
            const ordenados = [...activos].sort((a, b) => {
                const idxA = saved.indexOf(a.id);
                const idxB = saved.indexOf(b.id);
                if (idxA === -1 && idxB === -1)
                    return (a.nombreProducto || "").localeCompare(b.nombreProducto || "");
                if (idxA === -1) return 1;
                if (idxB === -1) return -1;
                return idxA - idxB;
            });
            setLista(ordenados);
        }
    }, [abierto, productos]);

    const mover = (index, dir) => {
        if (index + dir < 0 || index + dir >= lista.length) return;
        const nueva = [...lista];
        [nueva[index], nueva[index + dir]] = [nueva[index + dir], nueva[index]];
        setLista(nueva);
    };

    const handleDragStart = (_, position) => { dragItem.current = position; };
    const handleDragEnter = (_, position) => { dragOverItem.current = position; };
    const handleDrop = () => {
        const copia = [...lista];
        const item = copia[dragItem.current];
        copia.splice(dragItem.current, 1);
        copia.splice(dragOverItem.current, 0, item);
        dragItem.current = null;
        dragOverItem.current = null;
        setLista(copia);
    };

    const guardar = () => {
        localStorage.setItem(
            "orden_recomendados_nutripharma",
            JSON.stringify(lista.map((p) => p.id))
        );
        alert("Orden guardado.");
        onClose();
    };

    return (
        <Sheet open={abierto} onOpenChange={onClose}>
            {/* 👇 FIX 1: Añadido h-full al SheetContent para limitar la altura */}
            <SheetContent side="right" className="sm:max-w-lg flex flex-col p-0 h-full">

                {/* Header */}
                <SheetHeader className="px-6 pt-6 pb-4 border-b border-neutral/10 shrink-0">
                    <div className="flex items-center gap-3">
                        <div className="bg-primary/10 p-2.5 rounded-xl text-primary shrink-0">
                            <ListOrdered size={18} />
                        </div>
                        <div>
                            <SheetTitle className="text-base">Organizar Por Defecto</SheetTitle>
                            <p className="text-xs text-neutral/50 font-medium mt-0.5">
                                Arrastra o usa las flechas para reordenar los productos recomendados.
                            </p>
                        </div>
                    </div>
                </SheetHeader>

                {/* 👇 FIX 2: Sustituido ScrollArea por un div con overflow-y-auto nativo */}
                <div className="flex-1 overflow-y-auto px-6 py-4 custom-scrollbar">
                    <div className="space-y-2">
                        {lista.map((prod, i) => (
                            <div
                                key={prod.id}
                                draggable
                                onDragStart={(e) => handleDragStart(e, i)}
                                onDragEnter={(e) => handleDragEnter(e, i)}
                                onDragEnd={handleDrop}
                                onDragOver={(e) => e.preventDefault()}
                                className="flex items-center justify-between bg-neutral/5 border border-neutral/10 p-3 rounded-md hover:border-primary/30 transition-colors cursor-grab active:cursor-grabbing"
                            >
                                <div className="flex items-center gap-2">
                                    <GripVertical size={18} className="text-neutral/40 shrink-0" />
                                    <span className="font-bold text-sm text-primary w-5 shrink-0">
                                        {i + 1}.
                                    </span>
                                    <span className="font-semibold text-sm text-secondary">
                                        {prod.nombreProducto}
                                    </span>
                                </div>
                                <div className="flex gap-1 shrink-0">
                                    <button
                                        onClick={() => mover(i, -1)}
                                        disabled={i === 0}
                                        className="p-1.5 bg-neutral/10 rounded-md text-neutral hover:bg-primary/20 hover:text-primary transition-all disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
                                    >
                                        <ChevronUp size={16} />
                                    </button>
                                    <button
                                        onClick={() => mover(i, 1)}
                                        disabled={i === lista.length - 1}
                                        className="p-1.5 bg-neutral/10 rounded-md text-neutral hover:bg-primary/20 hover:text-primary transition-all disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
                                    >
                                        <ChevronDown size={16} />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Footer */}
                <div className="px-6 py-4 border-t border-neutral/10 shrink-0 bg-surface">
                    <Button
                        onClick={guardar}
                        className="w-full bg-primary hover:bg-primary-hover text-surface font-bold rounded-md h-10"
                    >
                        Guardar Posiciones
                    </Button>
                </div>

            </SheetContent>
        </Sheet>
    );
};

export default SheetOrganizarPorDefecto;