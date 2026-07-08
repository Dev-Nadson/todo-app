import { useEffect, useState } from "react";
import { Check, ChevronLeft, Trash2 } from "lucide-react";
import { useNavigate } from "@tanstack/react-router";
import { Route } from "../routes/$id";
import { Button } from "./ui/button";
import { AppHeader, AppTitle } from "./ui/header";
import { Badge } from "./ui/badge";
import { FieldLabel } from "./ui/field-label";
import { deleteTask, getTask, toggleTask } from "../services/tasks";
import type { Task } from "../typings/tasks";

export function GetTask() {
  const { id } = Route.useParams();
  const navigate = useNavigate();
  const [task, setTask] = useState<Task | undefined>(undefined);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getTask(id).then((t) => {
      setTask(t);
      setLoading(false);
    });
  }, [id]);

  async function handleToggle() {
    await toggleTask(id);
    navigate({ to: "/" });
  }

  async function handleDelete() {
    await deleteTask(id);
    navigate({ to: "/" });
  }

  return (
    <div className="flex flex-col h-full">
      <AppHeader>
        <Button
          variant="ghost"
          size="icon"
          aria-label="Voltar"
          className="justify-self-start ml-2"
          onClick={() => navigate({ to: "/" })}
        >
          <ChevronLeft />
        </Button>
        <AppTitle title="Detalhes" />
        <span />
      </AppHeader>

      {loading ? (
        <div className="flex-1" />
      ) : !task ? (
        <div className="flex-1 grid place-items-center px-8 text-center text-text-tertiary">
          Tarefa não encontrada.
        </div>
      ) : (
        <>
          <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
            <Badge variant={task.completed ? "done" : "pending"}>
              {task.completed ? "Concluída" : "Pendente"}
            </Badge>

            <h2 className="text-detail-title font-detail-title text-text-primary">
              {task.title}
            </h2>

            {task.description && (
              <div className="space-y-1.5">
                <FieldLabel>Descrição</FieldLabel>
                <p className="text-body text-text-secondary whitespace-pre-wrap">
                  {task.description}
                </p>
              </div>
            )}
          </div>

          <div className="flex gap-2 px-4 py-4 border-t border-border">
            <Button
              variant="destructive"
              size="icon"
              aria-label="Excluir tarefa"
              onClick={handleDelete}
            >
              <Trash2 />
            </Button>
            <Button className="flex-1" onClick={handleToggle}>
              <Check />
              {task.completed ? "Reabrir" : "Concluir"}
            </Button>
          </div>
        </>
      )}
    </div>
  );
}
