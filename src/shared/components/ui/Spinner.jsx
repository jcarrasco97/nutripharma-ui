import * as React from "react"
import { Loader2Icon } from "lucide-react"

import { cn } from "../../utils/utils"

function Spinner({ className, ...props }) {
    return (
        <Loader2Icon
            role="status"
            aria-label="Cargando"
            className={cn("size-4 animate-spin", className)}
            {...props}
        />
    )
}

export { Spinner }