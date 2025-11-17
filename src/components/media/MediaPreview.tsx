import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Info, AlertCircle, Video, Mic } from "lucide-react";
import VideoPreview from "./VideoPreview";
import AudioMeter from "./AudioMeter";
import { useMediaStore } from "@/store/useMediaStore";
import { useMediaDevicesQuery } from "@/hooks/useMediaDevicesQuery";
import { useMemo, useEffect } from "react";

export type MediaPreviewResult = { stream: MediaStream; cameraId?: string; micId?: string };

interface Props {
  title?: string;
  subtitle?: string;
  ctaLabel?: string;
  onContinue: (r: MediaPreviewResult) => void;
  extraButton?: React.ReactNode; // 👈 novo
}

export default function MediaPreview({
  title = "Teste seu vídeo e áudio",
  subtitle = "Verifique se câmera e microfone estão funcionando antes de iniciar",
  ctaLabel = "Continuar",
  onContinue,
  extraButton,
}: Props) {
  const stream = useMediaStore((s) => s.stream);
  const mirror = useMediaStore((s) => s.mirror);
  const cameraId = useMediaStore((s) => s.cameraId);
  const micId = useMediaStore((s) => s.micId);
  const videoEnabled = useMediaStore((s) => s.videoEnabled);
  const audioEnabled = useMediaStore((s) => s.audioEnabled);
  const error = useMediaStore((s) => s.error);
  const setCamera = useMediaStore((s) => s.setCamera);
  const setMic = useMediaStore((s) => s.setMic);
  const openStream = useMediaStore((s) => s.openStream);
  const powerOff = useMediaStore((s) => s.powerOff);
  const { data: devicesData } = useMediaDevicesQuery();

  useEffect(() => {
    const shouldHaveVideo = !!cameraId;
    const shouldHaveAudio = !!micId;
    useMediaStore.setState({ videoEnabled: shouldHaveVideo, audioEnabled: shouldHaveAudio });
    openStream(cameraId, micId);
    return () => powerOff();
  }, [cameraId, micId, openStream]);

  const hasVideoTrack = useMemo(() => stream?.getVideoTracks().some(t => t.readyState === "live") ?? false, [stream]);
  const hasAudioTrack = useMemo(() => stream?.getAudioTracks().some(t => t.readyState === "live") ?? false, [stream]);

  const readyVideo = videoEnabled && hasVideoTrack;
  const readyAudio = audioEnabled && hasAudioTrack;
  const canContinue = !!stream && readyVideo && readyAudio && !error;

  const streamForMeter = useMemo(() => {
    if (!audioEnabled || !stream || !hasAudioTrack) return null;
    return stream;
  }, [audioEnabled, stream, hasAudioTrack]);

  return (
    <div className="mx-auto w-full max-w-4xl px-4 py-8 flex flex-col items-center">
      {/* Título e Subtítulo */}
      <div className="mb-6 text-center">
        <h1 className="text-2xl font-semibold text-gray-900">{title}</h1>
        <p className="text-sm text-gray-500">{subtitle}</p>
      </div>

      {/* Container do Vídeo */}
      <div className="relative w-full max-w-2xl aspect-video bg-gray-100 rounded-lg overflow-hidden border border-gray-300 shadow-sm mb-4">
        <VideoPreview stream={stream} mirror={mirror} videoEnabled={videoEnabled} />
        {error && (
          <div className="absolute bottom-2 left-2 right-2 z-10">
            <Alert variant="destructive" className="bg-red-50/90 backdrop-blur-sm">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Erro</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          </div>
        )}
      </div>

      {/* Barra de Controles */}
      <div className="w-full max-w-2xl flex flex-col sm:flex-row items-center justify-between gap-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
        <div className="w-full sm:w-auto flex-grow sm:flex-grow-0 sm:min-w-[150px]">
          <AudioMeter stream={streamForMeter} />
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
          <Select value={cameraId || ""} onValueChange={setCamera}>
            <SelectTrigger className="w-full sm:w-[200px] bg-white">
              <Video className="h-4 w-4 mr-2 flex-shrink-0" />
              <SelectValue placeholder="Selecionar câmera..." />
            </SelectTrigger>
            <SelectContent>
              {devicesData?.cameras?.length ? (
                devicesData.cameras
                  .filter(cam => cam.deviceId?.trim())
                  .map(cam => (
                    <SelectItem key={cam.deviceId} value={cam.deviceId}>
                      {cam.label || `Câmera ${cam.deviceId.substring(0, 6)}`}
                    </SelectItem>
                  ))
              ) : (
                <div className="px-4 py-2 text-sm text-gray-500">Nenhuma câmera encontrada</div>
              )}
            </SelectContent>
          </Select>

          <Select value={micId || ""} onValueChange={setMic}>
            <SelectTrigger className="w-full sm:w-[200px] bg-white">
              <Mic className="h-4 w-4 mr-2 flex-shrink-0" />
              <SelectValue placeholder="Selecionar microfone..." />
            </SelectTrigger>
            <SelectContent>
              {devicesData?.mics?.length ? (
                devicesData.mics
                  .filter(mic => mic.deviceId?.trim())
                  .map(mic => (
                    <SelectItem key={mic.deviceId} value={mic.deviceId}>
                      {mic.label || `Microfone ${mic.deviceId.substring(0, 6)}`}
                    </SelectItem>
                  ))
              ) : (
                <div className="px-4 py-2 text-sm text-gray-500">Nenhum microfone encontrado</div>
              )}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Botões */}
      <div className="mt-8 w-full max-w-2xl flex flex-col sm:flex-row items-center justify-center gap-3">
        {extraButton && extraButton}
        <Button
          size="lg"
          className="w-full sm:w-auto sm:px-10 rounded-lg bg-[#0385d1] text-white hover:bg-[#0271b2] transition"
          disabled={!canContinue}
          onClick={() => stream && canContinue && onContinue({ stream, cameraId, micId })}
        >
          {ctaLabel}
        </Button>
      </div>

      {/* Dicas */}
      <Alert className="mt-6 w-full text-left bg-blue-50 border-blue-200">
        <Info className="h-4 w-4 text-blue-700" />
        <AlertTitle className="text-blue-800">Dicas rápidas</AlertTitle>
        <AlertDescription className="text-blue-700">
          Feche outros aplicativos que usam a câmera (Meet, Zoom, Teams). Se não funcionar,
          atualize a página. Use Safari no iOS ou Chrome no Android/Desktop.
        </AlertDescription>
      </Alert>
    </div>
  );
}
