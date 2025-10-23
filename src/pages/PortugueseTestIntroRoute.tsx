import PortugueseTestIntroPage from "@/components/PortugueseTestIntro";
import { useNavigate, useParams } from "@tanstack/react-router";

/**
 * Este é o componente "container" da rota.
 * Sua responsabilidade é lidar com a lógica de roteamento e passar
 * as funções necessárias para o componente de apresentação (UI).
 */
export default function PortugueseTestIntroRoute() {
  const navigate = useNavigate();
  
  // --- CORREÇÃO AQUI ---
  // Chame useParams() com o argumento 'from' para pegar o candidateId da rota pai.
  const { candidateId } = useParams({ from: "/selection-process/$candidateId/portugues/" });

  // A função para voltar para a página principal do processo seletivo.
  const handleBack = () => {
    navigate({ 
      to: "/selection-process/$candidateId", 
      params: { candidateId } 
    });
  };

  // A função para avançar para a próxima etapa (preview de câmera/microfone).
  const handleStart = () => {
    navigate({ 
      to: "/selection-process/$candidateId/portugues/preview", 
      params: { candidateId } 
    });
  };

  // O restante do componente permanece igual.
  return (
    <PortugueseTestIntroPage
      onBack={handleBack}
      onStart={handleStart}
    />
  );
}