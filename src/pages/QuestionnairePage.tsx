import { Button } from "@/components/ui/button";
import { ProgressHeader, QuestionBlock } from "@/lib/helper";
import { useMemo, useState } from "react";
import { ConfirmDialog } from "@/components/confirm-dialog";
import { useNavigate, useParams } from "@tanstack/react-router";
import { useTest } from "@/hooks/useTest";
import { useSubmitQuestionnaire } from "@/hooks/useQuestionnaire";
import { Loader2 } from "lucide-react";
import { TestType } from "@/api/apiPaths";

const QuestionnairePage = () => {
    const navigate = useNavigate();
    const { candidateId } = useParams({
        from: "/selection-process/$candidateId/questionario/",
    });

    const {
        data: testData,
        isLoading: isLoadingTest,
        isError: isTestError,
    } = useTest(candidateId, TestType.Psychology);

    console.log("Candidate ID:", candidateId); 
    console.log("Test Data:", testData);

    const submitMutation = useSubmitQuestionnaire();
    const [answers, setAnswers] = useState<Record<string, string | string[]>>({});
    const [questionIndex, setQuestionIndex] = useState(0);

    const questions = Array.isArray(testData?.questions) ? testData.questions : [];
    const totalQuestions = questions.length;
    
    const currentQuestion = questions[questionIndex] ?? null;

    const isFirst = questionIndex === 0;
    const isLast = totalQuestions > 0 && questionIndex === totalQuestions - 1;

    const totalAnswered = useMemo(() => {
        return Object.values(answers).filter(
            (a) =>
                (Array.isArray(a) && a.length > 0) ||
                (typeof a === "string" && a.trim().length > 0)
        ).length;
    }, [answers]);

    const handleChange = (qid: string, newVal: string | string[]) => {
        setAnswers((prev) => ({ ...prev, [qid]: newVal }));
    };

    const handleNext = () => {
        if (!currentQuestion || !answers[currentQuestion.id]) return;
        if (!isLast) setQuestionIndex((i) => i + 1);
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    const handleBack = () => {
        if (!isFirst) setQuestionIndex((i) => i - 1);
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    const handleFinish = async () => {
        if (!testData) return;

        const fixedResponses: Record<string, string> = {};
        for (const key in answers) {
            const value = answers[key];
            fixedResponses[key] = Array.isArray(value) ? value.join(",") : value;
        }

        submitMutation.mutate(
            {
                candidateId,
                testId: testData.id,
                fixedResponses,
            },
            {
                onSuccess: () => {
                    navigate({
                        to: "/selection-process/$candidateId",
                        params: { candidateId },
                    });
                },
            }
        );
    };

    if (isLoadingTest) {
        return (
            <div className="flex h-screen w-full items-center justify-center gap-2">
                <Loader2 className="h-6 w-6 animate-spin text-gray-600" />
                <span className="text-gray-700">Preparando questionário...</span>
            </div>
        );
    }

    if (isTestError || !testData || totalQuestions === 0) {
        return (
            <div className="flex h-screen w-full items-center justify-center text-red-600">
                Não foi possível carregar o questionário. Por favor, tente novamente.
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#F9FAFB]">
            <ProgressHeader answered={totalAnswered} />

            <main className="mx-auto w-full max-w-[1100px] px-6 py-8">
                <h2 className="mb-4 text-[16px] font-semibold text-gray-900">
                    Questão {questionIndex + 1} de {totalQuestions}
                </h2>

                {currentQuestion ? (
                    <QuestionBlock
                        q={currentQuestion}
                        value={answers[currentQuestion.id]}
                        onChange={(newVal) => handleChange(currentQuestion.id, newVal)}
                    />
                ) : (
                    <p className="text-gray-600">Nenhuma pergunta encontrada.</p>
                )}

                <div className="mt-8 flex items-center justify-between">
                    <button
                        onClick={handleBack}
                        disabled={isFirst || submitMutation.isPending}
                        className="text-sm text-gray-600 hover:text-gray-800 disabled:cursor-not-allowed disabled:text-gray-300"
                    >
                        Voltar
                    </button>

                    {isLast ? (
                        <ConfirmDialog
                            trigger={
                                <Button
                                    disabled={submitMutation.isPending}
                                    className="rounded-lg bg-[#0385d1] px-6 py-2 text-white hover:bg-[#0271b2] disabled:cursor-not-allowed disabled:bg-gray-200 disabled:text-gray-500"
                                >
                                    {submitMutation.isPending ? "Enviando..." : "Finalizar"}
                                </Button>
                            }
                            title="Deseja finalizar o questionário?"
                            description="Após o envio, suas respostas não poderão ser alteradas. Deseja continuar?"
                            confirmText={
                                submitMutation.isPending ? "Aguarde..." : "Confirmar e Enviar"
                            }
                            cancelText="Cancelar"
                            onConfirm={handleFinish}
                        />
                    ) : (
                        <Button
                            onClick={handleNext}
                            disabled={!answers[currentQuestion.id]}
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
