import { useCallback, useEffect, useRef, useState } from "react";
import Webcam from "react-webcam";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { ChevronLeft, Circle, Square } from "lucide-react";
import { READING_PARAGRAPHS, READING_TITLE } from "../ReadingText";

type Props = { onBack?: () => void; limitSeconds?: number };

// mm:ss
const fmt = (s: number) =>
  `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, "0")}`;

export default function Recorder({ onBack, limitSeconds = 10 * 60 }: Props) {
  const webcamRef = useRef<Webcam | null>(null);
  const mediaRecRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);

  const [started, setStarted] = useState(false);   // liga câmera/mic só após start
  const [recording, setRecording] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [err, setErr] = useState<string | null>(null);

  const startRecording = useCallback(async () => {
    setErr(null);
    setVideoUrl(null);
    chunksRef.current = [];

    try {
      setStarted(true); // renderiza o <Webcam />
      // aguarda o Webcam montar e abrir o stream
      await new Promise((r) => setTimeout(r, 250));

      const stream =
        webcamRef.current?.stream ||
        (await navigator.mediaDevices.getUserMedia({
          audio: { echoCancellation: true, noiseSuppression: true, autoGainControl: true },
          video: { width: 960, height: 540 },
        }));

      const mime =
        MediaRecorder.isTypeSupported("video/webm;codecs=vp9,opus")
          ? "video/webm;codecs=vp9,opus"
          : MediaRecorder.isTypeSupported("video/webm")
          ? "video/webm"
          : "";

      const mr = new MediaRecorder(stream!, mime ? { mimeType: mime } : undefined);
      mediaRecRef.current = mr;

      mr.ondataavailable = (e) => e.data.size && chunksRef.current.push(e.data);
      mr.onstop = () => {
        const type = mime || "video/webm";
        const blob = new Blob(chunksRef.current, { type });
        setVideoUrl(URL.createObjectURL(blob));
        setRecording(false);
      };

      mr.start(1000);
      setElapsed(0);
      setRecording(true);
    } catch {
      setErr("Não foi possível iniciar a gravação. Verifique as permissões de câmera e microfone.");
    }
  }, []);

  const stopRecording = useCallback(() => mediaRecRef.current?.stop(), []);

  // cronômetro
  useEffect(() => {
    if (!recording) return;
    const id = setInterval(() => {
      setElapsed((s) => {
        if (s + 1 >= limitSeconds) {
          stopRecording();
          return limitSeconds;
        }
        return s + 1;
      });
    }, 1000);
    return () => clearInterval(id);
  }, [recording, limitSeconds, stopRecording]);

  const pct = Math.min(100, Math.round((elapsed / limitSeconds) * 100));

  return (
    <div className="min-h-screen bg-[#F9FAFB]">
      <header className="sticky top-0 z-10 w-full bg-white border-b-2 border-gray-200">
        <div className="relative flex h-16 items-center px-6">
          <button onClick={onBack} className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-800">
            <ChevronLeft className="size-4" />
            <span className="text-sm">Voltar ao menu</span>
          </button>
          <h1 className="pointer-events-none absolute left-1/2 -translate-x-1/2 text-[20px] font-semibold text-gray-900">
            Teste de Português
          </h1>
        </div>
      </header>

      <main className="mx-auto w-full max-w-[1100px] px-6 py-10">
        {/* Layout 2 colunas como no Figma */}
        <div className="grid grid-cols-1 gap-10 md:grid-cols-2">
          {/* *** Coluna esquerda *** */}
          <section className="md:pr-8">
            <h2 className="mb-2 text-lg font-semibold text-gray-900">Instruções:</h2>

            {/* caixa cinza maior (mais largura + respiro) */}
            <div className="rounded-lg border border-gray-300 bg-gray-100 p-4 text-sm text-gray-700">
              <ol className="list-decimal space-y-2 pl-4">
                <li>Clique em Iniciar gravação para ativar sua câmera e microfone.</li>
                <li>Assim que começar, o texto será exibido e você terá 10 minutos para gravar a leitura.</li>
                <li>Ao finalizar, clique em Encerrar gravação para salvar seu vídeo.</li>
              </ol>
            </div>

            {/* Texto aparece SOMENTE após iniciar */}
            {recording && (
              <div className="mt-6 rounded-lg border border-gray-300 bg-white p-4">
                <h3 className="mb-2 text-sm font-semibold text-gray-800">{READING_TITLE}</h3>
                <div className="space-y-3 text-[13px] leading-relaxed text-gray-700">
                  {READING_PARAGRAPHS.map((p, i) => (
                    <p key={i}>{p}</p>
                  ))}
                </div>
              </div>
            )}
          </section>

          {/* *** Coluna direita *** */}
          <section>
            {/* Placeholder quadriculado quando ainda não iniciou */}
            <div className="overflow-hidden rounded-lg border border-gray-300 bg-white">
              {started ? (
                <Webcam
                  ref={webcamRef}
                  audio={true}
                  muted  // impede ouvir a si mesmo
                  className="aspect-video w-full object-cover"
                  videoConstraints={{ width: 960, height: 540 }}
                />
              ) : (
                <div className="aspect-video w-full bg-[length:24px_24px] bg-[linear-gradient(45deg,_#eee_25%,_transparent_25%),_linear-gradient(-45deg,_#eee_25%,_transparent_25%),_linear-gradient(45deg,_transparent_75%,_#eee_75%),_linear-gradient(-45deg,_transparent_75%,_#eee_75%)] bg-[position:0_0,0_12px,12px_-12px,-12px_0] bg-white" />
              )}
            </div>

            {/* Barra + tempos (vermelho como o Figma) */}
            <div className="mt-4">
              <span className="mb-1 block text-sm text-gray-700">Tempo restante</span>
              <Progress value={pct} className="h-2 [&>div]:bg-red-600" />
              <div className="mt-1 flex items-center justify-between text-[11px] text-gray-500">
                <span>{fmt(elapsed)}</span>
                <span>{fmt(limitSeconds)}</span>
              </div>
            </div>

            {/* Botão centralizado — azul para iniciar, vermelho para encerrar */}
            <div className="mt-6 flex items-center justify-center">
              {recording ? (
                <Button onClick={stopRecording} className="rounded-lg bg-red-600 text-white hover:bg-red-700">
                  <Square className="mr-2 h-4 w-4" />
                  Encerrar gravação
                </Button>
              ) : (
                <Button onClick={startRecording} className="rounded-lg bg-[#0385d1] text-white hover:bg-[#0271b2]">
                  <Circle className="mr-2 h-4 w-4 fill-current" />
                  Iniciar gravação
                </Button>
              )}
            </div>

            {/* Prévia do vídeo após encerrar (opcional) */}
            {videoUrl && (
              <div className="mt-6 space-y-2">
                <h3 className="text-sm font-medium text-gray-800">Prévia gravada:</h3>
                <video src={videoUrl} controls className="w-full rounded-lg border" />
              </div>
            )}

            {err && <p className="mt-3 text-sm text-red-600">{err}</p>}
          </section>
        </div>
      </main>
    </div>
  );
}
