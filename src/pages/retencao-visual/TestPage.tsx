import { useEffect, useMemo, useState } from "react";
import { ChevronLeft, Loader2 } from "lucide-react";
import { useNavigate } from "@tanstack/react-router";
import { ConfirmDialog } from "@/components/confirm-dialog";
import { QUESTIONS } from "./questions";
import { useAnswers } from "@/hooks/useAnswers";
import { useTimer } from "@/hooks/useTimer";
import { TimerPill } from "@/components/TimerPill";
import { Card } from "@/components/Card";
import { TestType, useVisualRetentionTest } from "@/hooks/useVisualRetentionTest";
import type { QuestionSpec } from "./questions/types";
import { getStoredCandidate } from "@/api/auth";
import { toast } from "sonner";
import { ConfirmExitTestDialog } from "@/components/ConfirmExitTestDialog";

export type QuestionWithBackend = QuestionSpec & {
  backendId: string | null;
};

export default function TestPage() {
  const navigate = useNavigate();
  const candidate = getStoredCandidate();
  const candidateId = candidate?.id;

  const {
    testId,
    questions,
    createOrGetActiveTest,
    isLoading,
    submitTest,
    submitAnswers,
  } = useVisualRetentionTest();

  const [submitting, setSubmitting] = useState(false);
  const [openExitTest, setOpenExitTest] = useState(false);
  const globalLoading = submitting || isLoading;

  useEffect(() => {
    if (!candidateId) return;
    createOrGetActiveTest(candidateId, TestType.VisualRetention);
  }, [candidateId]);

  if (!candidateId) return toast.error("Dados inválidos.");

  useEffect(() => {
    const bloqueada = localStorage.getItem("prova_visual_bloqueada");
    if (bloqueada === "true") {
      navigate({ to: "/selection-process/$candidateId", params: { candidateId } });
    }
  }, []);

  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue = "";
      localStorage.setItem("prova_visual_bloqueada", "true");
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, []);

  useEffect(() => {
    const handlePopState = (e: PopStateEvent) => {
      e.preventDefault();
      localStorage.setItem("prova_visual_bloqueada", "true");
      setOpenExitTest(true);
      window.history.pushState(null, "", window.location.pathname);
    };

    window.history.pushState(null, "", window.location.pathname);
    window.addEventListener("popstate", handlePopState);

    return () => window.removeEventListener("popstate", handlePopState);
  }, []);


  const mergedQuestions: QuestionWithBackend[] = useMemo(() => {
    if (!questions || questions.length === 0) return QUESTIONS.map(q => ({
      ...q,
      backendId: null,
      backendQuestionText: null,
    }));

    return QUESTIONS.map((q, index) => {
      const backend = questions.find(
        (bq) => bq.questionOrder === index + 1
      );

      return {
        ...q,
        backendId: backend?.id ?? null,
        backendQuestionText: backend?.questionText ?? null,
      };
    });
  }, [questions]);

  const TOTAL = mergedQuestions.length;

  const [step, setStep] = useState(0);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);

  const { answers, setAnswer } = useAnswers(TOTAL);

  const { remaining, stop } = useTimer(() => handleFinish());

  const spec = mergedQuestions[step];
  const selected = answers[step];
  const isLast = step === TOTAL - 1;
  const canAdvance = selected !== null;

  const BoardComp = useMemo(() => spec.Board, [spec]);
  const OptionsComp = useMemo(() => spec.Options, [spec]);

  async function handleFinish() {
    if (!candidateId || !testId) return toast.error("Dados inválidos.");

    stop();
    setSubmitting(true);

    try {
      await submitAnswers(candidateId, Object.entries(answers).map(([index, selectedOption]) => ({
        questionSnapshotId: mergedQuestions[Number(index)].backendId!,
        selectedAnswers: (Array.isArray(selectedOption) ? selectedOption : [selectedOption])
          .filter((v): v is string => v !== null && v !== undefined),
        responseTimeMs: 0,
      })));

      await submitTest(candidateId);

      toast.success("✅ Teste submetido com sucesso!");
      navigate({ to: "/selection-process/$candidateId", params: { candidateId } });
    } catch (err) {
      toast.error("Erro ao enviar o teste. Tente novamente.");
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  }

  function handleNext() {
    if (!canAdvance) return;

    if (isLast) {
      setIsConfirmOpen(true);
    } else {
      setStep((s) => s + 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }

  function handleBack() {
    if (step > 0) {
      setStep((s) => s - 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }

  return (
    <div className="min-h-screen bg-[#F3F5F7]">
      <header className="sticky top-0 z-10 w-full border-b border-black/10 bg-[#0385D1] text-white shadow-sm md:bg-white md:text-gray-900">
        <div className="mx-auto flex h-16 max-w-screen-xl items-center justify-between px-4 md:px-6">
          <h1 className="pointer-events-none text-center text-[18px] font-semibold md:text-[20px]">
            Retenção Visual
          </h1>

          <TimerPill remaining={remaining} />
        </div>
      </header>

      <main className="flex justify-center px-4 py-8">
        <Card>
          <div className="flex justify-center">
            <div className="inline-flex items-center gap-3 rounded-full bg-[#0385D1] px-4 py-2 font-semibold text-white">
              {`QUESTÃO ${step + 1}`}
            </div>
          </div>

          <div className="mt-4 flex justify-center">
            <BoardComp />
          </div>

          <h3 className="mt-4 text-center text-[18px] font-semibold text-gray-900">
            {spec.prompt}
          </h3>

          <div className="mt-6">
            <OptionsComp
              selected={selected}
              onSelect={(k) => setAnswer(step, k)}
            />
          </div>

          <div className="mt-8 flex items-center justify-between">
            <button
              onClick={handleBack}
              disabled={step === 0}
              className="inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 disabled:opacity-50"
            >
              <ChevronLeft className="size-4" />
              Voltar
            </button>

            <button
              onClick={handleNext}
              disabled={!canAdvance}
              className={[
                "inline-flex rounded-lg px-6 py-2 font-semibold",
                canAdvance
                  ? "bg-[#0385D1] text-white hover:bg-[#0271B2]"
                  : "cursor-not-allowed bg-gray-200 text-gray-500",
              ].join(" ")}
            >
              {isLast ? "Finalizar" : "Avançar"}
            </button>
          </div>
        </Card>
      </main>

      <ConfirmDialog
        open={isConfirmOpen}
        onOpenChange={setIsConfirmOpen}
        title="Finalizar o teste?"
        description="Você tem certeza que deseja finalizar o teste? Suas respostas serão mostradas no console."
        onConfirm={async () => {
          await handleFinish();
        }}
        confirmText="Sim, finalizar"
        cancelText="Não, voltar"
      />

      <ConfirmExitTestDialog
        open={openExitTest}
        onOpenChange={setOpenExitTest}
        onConfirm={() => {
          localStorage.removeItem("prova_visual_bloqueada");
          navigate({ to: "/selection-process/$candidateId", params: { candidateId } });
        }}
      />

      {globalLoading && (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black/70 text-white backdrop-blur-sm">
          <Loader2 className="animate-spin w-16 h-16 mb-6" />
          <p className="text-lg font-semibold">
            {submitting ? "Enviando suas respostas..." : "Preparando teste..."}
          </p>
          <p className="text-sm text-gray-300 mt-2">
            {submitting
              ? "Por favor, não feche nem recarregue a página."
              : "Aguarde enquanto carregamos suas questões e dados."}
          </p>
        </div>
      )}
    </div>
  );
}
