// src/pages/QuestionnairePage.tsx
import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { ProgressHeader, QuestionBlock } from "@/lib/helper";
import { ConfirmDialog } from "@/components/confirm-dialog";
import { useNavigate, useParams } from "@tanstack/react-router";
import { Loader2 } from "lucide-react";
import { usePsychologyTest } from "@/hooks/usePsychologyTest";
import type { TestQuestion, Question, Option } from "@/@types/tests"; // Importe os tipos

const QuestionnairePage = () => {
    const navigate = useNavigate();
    const { candidateId } = useParams({
        from: "/selection-process/$candidateId/questionario/",
    });

    const {
        testInstance,
        isLoading,
        error,
        submitAnswer,
        finishTest,
        isFinishing
    } = usePsychologyTest(candidateId);

    const [questionIndex, setQuestionIndex] = useState(0);
    const [localAnswers, setLocalAnswers] = useState<Record<string, string[]>>({});
    const [startTimes, setStartTimes] = useState<Record<string, number>>({});

    const questions = testInstance?.questions || [];
    const currentQuestion: TestQuestion | undefined = questions[questionIndex];
    const totalQuestions = questions.length;

    if (currentQuestion && !startTimes[currentQuestion.id]) {
        setStartTimes(prev => ({ ...prev, [currentQuestion.id]: Date.now() }));
    }

    const isLast = questionIndex === totalQuestions - 1;
    
    // ALTERAÇÃO: Conversão explícita de TestQuestion para o tipo Question esperado pelo QuestionBlock
    const parsedQuestion: Question | null = useMemo(() => {
        if (!currentQuestion) return null;
        
        let parsedOptions: Option[] = [];
        try {
            const rawOpts = currentQuestion.optionsJson 
                ? JSON.parse(currentQuestion.optionsJson) 
                : null;

            if (rawOpts) {
                if (!Array.isArray(rawOpts) && typeof rawOpts === 'object') {
                    parsedOptions = Object.entries(rawOpts).map(([key, value]) => ({
                        id: key,
                        label: String(value)
                    }));
                } 
                else if (Array.isArray(rawOpts)) {
                    parsedOptions = rawOpts.map((o: any) => ({
                        id: o.id || o.key,
                        label: o.text || o.label || o.value || String(o)
                    }));
                }
            }
        } catch (e) {
            console.error("Erro ao parsear opções:", e);
            parsedOptions = [];
        }

        return {
            id: currentQuestion.id,
            prompt: currentQuestion.questionText,
            options: parsedOptions,
            type: currentQuestion.allowMultipleAnswers ? 'multi' : 'single',
            // ADICIONADO: Mapeia o limite máximo de respostas vindo do backend
            maxSelections: currentQuestion.maxAnswersAllowed || 1, 
            isRequired: true,
            pointValue: currentQuestion.pointValue
        };
    }, [currentQuestion]);

    const handleAnswerChange = (val: string | string[]) => {
        if (!currentQuestion) return;
        const valArray = Array.isArray(val) ? val : [val];
        setLocalAnswers(prev => ({ ...prev, [currentQuestion.id]: valArray }));
    };

    const saveCurrentAndNext = async () => {
        if (!currentQuestion) return;

        const answer = localAnswers[currentQuestion.id];
        const startTime = startTimes[currentQuestion.id] || Date.now();
        const duration = Date.now() - startTime;

        try {
            await submitAnswer([{
                questionSnapshotId: currentQuestion.id,
                selectedAnswers: answer,
                responseTimeMs: duration
            }]);

            if (!isLast) {
                setQuestionIndex(prev => prev + 1);
                window.scrollTo({ top: 0, behavior: "smooth" });
            }
        } catch (err) {
            // Erro já tratado no hook
        }
    };

    const handleFinish = async () => {
        if (currentQuestion && localAnswers[currentQuestion.id]) {
             await saveCurrentAndNext();
        }

        try {
            await finishTest();
            navigate({
                to: "/selection-process/$candidateId",
                params: { candidateId },
            });
        } catch (error) {
            console.error("Erro ao finalizar", error);
        }
    };

    if (isLoading) {
        return (
            <div className="flex h-screen w-full items-center justify-center gap-2">
                <Loader2 className="h-6 w-6 animate-spin text-gray-600" />
                <span className="text-gray-700">Carregando teste...</span>
            </div>
        );
    }

    if (error || !testInstance) {
        return (
            <div className="flex h-screen w-full flex-col items-center justify-center gap-4 text-red-600">
                <p>Não foi possível carregar o questionário.</p>
                <Button onClick={() => window.location.reload()}>Tentar Novamente</Button>
            </div>
        );
    }

    if (testInstance.status === 'Submitted' || testInstance.status === 'Approved' || testInstance.status === 'Rejected') {
         return (
            <div className="flex h-screen w-full items-center justify-center">
                <div className="text-center">
                    <h2 className="text-xl font-bold">Teste já finalizado</h2>
                    <p className="text-gray-600">Você já completou este questionário.</p>
                    <Button 
                        className="mt-4" 
                        onClick={() => navigate({ to: "/selection-process/$candidateId", params: { candidateId }})}
                    >
                        Voltar ao Painel
                    </Button>
                </div>
            </div>
         );
    }

    return (
        <div className="min-h-screen bg-[#F9FAFB]">
            {/* ALTERAÇÃO: Passando a prop 'total' explicitamente */}
            <ProgressHeader answered={Object.keys(localAnswers).length} total={totalQuestions} />

            <main className="mx-auto w-full max-w-[1100px] px-6 py-8">
                <h2 className="mb-4 text-[16px] font-semibold text-gray-900">
                    Questão {questionIndex + 1} de {totalQuestions}
                </h2>

                {parsedQuestion && (
                    <QuestionBlock
                        q={parsedQuestion}
                        value={localAnswers[parsedQuestion.id] || []} 
                        onChange={handleAnswerChange}
                    />
                )}

                <div className="mt-8 flex items-center justify-between">
                    <Button
                        variant="ghost"
                        onClick={() => setQuestionIndex(i => Math.max(0, i - 1))}
                        disabled={questionIndex === 0 || isFinishing}
                    >
                        Voltar
                    </Button>

                    {isLast ? (
                        <ConfirmDialog
                            trigger={
                                <Button
                                    disabled={isFinishing || !localAnswers[currentQuestion?.id || ""]}
                                    className="bg-[#0385d1] text-white hover:bg-[#0271b2]"
                                >
                                    {isFinishing ? "Enviando..." : "Finalizar"}
                                </Button>
                            }
                            title="Finalizar Questionário"
                            description="Tem certeza? Suas respostas serão enviadas para análise."
                            confirmText="Enviar"
                            cancelText="Cancelar"
                            onConfirm={handleFinish}
                        />
                    ) : (
                        <Button
                            onClick={saveCurrentAndNext}
                            disabled={!localAnswers[currentQuestion?.id || ""]}
                            className="bg-[#0385d1] text-white hover:bg-[#0271b2] cursor-pointer"
                        >
                            Salvar e Avançar
                        </Button>
                    )}
                </div>
            </main>
        </div>
    );
};

export default QuestionnairePage;