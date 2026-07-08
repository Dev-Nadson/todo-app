import { cn } from "../../lib/utils";

interface TaskListProps {
  children: React.ReactNode;
  className?: string;
}

/** Caixa arredondada que agrupa linhas de tarefa, com divisores entre elas. */
export function TaskList({ children, className }: TaskListProps) {
  return (
    <div
      className={cn(
        "rounded-xl bg-surface-list border border-border overflow-hidden",
        "divide-y divide-border-subtle",
        className,
      )}
    >
      {children}
    </div>
  );
}
