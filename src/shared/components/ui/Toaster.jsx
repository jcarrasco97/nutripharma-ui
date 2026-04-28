import { Toaster as Sonner } from "sonner";

const Toaster = ({ ...props }) => {
  return (
    <Sonner
      className="toaster group"
      style={{
        "--normal-bg": "var(--color-surface)",
        "--normal-text": "var(--color-secondary)",
        "--normal-border": "var(--color-neutral-10)",
        "--border-radius": "var(--radius-xl)",
      }}
      toastOptions={{
        classNames: {
          toast: "border border-neutral/10 shadow-sm rounded-xl",
        },
      }}
      {...props}
    />
  );
};

export { Toaster };
