import { createFileRoute } from "@tanstack/react-router";
import TestPage from "@/pages/retencao-visual/TestPage";

export const Route = createFileRoute("/retencao-visual/teste")({
  component: TestPage,
});
