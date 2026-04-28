import * as React from "react";
import { cva } from "class-variance-authority";
import { Slot } from "@radix-ui/react-slot";
import { cn } from "../../utils/utils";

const badgeVariants = cva(
  "inline-flex w-fit shrink-0 items-center justify-center gap-1 overflow-hidden border border-transparent font-semibold whitespace-nowrap transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30 [&>svg]:pointer-events-none [&>svg]:size-3",
  {
    variants: {
      variant: {
        default: "bg-primary text-surface hover:bg-primary-hover shadow-sm",
        secondary: "bg-secondary text-surface hover:bg-secondary/90 shadow-sm",
        destructive:
          "bg-destructive/10 text-destructive hover:bg-destructive/20",
        outline: "text-secondary border border-neutral/10 bg-surface",
        accent: "bg-accent text-secondary hover:bg-accent-light shadow-sm",
      },
      size: {
        default: "h-10 px-2.5 py-2 rounded-full text-xs",
        sm: "h-8 px-2 py-1 rounded-lg text-xs",
        lg: "h-11 px-3 py-2.5 rounded-full text-sm",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

function Badge({ className, variant, size, asChild = false, ...props }) {
  const Comp = asChild ? Slot : "span";

  return (
    <Comp
      data-slot="badge"
      className={cn(badgeVariants({ variant, size }), className)}
      {...props}
    />
  );
}

export { Badge, badgeVariants };
