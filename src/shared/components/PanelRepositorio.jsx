import React, { useState } from "react";
import { Search, ChevronLeft, ChevronRight } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/shared/components/ui/card";
import { Input } from "@/shared/components/ui/Input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/components/ui/Select";
import { ScrollArea } from "@/shared/components/ui/ScrollArea";
import { Empty, EmptyHeader, EmptyMedia, EmptyTitle, EmptyDescription } from "@/shared/components/ui/Empty";
import { Skeleton } from "@/shared/components/ui/Skeleton";
import { Button } from "@/shared/components/ui/Button";

const ITEMS_POR_PAGINA = 5;

const PanelRepositorio = ({
    icono,
    titulo,
    headerClassName,
    filtroPrincipal,
    setFiltroPrincipal,
    opcionesFiltro,
    placeholderFiltro = "Todos",
    filtroBusqueda,
    setFiltroBusqueda,
    placeholderBusqueda,
    items,
    cargando,
    renderItem,
    children,
    emptyIcon,
    emptyTitulo = "No se encontraron resultados.",
    emptyDescripcion,
}) => {
    const [pagina, setPagina] = useState(1);

    const totalPaginas = Math.ceil((items?.length ?? 0) / ITEMS_POR_PAGINA);
    const itemsPagina = (items ?? []).slice(
        (pagina - 1) * ITEMS_POR_PAGINA,
        pagina * ITEMS_POR_PAGINA
    );

    // Resetear página al cambiar filtros
    React.useEffect(() => { setPagina(1); }, [filtroPrincipal, filtroBusqueda]);

    return (
        // Añadido overflow-hidden para que el header no desborde las esquinas redondeadas
        <Card className="overflow-hidden">
            {/* Añadimos min-h-[82px] y centrado flex para igualar la altura del Collapsible superior */}
            <CardHeader className={`flex flex-row items-center min-h-[70px] px-6 py-0 ${headerClassName}`}>
                <div className="flex items-center gap-3 w-full">
                    {icono && (
                        <div className="bg-surface/20 p-2.5 rounded-xl text-inherit">
                            {icono}
                        </div>
                    )}
                    <CardTitle className="text-base font-black text-inherit m-0">
                        {titulo}
                    </CardTitle>
                </div>
            </CardHeader>

            <CardContent className="pt-4 px-4 pb-4">
                <div className="flex gap-3 mb-4">
                    <div className={filtroBusqueda !== undefined ? "flex-1" : "w-full"}>
                        <Select value={filtroPrincipal} onValueChange={setFiltroPrincipal}>
                            <SelectTrigger className="w-full text-secondary border-neutral/10 bg-neutral/5 focus:border-accent">
                                <SelectValue placeholder={placeholderFiltro} />
                            </SelectTrigger>
                            <SelectContent>
                                {opcionesFiltro.map((op) => (
                                    <SelectItem key={op.value} value={op.value}>
                                        {op.label}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    {filtroBusqueda !== undefined && (
                        <div className="relative flex-1">
                            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral/50 z-10" />
                            <Input
                                type="text"
                                placeholder={placeholderBusqueda}
                                value={filtroBusqueda}
                                onChange={(e) => setFiltroBusqueda(e.target.value)}
                                className="w-full pl-9 text-secondary border-neutral/10 bg-neutral/5 focus-visible:border-accent focus-visible:ring-0"
                            />
                        </div>
                    )}
                </div>

                {cargando ? (
                    <div className="flex flex-col gap-3">
                        <Skeleton className="h-16 w-full" />
                        <Skeleton className="h-16 w-full" />
                        <Skeleton className="h-16 w-full" />
                    </div>
                ) : !items || items.length === 0 ? (
                    <Empty>
                        <EmptyHeader>
                            {emptyIcon && <EmptyMedia>{emptyIcon}</EmptyMedia>}
                            <EmptyTitle>{emptyTitulo}</EmptyTitle>
                            {emptyDescripcion && (
                                <EmptyDescription>{emptyDescripcion}</EmptyDescription>
                            )}
                        </EmptyHeader>
                    </Empty>
                ) : renderItem ? (
                    <>
                        <ScrollArea className="h-[340px]">
                            <div className="flex flex-col gap-3 pr-2 pb-1">
                                {itemsPagina.map(renderItem)}
                            </div>
                        </ScrollArea>

                        {totalPaginas > 1 && (
                            <div className="flex items-center justify-between mt-4 pt-4 border-t border-neutral/10">
                                <span className="text-xs text-neutral/50 font-medium">
                                    {(pagina - 1) * ITEMS_POR_PAGINA + 1}–{Math.min(pagina * ITEMS_POR_PAGINA, items.length)} de {items.length}
                                </span>
                                <div className="flex items-center gap-1">
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={() => setPagina(p => Math.max(1, p - 1))}
                                        disabled={pagina === 1}
                                        className="rounded-lg h-7 w-7"
                                    >
                                        <ChevronLeft size={14} />
                                    </Button>
                                    {Array.from({ length: totalPaginas }, (_, i) => i + 1).map((n) => (
                                        <Button
                                            key={n}
                                            variant={n === pagina ? "outline" : "ghost"}
                                            size="icon"
                                            onClick={() => setPagina(n)}
                                            className="rounded-lg h-7 w-7 text-xs font-bold"
                                        >
                                            {n}
                                        </Button>
                                    ))}
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={() => setPagina(p => Math.min(totalPaginas, p + 1))}
                                        disabled={pagina === totalPaginas}
                                        className="rounded-lg h-7 w-7"
                                    >
                                        <ChevronRight size={14} />
                                    </Button>
                                </div>
                            </div>
                        )}
                    </>
                ) : (
                    children
                )}
            </CardContent>
        </Card>
    );
};

export default PanelRepositorio;