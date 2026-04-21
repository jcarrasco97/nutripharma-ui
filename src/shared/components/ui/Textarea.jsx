import * as React from "react"

import { cn } from "../../utils/utils"

function Textarea({ className, ...props }) {
    return (
        <textarea
            data-slot="textarea"
            className={cn(
                "flex field-sizing-content min-h-24 w-full rounded-xl border border-neutral/20 bg-surface px-3 py-2 text-sm text-neutral transition-colors outline-none placeholder:text-neutral/50 focus-visible:border-primary focus-visible:ring-3 focus-visible:ring-primary/50 disabled:cursor-not-allowed disabled:bg-neutral/5 disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20",
                className
            )}
            {...props}
        />
    )
}

export { Textarea }