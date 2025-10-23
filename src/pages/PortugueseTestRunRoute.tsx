import { useNavigate, useParams } from "@tanstack/react-router";
import PortugueseTestRunPage from "@/features/portuguese-test/PortugueseTestRunPage";

export default function PortugueseTestRunRoute() {
  const navigate = useNavigate();
  
  // 1. Pega o candidateId da URL da rota atual
  const { candidateId } = useParams({ 
    from: '/selection-process/$candidateId/portugues/gravar' 
  });

  // 2. Cria a função de navegação dinâmica para voltar
  const handleBack = () => {
    navigate({ 
      to: "/selection-process/$candidateId", 
      params: { candidateId } 
    });
  };

  return (
    <PortugueseTestRunPage
      onBack={handleBack} // Passa a função dinâmica como prop
    />
  );
}