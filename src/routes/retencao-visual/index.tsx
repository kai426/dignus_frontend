import { createFileRoute } from "@tanstack/react-router";
import IntroPage from "@/pages/retencao-visual/IntroPage";

export const Route = createFileRoute("/retencao-visual/")({
  component: IntroPage,
});
