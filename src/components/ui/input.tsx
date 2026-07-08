import { cn } from "../../lib/utils";

export function Input({
  className,
  ...props
}: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className={cn(
        "w-full rounded-lg bg-surface-list border border-border px-3 py-2 text-task text-text-primary",
        "placeholder:text-text-tertiary outline-none transition-colors",
        "focus:border-accent focus:ring-2 focus:ring-accent/40",
        className,
      )}
      {...props}
    />
  );
}
