"use client";

import * as React from "react";
import { Collapsible as CollapsiblePrimitive } from "radix-ui";

import { cn } from "../../utils/utils";

function Collapsible({ className, ...props }) {
  return (
    <CollapsiblePrimitive.Root
      data-slot="collapsible"
      className={cn("text-secondary", className)}
      {...props}
    />
  );
}

function CollapsibleTrigger({ className, ...props }) {
  return (
    <CollapsiblePrimitive.CollapsibleTrigger
      data-slot="collapsible-trigger"
      className={cn(
        "text-secondary hover:text-secondary/80 transition-colors outline-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30 focus-visible:border-primary rounded-xl",
        className,
      )}
      {...props}
    />
  );
}

function CollapsibleContent({ className, ...props }) {
  return (
    <CollapsiblePrimitive.CollapsibleContent
      data-slot="collapsible-content"
      className={cn(
        "overflow-hidden text-secondary transition-all data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down",
        className,
      )}
      {...props}
    />
  );
}

export { Collapsible, CollapsibleTrigger, CollapsibleContent };
