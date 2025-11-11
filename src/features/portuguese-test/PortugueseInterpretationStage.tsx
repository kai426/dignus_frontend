// src/features/portuguese-test/PortugueseInterpretationStage.tsx
import { useEffect, useMemo, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { ChevronRight, Square, Loader2 } from "lucide-react"; // Import Loader2
import Webcam from "react-webcam";
import { TimerProgress } from "@/components/TimerProgress";
import { useRecorder } from "@/hooks/useRecorder";
import { useMediaStore } from "@/store/useMediaStore";
import { ConfirmStopDialog } from "@/components/media/ConfirmStopDialog";
import { useUploadVideoResponse } from "@/hooks/useTestActions"; // Hook V2
import { VideoResponseType } from "@/api/apiPaths"; // Enum V2
import type { QuestionSnapshotDto, UploadVideoRequestPayload } from "@/@types/tests"; // Tipo V2
import { toast } from "sonner"; // Para notificações

const PREP_SECONDS = 5; // Tempo de preparação antes de gravar
const QUESTION_LIMIT_SECONDS = 60 * 2; // Exemplo: 2 minutos por pergunta

type Props = {
  testId: string; // ID da instância do teste (V2)
  candidateId: string; // ID do candidato (V2)
  questions: QuestionSnapshotDto[]; // Snapshots das perguntas de interpretação (V2)
  onFinishedAll: () => void; // Callback ao finalizar a última pergunta
};

type Phase = "prep" | "recording";

export function PortugueseInterpretationStage({
    testId,
    candidateId,
    questions = [], // Default para array vazio
    onFinishedAll
}: Props) {
  // Hook de upload V2
  const uploadMutation = useUploadVideoResponse();

  // Estados locais
  const [currentIdx, setCurrentIdx] = useState(0); // Índice da pergunta atual
  const [phase, setPhase] = useState<Phase>("prep"); // Fase: preparação ou gravação
  const [prepLeft, setPrepLeft] = useState(PREP_SECONDS); // Segundos restantes de preparação
  const [openStop, setOpenStop] = useState(false); // Controle do modal de confirmação

  // Verifica se é a última pergunta
  const isLast = currentIdx === questions.length - 1;

  // Hook de gravação, limitado pelo tempo da questão
  const { start, stop, elapsed, videoBlob, error, setSourceStream } =
    useRecorder(QUESTION_LIMIT_SECONDS);

  // Estados do MediaStore
  const mirror = useMediaStore((s) => s.mirror);
  const cameraId = useMediaStore((s) => s.cameraId);
  const micId = useMediaStore((s) => s.micId);
  const videoEnabled = useMediaStore((s) => s.videoEnabled);
  const audioEnabled = useMediaStore((s) => s.audioEnabled);
  const openStream = useMediaStore((s) => s.openStream);
  const makeRecordableStream = useMediaStore((s) => s.makeRecordableStream);

  // Flag para evitar múltiplas inicializações de gravação
  const recordingStartedRef = useRef(false);

  // --- Lógica de Preparação (Contagem Regressiva) ---
  useEffect(() => {
    // Só roda na fase de preparação e se ainda não iniciou a gravação
    if (phase !== "prep" || recordingStartedRef.current) return;

    // Reseta a flag para a próxima pergunta
    recordingStartedRef.current = false;

    // Timer para contagem regressiva
    const timerId = window.setInterval(() => {
      setPrepLeft((prev) => {
        if (prev <= 1) { // Quando chega a 0 (era 1 no tick anterior)
          clearInterval(timerId);
          return 0; // Finaliza em 0
        }
        return prev - 1;
      });
    }, 1000);

    // Limpa o timer ao desmontar ou mudar de fase/pergunta
    return () => clearInterval(timerId);
  }, [phase, currentIdx]); // Reinicia a contagem a cada nova pergunta (mudança de currentIdx)

  // --- Lógica para Iniciar Gravação (Após Preparação) ---
  useEffect(() => {
    // Só roda se: fase=prep, contagem chegou a 0, e gravação ainda não iniciou
    if (phase !== "prep" || prepLeft !== 0 || recordingStartedRef.current) return;

     // Define a flag para evitar re-execução
    recordingStartedRef.current = true;
    console.log(`Iniciando gravação para questão ${currentIdx + 1}`);

    // Função assíncrona para abrir stream e iniciar recorder
    const setupAndStartRecording = async () => {
       try {
            if (!videoEnabled || !audioEnabled) {
              toast.error("Câmera e/ou microfone não estão ativos.");
              // Opcional: Voltar para a fase de 'prep' ou mostrar erro?
              setPrepLeft(PREP_SECONDS); // Reinicia prep?
              recordingStartedRef.current = false; // Permite tentar de novo
              return;
            }
            await openStream(cameraId, micId); // Abre o stream base
            const recordableStream = await makeRecordableStream(); // Cria stream gravável (espelhado se necessário)
            setSourceStream(recordableStream); // Informa ao recorder qual stream usar
            start(); // Inicia a gravação (useRecorder)
            setPhase("recording"); // Muda para a fase de gravação
       } catch (mediaError: any) {
            console.error("Erro ao configurar mídia para gravação:", mediaError);
            toast.error(`Erro ao iniciar gravação: ${mediaError.message}`);
            // Resetar estado para tentar novamente?
            setPhase("prep");
            setPrepLeft(PREP_SECONDS);
            recordingStartedRef.current = false;
       }
    };

    setupAndStartRecording();

  }, [phase, prepLeft, openStream, cameraId, micId, audioEnabled, videoEnabled, makeRecordableStream, setSourceStream, start, currentIdx]); // Depende do currentIdx para reiniciar a lógica

  // --- Lógica para Finalizar Gravação e Enviar ---
  useEffect(() => {
    // Só roda se: tem um blob gravado e não está enviando
    if (!videoBlob || uploadMutation.isPending) return;

    const currentQuestion = questions[currentIdx];
    if (!currentQuestion) {
        console.error("Erro: Tentando enviar vídeo sem dados da questão atual.");
        return;
    }

    console.log(`Blob Q${currentIdx + 1} gerado (${(videoBlob.size / 1024 / 1024).toFixed(2)} MB), enviando...`);

    // Payload V2 para o upload
    const payload: UploadVideoRequestPayload = {
      testId: testId,
      candidateId: candidateId,
      videoBlob: videoBlob,
      fileName: `interpretacao_${candidateId}_${testId}_q${currentQuestion.questionOrder}.webm`, // Nome com ordem da questão
      responseType: VideoResponseType.QuestionAnswer, // Tipo V2: Resposta de Questão
      questionNumber: currentQuestion.questionOrder, // Número/Ordem da questão vindo do snapshot
      questionSnapshotId: currentQuestion.id, // ID do snapshot da questão (OBRIGATÓRIO para interpretação)
    };

    // Chama a mutação de upload V2
    uploadMutation.mutate(payload, {
      onSuccess: () => {
        // Após upload bem-sucedido:
        if (!isLast) {
          // Vai para a próxima pergunta
          setCurrentIdx((i) => i + 1);
          setPrepLeft(PREP_SECONDS); // Reseta tempo de preparação
          setPhase("prep"); // Volta para fase de preparação
          recordingStartedRef.current = false; // Permite iniciar a gravação da próxima
        } else {
          // Se era a última, chama o callback final
          onFinishedAll();
        }
      },
      // onError já é tratado no hook useUploadVideoResponse
    });

  }, [videoBlob, testId, candidateId, questions, currentIdx, isLast, onFinishedAll, uploadMutation]);

  // Renderização da Webcam (memoizado)
  const webcam = useMemo(() => {
    // Só mostra na fase de gravação
    if (phase !== "recording") return null;
    return (
      <Webcam
        videoConstraints={
          videoEnabled && cameraId
            ? { deviceId: { exact: cameraId }, width: 960, height: 540 } // Ajuste resolução
            : { width: 960, height: 540 }
        }
        audio={!!audioEnabled}
        muted
        mirrored={!!mirror}
        className="aspect-video w-full bg-gray-200 object-cover"
      />
    );
  }, [phase, videoEnabled, cameraId, audioEnabled, mirror]);

  // Overlay de Preparação (Contagem Regressiva)
  const prepOverlay =
    phase === "prep" ? (
      <div className="absolute inset-0 z-10 grid place-items-center bg-black/60 backdrop-blur-sm">
        <div className="text-center text-white">
            <p className="mb-4 text-lg">Prepare-se para gravar em...</p>
            <div className="flex h-24 w-24 items-center justify-center rounded-full bg-white/90 shadow-xl mb-4 mx-auto">
              <span className="text-5xl font-bold text-gray-900">{prepLeft}</span>
            </div>
        </div>
      </div>
    ) : null;

  // Texto da pergunta atual
  const currentQuestionText = questions[currentIdx]?.questionText ?? "Carregando pergunta...";

  const isBusy = phase === 'prep' || uploadMutation.isPending;

  // --- Renderização do Componente ---
  return (
    <div className="mx-auto w-full max-w-3xl"> {/* Layout centralizado */}

      {/* Indicador de Loading durante o upload */}
      {uploadMutation.isPending && (
        <div className="mb-4 flex items-center justify-center rounded-md border border-blue-200 bg-blue-50 p-3 text-center text-sm font-medium text-blue-700">
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Enviando resposta da questão {currentIdx + 1}, por favor aguarde...
        </div>
      )}

      {/* Navegação entre Questões (Pílulas) */}
      <div className="mb-5 flex flex-wrap items-center justify-center gap-2 sm:gap-3">
        {questions.map((q, i) => ( // Usa 'q' para pegar dados se precisar depois
          <button
            key={q.id} // Usa ID do snapshot como key
            type="button"
            disabled // Desabilitado para navegação, apenas visual
            className={`rounded-full px-4 py-1.5 text-xs sm:px-5 sm:py-2 sm:text-sm font-medium transition-colors ${
              i === currentIdx
                ? "bg-[#0385d1] text-white shadow-sm" // Estilo ativo
                : "bg-gray-100 text-gray-500 hover:bg-gray-200" // Estilo inativo
            }`}
          >
            Questão {q.questionOrder} {/* Usa a ordem vinda do backend */}
          </button>
        ))}
      </div>

      {/* Enunciado da Pergunta Atual */}
      <p className="mb-5 text-center text-lg font-semibold text-gray-800 md:text-xl">
          {currentQuestionText}
      </p>

      {/* Webcam + Overlay */}
      <div className="relative overflow-hidden rounded-lg border border-gray-300 bg-white shadow-sm">
        {phase === "recording" ? (
          webcam // Mostra a webcam gravando
        ) : (
          // Mostra um placeholder antes ou durante a preparação
          <div className="aspect-video w-full bg-gray-100 flex items-center justify-center text-gray-400">
            {phase === 'prep' ? 'Prepare-se...' : 'A câmera aparecerá aqui'}
          </div>
        )}
        {prepOverlay} {/* Mostra contagem regressiva */}
      </div>

      {/* Barra de Progresso da Gravação */}
      {phase === "recording" && (
        <TimerProgress elapsed={elapsed} limitSeconds={QUESTION_LIMIT_SECONDS} className="mt-4" />
      )}

      {/* Botão de Ação (Avançar/Finalizar) */}
      <div className="mt-6 flex items-center justify-center">
        <Button
          onClick={() => (phase === "recording" ? setOpenStop(true) : null)} // Só abre modal se estiver gravando
          // Desabilita se estiver em preparação, enviando, ou se mídia não estiver pronta
          disabled={isBusy || (phase === 'recording' && !useMediaStore.getState().stream) }
           size="lg" // Botão maior
           className={`rounded-lg transition-colors disabled:opacity-60 ${
             isLast
                ? "bg-red-600 text-white hover:bg-red-700" // Botão Finalizar
                : "bg-[#0385d1] text-white hover:bg-[#0271b2]" // Botão Avançar
           }`}
        >
          {isLast ? (
            <>
              <Square className="mr-2 h-5 w-5 fill-current" />
              Finalizar Teste
            </>
          ) : (
            <>
              Avançar para Próxima
              <ChevronRight className="ml-2 h-5 w-5" />
            </>
          )}
        </Button>
      </div>

      {/* Modal de Confirmação para Parar/Avançar */}
      <ConfirmStopDialog
        open={openStop}
        onOpenChange={setOpenStop}
        onConfirm={stop} // Chama stop do useRecorder
        description={
          isLast
            ? "Você está prestes a finalizar o teste de português. Deseja enviar sua última resposta?"
            : `Avançar agora encerrará a gravação da questão ${currentIdx + 1} e a enviará. Deseja continuar?`
        }
      />

      {/* Exibição de Erros */}
       {error && <p className="mt-4 text-center text-sm text-red-600">Erro no gravador: {error}</p>}
       {uploadMutation.isError && <p className="mt-4 text-center text-sm text-red-600">Erro no envio: {uploadMutation.error.message}</p>}
    </div>
  );
}