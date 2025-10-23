import { createFileRoute } from "@tanstack/react-router";
import PortuguesePreviewPage from "@/pages/PortuguesePreviewPage";

export const Route = createFileRoute("/selection-process/$candidateId/portugues/preview")({
  component: PortuguesePreviewPage,
});
