// src/features/portuguese-test/PortugueseTestRunPage.tsx
import { useEffect, useState } from "react";
import { useMediaStore } from "@/store/useMediaStore";
import { useNavigate, useParams } from "@tanstack/react-router";
import { useMediaDevicesQuery } from "@/hooks/useMediaDevicesQuery";
import { getStoredCandidate } from "@/api/auth";
import { TestType, useTestFlow } from "@/hooks/useTestFlow";
import { useQuestionRecorder } from "@/hooks/useQuestionRecorder";
import { toast } from "sonner";
import { ChevronLeft, Loader2 } from "lucide-react";
import { QuestionNavigator } from "@/components/QuestionNavigator";
import { TestControls } from "@/components/TestControls";
import { QuestionVideo } from "@/components/QuestionVideo";
import { ConfirmStartDialog } from "@/components/media/ConfirmStartDialog";
import { ConfirmStopDialog } from "@/components/media/ConfirmStopDialog";
import { useTestFlowPortuguese } from "@/hooks/useTestFlowPortuguese";
import { ConfirmExitTestDialog } from "@/components/ConfirmExitTestDialog";


const PREP_SECONDS = 5;
const PER_QUESTION_SECONDS = 60;

export default function PortugueseTestRunPage() {
  const navigate = useNavigate();
  const candidate = getStoredCandidate();
  const candidateId = candidate?.id;

  if (!candidateId) {
    toast.error("ID do candidato não encontrado.");
    return null;
  }

  const { testId, questions, isLoading, error, createOrGetActivePortugueseTest, uploadVideo, submitTest } = useTestFlowPortuguese();

  const {
    phase,
    currentIdx,
    prepLeft,
    elapsed,
    startPrep,
    stop,
  } = useQuestionRecorder(questions.length, PREP_SECONDS, PER_QUESTION_SECONDS, handleAllVideosReady);

  const [openStart, setOpenStart] = useState(false);
  const [openStop, setOpenStop] = useState(false);
  const [loadingStart, setLoadingStart] = useState(false);
  const [globalLoading, setGlobalLoading] = useState(false);

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
  const [openExitTest, setOpenExitTest] = useState(false);
  const [skipAutoNavigation, setSkipAutoNavigation] = useState(false);

  useEffect(() => {
    const bloqueada = localStorage.getItem("prova_portugues_bloqueada");

    if (!skipAutoNavigation && bloqueada === "true" && phase === "idle") {
      powerOff();
      navigate({ to: "/selection-process/$candidateId", params: { candidateId } });
    }
  }, [phase]);

  async function handleAllVideosReady(blobs: (Blob | null)[]) {
    setSkipAutoNavigation(true);

    if (!candidateId || !testId) return toast.error("Dados inválidos.");

    try {
      setGlobalLoading(true);

      console.log("🚀 Enviando vídeos gravados:", blobs.length);

      const normalVideos: Array<{ blob: Blob; q: any; index: number }> = [];
      let readingVideo: { blob: Blob; q: any; index: number } | null = null;

      for (let i = 0; i < blobs.length; i++) {
        const blob = blobs[i];
        if (!blob) continue;

        const q = questions[i];
        if (!q) continue;

        console.log(
          `🔎 Analisando vídeo ${i} | questionOrder=${q.questionOrder} | isReading=${q.isReading}`
        );

        if (q.isReading) {
          console.log(`📘 → VÍDEO ${i} identificado como LEITURA`);
          readingVideo = { blob, q, index: i };
        } else {
          console.log(`📝 → VÍDEO ${i} identificado como NORMAL`);
          normalVideos.push({ blob, q, index: i });
        }
      }

      console.log("NormalVideos:", normalVideos.map(v => v.index));
      console.log("ReadingVideo:", readingVideo?.index);

      for (const { blob, q, index } of normalVideos) {
        const file = new File([blob], `resposta_${index + 1}.mp4`, { type: "video/mp4" });

        console.log(
          `📤 Enviando resposta NORMAL (idx=${index}) | snapshotId=${q.id} | questionOrder=${q.questionOrder}`
        );

        await uploadVideo(
          file,
          q.id,
          q.questionOrder,
          "QuestionAnswer",
          candidateId
        );
      }

      if (readingVideo) {
        const { blob, q, index } = readingVideo;

        const file = new File([blob], "resposta_leitura.mp4", { type: "video/mp4" });

        console.log(
          `📤 Enviando resposta LEITURA (idx=${index}) | questionNumber=4 | SEM questionSnapshotId`
        );

        await uploadVideo(
          file,
          undefined,
          4,
          "Reading",
          candidateId
        );
      } else {
        console.warn("⚠️ Nenhum vídeo marcado como leitura foi encontrado.");
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

  async function handleButtonClick() {
    setLoadingStart(true);
    try {
      if (!candidateId) {
        toast.error("ID do candidato não encontrado.");
        setLoadingStart(false);
        return;
      }

      const media = useMediaStore.getState();
      await media.enableVideo();
      await media.enableAudio();

      const ok = await media.openStream(cameraId, micId);
      if (!ok) {
        toast.error("Falha ao abrir câmera/microfone.");
        setLoadingStart(false);
        return;
      }

      const createdTestId = await createOrGetActivePortugueseTest(candidateId);

      console.log("🚀 Teste de Português criado/recuperado:", createdTestId);
      if (!createdTestId) {
        setLoadingStart(false);
        return;
      }

      if (questions.length > 0) {
        setOpenStart(true);
      } else {
        setTimeout(() => setOpenStart(true), 500);
      }
    } catch (err) {
      console.error("Erro ao preparar para iniciar:", err);
      toast.error("Erro ao preparar para iniciar a prova.");
    } finally {
      setLoadingStart(false);
    }
  }

  const handleConfirmStart = async () => {
    setOpenStart(false);
    setLoadingStart(true);

    localStorage.setItem("prova_portugues_bloqueada", "true");

    try {
      const streamOk = await openStream(cameraId, micId);
      if (!streamOk) throw new Error("Falha ao abrir câmera/microfone");

      await new Promise((r) => setTimeout(r, 200));
      startPrep();
    } catch (e) {
      console.error(e);
      toast.error("Erro ao iniciar gravação. Verifique permissões de câmera/microfone.");
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
    if (phase !== "idle") {
      const handler = (e: BeforeUnloadEvent) => {
        e.preventDefault();
        e.returnValue = "";
      };

      window.addEventListener("beforeunload", handler);

      return () => window.removeEventListener("beforeunload", handler);
    }
  }, [phase]);

  return (
    <div className="min-h-screen bg-[#F9FAFB] relative">
      <header className="sticky top-0 z-10 w-full h-16 bg-[#0385D1] text-white md:bg-white md:text-gray-900 md:border-b-2 md:border-gray-200">
        <div className="relative flex h-full items-center px-4 md:px-6">
          {phase === "idle" && (
            <button
              onClick={onBack}
              disabled={globalLoading || loadingStart}
              className={`inline-flex items-center gap-2 
    ${globalLoading || loadingStart ? "opacity-50 cursor  -not-allowed" : ""}
    text-white md:text-gray-600 md:hover:text-gray-800
    outline-none focus:outline-none focus:ring-0 focus:ring-offset-0
  `}
            >
              <ChevronLeft className="size-5" />
              <span className="hidden md:inline text-sm">Voltar ao menu</span>
            </button>
          )}
          <h1 className="pointer-events-none absolute left-1/2 -translate-x-1/2 text-[18px] font-semibold text-white md:text-[20px] md:text-gray-900">
            Prova de Português
          </h1>
        </div>
      </header>

      <main className="mx-auto w-full 2xl:max-w-[1100px] lg:max-w-[1000px] px-6 py-8">
        {phase !== "idle" && questions.length > 0 && (
          <>
            <QuestionNavigator questions={questions} currentIdx={currentIdx} />
            {questions[currentIdx]?.isReading ? (
              <>
                <h2 className="mb-2 text-center text-xl font-bold text-gray-800">
                  {questions[currentIdx].questionText}
                </h2>

                <p className="text-center max-w-[900px] mx-auto text-gray-700 leading-relaxed text-lg whitespace-pre-line">
                  {questions[currentIdx].readingContent}
                </p>
              </>
            ) : (
              <p className="mb-4 text-center text-lg font-semibold text-gray-700">
                {questions[currentIdx]?.questionText}
              </p>
            )}
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

        <ConfirmStartDialog open={openStart} onOpenChange={setOpenStart} minutes={totalMinutes} onConfirm={handleConfirmStart} />
        <ConfirmStopDialog
          open={openStop}
          onOpenChange={setOpenStop}
          onConfirm={handleConfirmStop}
          description={
            isLast
              ? "Você está prestes a finalizar o teste. Deseja encerrar agora?"
              : "Avançar agora encerrará e enviará a resposta desta pergunta. Deseja continuar?"
          }
        />

        <ConfirmExitTestDialog
          open={openExitTest}
          onOpenChange={setOpenExitTest}
          onConfirm={() => {
            powerOff();
            navigate({ to: "/selection-process/$candidateId", params: { candidateId } });
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