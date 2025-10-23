import { Button } from "@/components/ui/button";
import { ProgressHeader, QuestionBlock } from "@/lib/helper";
import { SECTION_DATA, TOTAL_QUESTIONS } from "@/mocks/questionario";
import { useMemo, useState } from "react";
import { ConfirmDialog } from "@/components/confirm-dialog";
import { useNavigate, useParams } from "@tanstack/react-router";
import { useTest } from "@/hooks/useTest";
import { useSubmitQuestionnaire } from "@/hooks/useQuestionnaire";
import { Loader2 } from "lucide-react";

const QuestionnairePage = () => {
    const navigate = useNavigate();
    const { candidateId } = useParams({ 
        from: '/selection-process/$candidateId/questionario/' 
    });

    // Busca o 'testId' para o teste de psicologia.
    const { data: testData, isLoading: isLoadingTest, isError: isTestError } = useTest(candidateId, 'psychology');
    
    // Hook para enviar as respostas
    const submitMutation = useSubmitQuestionnaire();

    const [sectionIndex, setSectionIndex] = useState(0);
    const [answers, setAnswers] = useState<Record<string, string | string[]>>({});

    // Os dados das seções e questões vêm dos seus mocks
    const currentSection = useMemo(() => SECTION_DATA[sectionIndex], [sectionIndex]);
    const isFirstSection = sectionIndex === 0;
    const isLastSection = sectionIndex === SECTION_DATA.length - 1;

    const totalAnswered = useMemo(() => {
        let count = 0;
        // Itera sobre as seções e perguntas reais, não sobre as chaves de resposta
        for (const section of SECTION_DATA) {
            for (const question of section.questions) {
                const answer = answers[question.id];
                if (answer && ( (Array.isArray(answer) && answer.length > 0) || (typeof answer === 'string' && answer.length > 0) ) ) {
                    count++;
                }
            }
        }
        return count;
    }, [answers]);
    
    const answeredInSection = useMemo(() => {
        return currentSection.questions.filter(q => {
            const answer = answers[q.id];
            return Array.isArray(answer) ? answer.length > 0 : !!answer;
        }).length;
    }, [answers, currentSection]);

    const canAdvance = answeredInSection === currentSection.questions.length;
    const canFinish = totalAnswered === TOTAL_QUESTIONS;

    function handleChange(qid: string, newVal: string | string[]) {
        setAnswers((prev) => ({ ...prev, [qid]: newVal }));
    }

    function handleNext() {
        if (!canAdvance || isLastSection) return;
        setSectionIndex((i) => i + 1);
        window.scrollTo({ top: 0, behavior: "smooth" });
    }

    function handleBack() {
        if (isFirstSection) return;
        setSectionIndex((i) => i - 1);
        window.scrollTo({ top: 0, behavior: "smooth" });
    }

    async function handleFinish() {
        if (!canFinish || !testData) return;

        const fixedResponses: Record<string, string> = {};
        for (const key in answers) {
            const value = answers[key];
            fixedResponses[key] = Array.isArray(value) ? value.join(',') : value;
        }

        submitMutation.mutate({
            candidateId,
            testId: testData.id,
            fixedResponses,
        }, {
            onSuccess: () => {
                navigate({ 
                    to: "/selection-process/$candidateId", 
                    params: { candidateId } 
                });
            }
        });
    }

    if (isLoadingTest) {
        return (
            <div className="flex h-screen w-full items-center justify-center gap-2">
                <Loader2 className="h-6 w-6 animate-spin text-gray-600" />
                <span className="text-gray-700">Preparando questionário...</span>
            </div>
        );
    }

    if (isTestError) {
        return (
            <div className="flex h-screen w-full items-center justify-center text-red-600">
                Não foi possível carregar o questionário. Por favor, tente recarregar a página.
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#F9FAFB]">
            {/* Barra de Progresso Restaurada */}
            <ProgressHeader answered={totalAnswered} />

            <main className="mx-auto w-full max-w-[1100px] px-6 py-8">
                <h2 className="mb-4 text-[16px] font-semibold text-gray-900">
                    {currentSection.title}
                </h2>

                <div className="space-y-5">
                    {currentSection.questions.map((q) => (
                        <QuestionBlock
                            key={q.id}
                            q={q}
                            value={answers[q.id]}
                            onChange={(newVal) => handleChange(q.id, newVal)}
                            extraGet={(k) => answers[k]}
                            extraSet={(k, v) => setAnswers((prev) => ({ ...prev, [k]: v }))}
                        />
                    ))}
                </div>

                <div className="mt-8 flex items-center justify-between">
                    <button
                        onClick={handleBack}
                        disabled={isFirstSection || submitMutation.isPending}
                        className="text-sm text-gray-600 hover:text-gray-800 disabled:cursor-not-allowed disabled:text-gray-300"
                    >
                        Voltar
                    </button>

                    {isLastSection ? (
                        <ConfirmDialog
                            trigger={
                                <Button
                                    disabled={!canFinish || submitMutation.isPending}
                                    className="rounded-lg bg-[#0385d1] px-6 py-2 text-white hover:bg-[#0271b2] disabled:cursor-not-allowed disabled:bg-gray-200 disabled:text-gray-500"
                                >
                                    {submitMutation.isPending ? "Enviando..." : "Finalizar"}
                                </Button>
                            }
                            title="Deseja finalizar o questionário?"
                            description="Após o envio, suas respostas não poderão ser alteradas. Deseja continuar?"
                            confirmText={submitMutation.isPending ? "Aguarde..." : "Confirmar e Enviar"}
                            cancelText="Cancelar"
                            onConfirm={handleFinish}
                        />
                    ) : (
                        <Button
                            onClick={handleNext}
                            disabled={!canAdvance}
                            className="rounded-lg bg-[#0385d1] px-6 py-2 text-white hover:bg-[#0271b2] disabled:cursor-not-allowed disabled:bg-gray-200 disabled:text-gray-500 cursor-pointer"
                        >
                            Avançar
                        </Button>
                    )}
                </div>
            </main>
        </div>
    );
};

export default QuestionnairePage;