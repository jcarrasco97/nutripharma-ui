"use client"

import * as React from "react"
import { ScrollArea as ScrollAreaPrimitive } from "radix-ui"

import { cn } from "../../utils/utils"

function ScrollArea({
    className,
    children,
    type = "always", // Cambiado a 'always' para que las barras sean siempre visibles
    ...props
}) {
    return (
        <ScrollAreaPrimitive.Root
            data-slot="scroll-area"
            type={type}
            className={cn("relative", className)}
            {...props}
        >
            <ScrollAreaPrimitive.Viewport
                data-slot="scroll-area-viewport"
                className="size-full rounded-[inherit] transition-[color,box-shadow] outline-none focus-visible:ring-[3px] focus-visible:ring-primary/50 focus-visible:outline-1"
            >
                {children}
            </ScrollAreaPrimitive.Viewport>
            {/* Renderizamos ambas barras por defecto */}
            <ScrollBar orientation="vertical" />
            <ScrollBar orientation="horizontal" />
            <ScrollAreaPrimitive.Corner />
        </ScrollAreaPrimitive.Root>
    )
}

function ScrollBar({
    className,
    orientation = "vertical",
    ...props
}) {
    return (
        <ScrollAreaPrimitive.ScrollAreaScrollbar
            data-slot="scroll-area-scrollbar"
            data-orientation={orientation}
            orientation={orientation}
            className={cn(
                "flex touch-none p-px transition-colors select-none data-horizontal:h-2.5 data-horizontal:flex-col data-horizontal:border-t data-horizontal:border-t-transparent data-vertical:h-full data-vertical:w-2.5 data-vertical:border-l data-vertical:border-l-transparent hover:bg-neutral/5",
                className
            )}
            {...props}
        >
            <ScrollAreaPrimitive.ScrollAreaThumb
                data-slot="scroll-area-thumb"
                className="relative flex-1 rounded-full bg-neutral/30" // Color más definido para que sea fácil de ver/pulsar
            />
        </ScrollAreaPrimitive.ScrollAreaScrollbar>
    )
}

export { ScrollArea, ScrollBar }