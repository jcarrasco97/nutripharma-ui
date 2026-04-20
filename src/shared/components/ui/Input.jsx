import * as React from "react"
import { cn } from "../../utils/utils"

const Input = React.forwardRef(({ className, type, ...props }, ref) => {
  return (
    <input
      type={type}
      className={cn(
        "flex h-10 w-full rounded-xl border border-gray-200 bg-surface px-3 py-2 text-sm transition-colors outline-none file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-neutral/50 focus-visible:border-primary focus-visible:ring-4 focus-visible:ring-primary/10 disabled:cursor-not-allowed disabled:bg-gray-50 disabled:opacity-50 text-neutral",
        className
      )}
      ref={ref}
      {...props}
    />
  )
})
Input.displayName = "Input"
export { Input }