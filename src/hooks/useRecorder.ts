import { useCallback, useEffect, useRef, useState } from "react";

export function useRecorder(limitSeconds: number) {
  const mediaRecRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  // stream atualmente sendo gravado (pode ser interno ou injetado)
  const streamRef = useRef<MediaStream | null>(null);
  const ownsStreamRef = useRef<boolean>(false);

  const [recording, setRecording] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const [videoBlob, setVideoBlob] = useState<Blob | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Permite injetar um stream externo (ex.: makeRecordableStream do store)
  const setSourceStream = useCallback((s: MediaStream | null) => {
    streamRef.current = s;
    ownsStreamRef.current = false;
  }, []);

  const start = useCallback(
    async (stream?: MediaStream) => {
      try {
        setError(null);
        setVideoBlob(null);
        chunksRef.current = [];

        let usedStream = stream || streamRef.current;

        // Se recebeu stream no parâmetro, atualiza o ref
        if (stream) {
          streamRef.current = stream;
          ownsStreamRef.current = false;
        }

        if (!usedStream) {
          const acquired = await navigator.mediaDevices.getUserMedia({
            video: { width: 960, height: 540 },
            audio: true,
          });
          streamRef.current = acquired;
          ownsStreamRef.current = true;
          usedStream = acquired;
        }

        if (!usedStream) {
          setError("Sem fonte de mídia para gravar.");
          return;
        }

        const mime =
          MediaRecorder.isTypeSupported("video/webm;codecs=vp9,opus")
            ? "video/webm;codecs=vp9,opus"
            : MediaRecorder.isTypeSupported("video/webm")
              ? "video/webm"
              : "";

        const mr = new MediaRecorder(usedStream, mime ? { mimeType: mime } : undefined);
        mediaRecRef.current = mr;

        mr.ondataavailable = (e) => e.data.size && chunksRef.current.push(e.data);
        mr.onstop = () => {
          const type = mime || "video/webm";
          const blob = new Blob(chunksRef.current, { type });
          setVideoBlob(blob);
          setRecording(false);
          try {
            streamRef.current?.getTracks().forEach((t) => t.stop());
            (streamRef.current as any)?.__stopMirroring?.();
          } catch { }
          streamRef.current = null;
          ownsStreamRef.current = false;
        };

        mr.start(1000);
        setRecording(true);
        setElapsed(0);
      } catch {
        setError(
          "Não foi possível iniciar a gravação. Verifique as permissões de câmera e microfone."
        );
      }
    },
    []
  );

  const stop = useCallback(() => {
    mediaRecRef.current?.stop();
  }, []);

  useEffect(() => {
    if (!recording) return;
    const id = setInterval(() => {
      setElapsed((s) => {
        if (s + 1 >= limitSeconds) {
          stop();
          return limitSeconds;
        }
        return s + 1;
      });
    }, 1000);
    return () => clearInterval(id);
  }, [recording, limitSeconds, stop]);

  return { start, stop, recording, elapsed, videoBlob, error, streamRef, setSourceStream };
}
