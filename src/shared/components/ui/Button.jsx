import * as React from "react"
import { cn } from "../../utils/utils"

const buttonVariants = {
  variant: {
    default: "bg-primary text-white hover:bg-primary-hover shadow-sm",
    secondary: "bg-secondary text-white hover:bg-secondary/90 shadow-sm",
    accent: "bg-accent text-secondary hover:bg-accent-light shadow-sm",
    outline: "border border-gray-200 bg-white hover:bg-gray-100 hover:text-secondary",
    ghost: "hover:bg-gray-100 hover:text-secondary",
    destructive: "bg-red-500/10 text-red-600 hover:bg-red-500/20",
    link: "text-secondary underline-offset-4 hover:underline",
  },
  size: {
    default: "h-10 px-4 py-2 gap-1.5",
    sm: "h-8 rounded-lg px-3 text-xs gap-1",
    lg: "h-11 rounded-xl px-8 gap-1.5",
    icon: "h-10 w-10",
  },
}

const Button = React.forwardRef(({
  className,
  variant = "default",
  size = "default",
  ...props
}, ref) => {
  return (
    <button
      ref={ref}
      className={cn(
        "inline-flex shrink-0 items-center justify-center rounded-xl text-sm font-medium transition-all outline-none focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
        buttonVariants.variant[variant],
        buttonVariants.size[size],
        className
      )}
      {...props}
    />
  )
})

Button.displayName = "Button"

export { Button, buttonVariants }