import { createFileRoute } from "@tanstack/react-router";
import LogicalTestPage from "@/pages/logic/LogicalTestPage";

export const Route = createFileRoute("/logico/")({
  component: () => <LogicalTestPage />,
});
