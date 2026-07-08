import { createFileRoute } from "@tanstack/react-router";
import { ListTasks } from "../components/list-tasks";

export const Route = createFileRoute("/")({
  component: ListTasks,
});
