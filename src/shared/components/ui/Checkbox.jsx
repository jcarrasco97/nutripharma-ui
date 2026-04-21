"use client"

import * as React from "react"
import { CheckIcon } from "lucide-react"
import { Checkbox as CheckboxPrimitive } from "radix-ui"

import { cn } from "../../utils/utils"

function Checkbox({ className, ...props }) {
    return (
        <CheckboxPrimitive.Root
            data-slot="checkbox"
            className={cn(
                "peer relative flex size-4 shrink-0 items-center justify-center rounded-md border border-neutral/20 transition-colors outline-none group-has-disabled/field:opacity-50 after:absolute after:-inset-x-3 after:-inset-y-2 focus-visible:border-primary focus-visible:ring-3 focus-visible:ring-primary/50 disabled:cursor-not-allowed disabled:opacity-50 aria-[invalid=true]:border-destructive aria-[invalid=true]:ring-3 aria-[invalid=true]:ring-destructive/20 data-[state=checked]:border-primary data-[state=checked]:bg-primary data-[state=checked]:text-surface",
                className
            )}
            {...props}
        >
            <CheckboxPrimitive.Indicator
                data-slot="checkbox-indicator"
                className="grid place-content-center text-current transition-none [&>svg]:size-3.5"
            >
                <CheckIcon />
            </CheckboxPrimitive.Indicator>
        </CheckboxPrimitive.Root>
    )
}

export { Checkbox }