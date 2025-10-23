import { useEffect, useMemo, useRef, useState } from "react";
import { ChevronLeft, Circle, Square, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import Webcam from "react-webcam";
import { useRecorder } from "@/hooks/useRecorder";
import { TimerProgress } from "@/components/TimerProgress";
import { INTERVIEW_QUESTIONS } from "@/features/interview-test/questions";
import { InstructionsPanel } from "@/features/interview-test/InstructionsPanel";

// Store/Dialogs/Toast
import { useMediaStore } from "@/store/useMediaStore";
import { ConfirmStartDialog } from "@/components/media/ConfirmStartDialog";
import { ConfirmStopDialog } from "@/components/media/ConfirmStopDialog";
import { toast } from "sonner";
import { useNavigate } from "@tanstack/react-router";

const TOTAL_LIMIT_SECONDS = 10 * 60;
const QUESTION_LIMIT_SECONDS = 2 * 60;
const PREP_SECONDS = 5;
const TOTAL_MINUTES = Math.ceil(TOTAL_LIMIT_SECONDS / 60);

type Phase = "idle" | "prep" | "recording";

export default function VideoInterviewPage() {
  // grava por pergunta (2 min)
  const { start, stop, elapsed, videoUrl, error, setSourceStream } =
    useRecorder(QUESTION_LIMIT_SECONDS);

  // índice e fases
  const [currentIdx, setCurrentIdx] = useState(0);
  const total = INTERVIEW_QUESTIONS.length;
  const isLast = currentIdx === total - 1;
  const [phase, setPhase] = useState<Phase>("idle");
  const [prepLeft, setPrepLeft] = useState(PREP_SECONDS);

  // modais
  const [openStart, setOpenStart] = useState(false);
  const [openStop, setOpenStop] = useState(false);

  // store de mídia + helpers
  const mirror = useMediaStore((s) => s.mirror);
  const cameraId = useMediaStore((s) => s.cameraId);
  const micId = useMediaStore((s) => s.micId);
  const videoEnabled = useMediaStore((s) => s.videoEnabled);
  const audioEnabled = useMediaStore((s) => s.audioEnabled);
  const openStream = useMediaStore((s) => s.openStream);
  const makeRecordableStream = useMediaStore((s) => s.makeRecordableStream);
  const navigate = useNavigate();
  const powerOff = useMediaStore((s) => s.powerOff);

  function onBack() {
    window.history.back();
  }

  // Inicia entrevista: abre stream, exibe prep de 5s da 1ª pergunta
  async function handleStartInterview() {
    setCurrentIdx(0);
    await openStream(cameraId, micId);
    setPrepLeft(PREP_SECONDS);
    setPhase("prep");
  }

  // Ao final do prep, começa a gravar a pergunta atual
  const startedRef = useRef(false);
  useEffect(() => {
    if (phase !== "prep") return;
    startedRef.current = false;

    const id = window.setInterval(() => {
      setPrepLeft((v) => {
        if (v <= 1) {
          window.clearInterval(id);
          return 0;
        }
        return v - 1;
      });
    }, 1000);

    return () => window.clearInterval(id);
  }, [phase]);

  // Quando terminou o prep (chegou em 0), inicia a gravação
  useEffect(() => {
    if (phase !== "prep" || prepLeft !== 0 || startedRef.current) return;
    (async () => {
      startedRef.current = true;
      // garante stream vivo e de acordo com flags/ids
      await openStream(cameraId, micId);
      const recordable = await makeRecordableStream(); // já espelhado se mirror=true
      setSourceStream(recordable);
      start();
      setPhase("recording");
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase, prepLeft]);

  // Quando a gravação de UMA pergunta termina, salva e avança (ou finaliza)
  useEffect(() => {
    if (!videoUrl) return;
    const qNumber = currentIdx + 1;

    // TODO: enviar para o backend aqui (videoUrl → blob fetch/POST). Exemplo:
    // await uploadAnswer({ questionIndex: currentIdx, url: videoUrl });

    toast.success(`Questão ${qNumber} gravada com sucesso.`);

    if (!isLast) {
      // próxima pergunta: prep novamente
      setCurrentIdx((i) => i + 1);
      setPrepLeft(PREP_SECONDS);
      setPhase("prep");
    } else {
      // última questão finalizada — volta para estado ocioso (ou redirecione)
      powerOff();
      navigate({ to: "/selection-process" });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [videoUrl]);


  // Avançar manualmente antes de 2min → confirmar parada
  function handleAdvance() {
    if (phase === "recording") {
      setOpenStop(true);
    }
  }

  // webcam só aparece quando gravando (para não pedir permissão antes)
  const webcam = useMemo(() => {
    if (phase !== "recording") return null;
    return (
      <Webcam
        videoConstraints={
          videoEnabled && cameraId
            ? { deviceId: { exact: cameraId }, width: 960, height: 540 }
            : { width: 960, height: 540 }
        }
        audio={!!audioEnabled}
        muted
        mirrored={!!mirror}
        className="aspect-video w-full bg-[url('/checker.svg')] bg-center object-cover"
      />
    );
  }, [phase, videoEnabled, cameraId, audioEnabled, mirror]);

  // Overlay da contagem regressiva (5 → 0) antes de cada pergunta
  const prepOverlay =
    phase === "prep" ? (
      <div className="absolute inset-0 grid place-items-center bg-black/40">
        <div className="flex h-28 w-28 items-center justify-center rounded-full bg-white/90 shadow-xl">
          <span className="text-4xl font-semibold text-gray-900">{prepLeft}</span>
        </div>
      </div>
    ) : null;

  return (
    <div className="min-h-screen bg-[#F9FAFB]">
      {/* Topbar */}
      <header className="sticky top-0 z-10 w-full h-16 bg-[#0385D1] text-white md:bg-white md:text-gray-900 md:border-b-2 md:border-gray-200">
        <div className="relative flex h-full items-center px-4 md:px-6">
          {phase === "idle" && (
            <button
              onClick={onBack}
              className="inline-flex items-center gap-2 text-white md:text-gray-600 md:hover:text-gray-800"
            >
              <ChevronLeft className="size-5" />
              <span className="hidden md:inline text-sm">Voltar ao menu</span>
            </button>
          )}
          <h1 className="pointer-events-none absolute left-1/2 -translate-x-1/2 text-[18px] font-semibold text-white md:text-[20px] md:text-gray-900">
            Entrevista de Vídeo
          </h1>
        </div>
      </header>

      <main className="mx-auto w-full max-w-[1100px] px-6 py-8">
        {/* INSTRUÇÕES — apenas antes de iniciar */}
        {phase === "idle" && <InstructionsPanel />}

        <div className="mx-auto w-full max-w-[920px]">
          {/* Tabs + enunciado — visíveis durante prep e gravação */}
          {phase !== "idle" && (
            <>
              <div className="mb-4 flex flex-wrap items-center justify-center gap-3 font-bold">
                {INTERVIEW_QUESTIONS.map((_, i) => {
                  const active = i === currentIdx;
                  return (
                    <button
                      key={i}
                      type="button"
                      disabled={i !== currentIdx}
                      className={[
                        "rounded-full px-5 py-2 text-sm transition-colors",
                        active
                          ? "bg-[#0385d1] text-white"
                          : "bg-gray-100 text-gray-500",
                      ].join(" ")}
                    >
                      {`Questão #${i + 1}`}
                    </button>
                  );
                })}
              </div>

              <p className="mb-4 text-center text-[18px] text-gray-700 font-bold">
                {INTERVIEW_QUESTIONS[currentIdx].text}
              </p>
            </>
          )}

          {/* Webcam + overlay */}
          <div className="relative overflow-hidden rounded-lg border border-gray-300 bg-white">
            {phase === "idle" ? (
              <div className="aspect-video w-full bg-[url('/checker.svg')] bg-center" />
            ) : phase === "recording" ? (
              webcam
            ) : (
              <div className="aspect-video w-full bg-[url('/checker.svg')] bg-center" />
            )}
            {prepOverlay}
          </div>

          {/* Progresso — só durante a gravação da pergunta */}
          {phase === "recording" && (
            <TimerProgress
              elapsed={elapsed}
              limitSeconds={QUESTION_LIMIT_SECONDS}
              className="mt-4"
            />
          )}

          {/* Botões */}
          <div className="mt-6 flex items-center justify-center">
            {phase === "recording" ? (
              <Button
                onClick={handleAdvance}
                className={
                  isLast
                    ? "rounded-lg bg-red-600 text-white hover:bg-red-700"
                    : "rounded-lg bg-[#0385d1] text-white hover:bg-[#0271b2]"
                }
              >
                {isLast ? (
                  <>
                    <Square className="mr-2 h-4 w-4" />
                    Finalizar
                  </>
                ) : (
                  <>
                    Avançar
                    <ChevronRight className="ml-2 h-4 w-4" />
                  </>
                )}
              </Button>
            ) : phase === "idle" ? (
              <Button
                onClick={() => setOpenStart(true)}
                className="rounded-lg bg-[#0385d1] text-white hover:bg-[#0271b2]"
              >
                <Circle className="mr-2 h-4 w-4 fill-current" />
                Iniciar gravação
              </Button>
            ) : (
              // Durante o prep, apenas um estado desabilitado
              <Button disabled className="rounded-lg bg-gray-300 text-gray-700">
                Preparando…
              </Button>
            )}
          </div>

          {/* Modais */}
          <ConfirmStartDialog
            open={openStart}
            onOpenChange={setOpenStart}
            minutes={TOTAL_MINUTES}
            onConfirm={handleStartInterview}
          />
          <ConfirmStopDialog
            open={openStop}
            onOpenChange={setOpenStop}
            onConfirm={() => stop()}
            description={
              isLast
                ? "Você está prestes a finalizar a entrevista. Deseja encerrar agora?"
                : "Avançar agora encerrará e enviará a resposta desta pergunta. Deseja continuar?"
            }
          />

          {error && <p className="mt-3 text-sm text-red-600">{error}</p>}
        </div>
      </main>
    </div>
  );
}
