import { createFileRoute } from "@tanstack/react-router";
import LogicalIntroRoute from "@/pages/logic/LogicalIntroPage";

export const Route = createFileRoute("/logico/intro")({
  component: LogicalIntroRoute,
});