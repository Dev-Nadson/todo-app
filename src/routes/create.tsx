import { createFileRoute } from "@tanstack/react-router";
import { CreateTask } from "../components/create-task";

export const Route = createFileRoute("/create")({
  component: CreateTask,
});
