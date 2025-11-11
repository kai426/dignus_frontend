// src/features/portuguese-test/PortugueseTestRunPage.tsx
import { useState } from "react";
import Topbar from "./components/Topbar";
import { PortugueseReadingStage } from "@/features/portuguese-test/PortugueseReadingStage";
import { PortugueseInterpretationStage } from "@/features/portuguese-test/PortugueseInterpretationStage";
import { useMediaStore } from "@/store/useMediaStore";
import { useNavigate, useParams } from "@tanstack/react-router";
import { useGetOrCreateTestQuery } from "@/hooks/useTestQuery"; // Importar o novo hook
import { TestType } from "@/api/apiPaths"; // Importar Enum TestType
import { Loader2 } from "lucide-react";
import type { QuestionSnapshotDto } from "@/@types/tests"; // Importar tipo
import { Button } from "@/components/ui/button";

type Stage = "reading" | "qa";

export default function PortugueseTestRunPage({ onBack }: { onBack?: () => void }) {
  const [stage, setStage] = useState<Stage>("reading");
  const powerOff = useMediaStore((s) => s.powerOff);
  const navigate = useNavigate();
  const { candidateId } = useParams({
    from: '/selection-process/$candidateId/portugues/gravar'
  });

  // --- ALTERAÇÃO PRINCIPAL ---
  // Busca ou cria o teste de Português para este candidato
  const { data: testInstance, isLoading, isError, error } = useGetOrCreateTestQuery(
      candidateId,
      TestType.Portuguese // Usa o Enum para clareza
  );

  function handleReadingFinished() {
    setStage("qa");
  }

  function handleAllFinished() {
    powerOff(); // Desliga a câmera/mic
    navigate({
      to: "/selection-process/$candidateId", // Volta para a página principal
      params: { candidateId }
    });
  }

  // Extrai dados do teste APÓS verificar se `testInstance` existe
  const readingTextContent = testInstance?.portugueseReadingText?.content;
  // As perguntas de interpretação são todas do array 'questions'
  const interpretationQuestions: QuestionSnapshotDto[] = testInstance?.questions ?? [];

  // --- Gerenciamento de Loading/Erro ---
  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-3 text-lg font-medium text-gray-700">Carregando teste de português...</span>
      </div>
    );
  }

  if (isError || !testInstance) {
    return (
      <div className="flex h-screen flex-col items-center justify-center text-center text-red-600 p-4">
         <h2 className="text-xl font-bold mb-2">Erro ao carregar o teste</h2>
         <p className="mb-4">{error?.response?.data?.message || error?.message || "Não foi possível buscar ou criar o teste."}</p>
         <Button onClick={onBack} variant="outline">Voltar</Button>
      </div>
    );
  }

  // --- Renderização Principal ---
  return (
    <div className="min-h-screen bg-[#F9FAFB]">
      <Topbar
        onBack={onBack}
        hideBack={stage !== "reading"} // Esconde botão voltar na etapa de interpretação
        title="Teste de Português"
      />

      <main className="mx-auto w-full max-w-[1200px] px-4 sm:px-6 py-8">
        {stage === "reading" ? (
          <PortugueseReadingStage
            testId={testInstance.id} // Passa o ID do teste
            candidateId={candidateId} // Passa o ID do candidato
            readingTextId={testInstance.portugueseReadingTextId} // Passa o ID do texto
            textToRead={readingTextContent} // Passa o conteúdo do texto
            onFinished={handleReadingFinished}
          />
        ) : (
          <PortugueseInterpretationStage
            testId={testInstance.id} // Passa o ID do teste
            candidateId={candidateId} // Passa o ID do candidato
            questions={interpretationQuestions} // Passa os snapshots das questões
            onFinishedAll={handleAllFinished}
          />
        )}
      </main>
    </div>
  );
}