import { cn } from "../../utils/utils"

function Skeleton({ className, ...props }) {
    return (
        <div
            data-slot="skeleton"
            className={cn("animate-pulse rounded-xl bg-neutral/10", className)}
            {...props}
        />
    )
}

export { Skeleton }