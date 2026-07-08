import { useEffect, useState } from "react";
import { Plus } from "lucide-react";
import { useNavigate } from "@tanstack/react-router";
import {
    DndContext,
    PointerSensor,
    KeyboardSensor,
    useSensor,
    useSensors,
    closestCenter,
    type DragEndEvent,
} from "@dnd-kit/core";
import {
    SortableContext,
    arrayMove,
    sortableKeyboardCoordinates,
    verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { Button } from "./ui/button";
import { AppHeader, AppTitle } from "./ui/header";
import { EmptyState } from "./ui/empty-state";
import { FieldLabel } from "./ui/field-label";
import { TaskList } from "./ui/task-list";
import { TaskItem } from "./ui/task-item";
import { SortableTaskItem } from "./ui/sortable-task-item";
import { listTasks, reorderTasks, toggleTask } from "./../services/tasks";
import type { Task } from "../typings/tasks";

function plural(n: number, singular: string, plural: string) {
    return `${n} ${n === 1 ? singular : plural}`;
}

export function ListTasks() {
    const navigate = useNavigate();
    const [tasks, setTasks] = useState<Task[]>([]);

    // Um clique curto não deve virar arraste: exige mover 5px antes de ativar.
    const sensors = useSensors(
        useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
        useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
    );

    useEffect(() => {
        listTasks().then(setTasks);
    }, []);

    const pending = tasks.filter((t) => !t.completed);
    const done = tasks.filter((t) => t.completed);

    async function handleToggle(id: string) {
        await toggleTask(id);
        setTasks((prev) =>
            prev.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t)),
        );
    }

    function openTask(id: string) {
        navigate({ to: "/$id", params: { id } });
    }

    function handleDragEnd(event: DragEndEvent) {
        const { active, over } = event;
        if (!over || active.id === over.id) return;

        const oldIndex = pending.findIndex((t) => t.id === active.id);
        const newIndex = pending.findIndex((t) => t.id === over.id);
        if (oldIndex === -1 || newIndex === -1) return;

        const reordered = arrayMove(pending, oldIndex, newIndex);
        // Estado local: pendentes reordenados + concluídas ao final.
        setTasks([...reordered, ...done]);
        // Persiste a nova ordem (só os ids das pendentes).
        reorderTasks(reordered.map((t) => t.id));
    }

    return (
        <div className="flex flex-col h-full">
            <AppHeader>
                <span />
                <AppTitle title="Tarefas" />
                <Button
                    size="icon"
                    aria-label="Adicionar tarefa"
                    className="justify-self-end mr-4"
                    onClick={() => navigate({ to: "/create" })}
                >
                    <Plus />
                </Button>
            </AppHeader>

            {tasks.length === 0 ? (
                <EmptyState />
            ) : (
                <div className="flex-1 overflow-y-auto px-4 py-4 space-y-5">
                    <section className="space-y-2">
                        <FieldLabel>
                            {plural(pending.length, "PENDENTE", "PENDENTES")}
                            {" · "}
                            {plural(done.length, "CONCLUÍDA", "CONCLUÍDAS")}
                        </FieldLabel>
                        {pending.length > 0 && (
                            <DndContext
                                sensors={sensors}
                                collisionDetection={closestCenter}
                                onDragEnd={handleDragEnd}
                            >
                                <SortableContext
                                    items={pending.map((t) => t.id)}
                                    strategy={verticalListSortingStrategy}
                                >
                                    <TaskList>
                                        {pending.map((task) => (
                                            <SortableTaskItem
                                                key={task.id}
                                                task={task}
                                                onToggle={() => handleToggle(task.id)}
                                                onOpen={() => openTask(task.id)}
                                            />
                                        ))}
                                    </TaskList>
                                </SortableContext>
                            </DndContext>
                        )}
                    </section>

                    {done.length > 0 && (
                        <section className="space-y-2">
                            <FieldLabel>Concluídas</FieldLabel>
                            <TaskList>
                                {done.map((task) => (
                                    <TaskItem
                                        key={task.id}
                                        task={task}
                                        onToggle={() => handleToggle(task.id)}
                                        onOpen={() => openTask(task.id)}
                                    />
                                ))}
                            </TaskList>
                        </section>
                    )}
                </div>
            )}
        </div>
    );
}
