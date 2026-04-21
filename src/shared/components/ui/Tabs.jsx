"use client"

import * as React from "react"
import { cva } from "class-variance-authority"
import { Tabs as TabsPrimitive } from "radix-ui"

import { cn } from "../../utils/utils"

function Tabs({ className, orientation = "horizontal", ...props }) {
    return (
        <TabsPrimitive.Root
            data-slot="tabs"
            data-orientation={orientation}
            className={cn("group/tabs flex gap-2 data-horizontal:flex-col", className)}
            {...props}
        />
    )
}

const tabsListVariants = cva(
    "group/tabs-list inline-flex w-fit items-center justify-center rounded-xl p-[3px] text-neutral/70 bg-neutral/5 group-data-horizontal/tabs:h-10 group-data-vertical/tabs:h-fit group-data-vertical/tabs:flex-col data-[variant=line]:bg-transparent data-[variant=line]:rounded-none",
    {
        variants: {
            variant: {
                default: "",
                line: "gap-1",
            },
        },
        defaultVariants: {
            variant: "default",
        },
    }
)

function TabsList({ className, variant = "default", ...props }) {
    return (
        <TabsPrimitive.List
            data-slot="tabs-list"
            data-variant={variant}
            className={cn(tabsListVariants({ variant }), className)}
            {...props}
        />
    )
}

function TabsTrigger({ className, ...props }) {
    return (
        <TabsPrimitive.Trigger
            data-slot="tabs-trigger"
            className={cn(
                "relative inline-flex h-full flex-1 items-center justify-center gap-1.5 rounded-lg border border-transparent px-3 py-1.5 text-sm font-semibold whitespace-nowrap transition-all group-data-vertical/tabs:w-full group-data-vertical/tabs:justify-start hover:text-neutral focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50 has-data-[icon=inline-end]:pr-1 has-data-[icon=inline-start]:pl-1 group-data-[variant=default]/tabs-list:data-active:shadow-sm group-data-[variant=line]/tabs-list:data-active:shadow-none [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
                "group-data-[variant=line]/tabs-list:bg-transparent group-data-[variant=line]/tabs-list:data-active:bg-transparent",
                "data-active:bg-surface data-active:text-primary dark:data-active:text-primary",
                "after:absolute after:bg-primary after:opacity-0 after:transition-opacity group-data-horizontal/tabs:after:inset-x-0 group-data-horizontal/tabs:after:bottom-[-5px] group-data-horizontal/tabs:after:h-0.5 group-data-vertical/tabs:after:inset-y-0 group-data-vertical/tabs:after:-right-1 group-data-vertical/tabs:after:w-0.5 group-data-[variant=line]/tabs-list:data-active:after:opacity-100",
                className
            )}
            {...props}
        />
    )
}

function TabsContent({ className, ...props }) {
    return (
        <TabsPrimitive.Content
            data-slot="tabs-content"
            className={cn("flex-1 text-sm outline-none mt-2", className)}
            {...props}
        />
    )
}

export { Tabs, TabsList, TabsTrigger, TabsContent, tabsListVariants }