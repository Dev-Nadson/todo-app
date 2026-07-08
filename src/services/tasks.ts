import { load } from "@tauri-apps/plugin-store";
import type { Task, CreateTaskInput } from "../typings/tasks";

/**
 * Store key:value persistido em disco (tasks.json).
 * `autoSave: true` grava a cada mutação. Carregado uma única vez.
 */
const storePromise = load("tasks.json", { defaults: {}, autoSave: true });

/** Cria uma nova tarefa e persiste (vai para o fim da lista). */
export async function createTask(input: CreateTaskInput): Promise<Task> {
  const store = await storePromise;
  const existing = await store.entries<Task>();
  const nextOrder =
    existing.reduce((max, [, t]) => Math.max(max, t.order ?? 0), 0) + 1;
  const task: Task = {
    id: crypto.randomUUID(),
    title: input.title.trim(),
    description: input.description.trim(),
    completed: false,
    createdAt: Date.now(),
    order: nextOrder,
  };
  await store.set(task.id, task);
  return task;
}

/** Lista todas as tarefas na ordem manual (campo `order`), com fallback para createdAt. */
export async function listTasks(): Promise<Task[]> {
  const store = await storePromise;
  const entries = await store.entries<Task>();
  return entries
    .map(([, task]) => task)
    .sort((a, b) => (a.order ?? a.createdAt) - (b.order ?? b.createdAt));
}

/** Persiste a nova ordem das tarefas a partir de uma lista de ids ordenada. */
export async function reorderTasks(orderedIds: string[]): Promise<void> {
  const store = await storePromise;
  for (let i = 0; i < orderedIds.length; i++) {
    const task = await store.get<Task>(orderedIds[i]);
    if (task) await store.set(task.id, { ...task, order: i });
  }
}

/** Busca uma tarefa pelo id. */
export async function getTask(id: string): Promise<Task | undefined> {
  const store = await storePromise;
  return (await store.get<Task>(id)) ?? undefined;
}

/** Remove uma tarefa. */
export async function deleteTask(id: string): Promise<void> {
  const store = await storePromise;
  await store.delete(id);
}

/** Alterna o estado de conclusão de uma tarefa. */
export async function toggleTask(id: string): Promise<Task | undefined> {
  const store = await storePromise;
  const task = await store.get<Task>(id);
  if (!task) return undefined;
  const updated: Task = { ...task, completed: !task.completed };
  await store.set(id, updated);
  return updated;
}
