import InterviewTestIntroPage from "@/components/InterviewTestIntro";
import { useNavigate } from "@tanstack/react-router";

export default function InterviewTestIntroRoute() {
  const navigate = useNavigate();

  const handleBack = () => {
    window.history.back();
  };
  
  return (
    <InterviewTestIntroPage
      onBack={handleBack}
      onStart={() => navigate({ to: "/entrevista/preview" })}
    />
  );
}
