import * as React from "react"
import { cva } from "class-variance-authority"
import { Slot } from "@radix-ui/react-slot"
import { cn } from "../../utils/utils"

const badgeVariants = cva(
    "inline-flex w-fit shrink-0 items-center justify-center gap-1 overflow-hidden rounded-full border border-transparent px-2.5 py-0.5 text-xs font-semibold whitespace-nowrap transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 [&>svg]:pointer-events-none [&>svg]:size-3",
    {
        variants: {
            variant: {
                default: "bg-primary text-white hover:bg-primary-hover shadow-sm",
                secondary: "bg-secondary text-white hover:bg-secondary/90 shadow-sm",
                destructive: "bg-red-50 text-red-600 hover:bg-red-100",
                outline: "text-secondary border-gray-200",
                accent: "bg-accent text-secondary hover:bg-accent-light shadow-sm",
            },
        },
        defaultVariants: {
            variant: "default",
        },
    }
)

function Badge({ className, variant, asChild = false, ...props }) {
    const Comp = asChild ? Slot : "span"

    return (
        <Comp
            data-slot="badge"
            className={cn(badgeVariants({ variant }), className)}
            {...props}
        />
    )
}

export { Badge, badgeVariants }