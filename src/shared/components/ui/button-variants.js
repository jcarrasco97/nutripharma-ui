import { cva } from "class-variance-authority";

export const buttonVariants = cva(
  "inline-flex shrink-0 items-center justify-center rounded-xl text-sm font-medium transition-all outline-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30 focus-visible:border-primary disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-primary text-surface hover:bg-primary-hover shadow-sm",
        primary: "bg-primary text-surface hover:bg-primary-hover shadow-sm",
        secondary: "bg-secondary text-surface hover:bg-secondary/90 shadow-sm",
        accent: "bg-accent text-secondary hover:bg-accent-light shadow-sm",
        outline:
          "border border-neutral/10 bg-surface hover:bg-neutral/5 hover:text-secondary",
        ghost: "hover:bg-neutral/5 hover:text-secondary",
        destructive:
          "bg-destructive/10 text-destructive hover:bg-destructive/20",
        link: "text-secondary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-10 px-4 py-2 gap-1.5",
        sm: "h-8 rounded-lg px-3 py-1 text-xs gap-1",
        lg: "h-11 rounded-xl px-8 py-2.5 gap-1.5",
        icon: "h-10 w-10",
        "icon-sm": "h-8 w-8 rounded-lg",
        "icon-lg": "h-11 w-11",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);
