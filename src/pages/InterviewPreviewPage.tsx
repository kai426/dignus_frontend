import { useEffect } from "react";
import { useNavigate } from "@tanstack/react-router";
import MediaPreview from "@/components/media/MediaPreview";
import { useMediaDevicesQuery } from "@/hooks/useMediaDevicesQuery";
import { useMediaStore } from "@/store/useMediaStore";

export default function InterviewPreviewPage() {
  const navigate = useNavigate();
  const { data } = useMediaDevicesQuery();
  const cameraId = useMediaStore((s) => s.cameraId);
  const micId = useMediaStore((s) => s.micId);
  const setCamera = useMediaStore((s) => s.setCamera);
  const setMic = useMediaStore((s) => s.setMic);

  // (Opcional) pré-seleciona IDs, mas NÃO abre o stream
  useEffect(() => {
    if (!data) return;
    if (!cameraId && data.cameras[0]) setCamera(data.cameras[0].deviceId);
    if (!micId && data.mics[0]) setMic(data.mics[0].deviceId);
  }, [data, cameraId, micId, setCamera, setMic]);

  return (
    <div className="min-h-screen bg-[#F9FAFB]">
      <header className="sticky top-0 z-10 w-full h-16 bg-[#0385D1] text-white md:bg-white md:text-gray-900 md:border-b-2 md:border-gray-200">
        <div className="relative flex h-full items-center px-4 md:px-6">
          <h1 className="pointer-events-none absolute left-1/2 -translate-x-1/2 text-[18px] font-semibold text-white md:text-[20px] md:text-gray-900">
            Entrevista de Vídeo — Prévia
          </h1>
        </div>
      </header>
      <main className="py-6">
        <MediaPreview
          ctaLabel="Ir para a prova"
          onContinue={() => navigate({ to: "/entrevista/gravar" })}
        />
      </main>
    </div>
  );
}
