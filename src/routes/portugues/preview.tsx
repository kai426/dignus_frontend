import { createFileRoute } from "@tanstack/react-router";
import PortuguesePreviewPage from "@/pages/PortuguesePreviewPage";

export const Route = createFileRoute("/portugues/preview")({
  component: PortuguesePreviewPage,
});
