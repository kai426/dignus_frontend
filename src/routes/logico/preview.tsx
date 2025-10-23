
import { createFileRoute } from "@tanstack/react-router";
import LogicalPreviewPage from "@/pages/logic/LogicalPreviewPage";

export const Route = createFileRoute("/logico/preview")({
  component: LogicalPreviewPage,
});
