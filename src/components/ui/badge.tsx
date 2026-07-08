import { cn } from "../../lib/utils";

interface BadgeProps {
  variant?: "pending" | "done";
  children: React.ReactNode;
  className?: string;
}

/** Pílula de status com dot — Pendente (accent) / Concluída (cinza). */
export function Badge({ variant = "pending", children, className }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-label font-label",
        variant === "pending"
          ? "bg-accent-soft text-accent-light"
          : "bg-surface-done text-text-tertiary",
        className,
      )}
    >
      <span
        className={cn(
          "size-1.5 rounded-full",
          variant === "pending" ? "bg-accent-light" : "bg-text-tertiary",
        )}
      />
      {children}
    </span>
  );
}
