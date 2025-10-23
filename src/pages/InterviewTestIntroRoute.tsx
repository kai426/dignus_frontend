import InterviewTestIntroPage from "@/components/InterviewTestIntro";
import { useNavigate } from "@tanstack/react-router";

export default function InterviewTestIntroRoute() {
  const navigate = useNavigate();
  return (
    <InterviewTestIntroPage
      onBack={() => navigate({ to: "/selection-process" })}
      onStart={() => navigate({ to: "/entrevista/preview" })}
    />
  );
}
