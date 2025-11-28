import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";

type Props = { onBack?: () => void; onSuccess: () => void };

// formata mm:ss

export default function MicCheck({ onBack, onSuccess }: Props) {
  const [recording, setRecording] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [level, setLevel] = useState(0);
  const [err, setErr] = useState<string | null>(null);

  const mediaRecRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const streamRef = useRef<MediaStream | null>(null);

  // meter simples (0..1)
  useEffect(() => {
    let ac: AudioContext | null = null;
    let an: AnalyserNode | null = null;
    let raf = 0;

    const setup = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          audio: { echoCancellation: true, noiseSuppression: true, autoGainControl: true },
        });
        streamRef.current = stream;

        ac = new (window.AudioContext || (window as any).webkitAudioContext)();
        const src = ac.createMediaStreamSource(stream);
        an = ac.createAnalyser();
        an.fftSize = 256;
        src.connect(an);

        const buf = new Uint8Array(an.frequencyBinCount);
        const loop = () => {
          if (!an) return;
          an.getByteTimeDomainData(buf);
          let sum = 0;
          for (let i = 0; i < buf.length; i++) {
            const v = (buf[i] - 128) / 128;
            sum += v * v;
          }
          const rms = Math.sqrt(sum / buf.length);
          setLevel(Math.min(1, rms * 2));
          raf = requestAnimationFrame(loop);
        };
        loop();
      } catch {
        setErr("Não foi possível acessar o microfone. Verifique as permissões do navegador.");
      }
    };

    setup();
    return () => {
      cancelAnimationFrame(raf);
      ac?.close();
      streamRef.current?.getTracks().forEach((t) => t.stop());
    };
  }, []);

  const startTest = async () => {
    setErr(null);
    setAudioUrl(null);
    chunksRef.current = [];
    try {
      const stream =
        streamRef.current ||
        (await navigator.mediaDevices.getUserMedia({ audio: true }));
      streamRef.current = stream;

      const mime = MediaRecorder.isTypeSupported("audio/webm") ? "audio/webm" : "audio/mp4";
      const mr = new MediaRecorder(stream, { mimeType: mime });
      mediaRecRef.current = mr;

      mr.ondataavailable = (e) => e.data.size && chunksRef.current.push(e.data);
      mr.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: mime });
        setAudioUrl(URL.createObjectURL(blob));
        setRecording(false);
      };

      mr.start();
      setRecording(true);
      setTimeout(() => mr.stop(), 3000); // 3s
    } catch {
      setErr("Falha ao iniciar a gravação de teste. Tente novamente.");
      setRecording(false);
    }
  };

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

      <main className="mx-auto w-full max-w-[880px] px-6 py-10">
        <h2 className="text-lg font-semibold text-gray-900">Teste de áudio</h2>
        <p className="mt-1 text-sm text-gray-600">
          Gravaremos 3 segundos para você ouvir o retorno e confirmar que o microfone está OK.
        </p>

        <div className="mt-6 rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <div className="mb-4">
            <div className="flex items-center justify-between text-sm text-gray-600">
              <span>Nível do microfone</span>
              <span>{Math.round(level * 100)}%</span>
            </div>
            <div className="mt-1 h-2 w-full rounded-full bg-gray-200">
              <div className="h-2 rounded-full bg-[#0385d1]" style={{ width: `${Math.round(level * 100)}%` }} />
            </div>
            <p className="mt-2 text-xs text-gray-500">
              Fale algo: o nível deve oscilar. Se ficar em 0%, verifique o microfone/permissões.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Button onClick={startTest} disabled={recording} className="rounded-lg bg-[#0385d1] text-white hover:bg-[#0271b2]">
              {recording ? "Gravando 3s..." : "Gravar teste de áudio"}
            </Button>

            {audioUrl && (
              <>
                <audio src={audioUrl} controls className="h-9" />
                <Button onClick={onSuccess} className="rounded-lg bg-emerald-600 text-white hover:bg-emerald-700">
                  Está funcionando — Continuar
                </Button>
              </>
            )}
          </div>

          {err && <p className="mt-3 text-sm text-red-600">{err}</p>}
        </div>
      </main>
    </div>
  );
}
