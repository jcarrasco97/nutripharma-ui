import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cn } from "../../utils/utils";
import { Spinner } from "./Spinner";
import { buttonVariants } from "./button-variants";

const Button = React.forwardRef(
  (
    {
      className,
      variant,
      size,
      asChild = false,
      isLoading = false, // Secuestramos isLoading para que no vaya al DOM HTML
      disabled,
      children,
      ...props
    },
    ref,
  ) => {
    if (asChild) {
      return (
        <Slot
          ref={ref}
          className={cn(buttonVariants({ variant, size, className }))}
          {...props}
        >
          {children}
        </Slot>
      );
    }

    return (
      <button
        ref={ref}
        disabled={isLoading || disabled} // Deshabilita automáticamente si está cargando
        className={cn(buttonVariants({ variant, size, className }))}
        {...props}
      >
        {/* Si isLoading es true, inyecta nuestro nuevo Spinner corporativo */}
        {isLoading && <Spinner className="shrink-0" />}
        {children}
      </button>
    );
  },
);

Button.displayName = "Button";

export { Button };
