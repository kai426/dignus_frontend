import { createFileRoute } from "@tanstack/react-router";
import InterviewPreviewPage from "@/pages/InterviewPreviewPage";

export const Route = createFileRoute("/entrevista/preview")({
  component: InterviewPreviewPage,
});
