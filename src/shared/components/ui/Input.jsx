import * as React from "react";
import { cva } from "class-variance-authority";
import { cn } from "../../utils/utils";

const inputVariants = cva(
  "flex w-full rounded-md border border-neutral/10 bg-surface px-3 text-sm font-medium transition-colors outline-none file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-neutral/50 focus-visible:outline-none focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-primary/30 disabled:cursor-not-allowed disabled:bg-neutral/5 disabled:opacity-50 text-secondary",
  {
    variants: {
      size: {
        default: "h-10 py-2",
        sm: "h-8 py-1 rounded-md",
        lg: "h-11 py-2.5",
      },
    },
    defaultVariants: {
      size: "default",
    },
  },
);

const Input = React.forwardRef(
  ({ className, size = "default", type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(inputVariants({ size }), className)}
        ref={ref}
        {...props}
      />
    );
  },
);
Input.displayName = "Input";
export { Input, inputVariants };
