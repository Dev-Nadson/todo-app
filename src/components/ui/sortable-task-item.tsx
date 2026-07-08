import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import type { Task } from "../../typings/tasks";
import { TaskItem } from "./task-item";

interface SortableTaskItemProps {
  task: Task;
  onToggle: () => void;
  onOpen: () => void;
}

/** Envolve o TaskItem com o hook useSortable — usado apenas nas tarefas pendentes. */
export function SortableTaskItem({ task, onToggle, onOpen }: SortableTaskItemProps) {
  const {
    setNodeRef,
    attributes,
    listeners,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: task.id });

  return (
    <TaskItem
      task={task}
      onToggle={onToggle}
      onOpen={onOpen}
      innerRef={setNodeRef}
      style={{ transform: CSS.Transform.toString(transform), transition }}
      attributes={attributes}
      handleListeners={listeners}
      isDragging={isDragging}
    />
  );
}
