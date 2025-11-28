// src/features/portuguese-test/PortugueseReadingStage.tsx
import { useEffect, useMemo, useState } from "react";
import { InstructionList } from "./components/InstructionList";
import { ReadingBlock } from "./components/ReadingBlock";
import { Button } from "@/components/ui/button";
import { Circle, Square, Loader2 } from "lucide-react";
import Webcam from "react-webcam";
import { TimerProgress } from "@/components/TimerProgress";
import { useRecorder } from "@/hooks/useRecorder";
import { useMediaStore } from "@/store/useMediaStore";
import { ConfirmStartDialog } from "@/components/media/ConfirmStartDialog";
import { ConfirmStopDialog } from "@/components/media/ConfirmStopDialog";
import { toast } from "sonner";
import { useUploadVideoResponse } from "@/hooks/useTestActions";
import { useStartTest } from "@/hooks/useTestActions";
import { VideoResponseType } from "@/api/apiPaths";
import { useMediaDevicesQuery } from "@/hooks/useMediaDevicesQuery";

const READING_LIMIT_SECONDS = 60 * 2;

type Props = {
  testId: string;
  candidateId: string;
  readingTextId?: string;
  textToRead?: string;
  onFinished: () => void;
};

export function PortugueseReadingStage({
  testId,
  candidateId,
  textToRead,
  onFinished,
}: Props) {

  const mirror = useMediaStore((s) => s.mirror);
  const cameraId = useMediaStore((s) => s.cameraId);
  const micId = useMediaStore((s) => s.micId);
  const videoEnabled = useMediaStore((s) => s.videoEnabled);
  const audioEnabled = useMediaStore((s) => s.audioEnabled);
  const openStream = useMediaStore((s) => s.openStream);
  const setCamera = useMediaStore((s) => s.setCamera);
  const setMic = useMediaStore((s) => s.setMic);
  const makeRecordableStream = useMediaStore((s) => s.makeRecordableStream);

  const { data, refetch } = useMediaDevicesQuery();

  const uploadMutation = useUploadVideoResponse();
  const startTestMutation = useStartTest();

  const {
    start,
    stop,
    recording,
    elapsed,
    videoBlob,
    error,
    setSourceStream,
  } = useRecorder(READING_LIMIT_SECONDS);

  const [permissionDenied, setPermissionDenied] = useState(false);
  const [checkingPermission, setCheckingPermission] = useState(true);
  const [openStart, setOpenStart] = useState(false);
  const [openStop, setOpenStop] = useState(false);

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
    if (!data) return;
    if (!cameraId && data.cameras?.length) setCamera(data.cameras[0].deviceId);
    if (!micId && data.mics?.length) setMic(data.mics[0].deviceId);
  }, [data, cameraId, micId, setCamera, setMic]);

  // Upload automático quando o vídeo é gerado
  useEffect(() => {
    if (!videoBlob || uploadMutation.isPending) return;

    uploadMutation.mutate(
      {
        testId,
        candidateId,
        videoBlob,
        fileName: `leitura_${candidateId}_${testId}.webm`,
        responseType: VideoResponseType.Reading,
        questionNumber: 1,
      },
      {
        onSuccess: () => {
          onFinished();
        },
      }
    );
  }, [videoBlob, testId, candidateId, uploadMutation, onFinished]);

  async function handleStart() {
    if (checkingPermission) {
      toast.error("Aguarde a verificação das permissões.");
      return;
    }
    if (permissionDenied) {
      toast.error("Ative câmera e microfone na prévia antes de iniciar.");
      return;
    }

    startTestMutation.mutate(
      { testId, candidateId },
      {
        onSuccess: async () => {
          try {
            await openStream(cameraId, micId);
            const recordable = await makeRecordableStream();
            setSourceStream(recordable);
            start();
          } catch (mediaError: any) {
            toast.error(`Erro ao acessar câmera/microfone: ${mediaError.message}`);
          }
        },
        onError: (startError) => {
          console.error("Erro ao iniciar teste:", startError);
        },
      }
    );
  }

  const webcam = useMemo(() => {
    if (!recording) return null;

    return (
      <Webcam
        videoConstraints={
          videoEnabled && cameraId
            ? { deviceId: { exact: cameraId }, width: 1152, height: 648 }
            : { width: 1152, height: 648 }
        }
        audio={!!audioEnabled}
        muted
        mirrored={!!mirror}
        className="aspect-video w-full bg-gray-200 object-cover"
      />
    );
  }, [recording, videoEnabled, cameraId, audioEnabled, mirror]);

  if (checkingPermission) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-600">
        Verificando acesso à câmera e microfone...
      </div>
    );
  }

  if (permissionDenied) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-center px-6">
        <h1 className="text-xl font-semibold text-red-600 mb-2">Permissão necessária</h1>
        <p className="text-gray-600 max-w-md mb-6">
          Não foi possível acessar sua câmera ou microfone. É necessário conceder permissão para continuar a
          entrevista.
        </p>
        <ol className="text-sm text-gray-500 mb-6 text-left list-decimal list-inside max-w-sm">
          <li>Feche esta página.</li>
          <li>Reabra e clique em <strong>“Permitir”</strong> quando o navegador solicitar.</li>
          <li>Se já negou, vá em <strong>Configurações do site → Permissões</strong> e ative câmera e microfone.</li>
        </ol>
        <button
          onClick={() => window.location.reload()}
          className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
        >
          Tentar novamente
        </button>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-8 md:gap-10 lg:grid-cols-2 lg:items-start">
      {/* Coluna esquerda: instruções ou texto */}
      <div className="space-y-6">
        {!recording ? (
          <InstructionList />
        ) : (
          <ReadingBlock text={textToRead ?? "Carregando texto..."} />
        )}
      </div>

      {/* Coluna direita: preview webcam e controles */}
      <div>
        <div className="relative overflow-hidden mt-9 rounded-lg border border-gray-300 bg-white shadow-sm">
          {(startTestMutation.isPending || uploadMutation.isPending) && (
            <div className="absolute inset-0 z-10 grid place-items-center bg-black/50 text-white">
              <Loader2 className="h-6 w-6 animate-spin" />
              {startTestMutation.isPending ? "Iniciando teste..." : "Enviando leitura..."}
            </div>
          )}

          {!recording ? (
            <div className="aspect-video w-full bg-gray-100 flex items-center justify-center text-gray-400">
              Preview da câmera aparecerá aqui
            </div>
          ) : (
            webcam
          )}
        </div>

        {recording && (
          <TimerProgress elapsed={elapsed} limitSeconds={READING_LIMIT_SECONDS} className="mt-4" />
        )}

        <div className="mt-6 flex items-center justify-center">
          {recording ? (
            <Button
              onClick={() => setOpenStop(true)}
              disabled={uploadMutation.isPending}
              variant="destructive"
              size="lg"
              className="rounded-lg"
            >
              <Square className="mr-2 h-5 w-5 fill-current" />
              Encerrar Leitura
            </Button>
          ) : (
            <Button
              onClick={() => setOpenStart(true)}
              disabled={
                startTestMutation.isPending ||
                uploadMutation.isPending ||
                checkingPermission ||
                permissionDenied
              }
              size="lg"
              className="rounded-lg bg-[#0385d1] text-white hover:bg-[#0271b2]"
            >
              {startTestMutation.isPending ? (
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              ) : (
                <Circle className="mr-2 h-5 w-5 fill-current" />
              )}
              Iniciar Gravação
            </Button>
          )}
        </div>

        <ConfirmStartDialog
          open={openStart}
          onOpenChange={setOpenStart}
          minutes={Math.ceil(READING_LIMIT_SECONDS / 60)}
          onConfirm={handleStart}
        />

        <ConfirmStopDialog
          open={openStop}
          onOpenChange={setOpenStop}
          onConfirm={stop}
          description="Encerrar agora finalizará a etapa de leitura e enviará o vídeo. Deseja continuar?"
        />

        {error && (
          <p className="mt-4 text-center text-sm text-red-600">{error}</p>
        )}

        {startTestMutation.isError && (
          <p className="mt-4 text-center text-sm text-red-600">
            Erro ao iniciar: {startTestMutation.error?.message}
          </p>
        )}

        {uploadMutation.isError && (
          <p className="mt-4 text-center text-sm text-red-600">
            Erro no envio: {uploadMutation.error?.message}
          </p>
        )}
      </div>
    </div>
  );
}