import { cn } from "../../lib/utils";

export function Textarea({
  className,
  ...props
}: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      className={cn(
        "w-full rounded-lg bg-surface-list border border-border px-3 py-2 text-body text-text-primary",
        "placeholder:text-text-tertiary outline-none transition-colors resize-none",
        "focus:border-accent focus:ring-2 focus:ring-accent/40",
        className,
      )}
      {...props}
    />
  );
}
