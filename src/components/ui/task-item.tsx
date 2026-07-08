import type { CSSProperties } from "react";
import type {
  DraggableAttributes,
  DraggableSyntheticListeners,
} from "@dnd-kit/core";
import { GripVertical } from "lucide-react";
import type { Task } from "../../typings/tasks";
import { cn } from "../../lib/utils";
import { TaskCheckbox } from "./checkbox";

interface TaskItemProps {
  task: Task;
  onToggle: () => void;
  onOpen: () => void;
  // Props de drag-and-drop (opcionais — só as tarefas pendentes são arrastáveis).
  innerRef?: (node: HTMLElement | null) => void;
  style?: CSSProperties;
  attributes?: DraggableAttributes;
  handleListeners?: DraggableSyntheticListeners;
  isDragging?: boolean;
}

/** Linha da lista: checkbox + (título + prévia da descrição) + alça de arraste. */
export function TaskItem({
  task,
  onToggle,
  onOpen,
  innerRef,
  style,
  attributes,
  handleListeners,
  isDragging,
}: TaskItemProps) {
  const draggable = Boolean(handleListeners);

  return (
    <div
      ref={innerRef}
      style={style}
      {...attributes}
      role="button"
      tabIndex={0}
      onClick={onOpen}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onOpen();
        }
      }}
      className={cn(
        "flex items-center gap-3 px-3 py-2.5 cursor-pointer hover:bg-white/[0.03] transition-colors",
        isDragging && "opacity-50 bg-surface-header",
      )}
    >
      <div onClick={(e) => e.stopPropagation()}>
        <TaskCheckbox checked={task.completed} onChange={onToggle} />
      </div>

      <div className="min-w-0 flex-1">
        <p
          className={cn(
            "text-task truncate",
            task.completed
              ? "line-through text-text-tertiary"
              : "font-bold text-text-primary",
          )}
        >
          {task.title}
        </p>
        {task.description && (
          <p className="text-preview text-text-tertiary truncate">
            {task.description}
          </p>
        )}
      </div>

      {draggable ? (
        <span
          {...handleListeners}
          onClick={(e) => e.stopPropagation()}
          aria-label="Arrastar para reordenar"
          className="shrink-0 cursor-grab active:cursor-grabbing touch-none text-text-tertiary/60 hover:text-text-secondary"
        >
          <GripVertical className="size-4" />
        </span>
      ) : (
        <GripVertical className="size-4 shrink-0 text-text-tertiary/30" />
      )}
    </div>
  );
}
