// src/components/media/MediaPreview.tsx

import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
// Importações adicionadas
import { Info, AlertCircle, Video, Mic, PlayCircle } from "lucide-react";
import { Dialog, DialogContent, DialogHeader } from "@/components/ui/dialog";
// Fim das importações adicionadas
import VideoPreview from "./VideoPreview";
import AudioMeter from "./AudioMeter";
import { useMediaStore } from "@/store/useMediaStore";
import { useMediaDevicesQuery } from "@/hooks/useMediaDevicesQuery";
import { useMemo, useEffect } from "react";

// Tipagem das props permanece a mesma
export type MediaPreviewResult = { stream: MediaStream; cameraId?: string; micId?: string };

interface Props {
  title?: string;
  subtitle?: string;
  ctaLabel?: string;
  onContinue: (r: MediaPreviewResult) => void;
}

export default function MediaPreview({
  title = "Teste seu vídeo e áudio",
  subtitle = "Verifique se câmera e microfone estão funcionando antes de iniciar",
  ctaLabel = "Continuar",
  onContinue,
}: Props) {
  // Hooks de estado e dados
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
  // const powerOff = useMediaStore((s) => s.powerOff); // Não precisamos mais do powerOff aqui

  // Hooks adicionados para a gravação de teste
  const testing = useMediaStore((s) => s.testing);
  const recordingUrl = useMediaStore((s) => s.recordingUrl);
  const isQuickPreviewOpen = useMediaStore((s) => s.isQuickPreviewOpen);
  const setQuickPreviewOpen = useMediaStore((s) => s.setQuickPreviewOpen);
  const startQuickRecord = useMediaStore((s) => s.startQuickRecord);
  // Fim dos hooks adicionados

  const { data: devicesData } = useMediaDevicesQuery();

  // --- CORREÇÃO PRINCIPAL ---
  // Este useEffect agora APENAS abre ou atualiza o stream.
  // A função de limpeza que chamava powerOff() foi REMOVIDA.
  useEffect(() => {
    const shouldHaveVideo = !!cameraId;
    const shouldHaveAudio = !!micId;

    useMediaStore.setState({ videoEnabled: shouldHaveVideo, audioEnabled: shouldHaveAudio });

    openStream(cameraId, micId);

    // A função de limpeza foi removida daqui.
    // O stream será desligado pelo powerOff() no logout ou no final do teste.
    
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cameraId, micId, openStream]);


  // Determina se está pronto para continuar
  const hasVideoTrack = useMemo(() => stream?.getVideoTracks().some(t => t.readyState === 'live') ?? false, [stream]);
  const hasAudioTrack = useMemo(() => stream?.getAudioTracks().some(t => t.readyState === 'live') ?? false, [stream]);

  const readyVideo = videoEnabled && hasVideoTrack;
  const readyAudio = audioEnabled && hasAudioTrack;
  const canContinue = !!stream && readyVideo && readyAudio && !error;

  // Adicionada condição para o botão de teste
  const canTest = canContinue && !testing;

  const streamForMeter = useMemo(() => {
    if (!audioEnabled || !stream || !hasAudioTrack) return null;
    return stream;
  }, [audioEnabled, stream, hasAudioTrack]);

  return (
    <> {/* Adicionado Fragment para o Dialog */}
      <div className="mx-auto w-full max-w-4xl px-4 py-8 flex flex-col items-center">
        {/* Título e Subtítulo */}
        <div className="mb-6 text-center">
          <h1 className="text-2xl font-semibold text-gray-900">{title}</h1>
          <p className="text-sm text-gray-500">{subtitle}</p>
        </div>

        {/* Container do Vídeo */}
        <div className="relative w-full max-w-2xl aspect-video bg-gray-100 rounded-lg overflow-hidden border border-gray-300 shadow-sm mb-4">
          <VideoPreview stream={stream} mirror={mirror} videoEnabled={videoEnabled} />
          {/* Exibição de erro sobre o vídeo */}
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
          {/* Lado Esquerdo: Audio Meter */}
          <div className="w-full sm:w-auto flex-grow sm:flex-grow-0 sm:min-w-[150px]">
            <AudioMeter stream={streamForMeter} />
          </div>

          {/* Lado Direito: Seletores de Dispositivo */}
          <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
            {/* Seletor de Câmera */}
            <Select value={cameraId || ""} onValueChange={setCamera}>
              <SelectTrigger className="w-full sm:w-[200px] bg-white">
                <Video className="h-4 w-4 mr-2 flex-shrink-0" />
                <SelectValue placeholder="Selecionar câmera..." />
              </SelectTrigger>
              <SelectContent>
                {devicesData?.cameras && devicesData.cameras.length > 0 ? (
                  devicesData.cameras.map((cam) => (
                    <SelectItem key={cam.deviceId} value={cam.deviceId}>
                      {cam.label || `Câmera ${cam.deviceId.substring(0, 6)}`}
                    </SelectItem>
                  ))
                ) : (
                  <div className="px-4 py-2 text-sm text-gray-500">Nenhuma câmera encontrada</div>
                )}
              </SelectContent>
            </Select>

            {/* Seletor de Microfone */}
            <Select value={micId || ""} onValueChange={setMic}>
              <SelectTrigger className="w-full sm:w-[200px] bg-white">
                <Mic className="h-4 w-4 mr-2 flex-shrink-0" />
                <SelectValue placeholder="Selecionar microfone..." />
              </SelectTrigger>
              <SelectContent>
                {devicesData?.mics && devicesData.mics.length > 0 ? (
                  devicesData.mics.map((mic) => (
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

        {/* Botão Principal e Dicas */}
        <div className="mt-8 w-full max-w-2xl flex flex-col items-center">
            {/* Checklist de prontidão (simplificado) */}
            {!canContinue && !error && (
              <div className="mb-4 text-xs text-center text-orange-600 flex items-center gap-1.5">
                  <AlertCircle className="h-4 w-4 flex-shrink-0"/>
                  <span>Para continuar, selecione e permita o acesso à <strong>câmera</strong> e ao <strong>microfone</strong>.</span>
              </div>
            )}

          {/* Wrapper para os botões */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full sm:w-auto">
            {/* BOTÃO DE TESTE ADICIONADO */}
            <Button
              variant="outline"
              size="lg"
              className="w-full sm:w-auto sm:px-8 rounded-lg" // Estilo de contorno
              onClick={() => startQuickRecord(5)} // Grava por 5 segundos
              disabled={!canTest} // Desabilitado se não puder ou se já estiver testando
            >
              <PlayCircle className="mr-2 h-4 w-4" />
              {testing ? "Gravando..." : "Gravar Teste (5s)"}
            </Button>

            {/* Botão Continuar */}
            <Button
              size="lg"
              className="w-full sm:w-auto sm:px-10 rounded-lg"
              disabled={!canContinue}
              onClick={() => stream && canContinue && onContinue({ stream, cameraId, micId })}
            >
              {ctaLabel}
            </Button>
          </div>


          {/* Dicas rápidas */}
          <Alert className="mt-6 w-full text-left bg-blue-50 border-blue-200">
            <Info className="h-4 w-4 text-blue-700" />
            <AlertTitle className="text-blue-800">Dicas rápidas</AlertTitle>
            <AlertDescription className="text-blue-700">
              Feche outros aplicativos que usam a câmera (Meet, Zoom, Teams). Se não funcionar,
              atualize a página. Use Safari no iOS ou Chrome no Android/Desktop.
            </AlertDescription>
          </Alert>
        </div>
      </div>

      {/* DIALOG PARA PREVIEW DO TESTE (ADICIONADO) */}
      <Dialog open={!!recordingUrl && isQuickPreviewOpen} onOpenChange={setQuickPreviewOpen}>
        <DialogContent className="sm:max-w-[720px] rounded-2xl p-0 overflow-hidden">
          <DialogHeader />
          {recordingUrl && <video src={recordingUrl} controls autoPlay className="w-full h-full" />}
        </DialogContent>
      </Dialog>
    </>
  );
}