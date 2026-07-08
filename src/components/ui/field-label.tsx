import { cn } from "../../lib/utils";

interface FieldLabelProps {
  children: React.ReactNode;
  htmlFor?: string;
  className?: string;
}

/** Rótulo/overline uppercase — usado em labels de formulário e cabeçalhos de seção. */
export function FieldLabel({ children, htmlFor, className }: FieldLabelProps) {
  const classes = cn(
    "block text-label font-label uppercase tracking-wide text-text-tertiary",
    className,
  );
  return htmlFor ? (
    <label htmlFor={htmlFor} className={classes}>
      {children}
    </label>
  ) : (
    <span className={classes}>{children}</span>
  );
}
