import { createFileRoute } from "@tanstack/react-router";
import { GetTask } from "../components/get-task";

export const Route = createFileRoute("/$id")({
  component: GetTask,
});
