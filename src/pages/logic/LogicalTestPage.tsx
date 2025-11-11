import { useEffect, useMemo, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Square } from "lucide-react";
import Webcam from "react-webcam";
import { TimerProgress } from "@/components/TimerProgress";
import { useRecorder } from "@/hooks/useRecorder";
import { toast } from "sonner";
import { useNavigate } from "@tanstack/react-router";
import { useMediaStore } from "@/store/useMediaStore";
import { ConfirmStartDialog } from "@/components/media/ConfirmStartDialog";
import { ConfirmStopDialog } from "@/components/media/ConfirmStopDialog";
import { useMediaDevicesQuery } from "@/hooks/useMediaDevicesQuery";
import { getStoredCandidate } from "@/api/auth";

const QUESTIONS = [
  "Explique como identificaria o próximo número da sequência: 2, 6, 12, 20, ...",
  "Uma máquina produz 6 peças a cada 4 minutos. Quantas peças produzirá em 1 hora? Justifique.",
];
const PREP_SECONDS = 5;
const PER_QUESTION_SECONDS = 90;
const TOTAL_MINUTES = Math.ceil((QUESTIONS.length * PER_QUESTION_SECONDS) / 60);

type Phase = "idle" | "prep" | "recording";

export default function LogicalTestPage() {
  const { start, stop, elapsed, videoBlob, error, setSourceStream } =
    useRecorder(PER_QUESTION_SECONDS);

  const [currentIdx, setCurrentIdx] = useState(0);
  const total = QUESTIONS.length;
  const isLast = currentIdx === total - 1;
  const [phase, setPhase] = useState<Phase>("idle");
  const [prepLeft, setPrepLeft] = useState(PREP_SECONDS);

  const [openStart, setOpenStart] = useState(false);
  const [openStop, setOpenStop] = useState(false);

  const mirror = useMediaStore((s) => s.mirror);
  const cameraId = useMediaStore((s) => s.cameraId);
  const micId = useMediaStore((s) => s.micId);
  const enableVideo = useMediaStore((state) => state.enableVideo);
  const enableAudio = useMediaStore((state) => state.enableAudio);
  const videoEnabled = useMediaStore((s) => s.videoEnabled);
  const audioEnabled = useMediaStore((s) => s.audioEnabled);
  const openStream = useMediaStore((state) => state.openStream);
  const makeRecordableStream = useMediaStore((s) => s.makeRecordableStream);
  const powerOff = useMediaStore((s) => s.powerOff);
  const setCamera = useMediaStore((s) => s.setCamera);
  const setMic = useMediaStore((s) => s.setMic);

  const navigate = useNavigate();
  const { data, refetch } = useMediaDevicesQuery();
  const candidate = getStoredCandidate();
  const candidateId = candidate?.id;

  const [permissionDenied, setPermissionDenied] = useState(false);
  const [checkingPermission, setCheckingPermission] = useState(true);

  useEffect(() => {
    async function requestPermission() {
      try {
        setCheckingPermission(true);
        await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        await refetch();
        setPermissionDenied(false);
      } catch (err) {
        console.error("Permissão negada ou erro:", err);
        setPermissionDenied(true);
      } finally {
        setCheckingPermission(false);
      }
    }
    requestPermission();
  }, [refetch]);

  useEffect(() => {
    async function enableDevices() {
      if (data) {
        if (!cameraId && data.cameras?.length) {
          await setCamera(data.cameras[0].deviceId);
        }
        if (!micId && data.mics?.length) {
          await setMic(data.mics[0].deviceId);
        }
        if (!videoEnabled) await enableVideo();
        if (!audioEnabled) await enableAudio();
      }
    }
    enableDevices();
  }, [data, cameraId, micId, setCamera, setMic, enableVideo, enableAudio, videoEnabled, audioEnabled]);

  function onBack() {
    window.history.back();
  }

  async function handleStart() {
    if (checkingPermission) {
      toast.error("Ative câmera e microfone na prévia antes de iniciar.");
      return;
    }
    if (permissionDenied) {
      toast.error("Permissão para câmera e microfone negada.");
      return;
    }

    await openStream(cameraId, micId);
    setCurrentIdx(0);
    setPrepLeft(PREP_SECONDS);
    setPhase("prep");
  }

  // contagem regressiva antes de cada pergunta
  const startedRef = useRef(false);
  useEffect(() => {
    if (phase !== "prep") return;
    startedRef.current = false;
    const id = window.setInterval(() => {
      setPrepLeft((v) => {
        if (v <= 1) {
          clearInterval(id);
          return 0;
        }
        return v - 1;
      });
    }, 1000);
    return () => clearInterval(id);
  }, [phase]);

  // quando termina o prep, começa a gravar a pergunta atual
  useEffect(() => {
    if (phase !== "prep" || prepLeft !== 0 || startedRef.current) return;
    (async () => {
      startedRef.current = true;
      const recordable = await makeRecordableStream();
      setSourceStream(recordable);
      start();
      setPhase("recording");
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase, prepLeft]);

  if (!candidateId) {
    toast.error("ID do candidato não encontrado. Por favor, faça login novamente.");
    return;
  }

  // quando uma pergunta termina (por stop ou por tempo), salvar e avançar
  useEffect(() => {
    if (!videoBlob) return;

    async function handleVideoBlob() {
      toast.success(`Questão ${currentIdx + 1} gravada com sucesso.`);
      if (!isLast) {
        setCurrentIdx((i) => i + 1);
        setPrepLeft(PREP_SECONDS);
        setPhase("prep");
      } else {
        powerOff();
        navigate({
          to: "/selection-process/$candidateId",
          params: { candidateId: candidateId ?? "default-id" },
        });
      }
    }

    handleVideoBlob();
  }, [videoBlob]);

  // webcam (só durante gravação; evita pedir permissão antes)
  const webcam = useMemo(() => {
    if (phase !== "recording") return null;
    return (
      <Webcam
        videoConstraints={
          videoEnabled && cameraId
            ? {
              deviceId: { exact: cameraId },
              width:
                window.innerWidth >= 1024 && window.innerWidth <= 1440
                  ? 720
                  : 800,
              height:
                window.innerWidth >= 1024 && window.innerWidth <= 1440
                  ? 405
                  : 540,
            }
            : { width: 960, height: 540 }
        }
        audio={!!audioEnabled}
        muted
        mirrored={!!mirror}
        className="aspect-video w-full bg-[url('/checker.svg')] bg-center object-cover"
      />
    );
  }, [phase, videoEnabled, cameraId, audioEnabled, mirror]);

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
      {/* Topbar (mesmo padrão da entrevista) */}
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
            Prova de Matemática
          </h1>
        </div>
      </header>
      <main className="mx-auto w-full 2xl:max-w-[1100px] lg:max-w-[1000px] px-6 py-8">
        {/* Tabs + enunciado — aparecem em prep e recording */}
        {phase !== "idle" && (
          <>
            <div className="mb-4 flex flex-wrap items-center justify-center gap-3">
              {QUESTIONS.map((_, i) => {
                const active = i === currentIdx;
                return (
                  <button
                    key={i}
                    type="button"
                    disabled
                    className={[
                      "rounded-full px-5 py-2 text-sm transition-colors",
                      active
                        ? "bg-[#0385d1] text-white"
                        : "bg-gray-100 text-gray-500 font-semibold",
                    ].join(" ")}
                  >
                    {`Questão #${i + 1}`}
                  </button>
                );
              })}
            </div>
            <p className="mb-4 text-center text-lg font-semibold text-gray-700">
              {QUESTIONS[currentIdx]}
            </p>
          </>
        )}
        {/* Webcam + overlay */}
        <div className="relative overflow-hidden rounded-lg border border-gray-300 bg-white">
          {phase === "recording" ? (
            webcam
          ) : (
            <div className="aspect-video w-full bg-[url('/checker.svg')] bg-center" />
          )}
          {prepOverlay}
        </div>
        {/* Progresso — só durante gravação */}
        {phase === "recording" && (
          <TimerProgress
            elapsed={elapsed}
            limitSeconds={PER_QUESTION_SECONDS}
            className="mt-4"
          />
        )}
        {/* Botões */}
        <div className="mt-6 flex items-center justify-center">
          {phase === "recording" ? (
            <Button
              onClick={() => setOpenStop(true)}
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
              disabled={checkingPermission || permissionDenied}
              className="rounded-lg bg-[#0385d1] text-white hover:bg-[#0271b2]"
            >
              Iniciar gravação
            </Button>
          ) : (
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
          onConfirm={handleStart}
        />
        <ConfirmStopDialog
          open={openStop}
          onOpenChange={setOpenStop}
          onConfirm={() => stop()}
          description={
            isLast
              ? "Você está prestes a finalizar o teste. Deseja encerrar agora?"
              : "Avançar agora encerrará e enviará a resposta desta pergunta. Deseja continuar?"
          }
        />
        {error && <p className="mt-3 text-sm text-red-600">{error}</p>}
      </main>
    </div>
  );
}