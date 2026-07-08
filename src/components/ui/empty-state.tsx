import { CheckCircle2 } from "lucide-react";

/** Estado vazio da lista — "Tudo em dia". */
export function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center h-full text-center px-8 gap-3">
      <div className="grid place-items-center size-16 rounded-full bg-accent-soft mb-1">
        <CheckCircle2 className="size-8 text-accent-light" />
      </div>
      <p className="text-detail-title font-detail-title text-text-primary">
        Tudo em dia
      </p>
      <p className="text-body text-text-tertiary">
        Nenhuma tarefa por aqui. Toque em + para criar a primeira.
      </p>
    </div>
  );
}
