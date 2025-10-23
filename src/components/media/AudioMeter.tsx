import { useEffect, useMemo, useRef } from "react";
import { MicOff } from "lucide-react";

type Props = { stream: MediaStream | null };

export default function AudioMeter({ stream }: Props) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const rafRef = useRef<number | null>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);

  // há trilha de áudio viva?
  const hasAudio = useMemo(() => {
    if (!stream) return false;
    const tracks = stream.getAudioTracks?.() ?? [];
    return tracks.length > 0 && tracks.some(t => t.readyState === "live" && t.enabled !== false);
  }, [stream]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !stream || !hasAudio) return;

    const ctx2d = canvas.getContext("2d");
    if (!ctx2d) return;

    const AC = (window.AudioContext || (window as any).webkitAudioContext) as typeof AudioContext;

    let audioCtx: AudioContext | null = null;
    let source: MediaStreamAudioSourceNode | null = null;
    let analyser: AnalyserNode | null = null;
    let buffer: Uint8Array | null = null;

    const cleanup = () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      try { source?.disconnect(); } catch {}
      try { analyser?.disconnect(); } catch {}
      try { audioCtx?.close(); } catch {}
      audioCtxRef.current = null;
      source = null;
      analyser = null;
      buffer = null;
      ctx2d.clearRect(0, 0, canvas.width, canvas.height);
    };

    try {
      // revalida antes de criar o source (evita erro ao alternar vídeo→áudio)
      if ((stream.getAudioTracks?.() ?? []).length === 0) {
        cleanup();
        return;
      }
      audioCtx = new AC();
      audioCtxRef.current = audioCtx;

      source = audioCtx.createMediaStreamSource(stream);
      analyser = audioCtx.createAnalyser();
      analyser.fftSize = 2048;
      source.connect(analyser);

      // TS fix: o typed array genérico vem como ArrayBufferLike; a API pede ArrayBuffer.
      buffer = new Uint8Array(analyser.fftSize);
    } catch {
      cleanup();
      return;
    }

    const draw = () => {
      if (!analyser || !buffer) return;

      // 👇 cast seguro para satisfazer a assinatura do lib.dom antigo
      (analyser.getByteTimeDomainData as unknown as (arr: Uint8Array) => void)(
        buffer as unknown as Uint8Array
      );

      let sum = 0;
      for (let i = 0; i < buffer.length; i++) {
        const v = (buffer[i] - 128) / 128;
        sum += v * v;
      }
      const rms = Math.sqrt(sum / buffer.length);
      const level = Math.min(1, rms * 3);

      const w = canvas.width, h = canvas.height;
      ctx2d.clearRect(0, 0, w, h);
      const barH = h * level;
      ctx2d.fillStyle = "#16a34a";
      ctx2d.fillRect(0, h - barH, w, barH);
      ctx2d.strokeStyle = "#e5e7eb";
      ctx2d.strokeRect(0, 0, w, h);

      rafRef.current = requestAnimationFrame(draw);
    };

    draw();
    return cleanup;
  }, [stream, hasAudio]);

  if (!hasAudio) {
    return (
      <div className="flex h-[18px] w-full items-center justify-center rounded border bg-gray-50 text-gray-500">
        <div className="flex items-center gap-2 text-xs">
          <MicOff className="h-3.5 w-3.5" />
          <span>Áudio desativado</span>
        </div>
      </div>
    );
  }

  return <canvas ref={canvasRef} width={380} height={18} className="w-full" />;
}
