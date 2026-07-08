import { Check } from "lucide-react";
import { cn } from "../../lib/utils";

interface TaskCheckboxProps {
  checked: boolean;
  onChange: () => void;
  className?: string;
  "aria-label"?: string;
}

/** Checkbox redondo: vazio quando pendente, roxo com check quando concluído. */
export function TaskCheckbox({
  checked,
  onChange,
  className,
  "aria-label": ariaLabel,
}: TaskCheckboxProps) {
  return (
    <button
      type="button"
      role="checkbox"
      aria-checked={checked}
      aria-label={ariaLabel ?? "Alternar conclusão"}
      onClick={onChange}
      className={cn(
        "grid place-items-center size-5 shrink-0 rounded-full border transition-colors cursor-pointer",
        checked
          ? "bg-accent border-accent text-white"
          : "border-text-tertiary hover:border-text-secondary",
        className,
      )}
    >
      {checked && <Check className="size-3.5" strokeWidth={3} />}
    </button>
  );
}
