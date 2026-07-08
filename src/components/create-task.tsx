import { useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { Button } from "./ui/button";
import { AppHeader, AppTitle } from "./ui/header";
import { FieldLabel } from "./ui/field-label";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { createTask } from "../services/tasks";

export function CreateTask() {
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (title.trim() === "") {
      setError("O título é obrigatório.");
      return;
    }
    setSaving(true);
    await createTask({ title, description });
    navigate({ to: "/" });
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col h-full">
      <AppHeader>
        <Button
          type="button"
          variant="ghost"
          className="justify-self-start ml-2 font-normal"
          onClick={() => navigate({ to: "/" })}
        >
          Cancelar
        </Button>
        <AppTitle title="Nova tarefa" />
        <span />
      </AppHeader>

      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
        <div className="space-y-1.5">
          <FieldLabel htmlFor="title">Título</FieldLabel>
          <Input
            id="title"
            autoFocus
            placeholder="Preparar apresentação"
            value={title}
            onChange={(e) => {
              setTitle(e.target.value);
              if (error) setError(null);
            }}
            className={error ? "border-destructive focus:border-destructive focus:ring-destructive/40" : ""}
          />
          {error && <p className="text-preview text-destructive">{error}</p>}
        </div>

        <div className="space-y-1.5">
          <FieldLabel htmlFor="description">Descrição</FieldLabel>
          <Textarea
            id="description"
            rows={6}
            placeholder="Slides sobre os resultados do trimestre…"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>
      </div>

      <div className="flex gap-2 px-4 py-4 border-t border-border">
        <Button
          type="button"
          variant="secondary"
          className="flex-1"
          onClick={() => navigate({ to: "/" })}
        >
          Cancelar
        </Button>
        <Button type="submit" className="flex-1" disabled={saving}>
          Criar tarefa
        </Button>
      </div>
    </form>
  );
}
