import * as React from "react"
import { ChevronDownIcon } from "lucide-react"

import { cn } from "../../utils/utils"

function NativeSelect({ className, size = "default", ...props }) {
    return (
        <div
            className={cn(
                "group/native-select relative w-fit has-[select:disabled]:opacity-50",
                className
            )}
            data-slot="native-select-wrapper"
            data-size={size}
        >
            <select
                data-slot="native-select"
                data-size={size}
                className="h-8 w-full min-w-0 appearance-none rounded-xl border border-neutral/10 bg-transparent py-1 pr-8 pl-2.5 text-sm transition-colors outline-none select-none selection:bg-primary selection:text-surface placeholder:text-neutral/70 focus-visible:border-primary focus-visible:ring-3 focus-visible:ring-primary/50 disabled:pointer-events-none disabled:cursor-not-allowed aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 data-[size=sm]:h-7 data-[size=sm]:rounded-lg data-[size=sm]:py-0.5"
                {...props}
            />
            <ChevronDownIcon
                className="pointer-events-none absolute top-1/2 right-2.5 size-4 -translate-y-1/2 text-neutral/70 select-none"
                aria-hidden="true"
                data-slot="native-select-icon"
            />
        </div>
    )
}

function NativeSelectOption({ className, ...props }) {
    return (
        <option
            data-slot="native-select-option"
            className={cn("bg-surface text-neutral", className)}
            {...props}
        />
    )
}

function NativeSelectOptGroup({ className, ...props }) {
    return (
        <optgroup
            data-slot="native-select-optgroup"
            className={cn("bg-surface text-neutral", className)}
            {...props}
        />
    )
}

export { NativeSelect, NativeSelectOptGroup, NativeSelectOption }