import { Toaster as Sonner } from "sonner";

const Toaster = ({ ...props }) => {
    return (
        <Sonner
            className="toaster group"
            style={{
                "--normal-bg": "var(--color-surface)",
                "--normal-text": "var(--color-neutral)",
                "--normal-border": "var(--color-neutral-10)",
                "--border-radius": "var(--radius-2xl)",
            }}
            toastOptions={{
                classNames: {
                    toast: "border border-neutral/10 shadow-xl",
                },
            }}
            {...props}
        />
    );
};

export { Toaster };