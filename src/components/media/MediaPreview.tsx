import { Button } from "@/components/ui/button";
import {
  Card, CardContent, CardDescription, CardHeader, CardTitle,
} from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Info, AlertCircle } from "lucide-react";
import VideoPreview from "./VideoPreview";
import AudioMeter from "./AudioMeter";
import DeviceSelect from "./DeviceSelect";
import QuickRecord from "./QuickRecord";
import MediaToggles from "./MediaToggles";
import { useMediaStore } from "@/store/useMediaStore";
import { useMemo } from "react";

export type MediaPreviewResult = { stream: MediaStream; cameraId?: string; micId?: string };

interface Props {
  title?: string;
  subtitle?: string;
  ctaLabel?: string;
  onContinue: (r: MediaPreviewResult) => void;
  enableQuickRecord?: boolean;
  quickRecordSeconds?: number;
}

export default function MediaPreview({
  title = "Teste seu vídeo e áudio",
  subtitle = "Verifique se câmera e microfone estão funcionando antes de iniciar",
  ctaLabel = "Continuar",
  onContinue,
  enableQuickRecord = true,
  quickRecordSeconds = 5,
}: Props) {
  const stream = useMediaStore((s) => s.stream);
  const mirror = useMediaStore((s) => s.mirror);
  const setMirror = useMediaStore((s) => s.setMirror);
  const cameraId = useMediaStore((s) => s.cameraId);
  const micId = useMediaStore((s) => s.micId);
  const error = useMediaStore((s) => s.error);
  const videoEnabled = useMediaStore((s) => s.videoEnabled);
  const audioEnabled = useMediaStore((s) => s.audioEnabled);

  // --- estado de prontidão (precisa ter as DUAS trilhas ativas)
  const hasVideoTrack = !!stream?.getVideoTracks()?.length;
  const hasAudioTrack = !!stream?.getAudioTracks()?.length;

  const readyVideo = !!cameraId && videoEnabled && hasVideoTrack;
  const readyAudio = !!micId && audioEnabled && hasAudioTrack;

  const canContinue = !!stream && readyVideo && readyAudio && !error;

  const streamForMeter = useMemo(() => {
    if (!audioEnabled || !stream) return null;
    const hasAudio = stream.getAudioTracks().length > 0;
    return hasAudio ? stream : null;
  }, [audioEnabled, stream]);

  return (
    <div className="mx-auto w-full max-w-[1100px] px-4 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">{title}</h1>
        <p className="text-sm text-gray-500">{subtitle}</p>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Pré-visualização</CardTitle>
              <CardDescription>Verifique enquadramento e iluminação</CardDescription>
            </div>
            <MediaToggles />
          </CardHeader>
          <CardContent>
            <VideoPreview stream={stream} mirror={mirror} videoEnabled={videoEnabled} />
            <div className="mt-4 flex items-center gap-3">
              <Switch id="mirror" checked={mirror} onCheckedChange={setMirror} />
              <Label htmlFor="mirror">Espelhar vídeo</Label>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Dispositivos</CardTitle>
            <CardDescription>Selecione a câmera e o microfone</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <DeviceSelect />

            <div className="space-y-2">
              <Label>Nível de áudio</Label>
              <div className="rounded-md border p-3">
                <AudioMeter stream={streamForMeter} />
                <p className="mt-1 text-xs text-gray-500">Fale algo — a barra deve se mover.</p>
              </div>
            </div>

            {enableQuickRecord && (
              // a gravação-teste só habilita quando os dois estão prontos
              <QuickRecord seconds={quickRecordSeconds} />
            )}

            {error && (
              <Alert variant="destructive">
                <AlertTitle>Problema ao acessar câmera/microfone</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {/* checklist de prontidão */}
            {!canContinue && (
              <Alert className="mt-1">
                <AlertCircle className="mr-2 h-4 w-4" />
                <AlertTitle>Para continuar, ative os dois</AlertTitle>
                <AlertDescription className="space-y-1">
                  <div className={readyVideo ? "text-green-700" : "text-gray-700"}>
                    • Câmera {readyVideo ? "ok" : "não habilitada/sem vídeo"}
                  </div>
                  <div className={readyAudio ? "text-green-700" : "text-gray-700"}>
                    • Microfone {readyAudio ? "ok" : "não habilitado/sem áudio"}
                  </div>
                </AlertDescription>
              </Alert>
            )}

            <div className="pt-2">
              <Button
                className="w-full"
                disabled={!canContinue}
                onClick={() => stream && canContinue && onContinue({ stream, cameraId, micId })}
              >
                {ctaLabel}
              </Button>
              {!canContinue && (
                <p className="mt-2 text-xs text-gray-500">
                  Dica: selecione os dispositivos e ative <b>câmera</b> e <b>microfone</b>.
                </p>
              )}
            </div>

            <Alert className="mt-2">
              <Info className="mr-2 h-4 w-4" />
              <AlertTitle>Dicas rápidas</AlertTitle>
              <AlertDescription>
                Feche outros apps que usam a câmera (Meet/Zoom/Teams) e atualize a página. No iOS use Safari; no Android, Chrome.
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
