import { useEffect, useState } from "react";
import { ChevronLeft, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useNavigate } from "@tanstack/react-router";

import { useMediaStore } from "@/store/useMediaStore";
import { useMediaDevicesQuery } from "@/hooks/useMediaDevicesQuery";

import { ConfirmStartDialog } from "@/components/media/ConfirmStartDialog";
import { ConfirmStopDialog } from "@/components/media/ConfirmStopDialog";
import { ConfirmExitTestDialog } from "@/components/ConfirmExitTestDialog";

import { getStoredCandidate } from "@/api/auth";
import { TestType } from "@/api/apiPaths";

import { useTestFlow } from "@/hooks/useTestFlow";
import { useQuestionRecorder } from "@/hooks/useQuestionRecorder";

import { QuestionNavigator } from "@/components/QuestionNavigator";
import { QuestionVideo } from "@/components/QuestionVideo";
import { TestControls } from "@/components/TestControls";
import { InstructionsPanel } from "@/features/interview-test/InstructionsPanel";

const PREP_SECONDS = 5;
const PER_QUESTION_SECONDS = 120;

export default function VideoInterviewTestPage() {
  const navigate = useNavigate();
  const candidate = getStoredCandidate();
  const candidateId = candidate?.id;

  const {
    testId,
    isLoading,
    questions,
    error,
    createOrGetActiveTest,
    uploadVideo,
    submitTest,
  } = useTestFlow();

  const {
    phase,
    currentIdx,
    prepLeft,
    elapsed,
    startPrep,
    stop,
  } = useQuestionRecorder(
    questions.length,
    PREP_SECONDS,
    PER_QUESTION_SECONDS,
    handleAllVideosReady
  );

  // dialogs
  const [openStart, setOpenStart] = useState(false);
  const [openStop, setOpenStop] = useState(false);
  const [openExitTest, setOpenExitTest] = useState(false);

  const [loadingStart, setLoadingStart] = useState(false);
  const [globalLoading, setGlobalLoading] = useState(false);
  const [skipAutoNavigation, setSkipAutoNavigation] = useState(false);
  const [instructionsPanel, setInstructionsPanel] = useState(false);

  const isLast = currentIdx === questions.length - 1;
  const totalMinutes = Math.ceil((questions.length * PER_QUESTION_SECONDS) / 60);

  const mirror = useMediaStore((s) => s.mirror);
  const cameraId = useMediaStore((s) => s.cameraId);
  const micId = useMediaStore((s) => s.micId);
  const videoEnabled = useMediaStore((s) => s.videoEnabled);
  const audioEnabled = useMediaStore((s) => s.audioEnabled);
  const openStream = useMediaStore((s) => s.openStream);
  const powerOff = useMediaStore((s) => s.powerOff);
  const setCamera = useMediaStore((s) => s.setCamera);
  const setMic = useMediaStore((s) => s.setMic);

  const { data, refetch } = useMediaDevicesQuery();

  const [permissionDenied, setPermissionDenied] = useState(false);
  const [checkingPermission, setCheckingPermission] = useState(true);

  if (!candidateId) {
    toast.error("ID do candidato não encontrado.");
    return null;
  }

  useEffect(() => {
    const flag = localStorage.getItem("entrevista_video_bloqueada");

    if (!skipAutoNavigation && flag === "true" && phase === "idle") {
      powerOff();
      navigate({
        to: "/selection-process/$candidateId",
        params: { candidateId },
      });
    }
  }, [phase]);

  useEffect(() => {
    if (phase !== "idle") {
      const handler = (e: BeforeUnloadEvent) => {
        e.preventDefault();
        e.returnValue = "";
      };

      window.addEventListener("beforeunload", handler);
      return () => window.removeEventListener("beforeunload", handler);
    }
  }, [phase]);

  useEffect(() => {
    if (phase !== "idle") {
      const handleBack = (e: PopStateEvent) => {
        e.preventDefault();
        setOpenExitTest(true);
        window.history.pushState(null, "", window.location.pathname);
      };

      window.history.pushState(null, "", window.location.pathname);
      window.addEventListener("popstate", handleBack);

      return () => window.removeEventListener("popstate", handleBack);
    }
  }, [phase]);

  useEffect(() => {
    (async () => {
      try {
        setCheckingPermission(true);
        await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        await refetch();
        setPermissionDenied(false);
      } catch {
        setPermissionDenied(true);
      } finally {
        setCheckingPermission(false);
      }
    })();
  }, []);

  useEffect(() => {
    if (data) {
      if (!cameraId && data.cameras?.length) setCamera(data.cameras[0].deviceId);
      if (!micId && data.mics?.length) setMic(data.mics[0].deviceId);
    }
  }, [data]);

  async function handleAllVideosReady(blobs: (Blob | null)[]) {
    setSkipAutoNavigation(true);
    if (!candidateId || !testId) return toast.error("Dados inválidos.");

    try {
      setGlobalLoading(true);
      console.log("🚀 Enviando vídeos gravados:", blobs.length);

      for (let i = 0; i < blobs.length; i++) {
        const blob = blobs[i];
        if (!blob) continue;

        const q = questions[i];
        const file = new File([blob], `resposta_${i + 1}.mp4`, { type: "video/mp4" });

        console.log(`📤 Enviando resposta ${i + 1} (${q.id})...`);
        await uploadVideo(file, q.id, q.questionOrder, "QuestionAnswer", candidateId);
      }

      await submitTest(candidateId);
      toast.success("✅ Teste submetido com sucesso!");
      powerOff();
      navigate({ to: "/selection-process/$candidateId", params: { candidateId } });
    } catch (err) {
      console.error("❌ Erro ao enviar vídeos:", err);
      toast.error("Erro ao enviar vídeos.");
    } finally {
      setGlobalLoading(false);
    }
  }

  async function handleButtonClick() {
    setLoadingStart(true);

    if (!candidateId) {
      toast.error("ID do candidato não encontrado.");
      return null;
    }

    try {
      const media = useMediaStore.getState();
      await media.enableVideo();
      await media.enableAudio();

      const ok = await media.openStream(cameraId, micId);
      if (!ok) throw new Error("Erro ao abrir câmera/microfone");

      const createdTestId = await createOrGetActiveTest(
        candidateId,
        TestType.Interview
      );

      if (!createdTestId) return;

      setOpenStart(true);
    } catch (err) {
      console.error(err);
      toast.error("Erro ao preparar gravação.");
    } finally {
      setLoadingStart(false);
    }
  }

  const handleConfirmStart = async () => {
    setOpenStart(false);
    setLoadingStart(true);
    setInstructionsPanel(true);

    localStorage.setItem("entrevista_video_bloqueada", "true");

    try {
      const ok = await openStream(cameraId, micId);
      if (!ok) throw new Error("Falha ao abrir câmera/microfone");

      await new Promise((r) => setTimeout(r, 200));

      startPrep();
    } catch (err) {
      toast.error("Erro ao iniciar gravação.");
    } finally {
      setLoadingStart(false);
    }
  };

  const handleConfirmStop = () => {
    setOpenStop(false);
    stop();
  };

  function onBack() {
    if (phase !== "idle") {
      setOpenExitTest(true);
      return;
    }
    window.history.back();
  }

  return (
    <div className="min-h-screen bg-[#F9FAFB] relative">
      <header className="sticky top-0 z-10 w-full h-16 bg-[#0385D1] text-white md:bg-white md:text-gray-900 md:border-b-2 md:border-gray-200">
        <div className="relative flex h-full items-center px-4 md:px-6">
          {phase === "idle" && (
            <button
              onClick={onBack}
              disabled={globalLoading || loadingStart}
              className={`inline-flex items-center gap-2 ${globalLoading || loadingStart ? "opacity-50 cursor-not-allowed" : ""
                } text-white md:text-gray-600 md:hover:text-gray-800`}
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

      <main className="mx-auto w-full lg:max-w-[1000px] px-6 py-8">
        {!instructionsPanel && (
          <InstructionsPanel />
        )}
        
        {phase !== "idle" && questions.length > 0 && (
          <>
            <QuestionNavigator
              questions={questions}
              currentIdx={currentIdx}
            />
            <p className="mb-4 text-center text-lg font-semibold text-gray-700">
              {questions[currentIdx]?.questionText}
            </p>
          </>
        )}

        <QuestionVideo
          phase={phase}
          cameraId={cameraId ?? null}
          mirror={mirror}
          videoEnabled={videoEnabled}
          audioEnabled={audioEnabled}
          prepLeft={prepLeft}
          elapsed={elapsed}
          limitSeconds={PER_QUESTION_SECONDS}
        />

        <div className="mt-6 flex items-center justify-center">
          <TestControls
            phase={phase}
            isLast={isLast}
            onStart={handleButtonClick}
            onStop={() => setOpenStop(true)}
            loading={loadingStart || isLoading}
            disabled={checkingPermission || permissionDenied}
          />
        </div>

        <ConfirmStartDialog
          open={openStart}
          onOpenChange={setOpenStart}
          minutes={totalMinutes}
          onConfirm={handleConfirmStart}
        />

        <ConfirmStopDialog
          open={openStop}
          onOpenChange={setOpenStop}
          onConfirm={handleConfirmStop}
          description={
            isLast
              ? "Você está prestes a finalizar a entrevista. Deseja encerrar agora?"
              : "Avançar agora encerrará e enviará a resposta desta pergunta. Deseja continuar?"
          }
        />

        <ConfirmExitTestDialog
          open={openExitTest}
          onOpenChange={setOpenExitTest}
          onConfirm={() => {
            powerOff();
            localStorage.removeItem("entrevista_video_bloqueada");
            navigate({
              to: "/selection-process/$candidateId",
              params: { candidateId },
            });
          }}
        />

        {error && <p className="mt-3 text-sm text-red-600">{error}</p>}
      </main>

      {(globalLoading || loadingStart) && (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black/70 text-white backdrop-blur-sm">
          <Loader2 className="animate-spin w-16 h-16 mb-6" />
          <p className="text-lg font-semibold">
            {globalLoading ? "Enviando suas respostas..." : "Preparando gravação..."}
          </p>
          <p className="text-sm text-gray-300 mt-2">
            {globalLoading
              ? "Por favor, não feche nem recarregue a página."
              : "Aguarde enquanto configuramos sua câmera e microfone."}
          </p>
        </div>
      )}
    </div>
  );
}
