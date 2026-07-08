import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../../lib/utils";

const buttonVariants = cva(
    "inline-flex items-center justify-center gap-2 rounded-lg font-sans font-bold " +
    "transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent " +
    "disabled:opacity-50 disabled:pointer-events-none",
    {
        variants: {
            variant: {
                default: "bg-accent text-white hover:bg-accent/70 hover:cursor-pointer",
                secondary:
                    "bg-surface-list text-text-primary border border-border hover:bg-surface-header",
                ghost: "bg-transparent text-text-secondary hover:bg-white/5",
                destructive:
                    "bg-transparent text-destructive border border-destructive/40 hover:bg-destructive/15",
            },
            size: {
                default: "h-9 px-4 text-task",
                sm: "h-8 px-3 text-preview",
                icon: "size-8.5",
            },
        },
        defaultVariants: { variant: "default", size: "default" },
    },
);

export interface ButtonProps
    extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> { }

export function Button({ className, variant, size, ...props }: ButtonProps) {
    return (
        <button
            className={cn(buttonVariants({ variant, size }), className)}
            {...props}
        />
    );
}

export { buttonVariants };
