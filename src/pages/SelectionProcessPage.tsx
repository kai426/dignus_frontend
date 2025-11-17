import { ProgressCircle } from "@/components/ProgressCircle";
import { ProgressBar } from "@/components/ProgressBar";
import { TestCard } from "@/components/TestCard";
import MainLayout from "@/layouts/MainLayout";
import { useParams } from '@tanstack/react-router';
import { useCandidateProgress } from '@/hooks/useProgress';
import { getTestDetails } from '@/config/tests';
import { useEffect } from "react";
import { useMediaStore } from "@/store/useMediaStore";

const mapApiStatusToComponentStatus = (
  apiStatus: "NotStarted" | "InProgress" | "Completed" | "Submitted"
): "pending" | "completed" | "not_finished" => {
  switch (apiStatus) {
    case "Completed":
    case "Submitted":
      return "completed";
    case "InProgress":
      return "not_finished";
    case "NotStarted":
    default:
      return "pending";
  }
};

const SelectionProcessPage = () => {
  const stream = useMediaStore((s) => s.stream);
  const powerOff = useMediaStore((s) => s.powerOff);

  useEffect(() => {
    if (stream?.active) {
      powerOff();
    }
  }, [stream, powerOff]);

  // Pega o ID do candidato da URL (ex: /selection-process/guid-do-candidato)
  const { candidateId } = useParams({ from: '/selection-process/$candidateId/' });

  // Busca os dados de progresso da API usando o hook e o ID
  const { data: progressData, isLoading, isError } = useCandidateProgress(candidateId);

  // --- Estados de Carregamento e Erro ---
  if (isLoading) {
    return <MainLayout><div className="text-center p-10">Carregando processo seletivo...</div></MainLayout>;
  }
  if (isError || !progressData) {
    return <MainLayout><div className="text-center p-10">Ocorreu um erro ao carregar seus dados. Tente novamente.</div></MainLayout>;
  }

  // --- Preparação dos Dados para Renderização ---

  // Combina os dados dinâmicos (status) com os dados estáticos (título, ícone, etc.)
  const testsToDisplay = progressData
    ? Object.values(progressData.testProgress).map(apiTest => {
      const details = getTestDetails(apiTest.testType);
      return {
        ...details,
        status: mapApiStatusToComponentStatus(apiTest.status),
        isCompleted: apiTest.isCompleted,
      };
    })
    : [];

  return (
    <MainLayout>
      {/* 1. SEU CABEÇALHO FOI RESTAURADO EXATAMENTE COMO ERA */}
      <header className="mb-6 lg:mb-3 text-center lg:text-left lg:mt-10 2xl:mt-0">
        <h1 className="ml-3 text-[18px] lg:ml-0 sm:text-[26px] lg:text-[34px] leading-tight font-semibold text-gray-800">
          Processo Seletivo - Bemol
        </h1>
        <p className="text-gray-600 mt-2 lg:ml-0 lg:mt-1 lg:text-[14px] 2xl:text-base mx-auto lg:mx-0 mb-5">
          Confira todas as etapas do processo seletivo. Você pode realizar as etapas em qualquer ordem.
        </p>

        {/* 2. BARRA DE PROGRESSO (NOTEBOOK) AGORA É DINÂMICA */}
        <div className="hidden lg:flex 2xl:hidden justify-start mt-4 pr-2">
          <ProgressBar
            progress={progressData.completionPercentage}
            completedSteps={progressData.completedTests}
            totalSteps={progressData.totalTests}
          />
        </div>
      </header>

      <div className="flex flex-col 2xl:flex-row items-center 2xl:items-start gap-10 2xl:gap-16 mt-2">
        {/* 3. CÍRCULO DE PROGRESSO (MOBILE) AGORA É DINÂMICO */}
        <section className="block lg:hidden mb-6">
          <ProgressCircle
            progress={progressData.completionPercentage}
            completedSteps={progressData.completedTests}
            totalSteps={progressData.totalTests}
            size={200}
            stroke={14}
            arcColor="#60A5FA"
            trailColor="#E5E7EB"
          />
        </section>

        {/* 4. CARDS AGORA SÃO RENDERIZADOS COM DADOS DA API */}
        <section className="order-2 2xl:order-1 w-full">
          <div
            className="
              grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3
              gap-7
              justify-items-center lg:justify-items-stretch
            "
          >
            {testsToDisplay.map((t) => (
              <TestCard key={t.id} test={t} candidateId={candidateId} />
            ))}
          </div>
        </section>

        {/* 5. CÍRCULO DE PROGRESSO (DESKTOP) AGORA É DINÂMICO */}
        <aside className="order-1 hidden 2xl:block w-[420px] pl-4">
          <ProgressCircle
            progress={progressData.completionPercentage}
            completedSteps={progressData.completedTests}
            totalSteps={progressData.totalTests}
            size={200}
            stroke={14}
            arcColor="#60A5FA"
            trailColor="#E5E7EB"
          />
        </aside>
      </div>
    </MainLayout>
  );
};

export default SelectionProcessPage;