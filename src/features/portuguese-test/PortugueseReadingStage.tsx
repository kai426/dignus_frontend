// src/features/portuguese-test/PortugueseReadingStage.tsx
import { useEffect, useMemo, useState } from "react";
import { InstructionList } from "./components/InstructionList";
import { ReadingBlock } from "./components/ReadingBlock";
import { Button } from "@/components/ui/button";
import { Circle, Square, Loader2 } from "lucide-react"; // Import Loader2
import Webcam from "react-webcam";
import { TimerProgress } from "@/components/TimerProgress";
import { useRecorder } from "@/hooks/useRecorder";
import { useMediaStore } from "@/store/useMediaStore";
import { ConfirmStartDialog } from "@/components/media/ConfirmStartDialog";
import { ConfirmStopDialog } from "@/components/media/ConfirmStopDialog";
import { toast } from "sonner";
import { useUploadVideoResponse } from "@/hooks/useMedia"; // Hook V2 de upload
import { useStartTest } from "@/hooks/useTestActions"; // Hook V2 de start
import { VideoResponseType } from "@/api/apiPaths"; // Enum V2

const READING_LIMIT_SECONDS = 60 * 2; // Exemplo: 2 minutos para leitura
const TOTAL_MINUTES = 5; // Tempo total estimado (apenas para info, não funcional)

type Props = {
  testId: string; // ID da instância do teste (V2)
  candidateId: string; // ID do candidato (V2)
  readingTextId?: string; // ID do texto de leitura (V2)
  textToRead?: string; // Conteúdo do texto
  onFinished: () => void; // Callback para ir para próxima etapa
};

export function PortugueseReadingStage({
    testId,
    candidateId,
    readingTextId, // Pode não ser necessário para o upload, mas bom ter
    textToRead,
    onFinished
}: Props) {
  // Estados do MediaStore
  const mirror = useMediaStore((s) => s.mirror);
  const cameraId = useMediaStore((s) => s.cameraId);
  const micId = useMediaStore((s) => s.micId);
  const videoEnabled = useMediaStore((s) => s.videoEnabled);
  const audioEnabled = useMediaStore((s) => s.audioEnabled);
  const openStream = useMediaStore((s) => s.openStream);
  const makeRecordableStream = useMediaStore((s) => s.makeRecordableStream);

  // Mutações V2
  const uploadMutation = useUploadVideoResponse();
  const startTestMutation = useStartTest();

  // Hook de gravação
  const { start, stop, recording, elapsed, videoBlob, error, setSourceStream } =
    useRecorder(READING_LIMIT_SECONDS);

  // Estados locais da UI
  const [openStart, setOpenStart] = useState(false);
  const [openStop, setOpenStop] = useState(false);

  // --- Lógica para Iniciar ---
  async function handleStart() {
    if (!videoEnabled || !audioEnabled) {
      toast.error("Ative câmera e microfone na prévia antes de iniciar.");
      return;
    }

    // Chama a mutação para iniciar o teste no backend ANTES de gravar
    startTestMutation.mutate({ testId, candidateId }, {
      onSuccess: async () => {
        // Só começa a gravação local se o backend confirmar o início
        try {
            await openStream(cameraId, micId);
            const recordable = await makeRecordableStream();
            setSourceStream(recordable);
            start(); // Inicia a gravação local
        } catch (mediaError: any) {
             toast.error(`Erro ao acessar câmera/microfone: ${mediaError.message}`);
             // Opcional: Reverter o status do teste no backend se falhar aqui?
        }
      },
      onError: (startError) => {
        // Erro já tratado no hook useStartTest com toast
        console.error("Falha ao marcar teste como iniciado no backend", startError);
      }
    });
  }

  // --- Lógica para Finalizar e Enviar ---
  // Roda quando a gravação para (pelo usuário ou limite de tempo) e videoBlob fica disponível
  useEffect(() => {
    if (!videoBlob || uploadMutation.isPending) return; // Não envia se não tem blob ou já está enviando

    console.log(`Blob de leitura gerado (${(videoBlob.size / 1024 / 1024).toFixed(2)} MB), enviando...`);

    // Dispara a mutação de upload V2
    uploadMutation.mutate(
      {
        testId: testId,
        candidateId: candidateId,
        videoBlob: videoBlob,
        fileName: `leitura_${candidateId}_${testId}.webm`, // Nome mais descritivo
        responseType: VideoResponseType.Reading, // Tipo V2: Leitura
        questionNumber: 0, // Usar 0 ou 1 para leitura, consistência é chave
        // questionSnapshotId: undefined, // Leitura não tem snapshot de questão, mas pode ter do texto
        // O backend pode associar pelo testId e responseType = Reading
      },
      {
        onSuccess: () => {
          // Só avança para a próxima etapa (interpretação) APÓS upload bem-sucedido
          onFinished();
        },
        // onError já mostra toast no hook useUploadVideoResponse
      }
    );
  }, [videoBlob, testId, candidateId, uploadMutation, onFinished]); // Dependências

  // Renderiza a Webcam (memoizado para performance)
  const webcam = useMemo(() => {
    if (!recording) return null;
    return (
      <Webcam
        videoConstraints={
          videoEnabled && cameraId
            ? { deviceId: { exact: cameraId }, width: 1152, height: 648 } // Ajuste resolução se necessário
            : { width: 1152, height: 648 }
        }
        audio={!!audioEnabled} // Controla se o áudio é capturado
        muted // Muta o preview local para evitar microfonia
        mirrored={!!mirror}
        className="aspect-video w-full bg-gray-200 object-cover" // Fundo placeholder
      />
    );
  }, [recording, videoEnabled, cameraId, audioEnabled, mirror]);

  const isBusy = startTestMutation.isPending || uploadMutation.isPending || recording;

  // --- Renderização do Componente ---
  return (
    <div className="grid grid-cols-1 gap-8 md:gap-10 lg:grid-cols-2 lg:items-start">
      {/* Coluna Esquerda: Instruções ou Texto */}
      <div className="space-y-6">
        {!recording ? <InstructionList /> : <ReadingBlock text={textToRead ?? "Carregando texto..."} />}
      </div>

      {/* Coluna Direita: Vídeo e Controles */}
      <div>
        {/* Preview da Webcam */}
        <div className="relative overflow-hidden rounded-lg border border-gray-300 bg-white shadow-sm">
           {/* Overlay de Loading ao iniciar teste */}
           {startTestMutation.isPending && (
             <div className="absolute inset-0 z-10 grid place-items-center bg-black/50 text-white">
                <Loader2 className="h-6 w-6 animate-spin" /> Iniciando teste...
             </div>
           )}
           {/* Overlay de Loading durante upload */}
           {uploadMutation.isPending && (
             <div className="absolute inset-0 z-10 grid place-items-center bg-black/50 text-white">
                <Loader2 className="h-6 w-6 animate-spin" /> Enviando leitura...
             </div>
           )}

           {/* Webcam ou Placeholder */}
           {!recording ? (
             <div className="aspect-video w-full bg-gray-100 flex items-center justify-center text-gray-400">
               Preview da câmera aparecerá aqui
             </div>
           ) : (
             webcam
           )}
        </div>

        {/* Barra de Progresso (só aparece gravando) */}
        {recording && (
           <TimerProgress elapsed={elapsed} limitSeconds={READING_LIMIT_SECONDS} className="mt-4" />
        )}

        {/* Botão Iniciar/Encerrar */}
        <div className="mt-6 flex items-center justify-center">
          {recording ? (
            <Button
              onClick={() => setOpenStop(true)}
              disabled={uploadMutation.isPending} // Desabilita enquanto envia
              variant="destructive" // Usa variant para cor vermelha
              size="lg" // Botão maior
              className="rounded-lg"
            >
              <Square className="mr-2 h-5 w-5 fill-current" />
              Encerrar Leitura
            </Button>
          ) : (
            <Button
              onClick={() => setOpenStart(true)}
              disabled={startTestMutation.isPending || uploadMutation.isPending} // Desabilita se estiver iniciando ou enviando
              size="lg" // Botão maior
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

        {/* Diálogos de Confirmação */}
        <ConfirmStartDialog
          open={openStart}
          onOpenChange={setOpenStart}
          minutes={Math.ceil(READING_LIMIT_SECONDS / 60)} // Calcula minutos
          onConfirm={handleStart} // Chama a função que inicia teste + gravação
        />
        <ConfirmStopDialog
          open={openStop}
          onOpenChange={setOpenStop}
          onConfirm={stop} // Chama a função que para a gravação local
          description="Encerrar agora finalizará a etapa de leitura e enviará o vídeo. Deseja continuar?"
        />

        {/* Exibição de Erro do Recorder */}
        {error && <p className="mt-4 text-center text-sm text-red-600">{error}</p>}
         {/* Exibição de Erro do StartTest (caso não tratado no hook) */}
        {startTestMutation.isError && <p className="mt-4 text-center text-sm text-red-600">Erro ao iniciar: {startTestMutation.error.message}</p>}
        {/* Exibição de Erro do Upload (caso não tratado no hook) */}
        {uploadMutation.isError && <p className="mt-4 text-center text-sm text-red-600">Erro no envio: {uploadMutation.error.message}</p>}

      </div>
    </div>
  );
}