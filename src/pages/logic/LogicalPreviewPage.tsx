import { useEffect, useState, useRef } from "react";
import { useNavigate } from "@tanstack/react-router";
import MediaPreview from "@/components/media/MediaPreview";
import { useMediaDevicesQuery } from "@/hooks/useMediaDevicesQuery";
import { useMediaStore } from "@/store/useMediaStore";
import { ChevronLeft, Video } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

export default function InterviewPreviewPage() {
  const navigate = useNavigate();
  const { data, refetch } = useMediaDevicesQuery();
  const cameraId = useMediaStore((s) => s.cameraId);
  const micId = useMediaStore((s) => s.micId);
  const setCamera = useMediaStore((s) => s.setCamera);
  const setMic = useMediaStore((s) => s.setMic);

  const [permissionDenied, setPermissionDenied] = useState(false);
  const [checkingPermission, setCheckingPermission] = useState(true);

  const [openTest, setOpenTest] = useState(false);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [isRecording, setIsRecording] = useState(false);

  const videoRef = useRef<HTMLVideoElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunks = useRef<Blob[]>([]);

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
    if (!cameraId && data.cameras[0]) setCamera(data.cameras[0].deviceId);
    if (!micId && data.mics[0]) setMic(data.mics[0].deviceId);
  }, [data, cameraId, micId, setCamera, setMic]);

  const startRecording = async () => {
    try {
      setIsRecording(true);
      setVideoUrl(null);

      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }

      const recorder = new MediaRecorder(stream);
      mediaRecorderRef.current = recorder;
      chunks.current = [];

      recorder.ondataavailable = (e) => chunks.current.push(e.data);
      recorder.onstop = () => {
        const blob = new Blob(chunks.current, { type: "video/webm" });
        const url = URL.createObjectURL(blob);
        setVideoUrl(url);
        setIsRecording(false);
        stream.getTracks().forEach((t) => t.stop());
      };

      recorder.start();
      console.log("🎥 Iniciando gravação de teste (5s)");

      setTimeout(() => {
        console.log("⏹️ Parando gravação de teste");
        recorder.stop();
      }, 5500);
    } catch (err) {
      console.error("Erro ao gravar vídeo de teste:", err);
      setIsRecording(false);
    }
  };

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
        <h1 className="text-xl font-semibold text-red-600 mb-2">
          Permissão necessária
        </h1>
        <p className="text-gray-600 max-w-md mb-6">
          Não foi possível acessar sua câmera ou microfone.
          É necessário conceder permissão para continuar a entrevista.
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

  const onBack = () => {
    window.history.back();
  };

  return (
    <div className="min-h-screen bg-[#F9FAFB]">
      <header className="sticky top-0 z-10 w-full h-16 bg-[#0385D1] text-white md:bg-white md:text-gray-900 md:border-b-2 md:border-gray-200">
        <div className="relative flex h-full items-center px-4 md:px-6">
          <button
            onClick={onBack}
            className="inline-flex items-center gap-2 text-white md:text-gray-600 md:hover:text-gray-800"
          >
            <ChevronLeft className="size-5" />
            <span className="hidden md:inline text-sm">Voltar ao menu</span>
          </button>
          <h1 className="pointer-events-none absolute left-1/2 -translate-x-1/2 text-[18px] font-semibold text-white md:text-[20px] md:text-gray-900">
            Teste de Matemática — Prévia
          </h1>
        </div>
      </header>

      <main className="py-6 flex flex-col items-center">
        <MediaPreview
          ctaLabel="Ir para a prova"
          extraButton={
            <Button
              onClick={() => setOpenTest(true)}
              variant="outline"
              className="flex items-center gap-2"
            >
              <Video className="size-4" />
              Gravar Teste (5s)
            </Button>
          }
          onContinue={() => navigate({ to: "/logico" })}
        />
      </main>

      <Dialog open={openTest} onOpenChange={setOpenTest}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Teste de vídeo e áudio</DialogTitle>
          </DialogHeader>

          {!videoUrl && (
            <div className="flex flex-col items-center gap-4">
              <video
                ref={videoRef}
                className="rounded-lg w-full bg-black"
                autoPlay
                muted
              ></video>
              <Button onClick={startRecording} disabled={isRecording}>
                {isRecording ? "Gravando..." : "Iniciar gravação (5s)"}
              </Button>
            </div>
          )}

          {videoUrl && (
            <div className="flex flex-col items-center gap-4">
              <video src={videoUrl} className="rounded-lg w-full" controls></video>
              <div className="flex gap-3">
                <Button onClick={startRecording}>Regravar</Button>
                <Button onClick={() => setOpenTest(false)}>Fechar</Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
