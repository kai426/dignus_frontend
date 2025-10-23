import { useEffect, useMemo, useRef, useState } from "react";
import { ChevronLeft, Clock3 } from "lucide-react";
import { useNavigate } from "@tanstack/react-router";
import type { OptionKey } from "@/components/options";
import { QUESTIONS } from "./questions";
import { ConfirmDialog } from "@/components/confirm-dialog";

/* ---------- helpers ---------- */
const LIMIT_SECONDS = 25 * 60; // 25 minutos

function fmt(sec: number) {
  const s = Math.max(0, sec);
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const r = s % 60;
  return [h, m, r].map((n) => n.toString().padStart(2, "0")).join(":");
}

/* ---------- Card wrapper ---------- */
function Card({ children }: { children: React.ReactNode }) {
  return (
    <section className="w-full max-w-[860px] rounded-2xl border border-gray-200 bg-white p-6 shadow-lg md:p-7">
      {children}
    </section>
  );
}

function TimerPill({ remaining }: { remaining: number }) {
  return (
    <span
      className="inline-flex items-center gap-2 rounded-full bg-black/80 px-3 py-1.5 text-sm font-semibold text-white shadow-md ring-1 ring-white/20 md:bg-yellow-100 md:text-yellow-800 md:ring-yellow-300"
      aria-label={`Tempo restante ${fmt(remaining)}`}
    >
      <Clock3 className="size-4 opacity-90 md:text-yellow-700" />
      <span className="tabular-nums">{fmt(remaining)}</span>
    </span>
  );
}

/* ---------- Página ---------- */
export default function TestPage() {
  const navigate = useNavigate();

  // navegação/estado
  const TOTAL = QUESTIONS.length;
  const [step, setStep] = useState(0);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [answers, setAnswers] = useState<Record<number, OptionKey | null>>(() =>
    Object.fromEntries(Array.from({ length: TOTAL }, (_, i) => [i, null]))
  );

  // timer
  const [elapsed, setElapsed] = useState(0);
  const timerRef = useRef<number | null>(null);
  const remaining = Math.max(0, LIMIT_SECONDS - elapsed);

  useEffect(() => {
    timerRef.current = window.setInterval(() => setElapsed((e) => e + 1), 1000);
    return () => {
      if (timerRef.current) window.clearInterval(timerRef.current);
    };
  }, []);

  function handleFinish() {
    if (timerRef.current) window.clearInterval(timerRef.current);
    // TODO: Enviar 'answers' para o backend
    console.log("Respostas finais:", answers);
    navigate({ to: "/selection-process" });
  }

  useEffect(() => {
    if (remaining <= 0) {
      handleFinish();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [remaining]);

  const selected = answers[step] ?? null;
  const setSelected = (k: OptionKey) =>
    setAnswers((prev) => ({ ...prev, [step]: k }));

  const isLast = step === TOTAL - 1;
  const canAdvance = selected !== null;

  const spec = QUESTIONS[step];

  const OptionsComp = useMemo(() => spec.Options, [spec]);
  const BoardComp = useMemo(() => spec.Board, [spec]);

  function handleBack() {
    if (step > 0) {
      setStep((s) => s - 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
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

  return (
    <div className="min-h-screen bg-[#F3F5F7]">
      {/* Topbar */}
      <header className="sticky top-0 z-10 w-full border-b border-black/10 bg-[#0385D1] text-white shadow-sm backdrop-blur supports-[backdrop-filter]:bg-[#0385D1]/95 md:bg-white md:text-gray-900">
        <div className="mx-auto grid h-16 max-w-screen-xl grid-cols-[1fr_auto_1fr] items-center px-4 md:px-6">
          {/* Espaço para alinhamento */}
          <div className="flex items-center"></div>

          {/* Título central sempre alinhado */}
          <h1 className="pointer-events-none text-center text-[18px] font-semibold md:text-[20px]">
            Retenção Visual
          </h1>

          {/* Tempo à direita */}
          <div className="ml-auto flex items-center justify-end">
            <TimerPill remaining={remaining} />
          </div>
        </div>
      </header>

      {/* Conteúdo */}
      <main className="flex justify-center px-4 py-8">
        <Card>
          {/* cabeçalho da questão */}
          <div className="flex justify-center">
            <div className="inline-flex items-center gap-3 rounded-full bg-[#0385D1] px-4 py-2 font-semibold text-white">
              {`QUESTÃO ${step + 1}`}
            </div>
          </div>

          {/* BOARD (cartas/matriz) */}
          <div className="mt-4 flex justify-center">
            <BoardComp />
          </div>

          {/* ENUNCIADO (agora vem do objeto da questão) */}
          <h3 className="mt-4 text-center text-[18px] font-semibold text-gray-900">
            {spec.prompt}
          </h3>

          {/* ALTERNATIVAS */}
          <div className="mt-6">
            <OptionsComp selected={selected} onSelect={setSelected} />
          </div>

          {/* navegação */}
          <div className="mt-8 flex items-center justify-between">
            <button
              onClick={handleBack}
              disabled={step === 0}
              className="inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50"
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
        description="Você tem certeza que deseja finalizar o teste? Suas respostas serão enviadas."
        onConfirm={handleFinish}
        confirmText="Sim, finalizar"
        cancelText="Não, voltar"
      />
    </div>
  );
}