// src/store/useMediaStore.ts
import { create } from "zustand";
// opcional: persistir preferências entre rotas/refresh
// import { persist } from "zustand/middleware";

export type MediaState = {
  stream: MediaStream | null;
  cameraId?: string;
  micId?: string;

  videoEnabled: boolean;
  audioEnabled: boolean;

  mirror: boolean; // <- usado em preview e nas provas
  testing: boolean;
  recordingUrl: string | null;
  isQuickPreviewOpen: boolean;
  error: string | null;

  setMirror: (v: boolean) => void;

  setCamera: (id?: string) => Promise<void>;
  setMic: (id?: string) => Promise<void>;

  openStream: (cameraId?: string, micId?: string) => Promise<void>;
  stopStream: () => void;

  enableVideo: () => Promise<void>;
  disableVideo: () => Promise<void>;
  toggleVideo: () => Promise<void>;

  enableAudio: () => Promise<void>;
  disableAudio: () => Promise<void>;
  toggleAudio: () => Promise<void>;

  // gravação-teste (usa stream "gravável" espelhado de fato)
  startQuickRecord: (seconds?: number) => Promise<void>;
  stopQuickRecord: () => void;

  // NEW: criar um stream pronto para gravar (espelhado se mirror=true)
  makeRecordableStream: () => Promise<MediaStream>;

  setQuickPreviewOpen: (v: boolean) => void;
  clearError: () => void;
  powerOff: () => void;
};

export const useMediaStore = create<MediaState>((set, get) => ({
  stream: null,
  cameraId: undefined,
  micId: undefined,

  videoEnabled: false,
  audioEnabled: false,

  mirror: true,
  testing: false,
  recordingUrl: null,
  isQuickPreviewOpen: false,
  error: null,

  setMirror: (v) => set({ mirror: v }),

  setCamera: async (id) => { set({ cameraId: id }); },
  setMic: async (id) => { set({ micId: id }); },

  openStream: async (cameraId, micId) => {
    try {
      const prev = get().stream;
      prev?.getTracks().forEach((t) => t.stop());

      set({ stream: null });

      const useVideo = get().videoEnabled;
      const useAudio = get().audioEnabled;

      if (!useVideo && !useAudio) {
        set({ stream: null, error: null });
        return;
      }

      const constraints: MediaStreamConstraints = {
        video: useVideo ? (cameraId ? { deviceId: { exact: cameraId } } : true) : false,
        audio: useAudio ? (micId ? { deviceId: { exact: micId } } : true) : false,
      };

      const newStream = await navigator.mediaDevices.getUserMedia(constraints);
      set({ stream: newStream, error: null });
    } catch (err: any) {
      const name = err?.name;
      if (name === "NotAllowedError") set({ error: "Permissão negada. Autorize câmera e microfone." });
      else if (name === "NotFoundError") set({ error: "Dispositivo não encontrado." });
      else set({ error: "Falha ao iniciar vídeo/áudio." });
      set({ stream: null });
    }
  },

  stopStream: () => {
    const s = get().stream;
    s?.getTracks().forEach((t) => t.stop());
    set({ stream: null });
  },

  enableVideo: async () => { set({ videoEnabled: true }); await get().openStream(get().cameraId, get().micId); },
  disableVideo: async () => {
    const s = get().stream; s?.getVideoTracks().forEach((t) => t.stop());
    set({ videoEnabled: false }); await get().openStream(get().cameraId, get().micId);
  },
  toggleVideo: async () => (get().videoEnabled ? get().disableVideo() : get().enableVideo()),

  enableAudio: async () => { set({ audioEnabled: true }); await get().openStream(get().cameraId, get().micId); },
  disableAudio: async () => {
    const s = get().stream; s?.getAudioTracks().forEach((t) => t.stop());
    set({ audioEnabled: false }); await get().openStream(get().cameraId, get().micId);
  },
  toggleAudio: async () => (get().audioEnabled ? get().disableAudio() : get().enableAudio()),

  // ---------- NEW: stream gravável (espelha de verdade quando mirror=true)
  makeRecordableStream: async () => {
    const base = get().stream;
    if (!base) throw new Error("Sem stream para gravar.");
    const mirror = get().mirror;

    // se não precisa espelhar, devolve cópia simples (garante 1 vídeo + áudios)
    if (!mirror) {
      return new MediaStream([
        ...base.getVideoTracks().slice(0, 1),
        ...base.getAudioTracks(),
      ]);
    }

    // espelhar: desenha o vídeo num canvas e captura
    const videoEl = document.createElement("video");
    videoEl.muted = true;
    videoEl.playsInline = true;
    videoEl.srcObject = base;

    // aguarda metadata p/ ter dimensões
    await new Promise<void>((resolve) => {
      const handler = () => { resolve(); videoEl.removeEventListener("loadedmetadata", handler); };
      videoEl.addEventListener("loadedmetadata", handler);
    });
    await videoEl.play();

    const width = videoEl.videoWidth || 1280;
    const height = videoEl.videoHeight || 720;

    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext("2d")!;
    const fps = 30;

    let stopDraw = false;
    const draw = () => {
      if (stopDraw) return;
      ctx.save();
      ctx.scale(-1, 1);
      ctx.drawImage(videoEl, -width, 0, width, height);
      ctx.restore();
      requestAnimationFrame(draw);
    };
    draw();

    const canvasStream = canvas.captureStream(fps);
    const out = new MediaStream([
      ...canvasStream.getVideoTracks().slice(0, 1),
      ...base.getAudioTracks(), // mantém áudio original
    ]);

    // quando a gravação terminar, quem chamou deve parar as tracks do out
    // e também encerrar o loop de desenho:
    (out as any).__stopMirroring = () => {
      stopDraw = true;
      canvasStream.getTracks().forEach((t) => t.stop());
    };
    return out;
  },
  // ----------

  startQuickRecord: async (seconds = 5) => {
    // usa o stream espelhado (se necessário)
    let recordable: MediaStream;
    try {
      recordable = await get().makeRecordableStream();
    } catch { return; }

    set({ testing: true, recordingUrl: null });

    const rec = new MediaRecorder(recordable, { mimeType: "video/webm;codecs=vp9,opus" });
    const chunks: BlobPart[] = [];
    rec.ondataavailable = (e) => { if (e.data.size > 0) chunks.push(e.data); };
    rec.onstop = () => {
      const blob = new Blob(chunks, { type: "video/webm" });
      const url = URL.createObjectURL(blob);
      set({ recordingUrl: url, testing: false, isQuickPreviewOpen: true });
      recordable.getTracks().forEach((t) => t.stop());
      (recordable as any).__stopMirroring?.();
    };
    rec.start();
    setTimeout(() => rec.stop(), seconds * 1000);
  },

  stopQuickRecord: () => {},
  setQuickPreviewOpen: (v) => set({ isQuickPreviewOpen: v }),
  clearError: () => set({ error: null }),

   powerOff: () => {
    const s = get().stream;
    try {
      s?.getTracks().forEach((t) => t.stop());
    } finally {
      // zera tudo sem pedir mídia novamente
      set({ stream: null, videoEnabled: false, audioEnabled: false });
    }
  },
}));
